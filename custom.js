import INST from "./Instruction.js";
let JMP = INST;

let out = [];
out[0x40] = JMP;
out[0x00] = class NOP {
  static Exec(proc,data) {}
  static DataLength = 0;
  static Cycles = 1;
}

out[0x01] = class TAX {
  static Cycles = 1;
  static Exec(proc,data) {
    //Transfer A to X.
    proc.Flags.Zero = proc.Register.A==0;

    proc.Register.X = proc.Register.A;


  }
  static DataLength = 0;
}

out[0x02] = class TAY {
  static Exec(proc,data) {
    //Transfer A to Y.
    proc.Register.Y = proc.Register.A;
    proc.Flags.Zero = proc.Register.A==0;


  }
  static DataLength = 0;
  static Cycles = 1;
}

out[0x03] = class TXA {
  static Exec(proc,data) {
    //Transfer X to A.
    proc.Register.A = proc.Register.X;
    proc.Flags.Zero = proc.Register.X==0;


  }
  static DataLength = 0;
  static Cycles = 1;
}

out[0x04] = class TYA {
  static Exec(proc,data) {
    //Transfer Y to A.
    proc.Register.A = proc.Register.Y;
    proc.Flags.Zero = proc.Register.Y==0;


  }
  static DataLength = 0;
  static Cycles = 1;
}



out[0x10] = class STA {
  static Exec(proc,data) {
    //Store A.

    let x = (data[0]<<8) + data[1];



    proc.Flags.Zero = proc.Register.A==0;
    proc.WriteBus(x,proc.Register.A);


  }
  static DataLength = 2;
  static Cycles = 1;
}


out[0x11] = class STX {
  static Exec(proc,data) {
    //Store X.
    let x = (data[0]<<8) + data[1];
    proc.Flags.Zero = proc.Register.X==0;
    proc.WriteBus(x,proc.Register.X);


  }
  static DataLength = 2;
  static Cycles = 1;
}


out[0x12] = class STY {
  static Exec(proc,data) {
    //Store Y.
    let x = (data[0]<<8) + data[1];
    proc.Flags.Zero = proc.Register.Y==0;
    proc.WriteBus(x,proc.Register.Y);


  }
  static DataLength = 2;
  static Cycles = 1;
}

out[0x13] = class SXY {
  static Exec(proc,data) {
    //Store A.
    let x = (proc.Register.X<<8) + proc.Register.Y;
    proc.Flags.Zero = proc.Register.A==0;

    proc.WriteBus(x,proc.Register.A);


  }
  static DataLength = 0;
  static Cycles = 1;
}


out[0x14] = class LDA {
  static Exec(proc,data) {
    //Load A.
    proc.Register.A = data[0];
    proc.Flags.Zero = proc.Register.A==0;



  }
  static DataLength = 1;
  static Cycles = 1;
}


out[0x15] = class LDX {
  static Exec(proc,data) {
    //Load X.
    proc.Register.X = data[0];
    proc.Flags.Zero = proc.Register.X==0;

  }
  static DataLength = 1;
  static Cycles = 1;
}


out[0x16] = class LDY {
  static Exec(proc,data) {
    //Load Y.
    proc.Register.Y = data[0];
    proc.Flags.Zero = proc.Register.Y==0;

  }
  static DataLength = 1;
  static Cycles = 1;
}


out[0x17] = class LAA {
  static Exec(proc,data) {
    //Load A.
    let x = (data[0]<<8) + data[1];

    proc.Register.A = proc.ReadBus(x);
    proc.Flags.Zero = proc.Register.A==0;

  }
  static DataLength = 2;
  static Cycles = 1;
}


out[0x18] = class LAX {
  static Exec(proc,data) {
    //Load X.
    let x = (data[0]<<8) + data[1];

    proc.Register.X = proc.ReadBus(x);
    proc.Flags.Zero = proc.Register.X==0;

  }
  static DataLength = 2;
  static Cycles = 1;
}

