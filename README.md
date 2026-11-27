# videos-ia — OJO AL DATO (YouTube Shorts)

5 Shorts generados con **Remotion** + voz **ElevenLabs** (Liam) + música original sintetizada.

- `out/*.mp4` → vídeos finales 1080×1920 listos para subir
- `GUIONES.md` → guiones, hooks, planos, texto en pantalla, títulos, descripciones y hashtags
- `src/` → proyecto Remotion (`src/engine` = motor de escenas/subtítulos, `src/videos` = un archivo por vídeo)
- `data/` → guiones (`scripts.py`), generador de voz (`tts.py`), generador de música (`music.py`)
- Skills de agente instaladas: Remotion (`remotion-dev/skills`) e HyperFrames (`heygen-com/hyperframes`) en `.claude/skills`

## Comandos
```bash
npm install
npx remotion studio                 # previsualizar y editar
./render_all.sh                     # renderizar los 5 vídeos en out/
./render_all.sh roma                # renderizar solo uno
python3 data/tts.py roma            # regenerar la voz de un vídeo (gasta créditos de ElevenLabs)
python3 data/music.py roma          # regenerar la música
```
