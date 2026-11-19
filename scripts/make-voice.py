#!/usr/bin/env python3
"""Genera la voz en off de los 5 shorts, una pista por escena.

Motores:
  elevenlabs (por defecto)  voz natural. Necesita ELEVENLABS_API_KEY (plan gratis: 10.000 caracteres/mes;
                            los 5 videos usan ~3.100). Lee src/videos/voiceover.json
      ELEVENLABS_API_KEY=tu_clave python3 scripts/make-voice.py [--voice-id TX3LPaxmHKxFdv7VOQHJ] [--speed 1.1]
  piper                     gratis y offline (pip install piper-tts + modelo .onnx). Lee voiceover-piper.json
      python3 scripts/make-voice.py --engine piper --model ruta/es_MX-claude-high.onnx

Crea public/vo/<video>/<escena>.wav (limpieza, compresión y volumen con ffmpeg)
y src/videos/vo-durations.json; cada escena se alarga sola para que su frase quepa.
"""
import argparse, json, os, subprocess, tempfile, urllib.request, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('--engine', choices=['elevenlabs', 'piper'], default='elevenlabs')
ap.add_argument('--voice-id', default='TX3LPaxmHKxFdv7VOQHJ', help='ElevenLabs voice id (por defecto: Liam)')
ap.add_argument('--speed', type=float, default=1.1, help='ElevenLabs: 0.7-1.2 · Piper: length-scale (<1 = más rápido)')
ap.add_argument('--model', help='Piper: ruta al modelo .onnx')
ap.add_argument('--only', help='Generar solo este video (id)')
args = ap.parse_args()

src = 'voiceover.json' if args.engine == 'elevenlabs' else 'voiceover-piper.json'
lines = json.load(open(os.path.join(ROOT, 'src/videos', src), encoding='utf-8'))
dur_path = os.path.join(ROOT, 'src/videos/vo-durations.json')
durations = json.load(open(dur_path)) if os.path.exists(dur_path) else {}


def tts_elevenlabs(text, prev, nxt, dst):
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        raise SystemExit('Falta ELEVENLABS_API_KEY')
    body = {
        'text': text,
        'model_id': 'eleven_multilingual_v2',
        'previous_text': prev,
        'next_text': nxt,
        'voice_settings': {'stability': 0.4, 'similarity_boost': 0.8, 'style': 0.45, 'use_speaker_boost': True, 'speed': args.speed},
    }
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{args.voice_id}?output_format=mp3_44100_128',
        data=json.dumps(body).encode(), headers={'xi-api-key': key, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=120) as r, open(dst, 'wb') as f:
        f.write(r.read())


def tts_piper(text, dst):
    if not args.model:
        raise SystemExit('Falta --model para Piper')
    subprocess.run(['python3', '-m', 'piper', '-m', args.model, '--length-scale', str(args.speed),
                    '--sentence-silence', '0.12', '-f', dst], input=text.encode(), check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


for vid, scenes in lines.items():
    if vid.startswith('_') or (args.only and vid != args.only):
        continue
    out_dir = os.path.join(ROOT, 'public/vo', vid)
    os.makedirs(out_dir, exist_ok=True)
    durations[vid] = []
    for i, text in enumerate(scenes):
        dst = os.path.join(out_dir, f'{i}.wav')
        if not text.strip():
            durations[vid].append(0)
            continue
        raw = tempfile.mktemp(suffix='.mp3' if args.engine == 'elevenlabs' else '.wav')
        if args.engine == 'elevenlabs':
            tts_elevenlabs(text, scenes[i - 1] if i else '', scenes[i + 1] if i + 1 < len(scenes) else '', raw)
        else:
            tts_piper(text, raw)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af',
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                        'highpass=f=90,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-15:TP=-1.5',
                        '-ar', '48000', '-ac', '1', dst], check=True)
        os.unlink(raw)
        with wave.open(dst) as w:
            d = w.getnframes() / w.getframerate()
        durations[vid].append(round(d, 3))
        print(f'{vid} #{i}: {d:.2f}s  {text}')

json.dump(durations, open(dur_path, 'w'), indent=2)
print('OK -> src/videos/vo-durations.json')
