"""Alinea una voz nueva (mismo texto, otro locutor) con la voz original mediante DTW sobre MFCC.
uso: python3 tools/align_voice.py voz_vieja.mp3 words_viejos.json voz_nueva.mp3 words_nuevos.json mapa_viejo_a_nuevo.json
Escribe los tiempos de cada palabra en la voz nueva y un mapa [[t_viejo, t_nuevo], ...]."""
import sys, json, numpy as np, librosa
old_a, old_w, new_a, new_w, map_out = sys.argv[1:6]
SR, HOP = 16000, 160  # 10 ms
def feats(p):
    y, _ = librosa.load(p, sr=SR, mono=True)
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=512)[1:]
    m = (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)  # normalización por locutor
    e = librosa.feature.rms(y=y, hop_length=HOP, frame_length=512)[0]
    e = (np.log(e + 1e-5) - np.log(e + 1e-5).mean()) / (np.log(e + 1e-5).std() + 1e-6)
    return np.vstack([m, 2.0 * e[None, : m.shape[1]]]), len(y) / SR
A, da = feats(old_a); B, db = feats(new_a)
D, wp = librosa.sequence.dtw(X=A, Y=B, metric="euclidean", step_sizes_sigma=np.array([[1, 1], [0, 1], [1, 0], [1, 2], [2, 1]]), weights_add=np.array([0, 1, 1, 0, 0]))
wp = wp[::-1]
ta, tb = wp[:, 0] * HOP / SR, wp[:, 1] * HOP / SR
# mapa monótono viejo->nuevo (media de tb para cada ta)
uniq = np.unique(ta)
mp = np.array([tb[ta == u].mean() for u in uniq])
mp = np.maximum.accumulate(mp)
f = lambda t: float(np.interp(t, uniq, mp))
w = json.load(open(old_w))
nw = [{"t": x["t"], "s": round(f(x["s"]), 3), "e": round(max(f(x["e"]), f(x["s"]) + 0.05), 3)} for x in w]
json.dump(nw, open(new_w, "w"), ensure_ascii=False, indent=0)
step = np.arange(0, da + 0.001, 0.05)
json.dump([[round(float(t), 3), round(f(t), 3)] for t in step], open(map_out, "w"))
print(f"viejo {da:.2f}s -> nuevo {db:.2f}s · coste medio {D[-1,-1]/len(wp):.3f}")
