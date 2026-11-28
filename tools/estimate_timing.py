"""Tiempos ESTIMADOS por palabra (sin voz, 0 créditos), calibrados con el ritmo de Dan (~17 caracteres/s).
Genera un alignment falso con el formato de ElevenLabs para usar después tools/words.py.
uso: python3 tools/estimate_timing.py voz.txt alignment_estimado.json [cps]"""
import sys, json
txt = open(sys.argv[1], encoding="utf-8").read().strip().replace("\n", " ")
cps = float(sys.argv[3]) if len(sys.argv) > 3 else 17.0
chars, st, en = [], [], []
t = 0.0
PAUSE = {",": 0.22, ":": 0.3, ";": 0.3, ".": 0.38, "?": 0.42, "!": 0.38}
i = 0
while i < len(txt):
    c = txt[i]
    if txt[i:i + 3] == "...":
        for k in range(3):
            chars.append("."); st.append(t); en.append(t)
        t += 0.55; i += 3; continue
    d = 1.0 / cps
    chars.append(c); st.append(t); t += d; en.append(t)
    if c in PAUSE and (i + 1 >= len(txt) or txt[i + 1] == " "):
        t += PAUSE[c]
    i += 1
json.dump({"characters": chars, "character_start_times_seconds": st, "character_end_times_seconds": en}, open(sys.argv[2], "w"), ensure_ascii=False)
print(f"duración estimada: {t:.1f}s")
