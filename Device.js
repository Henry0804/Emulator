export default class Device {//Simple RAM device.
  AddressMin = 0x0000;
  AddressMax = 0xffff;

  AddressActive = true;

  DataLength = 8;
  AddressLength = 16;

  Data = new Uint8Array(2**16);

  Read(a) {
    //Read some information.
    if (a==0xFFFF) {return Math.round(Math.random()*255);}

    let out = this.Data[a];
    if (typeof out=="undefined") {return 0x00;}
    if (out==null) {return 0x00;}
    return out;
  }

  Reset() {
    console.info('Reset ram device.');
    this.Data = new Uint8Array(2**16);
  }

  Write(a,d) {
    //Read some information.
    this.Data[a] = d;
  }

  Setup(a) {
    a.forEach((item, i) => {
      if (item==undefined||item==null) {return;}
      this.Data[i] = item;
    });

  }

  constructor() {

  }

}
