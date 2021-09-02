//Assembler.

class Label {//Function labels
  Name = "NULL";
  Pos = null;

  constructor(name,pos) {
    this.Name = name;
    this.Pos = pos;
  }


}

let types = ['text','hex','js-syntax'];

export function Syntax(code,inst) {
  let split = code.split('\n');

  let out = new Array();

  function get(str) {
    return out.find((item) => {return item.Name==str});
  }


  let pos = 0;

  let js = '';

  let dataType = null;


  for (var i = 0; i < split.length; i++) {
    let line = split[i];

    if (line.startsWith(';')||line=='\n'||line==''&&dataType==null) {continue;}

    //Check for labels
    if (line.endsWith(':')&&dataType==null) {out = out.concat(new Label(line.slice(0,line.length-1).trimStart(),pos));continue;}

    //Check for location changes.
    if (line.startsWith('/')) {pos = Number(line.slice(1));if (isNaN(pos)) {throw new Error(`Failed to parse number at line ${i+1}`);};continue;}

    //Data type checking


    if (dataType==null) {
      if (line=='.end') {throw new Error(`Cannot end data encoding if no encoding was specified, line ${i+1}`);}
      if (line.startsWith('.')) {
        dataType = line.slice(1);
        if (!types.includes(dataType)) {throw new Error(`Unkown data type, line ${i+1}`);}
        continue;
      }

    } else {
      if (line=='.end') {
        dataType = null;

        let exec = new Function(['data','get'],js);
        exec(out,get);

        js = '';

        continue;
      }
      //Otherwise start encoding the data line by line.
      if (dataType=='text') {
        if (line.charAt(0)=='\\') {line = line.slice(1);}
        line.split('').forEach((char, i2) => {
          pos++;
        });

        continue;
      }

      if (dataType=='hex') {
        line.split(' ').forEach((str, i2) => {
          if (str==''||str==' ') {return;}
          let v = Number(str);
          if (isNaN(v)) {return;}
          pos++;
        });

        continue;
      }

      if (dataType=='js-syntax') {
        js+=line;
        continue;
      }

    }

    //If the interpreter reaches here, then start encoding raw hex values, numbers, or instructions.
    let part = 1;//part of line
    let args = 0;

    let currentArg = 0;//current arg being interpreted


    line.split(' ').forEach((item, i2) => {
      if (item==' '||item=='') {return;}
      //Otherwise convert stuff.

      if (part==1) {
        part++;
        //Find the instruction.
        let found = null;
        let foundi = null;
        inst.forEach((item2, i3) => {
          if (item==undefined) {return;}
          if (item2.name==item) {found = item2;foundi = i3;}
        });
        if (found==null) {throw new Error(`Unknown instruction, line ${i+1}`);}
        args = found.DataLength;
        pos++;

      } else {
        if (currentArg>=args) {throw new Error(`Too many arguments! Line ${i+1}`);}
        //Find the instruction argument
        let value = Number(item);
        if (isNaN(value)) {
          //Assume existence of a label

          pos+=2;
          //End of label.
          currentArg+=2;
        } else {
          //Otherwise is a regular number.
          currentArg++;
          pos++;
        }
         //check args again in case they've changed
         if (currentArg>args) {throw new Error(`Too many arguments! Line ${i+1}`);}

      }

    });




  }

  return {Code:code,Labels:out};
}






export function Parse(data,inst) {
  let split = data.Code.split('\n');

  let out = [];

  let code = data.Code;

  let pos = 0;

  let dataType = null;


  for (var i = 0; i < split.length; i++) {
    let line = split[i];

    if (line.startsWith(';')||line=='\n'||line==''&&dataType==null) {continue;}

    //Check for labels
    if (line.endsWith(':')&&dataType==null) {continue;}

    //Check for location changes.
    if (line.startsWith('/')) {pos = Number(line.slice(1));if (isNaN(pos)) {throw new Error(`Failed to parse number at line ${i+1}`);};continue;}

    //Data type checking


    if (dataType==null) {
      if (line=='.end') {throw new Error(`Cannot end data encoding if no encoding was specified, line ${i+1}`);}
      if (line.startsWith('.')) {
        dataType = line.slice(1);
        if (!types.includes(dataType)) {throw new Error(`Unkown data type, line ${i+1}`);}
        continue;
      }

    } else {
      if (line=='.end') {dataType = null;continue;}
      //Otherwise start encoding the data line by line.
      if (dataType=='text') {
        if (line.charAt(0)=='\\') {
          line = line.slice(1);
          if (split[i+1]!='.end') {line+='\n';}
        }
        line.split('').forEach((char, i2) => {
          out[pos] = char.charCodeAt(0);
          pos++;
        });

        continue;
      }

      if (dataType=='hex') {
        line.split(' ').forEach((str, i2) => {
          if (str==''||str==' ') {return;}
          let v = Number(str);
          if (isNaN(v)) {return;}
          out[pos] = v;
          pos++;
        });

        continue;
      }

      if (dataType=='js-syntax') {
        continue;
      }

    }

    //If the interpreter reaches here, then start encoding raw hex values, numbers, or instructions.
    let part = 1;//part of line
    let args = 0;

    let currentArg = 0;//current arg being interpreted


    line.split(' ').forEach((item, i2) => {
      if (item==' '||item=='') {return;}
      //Otherwise convert stuff.

      if (part==1) {
        part++;
        //Find the instruction.
        let found = null;
        let foundi = null;
        inst.forEach((item2, i3) => {
          if (item==undefined) {return;}
          if (item2.name==item) {found = item2;foundi = i3;}
        });
        if (found==null) {throw new Error(`Unknown instruction, line ${i+1}`);}
        args = found.DataLength;
        out[pos] = foundi;
        pos++;

      } else {
        if (currentArg>=args) {throw new Error(`Too many arguments! Line ${i+1}`);}
        //Find the instruction argument
        let value = Number(item);
        if (isNaN(value)) {
          //Find the label
          let label = null;
          data.Labels.forEach((l, i3) => {
            if (l.Name==item) {label = l;}
          });

          if (label==null) {throw new Error(`Failed to find label, line ${i+1}`);}

          out[pos] = label.Pos>>8;
          pos++;
          out[pos] = label.Pos&0x00ff;
          pos++;
          //End of label finding and using
          currentArg+=2;
        } else {
          //Otherwise is a regular number.
          out[pos] = value;
          currentArg++;
          pos++;
        }
        //check args again in case they've changed
        if (currentArg>args) {throw new Error(`Too many arguments! Line ${i+1}`);}

      }

    });




  }

  return out;
}
