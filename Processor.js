import INST from "./custom.js";

export default class Processor {
  Instructions = INST;
  NoOp = INST[0x00];

  Trigger = [];

  Halt = false;

  static Operation = {
    Add: function Add(a,b) {
      let d = a + b;

      return {Carry: d>>8==1,Value: d&0xff};
    },

    Sub: function Sub(a,b) {
      let d = a - b;

      return {Carry: d>>8==1,Value: d&0xff};
    },

    PushStack: function PushStack(d,t) {
      t.WriteBus(t.StackPointer,d);

      t.StackPointer++;
      if (t.StackPointer>t.StackEnd) {t.StackPointer = t.StackStart;!proc.Debug || console.warn('Stack overflow!');}
    },

    PullStack: function PullStack(t) {
      t.StackPointer--;
      if (t.StackPointer<t.StackStart) {t.StackPointer = t.StackEnd;!proc.Debug || console.warn('Stack underflow!');}
      return t.ReadBus(t.StackPointer);
    },

    PushState: function PushState(proc,cycles) {
      if (cycles==1) {proc.constructor.Operation.PushStack(proc.Register.A,proc);}
      if (cycles==2) {proc.constructor.Operation.PushStack(proc.Register.X,proc);}
      if (cycles==3) {proc.constructor.Operation.PushStack(proc.Register.Y,proc);}

      if (cycles==4) {proc.constructor.Operation.PushStack(proc.Address&0xff,proc);}
      if (cycles==5) {proc.constructor.Operation.PushStack((proc.Address>>8)&0xff,proc);}
    },

    PullState: function PullState(proc,cycles,data) {
      if (cycles==5) {data.push(proc.constructor.Operation.PullStack(proc));}//a
      if (cycles==4) {data.push(proc.constructor.Operation.PullStack(proc));}//x
      if (cycles==3) {data.push(proc.constructor.Operation.PullStack(proc));}//y

      if (cycles==2) {data.push(proc.constructor.Operation.PullStack(proc));}//low
      if (cycles==1) {data.push(proc.constructor.Operation.PullStack(proc)<<8);}//top

      //end code:
      if (cycles==5) {
        proc.Address = data[0]|data[1];
        proc.Register.Y = data[2];
        proc.Register.X = data[3];
        proc.Register.A = data[4];
      }
    }

  }//End of operation object

  Flags = {
    Zero : false,
    Carry: false
  };

  Register = {
    A: 0,
    X: 0,
    Y: 0
  }

  constructor(table,addressLength,dataLength) {
    if (table!=null) {
      this.Instructions = table;
    }
    this.DataLength = dataLength;
    this.AddressLength = addressLength;



  }

  StackStart = 0x100;
  StackPointer = 0x100;
  StackEnd = 0x1FF;

  Debug = false;


  OpCode = null;
  OpData = [];
  OpTempData = [];
  Address = 0x0000;
  InterruptAddress = 0x0000;//The address to jump to on interrupts
  InterruptEnabled = false;//If interrupts should be enabled
  InterruptActive = false;//If an interrupt is currently being called
  InterruptCycles = 0;//The current interrupt's cycle count

  Cycles = 0;

  DataLength = 8;
  AddressLength = 16;

  Devices = [];

  AddDevice(d) {
    this.Devices = this.Devices.concat(d);
  }

  ReadBus(a) {
    let ret = null;

    this.Devices.forEach((item, i) => {
      let ca = a-item.AddressMin;
      if (ca>=0&&ca<=item.AddressMax&&item.AddressActive) {
        //If within range.
        if (ret==null) {ret = item.Read(ca);}//Read only if address is active.

      }

    });

    if (ret==null) {ret = 0;}


    return ret;//ret is usually a hex value.

  }

  WriteBus(a,value) {
    let write = true;

    this.Devices.forEach((item, i) => {
      let ca = a-item.AddressMin;
      if (ca>=0&&ca<=item.AddressMax&&item.AddressActive) {
        //If within range.
        if (write) {write = false;item.Write(ca,value);}//Read only if address is active.

      }

    });





  }

  Interrupt() {
    //Calls an interrupt after the current instruction is over.
    if (this.InterruptActive) return;
    //Do not call more then 1 interrupt at once
    if (!this.InterruptEnabled) return;


    if (this.OpCode==null) {
      this.InterruptActive = true;
      this.InterruptEnabled = false;
    }
  }


  Exec() {

    if (this.Halt) {return;}

    if (this.OpData.length>100) {
      throw new Error("Invalid OpData length.");
    }

    if (this.InterruptActive) {
      this.InterruptCycles++;
      this.constructor.Operation.PushState(this,this.InterruptCycles);
      if (this.InterruptCycles==5) {
        this.InterruptActive = false;
        this.InterruptCycles = 0;
        this.Address = this.InterruptAddress;
      }
      return;
    }



    if (this.OpCode==null) {
      //Read the op code...

      this.OpCode = this.ReadBus(this.Address);


      let v = this.Instructions.at(this.OpCode);
      if (v==undefined) {v = this.NoOp;}


      this.Address++;
    } else {
      //Otherwise collect data and execute the op code.

      let inst = this.Instructions[this.OpCode];
      if (!inst&&inst!=0) {inst = this.NoOp;}

      if (this.OpData.length>inst.DataLength) {
        throw new Error(`Instruction op data length is less then current length.`);
      }


      if (this.OpData.length==inst.DataLength) {
        //Exec op code...
        this.Cycles++;

        inst.Exec(this,this.OpData,this.Cycles);
        if (this.Cycles>=inst.Cycles) {
            this.OpCode = null;
            this.OpData = [];
            this.OpTempData = [];
            this.Cycles = 0;

          }

      } else {
        //Put data
        this.OpData = this.OpData.concat(this.ReadBus(this.Address));
        this.Address++;
      }



    }



    if ((this.Address>>16)>0) {console.warn('Address value outside of normal range!');this.Address = this.Address&0xffff;}

    //this.Address = this.Address&0xffff;
  }

  Reset() {
    this.Devices.forEach((item, i) => {
      item.Reset();
    });

    this.Cycles = 0;
    this.OpCode = null;
    this.OpData = [];
    this.OpTempData = [];
    this.Address = 0;
    this.StackPointer = 0x0100;
    this.Register.X = 0;
    this.Register.A = 0;
    this.Register.Y = 0;
    this.Flags.Zero = false;
    this.Flags.Carry = false;
    this.Halt = false;
  }

}
