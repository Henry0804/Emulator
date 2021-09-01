export default class Instruction {//Default jump instruction.
  static DataLength = 2;//Instruction length...
  static Cycles = 1;
  static Exec(proc,data) {
    let dataLength = proc.DataLength;//data length.
    let addressLength = proc.AddressLength;
    //Set address...
    let out = 0;
    for (var i = 0; i < this.DataLength; i++) {
      out += data[i]<<i*dataLength;
    }
    proc.Address = out;
    proc.Address--;
  }


}
