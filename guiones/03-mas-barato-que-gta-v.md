# Video 3 — "GTA VI a $80 es MÁS BARATO que GTA V"

**Archivo:** `out/03-V3-Mas-Barato-Que-GTA-V.mp4` · **Duración:** 36 s (≈40–45 s con voz en off)
**Problema:** todo el mundo se queja del precio de $79.99… y luego paga $20 más por la edición cara sin leer qué incluye.
**Gatillo principal:** opinión impopular respaldada con números (genera debate en comentarios sin ser falsa).

## Hook
- **Verbal / texto:** "GTA VI a $80 es más barato que GTA V."
- **Hook visual (0–3 s):** etiqueta "OPINIÓN IMPOPULAR" + temblor + golpe. Con cámara: tú con cara seria sosteniendo la caja/pantalla de compra, zoom brusco a tu cara.
- **Variante B:** "Te están mintiendo con el precio de GTA VI. Y no es Rockstar."

## Guion segundo a segundo

> La tabla muestra los tiempos base. En el MP4 final con voz en off (ElevenLabs, `src/videos/voiceover.json`) algunas escenas se alargan 0,5–2 s para que la frase quepa completa. La columna "Voz en off" es el texto pensado para grabar con tu propia voz; la versión de ElevenLabs usa casi el mismo texto.

| Tiempo | Plano / ángulo | Visual y b-roll | Texto en pantalla | Voz en off (opcional) | SFX |
|---|---|---|---|---|---|
| 0.0–2.8 | Plano cerrado, temblor | Fondo sunset | OPINIÓN IMPOPULAR · GTA VI A **$80** ES **MÁS BARATO** QUE GTA V | "GTA VI a 80 dólares es más barato que GTA V." | Impacto |
| 2.8–5.6 | Captions | | Y TE LO DEMUESTRO CON **MATEMÁTICAS**, NO CON OPINIONES. | "Y te lo demuestro con matemáticas." | Pops |
| 5.6–8.6 | Contador | 0 → $59.99. *B-roll:* portada/gameplay de GTA V de 2013 | GTA V COSTABA EN 2013 · **$59.99** · y casi nadie se quejó | "En 2013, GTA V costaba 59.99." | Ticks + impacto |
| 8.6–12.0 | Contador verde | 0 → $85 | CON LA INFLACIÓN, HOY SON UNOS **$85** · aprox., inflación de EE.UU. | "Con la inflación, eso hoy son unos 85." | Ticks + impacto |
| 12.0–15.8 | Pantalla dividida | $85 vs $80 + sello | GTA V (2013) $85 · GTA VI (2026) $80 · **MÁS BARATO.** | "Más barato." | Whoosh + impacto |
| 15.8–19.2 | Captions | | PERO EL NÚMERO QUE IMPORTA NO ES ESE. ES EL **PRECIO POR HORA**. | "Pero el número que importa es el precio por hora." | Pops |
| 19.2–23.0 | Contador | → $1.60/h | 50 HORAS DE JUEGO = **$1.60/h** · Ir al cine: ~$5.50 la hora | "Si lo juegas 50 horas, son 1.60 la hora. Ir al cine te sale a unos 5.50." | Ticks + impacto |
| 23.0–26.0 | Captions, fondo rojo | *B-roll:* pantalla de selección de ediciones | DONDE SÍ TE PUEDEN **SACAR DINERO** ES EN LA EDICIÓN DE **$100** | "Donde sí te pueden sacar dinero es en la edición de 100." | Pops |
| 26.0–31.2 | Checklist | ⚠ ✖ ✔ | ANTES DE PAGAR **$20 MÁS** · Lee qué incluye, línea por línea · ¿Es para Online? Se espera en 2027 · Si dudas: estándar. Siempre. | "Antes de pagar 20 más: lee qué incluye. Si es para Online, eso no llega hasta 2027. Si dudas, estándar." | Pops + glitch |
| 31.2–35.6 | CTA | Caja de comentario + botón; destello → loop | ¿CARO O BARATO? COMENTA TU **PRECIO JUSTO** · "Yo pagaría $..." | "¿Caro o barato? Comenta cuánto pagarías tú." | Riser + impacto |

## CTA
"Comenta tu precio justo" → pide **un número**: es facilísimo de comentar y genera discusión entre comentaristas (más alcance).

## Caption para publicar
```
No me odien, hice la cuenta 🧮 ¿Cuánto pagarías TÚ por GTA VI? Solo el número 👇
#GTA6 #GTAVI #GTA6precio #PS5 #Xbox #gamerlatino #opinionimpopular
```
**Comentario fijado:** "Pon solo un número: ¿cuánto vale GTA VI para ti? Los más votados salen en el próximo video 👀"

## Notas de verificación
- Precios de lanzamiento comunicados: **$79.99** estándar / **$99.99** Ultimate (EE.UU.). En tu país puede variar: ajusta los textos en `src/videos/v3-precio.ts` si quieres moneda local.
- $59.99 de 2013 ajustado por IPC de EE.UU. ≈ $84–86 en 2026 (por eso "unos $85", marcado como aproximado).
- Cine: entrada media en EE.UU. ≈ $11 por ~2 h → ~$5.50/h.
- No afirmamos qué incluye la Ultimate: el consejo es **leerlo** antes de pagar.
