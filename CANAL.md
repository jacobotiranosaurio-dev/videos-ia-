# OJO AL DATO — plan de gestión del canal

## Cómo funciona
- **Los Shorts los decide y revisa el usuario.** Claude solo los produce cuando el usuario da las indicaciones.
- Hay una tarea programada diaria (20:13, hora de Madrid) que **no crea vídeos**. Lo que hace:
  1. Revisa las estadísticas en Metricool y actualiza el registro de rendimiento de abajo.
  2. Comprueba que lo programado se publicó y, si algo falló, lo reprograma con el mismo contenido.
  3. Propone 3 ideas de Shorts, con su hook, basadas en los datos, y la mejor hora para publicar al día siguiente.

## Producción (cuando el usuario lo pida)
- Proceso: guion, `data/tts.py` (voz de Liam), `data/music.py`, `src/videos/<id>.tsx`, `./render_all.sh <id>`, push y programación en Metricool.
- Cuota de ElevenLabs (gratuita): unos 3.150 caracteres hasta el 20 de diciembre de 2026, que dan para unos 4 Shorts de ~750 caracteres.
- Horas de publicación: 10 minutos antes del pico de cada día según Metricool.

## Requisitos
- El repositorio tiene que seguir **público** para que Metricool pueda descargar los MP4 (después los copia a su propio almacenamiento).
- Voz: Liam (ElevenLabs, multilingual v2). Música: generada con `data/music.py`.

## Ideas de temas (propuestas, pendientes de que el usuario las apruebe)
1. Lo que le pasa a tu cuerpo si no duermes durante 11 días (récord real, Randy Gardner)
2. 3 animales que deberían estar extintos pero siguen vivos (celacanto, etc.)
3. El lugar más profundo de la Tierra: qué hay en la fosa de las Marianas
4. 3 experimentos psicológicos que hoy serían ilegales
5. Qué pasaría si la Luna desapareciera esta noche
6. 3 señales de que alguien te miente (según la psicología)
7. El día que el cielo se volvió rojo: el evento Carrington de 1859
8. Las 3 muertes más absurdas de la historia
9. Cuánto tardarías en caer atravesando la Tierra por un túnel
10. 3 trucos psicológicos que usan los supermercados contra ti
11. Así era un día normal en el Antiguo Egipto
12. ¿Qué pasa si caes en un agujero negro?

## Registro de rendimiento
| Fecha | Short | Views 24 h | Notas |
|---|---|---|---|
| 19 nov 20:55 | Lugares prohibidos | — | primer vídeo del canal |
| 20 nov 09:50 | Envidia | — | |
| 20 nov 13:50 | Sin humanos | — | |
| 20 nov 15:50 | Planetas | — | |
| 20 nov 17:20 | Roma | — | |
