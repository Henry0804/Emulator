import inst from "./custom.js";

/*
;example program
LDA 15
STA LABEL
HALT
/LABEL
*/


export function Parser(text) {
  let split = text.split('\n');

  let out = [];//return info here.
  let pos = 0;

  for (var i = 0; i < split.length; i++) {
    let v = split[i];
    //Check if line is a comment.
    if (v.charAt(0)==";") {continue;}

    //Check for labels.
    if (v.charAt(0)=="/") {out = out.concat({Name:v.slice(1),Type:'Label',Pos:pos});continue;}

    if (v.charAt(0)==""||v.charAt(0)==' ') {continue;}

    //Check for a data label
    if (v.split(' ')[0]=='LOCATION') {pos = Number( v.split(' ').slice(1).join(' ') );continue;}

    //Check for data
    if (v.split(' ')[0]=='DATA') {pos++;continue;}

    //Get instruction stuff.

    //Get the instruction name.
    let name = v.split(' ')[0];


    let cmd = null;

    inst.forEach((item, i) => {
      if (item.name==name) {cmd = item;}
    });

    if (cmd==null) {throw new Error(`[ERR] Unspecified instruction: ${name}`);}

    pos+=cmd.DataLength+1;

  }

  return out;
}



export function Assemble(text,info) {
  let out = [];

  let pos = 0;

  let split = text.split('\n');
  for (var i = 0; i < split.length; i++) {

    let v = split[i];


    if (v.charAt(0)==";") {continue;}


    if (v.charAt(0)=="/"||v.charAt(0)==''||v.charAt(0)==' ') {continue;}

    //Check for a data label
    if (v.split(' ')[0]=='LOCATION') {pos = Number( v.split(' ').slice(1).join(' ') );continue;}

    //Check for data
    if (v.split(' ')[0]=='DATA') {out[pos] = Number(v.split(' ').slice(1).join(' '));pos++;continue;}



    let name = v.split(' ')[0];
    let cmd = null;

    let cmdI = null;

    inst.forEach((item, i) => {
      if (item.name==name) {cmd = item;cmdI = i;}
    });

    if (cmd==null) {throw new Error(`Unspecified instruction: ${name}`);}

    let args = v.split(' ');


    out[pos] = cmdI;pos++;

    let nan = false;



    args.slice(1).forEach((item, i) => {
      let val = Number(item);

      if (nan) {
        //Do operation.
        let lpos = null;
        info.forEach((item2, i) => {

          if (args.slice(1)[0]==item2.Name) {lpos = item2.Pos;}
        });
        let pos2 = eval(`${lpos}${args.slice(1)[1]}`);
        out[pos] = (pos2&0xff00);
        pos++;
        out[pos] = (pos2&0xff);
        pos++;

      }

      if (isNaN(val)) {
        nan = true;
        //Get the label and then get it's pos
        let lpos = null;
        info.forEach((item2, i) => {

          if (item==item2.Name) {lpos = item2.Pos;}
        });

        out[pos] = (lpos&0xff00);
        pos++;
        out[pos] = (lpos&0xff);
        pos++;

        return;
      }

      out[pos] = val;
    });



  }

  return out;

}
