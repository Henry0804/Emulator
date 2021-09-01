import INST from "./Instruction.js";
let JMP = INST;

//I never really got around to this because it has way too many instructions.

let out = [];
out[0x4C] = JMP;
out[0xEA] = class NOP extends JMP {
  static Exec(proc,data) {proc.Address-=1;}
  static DataLength = 1;
}

out[0xC9] = class CMP extends JMP {
  static Exec(proc,data) {
    let out = false;
    if (proc.Register.A-data[0]==0) {out = true;}
    proc.Flags.Zero = out;
  }
  static DataLength = 1;
}

export default out;
