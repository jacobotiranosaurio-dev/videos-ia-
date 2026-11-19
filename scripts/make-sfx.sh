#!/usr/bin/env bash
# Genera efectos de sonido y beat 100% sintéticos (sin copyright) con ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/../public/sfx"
F="ffmpeg -y -hide_banner -loglevel error"
# Whoosh: ruido filtrado con barrido
$F -f lavfi -i "anoisesrc=d=0.45:c=pink:a=0.9" -af "highpass=f=400,lowpass=f=5000,afade=t=in:d=0.25:curve=exp,afade=t=out:st=0.25:d=0.2,volume=0.7" whoosh.wav
# Impacto: bombo grave con caída de tono + golpe de ruido
$F -f lavfi -i "aevalsrc='0.9*sin(2*PI*(45+140*exp(-t*25))*t)*exp(-t*5)':d=0.9:s=44100" -f lavfi -i "anoisesrc=d=0.15:c=white:a=0.5" \
  -filter_complex "[1]lowpass=f=2500,afade=t=out:d=0.15[n];[0][n]amix=inputs=2:normalize=0,volume=1.1" impact.wav
# Pop: clic corto agudo
$F -f lavfi -i "aevalsrc='0.6*sin(2*PI*(900-500*t*10)*t)*exp(-t*40)':d=0.12:s=44100" pop.wav
# Tick: para contadores
$F -f lavfi -i "aevalsrc='0.35*sin(2*PI*2200*t)*exp(-t*120)':d=0.05:s=44100" tick.wav
# Riser: barrido ascendente antes del CTA
$F -f lavfi -i "aevalsrc='0.35*sin(2*PI*(200*t+600*t*t))*(t/1.6)':d=1.6:s=44100" -f lavfi -i "anoisesrc=d=1.6:c=pink:a=0.4" \
  -filter_complex "[1]highpass=f=1500,afade=t=in:d=1.6:curve=exp[n];[0][n]amix=inputs=2:normalize=0" riser.wav
# Glitch: ruido digital entrecortado
$F -f lavfi -i "aevalsrc='0.5*sgn(sin(2*PI*180*t))*(mod(floor(t*40),2))':d=0.35:s=44100" -af "lowpass=f=4000,volume=0.6" glitch.wav
# Beat de fondo 110 BPM (synth retro): bombo + bajo en contratiempo + hi-hat
B=0.5454545
$F -f lavfi -i "aevalsrc='0.55*sin(2*PI*(48+110*exp(-mod(t,$B)*30))*mod(t,$B))*exp(-mod(t,$B)*7) + 0.22*sin(2*PI*55*pow(2,floor(mod(t/($B*8),4))*0.25)*t)*gt(mod(t,$B),$B/2)*exp(-(mod(t,$B)-$B/2)*6)':d=$(echo "$B*8*12" | bc):s=44100" \
  -f lavfi -i "anoisesrc=d=$(echo "$B*8*12" | bc):c=white:a=0.6" \
  -filter_complex "[1]highpass=f=7000,volume='0.35*exp(-mod(t,$B/2)*40)':eval=frame[h];[0][h]amix=inputs=2:normalize=0,lowpass=f=9000,volume=0.8" beat.wav
ls -la
