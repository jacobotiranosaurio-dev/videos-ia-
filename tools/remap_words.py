"""Remapea words.json con un timemap.json (de tighten.py). uso: remap_words.py words_in.json timemap.json words_out.json"""
import json, sys, bisect
w = json.load(open(sys.argv[1])); tm = json.load(open(sys.argv[2]))
xs = [a for a, _ in tm]
def m(t):
    i = max(0, min(len(tm) - 2, bisect.bisect_right(xs, t) - 1)); (x0, y0), (x1, y1) = tm[i], tm[i + 1]
    return y0 if x1 == x0 else y0 + (t - x0) * (y1 - y0) / (x1 - x0)
json.dump([{"t": x["t"], "s": round(m(x["s"]), 3), "e": round(m(x["e"]), 3)} for x in w], open(sys.argv[3], "w"), ensure_ascii=False, indent=0)
