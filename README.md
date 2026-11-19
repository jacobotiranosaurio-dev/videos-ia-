# GTA VI Shorts — 5 videos virales hechos con Remotion

5 videos verticales (1080×1920, 30 fps, 41–45 s) para **TikTok, Instagram Reels y YouTube Shorts**, sobre GTA VI en su semana de lanzamiento (19 nov 2026). Llevan **voz en off en español con ElevenLabs** (voz "Liam", plan gratuito), más beat y efectos sintéticos libres de copyright.

## 📦 Videos listos para subir (`out/`)

| # | Archivo | Hook | Guion |
|---|---|---|---|
| 1 | `out/01-V1-Consola-Sin-Espacio.mp4` | "Tu consola NO tiene sitio para GTA VI" | [guiones/01](guiones/01-consola-sin-espacio.md) |
| 2 | `out/02-V2-Cero-Spoilers.mp4` | "Este es el último video de GTA VI que deberías ver" | [guiones/02](guiones/02-cero-spoilers.md) |
| 3 | `out/03-V3-Mas-Barato-Que-GTA-V.mp4` | "GTA VI a $80 es MÁS BARATO que GTA V" | [guiones/03](guiones/03-mas-barato-que-gta-v.md) |
| 4 | `out/04-V4-Sin-Online-Es-Mejor.mp4` | "GTA VI sin Online es lo mejor que te pudo pasar" | [guiones/04](guiones/04-sin-online-es-mejor.md) |
| 5 | `out/05-V5-GTA-VI-PC-Es-Virus.mp4` | "Si ves 'GTA VI para PC' hoy, es un VIRUS" | [guiones/05](guiones/05-gta-vi-pc-es-virus.md) |

Estrategia de nicho, audiencia, psicología y calendario de publicación: **[guiones/00-nicho-audiencia-estrategia.md](guiones/00-nicho-audiencia-estrategia.md)**.
Cada guion incluye: hook verbal + visual, variante B del hook, tabla segundo a segundo (plano, b-roll, texto, voz en off, SFX), CTA, caption con hashtags y comentario fijado.

## 🛠️ Uso

```bash
npm install
npm run studio                    # Remotion Studio: previsualiza y edita
npm run render:all                # renderiza los 5 a out/ (con beat)
npm run render:all -- --sin-musica  # sin beat, para usar un audio en tendencia de la app
npm run render:all -- --sin-voz     # solo texto, sin narración
```

### Voz en off
Las frases están en `src/videos/voiceover.json` (una por escena). Para cambiarlas o probar otra voz:

```bash
# ElevenLabs (por defecto). Los 5 videos usan ~3.100 caracteres; el plan gratis da 10.000/mes
ELEVENLABS_API_KEY=tu_clave python3 scripts/make-voice.py --voice-id TX3LPaxmHKxFdv7VOQHJ --speed 1.1
python3 scripts/make-voice.py --only V1-Consola-Sin-Espacio --speed 1.2   # regenerar un solo video

# Alternativa 100% gratis y offline: Piper (usa voiceover-piper.json, escrito fonéticamente)
pip install piper-tts   # + modelo es_MX-claude-high de huggingface.co/rhasspy/piper-voices
python3 scripts/make-voice.py --engine piper --model ruta/es_MX-claude-high.onnx --speed 0.82

npm run render:all
```

Los audios quedan en `public/vo/` y sus duraciones en `src/videos/vo-durations.json`: cada escena se alarga sola para que su frase quepa y el beat baja mientras habla la voz.
¿Tu propia voz? Graba cada frase como `public/vo/<video>/<n>.wav` (n = escena, desde 0), pon sus duraciones en `vo-durations.json` y vuelve a renderizar.

### Usar tu propio gameplay de fondo
1. Copia tu clip a `public/broll/mi-clip.mp4` (grábalo tú con la consola).
2. Renderiza: `npx remotion render V1-Consola-Sin-Espacio out/v1-gameplay.mp4 --props='{"music":true,"gameplay":"broll/mi-clip.mp4"}'`

El fondo se oscurece automáticamente para que el texto siga legible.

### Editar textos
Cada video es un archivo de datos en `src/videos/` (escenas con duración en segundos). Las palabras entre `*asteriscos*` salen resaltadas en amarillo.
Tipos de escena: `punch` (hook/impacto), `words` (captions cinéticos), `stat` (contador), `meter` (barra de almacenamiento), `tip`, `versus`, `path` (mockup de móvil con ruta de menús), `list` y `cta`.

## 🧩 Estructura

```
src/engine/        motor: fondo animado, escenas, iconos, fuentes, SFX
src/videos/        los 5 guiones como datos
public/sfx/        efectos y beat generados con scripts/make-sfx.sh (ffmpeg)
public/vo/         voz en off por escena (scripts/make-voice.py)
public/fonts/      Anton + Montserrat (render sin internet)
guiones/           estrategia + guiones segundo a segundo
out/               MP4 finales
.agents/skills/    skills de Remotion y HyperFrames para agentes (Claude Code las lee vía .claude/skills)
```

## Skills instaladas
- **Remotion** (`remotion-dev/skills`): best practices, create, render, captions, studio, markup…
- **HyperFrames** (`heygen-com/hyperframes`): hyperframes, hyperframes-cli, registry, remotion-to-hyperframes, etc. También está el paquete `hyperframes` en devDependencies (`npx hyperframes`).

> Nota de licencia: Remotion es gratis para personas y empresas pequeñas; revisa https://remotion.dev/license si tu empresa tiene más de 3 empleados.
