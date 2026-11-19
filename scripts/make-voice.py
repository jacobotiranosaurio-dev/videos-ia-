#!/usr/bin/env python3
"""Genera la voz en off GRATIS y offline con Piper (https://github.com/rhasspy/piper).

Requisitos:  pip install piper-tts
Voz:         descarga es_MX-claude-high.onnx y .onnx.json de
             https://huggingface.co/rhasspy/piper-voices/tree/main/es/es_MX/claude/high
Uso:         python3 scripts/make-voice.py --voice /ruta/es_MX-claude-high.onnx [--speed 0.82]

Crea public/vo/<video>/<escena>.wav (procesada con ffmpeg: limpieza, compresión, volumen)
y src/videos/vo-durations.json con la duración de cada clip.
"""
import argparse, json, os, subprocess, tempfile, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('--voice', required=True)
ap.add_argument('--speed', type=float, default=0.82, help='length-scale de Piper (<1 = más rápido)')
args = ap.parse_args()

lines = json.load(open(os.path.join(ROOT, 'src/videos/voiceover.json'), encoding='utf-8'))
durations = {}
for vid, scenes in lines.items():
    if vid.startswith('_'):
        continue
    out_dir = os.path.join(ROOT, 'public/vo', vid)
    os.makedirs(out_dir, exist_ok=True)
    durations[vid] = []
    for i, text in enumerate(scenes):
        dst = os.path.join(out_dir, f'{i}.wav')
        if not text.strip():
            durations[vid].append(0)
            continue
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            raw = tmp.name
        subprocess.run(['python3', '-m', 'piper', '-m', args.voice, '--length-scale', str(args.speed),
                        '--sentence-silence', '0.12', '-f', raw], input=text.encode('utf-8'), check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        # Voz "de creador": quita graves sucios, recorta silencios, comprime y normaliza
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af',
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                        'highpass=f=90,equalizer=f=3000:t=q:w=1:g=3,'
                        'acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-15:TP=-1.5',
                        '-ar', '48000', '-ac', '1', dst], check=True)
        os.unlink(raw)
        with wave.open(dst) as w:
            d = w.getnframes() / w.getframerate()
        durations[vid].append(round(d, 3))
        print(f'{vid} #{i}: {d:.2f}s  {text}')

json.dump(durations, open(os.path.join(ROOT, 'src/videos/vo-durations.json'), 'w'), indent=2)
print('OK -> src/videos/vo-durations.json')
