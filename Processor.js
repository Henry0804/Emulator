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


  Exec() {

    if (this.Halt) {return;}

    if (this.OpData.length>100) {
      throw new Error("Invalid OpData length.");
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





    this.Address = this.Address&0xffff;
  }

  Reset() {
    this.Devices.forEach((item, i) => {
      item.Reset();
    });

  }

}
