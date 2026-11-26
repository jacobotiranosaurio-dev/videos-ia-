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

## Estilo fijo (decidido por el usuario)
- Desde el 22 nov: **sin el cartel superior "OJO AL DATO · …"**. La marca va solo, discreta, dentro del botón final de "Suscríbete" (`FollowCTA`). Para recuperar el cartel en un vídeo concreto: `showBrand: true`.
- Desde el 23 nov: **todo el contenido 70 px más abajo** (escenario `top 370`, subtítulos `top 1260`) para que quede más centrado. Sigue lejos de la zona del nombre de la cuenta.
- Desde el 23 nov: **voz más ágil**. Tras generar la voz se ejecuta `python3 data/tighten.py <id>`, que acorta los silencios largos (máx. ~0,22 s tras punto y ~0,14 s entre palabras) sin regenerar la voz.

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
| Publicado | Short | Estado | Views 24 h | Notas |
|---|---|---|---|---|
| 19 nov 20:55 | Lugares prohibidos | ✅ [publicado](https://www.youtube.com/shorts/3oJCUS43G20) | pendiente (Metricool tarda 24-48 h) | primer vídeo del canal |
| 20 nov 09:50 | Envidia | ✅ [publicado](https://www.youtube.com/shorts/baptKWnpFBk) | pendiente | |
| 20 nov 15:50 | Planetas | ✅ [publicado](https://www.youtube.com/shorts/mW3kiJsVdBY) | pendiente | |
| 21 nov 15:50 | Miel (versión subida fuera de esta sesión) | ✅ [publicado](https://www.youtube.com/shorts/D-ZkMa7L5Ug) con aviso: no se pudo subir la miniatura | pendiente | |
| 21 nov 20:55 | Sin humanos | ✅ [publicado](https://www.youtube.com/shorts/qcJyfvip0nk) | pendiente | |
| 22 nov 15:50 | Miel (versión de esta sesión) | ✅ [publicado](https://www.youtube.com/shorts/ywFOAxlQhd4) | pendiente | duplica el tema del 21 nov |
| 22 nov 20:50 | Carteles electorales | ✅ [publicado](https://www.youtube.com/shorts/b5rty9D_6s0) | pendiente | tema de actualidad (elecciones) |
| 23 nov 15:50 | Copa del Rey | ✅ [publicado](https://www.youtube.com/shorts/0gPbO8Ex494) | pendiente | día del sorteo; primer vídeo con silencios recortados |
| 23 nov 20:55 | Voto obligatorio | ✅ [publicado](https://www.youtube.com/shorts/c4IMeGSAVDI) | pendiente | |
| 24 nov 15:50 | Voto en blanco vs nulo | ✅ [publicado](https://www.youtube.com/shorts/HPGsDeADwzA) | pendiente | |
| 24 nov 20:50 | Roma | ✅ [publicado](https://www.youtube.com/shorts/5C_DctHh3yA) | pendiente | |
| 25 nov 15:50 | GTA VI 6 estrellas | ✅ [publicado](https://www.youtube.com/shorts/4xFZkXoN3hw) | pendiente | categoría Gaming |
| 26 nov 15:50 | Congreso vs Senado | ✅ [publicado](https://www.youtube.com/shorts/01MMVsezGlg) | pendiente | |
| 27 nov 15:50 | Curva del olvido (creado fuera de esta sesión) | programado | — | |
| 28 nov 15:50 | Ley D'Hondt (creado fuera de esta sesión) | programado | — | |
| 29 nov 15:50 | Sueldo diputado (versión creada fuera de esta sesión) | programado | — | día de elecciones; la versión de esta sesión está en borrador por decisión del usuario |

### Revisiones diarias
- **20 nov:** 3/3 publicaciones correctas. **2 suscriptores** (los primeros del canal). Las visualizaciones por vídeo todavía no han llegado a Metricool. Mejor hora para el sábado 21: 16:00 (y 10:00 como segunda opción).
- **21 nov:** **5 suscriptores** (+3 hoy). Las visualizaciones por vídeo siguen sin llegar a Metricool. Se ha publicado una versión del Short de la miel a las 15:50 que no se programó desde esta sesión, y la versión de esta sesión está programada para el 22 nov a las 15:50: posible duplicado, pendiente de que el usuario decida. Mejor hora para el domingo 22: 16:00.
- **22 nov:** **14 suscriptores** (+9 hoy). Primer dato de visualizaciones del canal en Metricool: **1.214 visualizaciones** el 19 nov (día del primer Short). Las dos versiones de la miel se han publicado (21 y 22 nov). Mejor hora para el lunes 23: 16:00 (ahí ya va Roma a las 15:50).
- **23 nov:** **15 suscriptores**. Visualizaciones del canal según Metricool: **1.214 (19 nov)** y **1.853 (20 nov)**; los días siguientes aún no han llegado. Carteles (22 nov) y Copa (23 nov) publicados sin errores. Mejor hora el martes 24: 16:00 (ahí va el voto en blanco a las 15:50).
- **24 nov:** **16 suscriptores**. Visualizaciones diarias: 1.214 (19) → 1.853 (20) → **2.788 (21 nov)**, con +9 suscriptores ese día: el canal crece cada día. Voto obligatorio y voto en blanco publicados sin errores. Mejor hora el miércoles 25: 16:00 (pico más alto de la semana).
- **25 nov:** **18 suscriptores**. Visualizaciones diarias: 1.214 (19) · 1.853 (20) · 2.788 (21) · **2.585 (22 nov)** → **8.440 en los 4 primeros días**. Roma y GTA VI publicados sin errores. Mejor hora jueves 26: 16:00 (ahí va Congreso vs Senado a las 15:50).
- **26 nov:** **23 suscriptores** (+5 hoy, el mejor día hasta ahora). Visualizaciones: 1.214 (19) · 1.853 (20) · 2.788 (21) · 2.585 (22) · **1.875 (23 nov)** → **10.315 en 5 días**. Congreso vs Senado publicado sin errores. Mejor hora viernes 27: 16:00 (ahí va la curva del olvido a las 15:50).
