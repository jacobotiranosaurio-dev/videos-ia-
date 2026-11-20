"""Genera la voz en off (Piper es_ES, voz davefx) y los tiempos de cada palabra.

Cada frase (separada por "/") se sintetiza por separado, se recortan sus silencios y se
concatenan con pausas controladas. Así los límites de cada frase son exactos; dentro de
la frase, el tiempo se reparte por sílabas (más una pausa extra en comas).

Uso: python tts.py <dir_modelo> <dir_salida>
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig
import soundfile as sf

MODEL_DIR = Path(sys.argv[1])
OUT = Path(sys.argv[2])
SPEED = 1.10  # +10 %
GAP_PHRASE = 0.14
GAP_SENTENCE = 0.36
LEAD_IN = 0.25

HERE = Path(__file__).parent
lines = [l.strip() for l in (HERE / "guion.txt").read_text(encoding="utf-8").splitlines()
         if l.strip() and not l.startswith("#")]

onnx = next(MODEL_DIR.glob("*.onnx"))
voice_model = PiperVoice.load(str(onnx))
SYN = SynthesisConfig(length_scale=1 / SPEED)

TOKEN_RE = re.compile(r"\{[^}]*\}|\S+")
PUNCT = "¿?¡!.,;:"


def tokens_of(phrase):
    out = []
    for raw in TOKEN_RE.findall(phrase):
        if raw.startswith("{"):
            disp, spoken = raw[1:-1].split("|")
            trail = ""
        else:
            m = re.match(r"^(.*?)([.,;:?!]*)$", raw)
            disp, trail = m.group(1), m.group(2)
            spoken = raw.replace("*", "")
        if not disp.strip("*¿¡") and out:  # puntuación suelta tras {..}
            out[-1]["spoken"] += raw
            out[-1]["comma"] = out[-1]["comma"] or "," in raw
            continue
        key = disp.startswith("*")
        disp = disp.lstrip("*").strip("¿¡")
        out.append({"display": disp, "spoken": spoken.replace("*", ""), "key": key,
                    "comma": "," in trail})
    return out


def syllables(text):
    t = re.sub(r"[^a-záéíóúüñ ]", "", text.lower())
    n = len(re.findall(r"[aeiouáéíóúü]+", t))
    return max(n, 1)


def trim(samples, sr, thr=0.012):
    win = int(sr * 0.01)
    env = np.array([np.abs(samples[i:i + win]).max() for i in range(0, len(samples), win)])
    idx = np.where(env > thr)[0]
    if len(idx) == 0:
        return samples
    a = max(idx[0] - 1, 0) * win
    b = min((idx[-1] + 2) * win, len(samples))
    return samples[a:b]


sr = None
chunks = []
t = LEAD_IN
words, sentences = [], []
for si, line in enumerate(lines):
    phrases = [p.strip() for p in line.split("/")]
    s_start = t
    for pi, phrase in enumerate(phrases):
        toks = tokens_of(phrase)
        text = " ".join(tk["spoken"] for tk in toks)
        if pi < len(phrases) - 1 and not text.endswith((",", "?", ".")):
            text += ","
        sr = voice_model.config.sample_rate
        raw = np.concatenate([c.audio_float_array for c in voice_model.synthesize(text, syn_config=SYN)])
        samples = trim(raw.astype(np.float32), sr)
        if not chunks:
            chunks.append(np.zeros(int(LEAD_IN * sr), np.float32))
        chunks.append(samples)
        dur = len(samples) / sr
        weights = [syllables(tk["spoken"]) + 0.6 + (1.4 if tk["comma"] else 0) for tk in toks]
        total = sum(weights)
        acc = t
        for tk, w in zip(toks, weights):
            d = dur * w / total
            words.append({"text": tk["display"], "key": tk["key"],
                          "start": round(acc, 3),
                          "end": round(acc + d - (dur * 1.4 / total if tk["comma"] else 0), 3),
                          "sentence": si, "phrase": pi})
            acc += d
        t += dur
        gap = GAP_PHRASE if pi < len(phrases) - 1 else GAP_SENTENCE
        chunks.append(np.zeros(int(gap * sr), np.float32))
        t += gap
    sentences.append({"start": round(s_start, 3), "end": round(t - GAP_SENTENCE, 3),
                      "text": line})

voice = np.concatenate(chunks)
voice = voice / np.abs(voice).max() * 0.89
OUT.mkdir(parents=True, exist_ok=True)
sf.write(OUT / "voice.wav", voice, sr)
total = len(voice) / sr
(OUT / "words.json").write_text(json.dumps(
    {"duration": round(total, 3), "words": words, "sentences": sentences},
    ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{len(words)} palabras, {total:.2f} s, sr={sr}")