out[0x19] = class LAY {
  static Exec(proc,data) {
    //Load X.
    let x = (data[0]<<8) + data[1];

    proc.Register.Y = proc.ReadBus(x);
    proc.Flags.Zero = proc.Register.Y==0;

  }
  static DataLength = 2;
  static Cycles = 1;
}

out[0x1A] = class AXY {
  static Exec(proc,data) {
    //Load A using X and Y.
    let x = (proc.Register.X<<8) + proc.Register.Y[1];

    proc.Register.A = proc.ReadBus(x);
    proc.Flags.Zero = proc.Register.A==0;

  }
  static DataLength = 0;
  static Cycles = 1;
}




out[0x20] = class ADD {
  static Exec(proc,data) {
    //Add X and Y and set it in A
    let x = proc.constructor.Operation.Add(proc.Register.X,proc.Register.Y);
    proc.Flags.Zero = x.Value==0;
    proc.Flags.Carry = x.Carry;
    proc.Register.A = x.Value;


  }
  static DataLength = 0;
  static Cycles = 1;
}



out[0x21] = class SUB {
  static Exec(proc,data) {
    //Add X and Y and set it in A
    let x = proc.constructor.Operation.Sub(proc.Register.X,proc.Register.Y);
    proc.Flags.Zero = x.Value==0;
    proc.Flags.Carry = x.Carry;
    proc.Register.A = x.Value;


  }
  static DataLength = 0;
  static Cycles = 1;
}


out[0x22] = class INA {
  static Exec(proc,data) {
    //INC A
    let out = proc.constructor.Operation.Add(proc.Register.A,1);

    proc.Flags.Carry = out.Carry;
    proc.Register.A = out.Value;


  }
  static DataLength = 0;
  static Cycles = 1;
}

out[0x23] = class INX {
  static Exec(proc,data) {
    //INC X
    let out = proc.constructor.Operation.Add(proc.Register.X,1);

    proc.Flags.Carry = out.Carry;
    proc.Register.X = out.Value;


  }
  static DataLength = 0;
  static Cycles = 1;
}

out[0x24] = class INY {
  static Exec(proc,data) {
    //INC Y
    let out = proc.constructor.Operation.Add(proc.Register.Y,1);

    proc.Flags.Carry = out.Carry;
    proc.Register.Y = out.Value;


  }
  static DataLength = 0;
  static Cycles = 1;
}



out[0x30] = class PHA {
  static Exec(proc,data) {
    //Push A
    let x = proc.Register.A;
    proc.Flags.Zero = x==0;

    proc.constructor.Operation.PushStack(x,proc);


  }
  static DataLength = 0;
  static Cycles = 1;
}

out[0x31] = class PHX {
  static Exec(proc,data) {
    //Push X
    let x = proc.Register.X;
    proc.Flags.Zero = x==0;

    proc.constructor.Operation.PushStack(x,proc);


  }
  static DataLength = 0;
  static Cycles = 1;
}


out[0x32] = class PHY {
  static Exec(proc,data) {
    //Push Y
    let x = proc.Register.Y;
    proc.Flags.Zero = x==0;

    proc.constructor.Operation.PushStack(x,proc);


  }
  static DataLength = 0;
  static Cycles = 1;
}


out[0x33] = class PLA {
  static Exec(proc,data) {
    //Pull A
    let x = proc.constructor.Operation.PullStack(proc);
    proc.Flags.Zero = x==0;
    proc.Register.A = x;
  }
  static DataLength = 0;
  static Cycles = 1;
}



out[0x34] = class PLX {
  static Exec(proc,data) {
    //Pull A
    let x = proc.constructor.Operation.PullStack(proc);
    proc.Flags.Zero = x==0;
    proc.Register.X = x;
  }
  static DataLength = 0;
  static Cycles = 1;
}


