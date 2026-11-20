#!/bin/bash
# uso: ./scripts_still.sh <id> frame1 frame2 ...  -> hoja de contacto en scratchpad
ID=$1; shift; S=${STILLS:-/tmp/stills}; mkdir -p $S; ins=""; n=0
for f in "$@"; do npx remotion still src/index.ts $ID $S/$ID-$f.jpg --frame=$f --scale=0.4 --log=error 2>&1 | grep -iE "error" | head -3; ins="$ins -i $S/$ID-$f.jpg"; n=$((n+1)); done
ffmpeg -loglevel error -y $ins -filter_complex hstack=$n $S/$ID-sheet.jpg && echo $S/$ID-sheet.jpg
