
JSR PrintMessage

HALT

PrintMessage:

PrintMessage_replace2:
PrintMessage_replace1:
LAA TEXT

BZS PrintMessage_end

LAX PrintMessage_replace1
INX

BCS PrintMessage_inc
STX PrintMessage_replace1
JSR PrintChar
JMP PrintMessage


PrintMessage_inc:
STX PrintMessage_replace1
LAX PrintMessage_replace2
INX
STX PrintMessage_replace2

JMP PrintMessage

JSR PrintChar




PrintMessage_end:

TRG 2 0

RET




PrintChar:
;A is char

  STA PrintChar_replace
  PrintChar_replace:
  TRG 1 0
  RET

/0x0200

TEXT:

.text
Hello world!
.end

.hex
0x00
.end


; stuff to put this all together
.js-syntax
console.info(data);
get('PrintChar_replace').Pos+=2;
get('PrintMessage_replace1').Pos+=2;
get('PrintMessage_replace2').Pos+=1;
.end
