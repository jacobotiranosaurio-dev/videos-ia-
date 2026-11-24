# Ojo al Dato — fábrica de Shorts

Vídeos verticales animados (2D) para YouTube Shorts, hechos con **Remotion**. Voz de ElevenLabs, música original sintetizada y subtítulos sincronizados palabra a palabra.

## Estructura
- `src/lib/` — piezas reutilizables: subtítulos (`Captions.tsx`), cámara, fondos, números animados (`core.tsx`) y personajes SVG (`chars.tsx`).
- `src/vXX/` — cada vídeo: escenas + `words.json` (timestamps).
- `videos/XX-tema/` — guion (`voz.txt`), ficha de producción (`GUION.md`) y alineación de ElevenLabs.
- `public/vXX/` — voz, música y efectos.
- `out/` — MP4 finales.
- `tools/` — `tts.py` (voz + timestamps), `words.py` (palabras + números en cifras), `music.py` (música y SFX originales).

## Flujo para un vídeo nuevo
```bash
python3 tools/tts.py videos/02-x/voz.txt public/v02/voz.mp3 videos/02-x/alignment.json
python3 tools/words.py videos/02-x/alignment.json videos/02-x/numeros.json x videos/02-x/words_original.json
# recortar silencios (0 créditos): gancho a 0.08 s, resto a 0.2 s
python3 tools/tighten.py public/v02/voz_original.mp3 public/v02/voz.mp3 src/v02/timemap.json --hook 12 --keep 0.2 --keep-hook 0.08
python3 tools/remap_words.py videos/02-x/words_original.json src/v02/timemap.json src/v02/words.json
python3 tools/music.py 65 public/v02 100 <semilla> && ffmpeg -i public/v02/musica.wav public/v02/musica.mp3
npx remotion studio            # previsualizar
npx remotion render src/index.ts V02-... out/02-x.mp4
ffmpeg -i out/02-x.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5 -c:a aac -b:a 192k out/02-x-final.mp4
```
Skills instaladas en `.claude/skills` (Remotion + HyperFrames).
