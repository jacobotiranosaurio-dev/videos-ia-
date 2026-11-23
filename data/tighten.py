"""Acorta los silencios largos de una voz ya generada (sin regenerarla, 0 créditos).
Uso: python3 data/tighten.py <id>
Lee public/audio/<id>_original.mp3 y data/<id>.timing_original.json (los crea la 1.ª vez)
y escribe public/audio/<id>.mp3 + data/<id>.timing.json + src/data/<id>.timing.json."""
import json, shutil, subprocess, sys, os
import numpy as np
ID = sys.argv[1]
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
A, T = f'public/audio/{ID}.mp3', f'data/{ID}.timing.json'
AO, TO = f'public/audio/{ID}_original.mp3', f'data/{ID}.timing_original.json'
if not os.path.exists(AO): shutil.copy(A, AO)
if not os.path.exists(TO): shutil.copy(T, TO)
SR = 44100
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', AO, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(float) / 32768
d = json.load(open(TO)); w = d['words']
def silent(t0, t1):
    seg = x[int(t0 * SR):int(t1 * SR)]
    return len(seg) == 0 or 20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-12) < -50
cuts = []  # (inicio, fin) a eliminar
for a, b in zip(w, w[1:]):
    gap = b['start'] - a['end']
    if gap <= 0.24: continue
    keep = 0.22 if a['text'][-1] in '.?!:…' else 0.14
    # zona silenciosa real dentro del hueco (margen de seguridad de 40 ms a cada lado)
    s0, s1 = a['end'] + 0.04, b['start'] - 0.04
    while s0 < s1 and not silent(s0, s0 + 0.02): s0 += 0.01
    while s1 > s0 and not silent(s1 - 0.02, s1): s1 -= 0.01
    remove = min(gap - keep, s1 - s0)
    if remove < 0.05: continue
    mid = (s0 + s1) / 2
    cuts.append((mid - remove / 2, mid + remove / 2))
# audio recortado
keep_parts, t = [], 0.0
for c0, c1 in cuts: keep_parts.append((t, c0)); t = c1
keep_parts.append((t, len(x) / SR))
flt = ''.join(f'[0:a]atrim={p0:.4f}:{p1:.4f},asetpts=PTS-STARTPTS[p{i}];' for i, (p0, p1) in enumerate(keep_parts))
flt += ''.join(f'[p{i}]' for i in range(len(keep_parts))) + f'concat=n={len(keep_parts)}:v=0:a=1[o]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', AO, '-filter_complex', flt, '-map', '[o]', '-b:a', '128k', A], check=True)
# tiempos desplazados
def shift(tt): return tt - sum(min(max(tt - c0, 0), c1 - c0) for c0, c1 in cuts)
for wd in w: wd['start'] = round(shift(wd['start']), 3); wd['end'] = round(shift(wd['end']), 3)
total = sum(c1 - c0 for c0, c1 in cuts)
d['duration'] = round(d['duration'] - total, 3)
json.dump(d, open(T, 'w'), ensure_ascii=False, indent=1); shutil.copy(T, f'src/data/{ID}.timing.json')
print(f'{len(cuts)} pausas acortadas, {total:.2f} s de silencio eliminado; última palabra termina en {w[-1]["end"]:.2f} s')
