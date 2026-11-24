"""alignment.json (ElevenLabs) -> words.json [{t, s, e}] con números en cifras."""
import json, sys, re
al = json.load(open(sys.argv[1], encoding="utf-8"))
reps = json.load(open(sys.argv[2], encoding="utf-8")) if len(sys.argv) > 3 else {}
out = sys.argv[-1]
ch, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
words, cur = [], None
for c, s, e in zip(ch, st, en):
    if c.isspace():
        if cur: words.append(cur); cur = None
        continue
    if cur is None: cur = {"t": "", "s": s, "e": e}
    cur["t"] += c; cur["e"] = e
if cur: words.append(cur)
# fusionar frases numéricas -> cifras
norm = lambda w: re.sub(r"[^\wáéíóúñü]", "", w.lower())
res, i = [], 0
keys = sorted(reps.keys(), key=lambda k: -len(k.split()))
while i < len(words):
    for k in keys:
        n = len(k.split())
        if [norm(w["t"]) for w in words[i:i+n]] == k.split():
            tail = re.sub(r"^[\wáéíóúñü]+", "", words[i+n-1]["t"]).strip() if True else ""
            last = words[i+n-1]["t"]; punct = re.findall(r"[^\wáéíóúñü]+$", last)
            res.append({"t": reps[k] + (punct[0] if punct else ""), "s": words[i]["s"], "e": last and words[i+n-1]["e"]})
            i += n; break
    else:
        res.append(words[i]); i += 1
json.dump([{"t": w["t"], "s": round(w["s"], 3), "e": round(w["e"], 3)} for w in res], open(out, "w"), ensure_ascii=False, indent=0)
print(len(res), "palabras")
