"""Acorta silencios de la voz SIN regenerarla (0 créditos).
uso: python3 tools/tighten.py voz_in.mp3 voz_out.mp3 timemap.json [--hook 12] [--keep 0.16] [--keep-hook 0.09] [--dramatic 25.8,18.1]
- En los primeros --hook segundos deja solo --keep-hook s de pausa (ritmo máximo en el gancho).
- Después deja --keep s.  Las pausas que empiezan cerca de --dramatic conservan 0.3 s (pausa intencionada).
Escribe timemap.json = [[t_original, t_nuevo], ...] para remapear subtítulos, escenas y efectos."""
import subprocess, re, json, sys, argparse
p = argparse.ArgumentParser(); p.add_argument("inp"); p.add_argument("out"); p.add_argument("map")
p.add_argument("--hook", type=float, default=12); p.add_argument("--keep", type=float, default=0.16)
p.add_argument("--keep-hook", type=float, default=0.09); p.add_argument("--dramatic", default="")
a = p.parse_args()
dram = [float(x) for x in a.dramatic.split(",") if x]
log = subprocess.run(["ffmpeg", "-i", a.inp, "-af", "silencedetect=noise=-38dB:d=0.1", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.inp], capture_output=True, text=True).stdout)
keepsegs, cur, removed = [], 0.0, 0.0
tmap = [[0.0, 0.0]]
for s, e in zip(st, en):
    if s < 0.05: continue  # silencio inicial: lo dejamos
    keep = 0.3 if any(abs(s - d) < 0.4 for d in dram) else (a.keep_hook if s < a.hook else a.keep)
    gap = e - s
    if gap <= keep: continue
    cut_a = s + keep / 2; cut_b = e - keep / 2
    keepsegs.append((cur, cut_a)); cur = cut_b
    tmap.append([cut_a, cut_a - removed]); removed += cut_b - cut_a; tmap.append([cut_b, cut_b - removed])
keepsegs.append((cur, dur)); tmap.append([dur, dur - removed])
f = "".join(f"[0:a]atrim={x:.4f}:{y:.4f},asetpts=PTS-STARTPTS[s{i}];" for i, (x, y) in enumerate(keepsegs))
f += "".join(f"[s{i}]" for i in range(len(keepsegs))) + f"concat=n={len(keepsegs)}:v=0:a=1[o]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.inp, "-filter_complex", f, "-map", "[o]", "-b:a", "192k", a.out], check=True)
json.dump([[round(x, 4), round(y, 4)] for x, y in tmap], open(a.map, "w"))
print(f"{dur:.2f}s -> {dur - removed:.2f}s  (recortados {removed:.2f}s en {len(keepsegs)-1} pausas)")