out[0x35] = class PLY {
  static Exec(proc,data) {
    //Pull A
    let x = proc.constructor.Operation.PullStack(proc);
    proc.Flags.Zero = x==0;
    proc.Register.Y = x;
  }
  static DataLength = 0;
  static Cycles = 1;
}



out[0x40] = class JMP {//Default jump instruction.
  static DataLength = 2;
  static Cycles = 1;
  static Exec(proc,data) {
    out = (data[0]<<8)+data[1];
    proc.Address = out;


  }


}

out[0x41] = class JSR {//Jump subrotuine.
  static DataLength = 2;
  static Cycles = 2;
  static Exec(proc,data,cycles) {

    //Push current address onto stack.
    if (cycles==1) {proc.constructor.Operation.PushStack(proc.Address&0xff,proc);}
    if (cycles==2) {
      proc.constructor.Operation.PushStack(proc.Address>>8&0xff,proc);
      out = (data[0]<<8)+data[1];
      proc.Address = out;
    }




  }


}


out[0x42] = class RET {//Jump subrotuine.
  static DataLength = 0;
  static Cycles = 3;
  static Exec(proc,data,cycles) {
    //Get current address onto stack.

    if (cycles==1) {proc.OpTempData[0] = proc.constructor.Operation.PullStack(proc);}
    if (cycles==2) {proc.OpTempData[1] = proc.constructor.Operation.PullStack(proc);}

    if (cycles==2) {
    out = (proc.OpTempData[0]<<8)+proc.OpTempData[1];

    proc.Address = out;
    }

  }


}


out[0x43] = class BNE {//Branch not equal.
  static DataLength = 2;
  static Cycles = 1;
  static Exec(proc,data) {
    if (proc.Flags.Zero) {return;}
    out = (data[0]<<8)+data[1];
    proc.Address = out;

  }


}



out[0x44] = class BCS {//Branch on carry set.
  static DataLength = 2;
  static Cycles = 1;
  static Exec(proc,data) {
    if (!proc.Flags.Carry) {return;}
    out = (data[0]<<8)+data[1];
    proc.Address = out;

  }


}

out[0x45] = class BZS {//Branch on zero set.
  static DataLength = 2;
  static Cycles = 1;
  static Exec(proc,data) {
    if (!proc.Flags.Zero) {return;}
    out = (data[0]<<8)+data[1];
    proc.Address = out;

  }


}


out[0x50] = class RFG {//Read flag
  static DataLength = 0;
  static Cycles = 1;
  static Exec(proc,data) {
    let out = 0x00;
    if (proc.Flags.Zero) {out = out || 0x0800;}
    if (proc.Flags.Carry) {out = out || 0x0400;}
    proc.Register.A = out;
  }


}


out[0x51] = class SFG {//Set flag
  static DataLength = 0;
  static Cycles = 1;
  static Exec(proc,data) {
    let out = proc.Register.A;
    proc.Flags.Zero = out&0x0800;
    proc.Flags.Carry = out&0x0400;

  }


}


out[0xFD] = class TRG {
  static DataLength = 2;
  static Cycles = 1;
  static Exec(proc,data) {
    let d = proc.Trigger.at(data[0]);
    d==undefined || d(data[1]);

  }

}

out[0xFE] = class BRK {
  static DataLength = 0;
  static Cycles = 1;
  static Exec(proc,data) {
    console.info(`BREAKPOINT HIT!
      Address: ${proc.Address}`);
    if (proc.Debug) {debugger;}

  }
}

out[0xff] = class HALT {
  static DataLength = 0;
  static Cycles = 1;
  static Exec(proc,data) {
    proc.Halt = true;
    console.info(`[INFO] Processor halted!`);

  }


}


/*
0x40 = Jump to address
0x41 = JSR, which jumps to an address and pushes the address to stack
0x42 = RET, undo's the JSR and jumps out of an address
0x43 = Branch not equal (BNE), jumps to an address if zero flag isn't set.
0x44 = Branch on carry set (BCS)
0x45 = Branch on zero set (BZS)
*/
export default out;
