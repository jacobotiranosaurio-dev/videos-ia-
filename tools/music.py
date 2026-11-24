"""Sintetiza música de fondo suave (curiosidad, lo-fi/marimba) + SFX. Todo original y libre de derechos.
uso: python3 tools/music.py <segundos> <carpeta_salida> [bpm] [semilla]"""
import numpy as np, sys, os
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 104
rng = np.random.default_rng(int(sys.argv[4]) if len(sys.argv) > 4 else 7)
style = sys.argv[5] if len(sys.argv) > 5 else "lofi"  # lofi | synth (synthwave)
os.makedirs(out, exist_ok=True)
n = int(dur * SR); t = np.arange(n) / SR
mix = np.zeros((n, 2))
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, c): b, a = butter(2, c / (SR / 2)); return lfilter(b, a, x)
def hp(x, c): b, a = butter(2, c / (SR / 2), "high"); return lfilter(b, a, x)
def add(sig, start, pan=0.0, g=1.0):
    i = int(start * SR); j = min(n, i + len(sig))
    if i >= n: return
    s = sig[: j - i] * g
    mix[i:j, 0] += s * (1 - pan) ; mix[i:j, 1] += s * (1 + pan)
beat = 60 / bpm; bar = 4 * beat
# progresión: Am - F - C - G (curiosa, positiva)
prog = [[57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62]]
bass = [45, 41, 48, 43]
if style == "synth":
    prog = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]]
    bass = [45, 41, 43, 40]
def pad(notes, L):
    tt = np.arange(int(L * SR)) / SR
    s = sum(np.sin(2*np.pi*f(m)*tt + 0.3*np.sin(2*np.pi*0.4*tt)) + 0.5*np.sin(2*np.pi*f(m)*1.003*tt) for m in notes)
    env = np.minimum(1, tt / 0.8) * np.minimum(1, (L - tt) / 0.8)
    return lp(s * env, 1200) * 0.08
def pluck(m, L=0.6):
    tt = np.arange(int(L * SR)) / SR
    if style == "synth":
        s = sum(np.sin(2*np.pi*f(m)*k*tt)/k for k in range(1, 8))
        return lp(s * np.exp(-tt * 9), 2600) * 0.12
    s = np.sin(2*np.pi*f(m)*tt) + 0.35*np.sin(2*np.pi*f(m)*4*tt)*np.exp(-tt*30)
    return s * np.exp(-tt * 7) * 0.16
def kick():
    tt = np.arange(int(0.35 * SR)) / SR
    return np.sin(2*np.pi*(50 + 90*np.exp(-tt*25))*tt) * np.exp(-tt*9) * 0.35
def hat():
    tt = np.arange(int(0.06 * SR)) / SR
    return hp(rng.standard_normal(len(tt)), 7000) * np.exp(-tt*70) * 0.05
nb = int(dur / bar) + 1
for b in range(nb):
    t0 = b * bar; ch = prog[b % 4]
    add(pad(ch, bar + 0.6), t0)
    tb = np.arange(int(bar*SR))/SR
    add(lp(np.sin(2*np.pi*f(bass[b%4])*tb)*np.minimum(1,tb/0.02)*np.exp(-tb*0.8),300)*0.22, t0)
    arp = [ch[0]+12, ch[1]+12, ch[2]+12, ch[1]+12, ch[0]+24, ch[2]+12, ch[1]+12, ch[2]+12]
    for k in range(8):
        if rng.random() < 0.85:
            add(pluck(arp[k]), t0 + k*beat/2, pan=0.3*np.sin(k), g=0.9 if k % 2 == 0 else 0.6)
    if b >= 1:  # ritmo suave a partir del 2º compás
        for k in range(4):
            if k in (0, 2): add(kick(), t0 + k*beat)
            add(hat(), t0 + k*beat + beat/2, pan=0.2)
            if style == "synth" and k in (1, 3):
                tt2 = np.arange(int(0.2*SR))/SR
                add(lp(hp(rng.standard_normal(len(tt2)), 900), 5000)*np.exp(-tt2*25)*0.12, t0 + k*beat)
# fades
fade = np.minimum(1, t/1.5) * np.minimum(1, (dur - t)/2.5)
mix *= fade[:, None]
mix /= np.abs(mix).max() + 1e-9
wavfile.write(f"{out}/musica.wav", SR, (mix*0.9*32767).astype(np.int16))
# ---------- SFX ----------
def save(name, s): s = s/ (np.abs(s).max()+1e-9) * 0.9; wavfile.write(f"{out}/{name}.wav", SR, (s*32767).astype(np.int16))
L=0.45; tt=np.arange(int(L*SR))/SR; noise=rng.standard_normal(len(tt))
w = np.zeros_like(noise)
for k,(a,b) in enumerate([(300,900),(900,2500),(2500,6000)]):
    w += lp(hp(noise,a),b) * np.exp(-((tt-0.18-0.04*k)/0.09)**2)
save("whoosh", w)
L=0.18; tt=np.arange(int(L*SR))/SR
save("pop", np.sin(2*np.pi*(900*np.exp(-tt*18)+300)*tt)*np.exp(-tt*22))
L=1.2; tt=np.arange(int(L*SR))/SR
save("ding", sum(np.sin(2*np.pi*fr*tt)*np.exp(-tt*d) for fr,d in [(1318,3),(2637,5),(3951,8)]))
L=0.05; tt=np.arange(int(L*SR))/SR
save("tick", hp(rng.standard_normal(len(tt)),3000)*np.exp(-tt*120))
L=0.7; tt=np.arange(int(L*SR))/SR
save("boom", np.sin(2*np.pi*(40+120*np.exp(-tt*12))*tt)*np.exp(-tt*5) + 0.3*lp(rng.standard_normal(len(tt)),800)*np.exp(-tt*10))
L=0.6; tt=np.arange(int(L*SR))/SR
save("rise", np.sin(2*np.pi*(300+1400*tt**2)*tt)*np.minimum(1,tt/0.5)*np.exp(-np.maximum(0,tt-0.5)*40)*0.6)
print("ok")
