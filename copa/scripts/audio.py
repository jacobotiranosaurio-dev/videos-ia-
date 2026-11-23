"""Genera música de fondo original (sin copyright) y efectos whoosh/pop con síntesis.

La música se escala para quedar 20 dB por debajo del RMS de la voz.
Uso: python audio.py <dir_public> <duracion_segundos>
"""
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

OUT = Path(sys.argv[1])
DUR = float(sys.argv[2])
SR = 44100
rng = np.random.default_rng(11)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s
    A, D, R = int(a * SR), int(d * SR), int(r * SR)
    e[:A] = np.linspace(0, 1, A)
    e[A:A + D] = np.linspace(1, s, len(e[A:A + D]))
    e[-R:] *= np.linspace(1, 0, R)
    return e


def pluck(freq, dur, bright=0.5):
    """Karplus-Strong: cuerda pulsada suave (tipo ukelele)."""
    n = int(dur * SR)
    p = int(SR / freq)
    buf = rng.uniform(-1, 1, p) * bright
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return out


BPM = 112
beat = 60 / BPM
bar = beat * 4
# I - vi - IV - V en Sol mayor, más brillante
prog = [[43, 55, 59, 62], [40, 55, 59, 64], [36, 55, 60, 64], [38, 54, 57, 62]]  # Sol - Mim - Do - Re
n_total = int((DUR + 1) * SR)
music = np.zeros(n_total)

t_bar = 0.0
k = 0
pluck_cache = {}
while t_bar < DUR + 1:
    chord = prog[k % 4]
    s = int(t_bar * SR)
    # pad: senos desafinados con ataque lento
    n = int(bar * SR)
    tt = np.arange(n) / SR
    pad = np.zeros(n)
    for note in chord[1:]:
        f = midi(note)
        pad += np.sin(2 * np.pi * f * tt) + 0.6 * np.sin(2 * np.pi * f * 1.003 * tt)
    pad *= env_adsr(n, 0.6, 0.4, 0.8, 0.6) * 0.05
    # bajo suave
    bass = np.sin(2 * np.pi * midi(chord[0]) * tt) * env_adsr(n, 0.02, 0.5, 0.5, 0.3) * 0.18
    seg = pad + bass
    e = min(s + n, n_total)
    music[s:e] += seg[:e - s]
    # arpegio en corcheas
    pattern = [1, 2, 3, 2, 1, 3, 2, 3]
    for j, idx in enumerate(pattern):
        note = chord[idx] + 12
        key = note
        if key not in pluck_cache:
            pluck_cache[key] = pluck(midi(note), 0.9) * np.exp(-np.arange(int(0.9 * SR)) / SR * 4)
        p = pluck_cache[key] * (0.16 if j % 2 == 0 else 0.11)
        ps = s + int(j * beat / 2 * SR)
        pe = min(ps + len(p), n_total)
        if ps < n_total:
            music[ps:pe] += p[:pe - ps]
    # bombo suave en cada pulso
    for j in range(4):
        ks = s + int(j * beat * SR)
        kn = int(0.18 * SR)
        if ks + kn < n_total:
            kt = np.arange(kn) / SR
            music[ks:ks + kn] += np.sin(2 * np.pi * (55 + 90 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 18) * 0.35
    # shaker suave en contratiempos
    for j in range(4):
        hs = s + int((j + 0.5) * beat * SR)
        hn = int(0.06 * SR)
        if hs + hn < n_total:
            noise = rng.normal(0, 1, hn) * np.exp(-np.arange(hn) / SR * 60)
            noise = np.diff(noise, prepend=0)  # paso alto simple
            music[hs:hs + hn] += noise * 0.025
    t_bar += bar
    k += 1

# fade in/out
music = music[:int(DUR * SR)]
fi, fo = int(1.0 * SR), int(2.5 * SR)
music[:fi] *= np.linspace(0, 1, fi)
music[-fo:] *= np.linspace(1, 0, fo)

voice, vsr = sf.read(OUT / "voice.wav")
voiced = voice[np.abs(voice) > 0.02]
v_rms = np.sqrt(np.mean(voice[: len(voice)] ** 2 + 1e-12))
v_rms_active = np.sqrt(np.mean(voiced ** 2))
m_rms = np.sqrt(np.mean(music ** 2))
target = v_rms_active * 10 ** (-20 / 20)
music *= target / m_rms
print(f"voz RMS {20*np.log10(v_rms_active):.1f} dBFS, música RMS {20*np.log10(np.sqrt(np.mean(music**2))):.1f} dBFS")
sf.write(OUT / "music.wav", np.stack([music, music], 1).astype(np.float32), SR)

# whoosh: ruido filtrado con barrido
n = int(0.5 * SR)
tt = np.arange(n) / SR
noise = rng.normal(0, 1, n)
y = np.zeros(n)
lp = 0.0
for i in range(n):
    a = 0.02 + 0.25 * np.sin(np.pi * i / n) ** 2
    lp += a * (noise[i] - lp)
    y[i] = lp
y = np.diff(y, prepend=0) * 0.6 + y * 0.4
y *= np.sin(np.pi * tt / 0.5) ** 2
y = y / np.abs(y).max() * v_rms_active * 10 ** (-9 / 20) * 2.5
sf.write(OUT / "whoosh.wav", np.stack([y, y], 1).astype(np.float32), SR)

# pop: blip con caída de tono
n = int(0.12 * SR)
tt = np.arange(n) / SR
f = 900 * np.exp(-tt * 18) + 300
ph = 2 * np.pi * np.cumsum(f) / SR
y = np.sin(ph) * np.exp(-tt * 35)
y = y / np.abs(y).max() * v_rms_active * 10 ** (-8 / 20) * 2.5
sf.write(OUT / "pop.wav", np.stack([y, y], 1).astype(np.float32), SR)
print("ok")
