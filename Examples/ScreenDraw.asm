;Render screen example
;
;  The screen fill color.
LDA 255
;
;  The start pos.
LDX 02
LDY 00
;
;
JMP LOOP
HALT
/LOOP
;  random color.
LAA 0xFF 0xFF
;  Render the pixel.
SXY
;  increment y value.
INY
;
BCS INC
;
;  Jump back to /loop
JMP LOOP
/INC
INX
TRG 0
JMP LOOP