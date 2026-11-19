# Video 2 — "Este es el último video de GTA VI que deberías ver"

**Archivo:** `out/02-V2-Cero-Spoilers.mp4` · **Duración:** 38 s (≈40–45 s con voz en off)
**Problema:** desde hoy TikTok, X y YouTube se llenan de finales, muertes y giros. El algoritmo no sabe que tú todavía no has terminado.
**Gatillo principal:** paradoja (un video que te dice que dejes de ver videos) + aversión a la pérdida.

## Hook
- **Verbal / texto:** "Este es el último video de GTA VI que deberías ver."
- **Hook visual (0–3 s):** glitch rojo + etiqueta "NO SIGAS BAJANDO". Versión con cámara: tú tapando la lente del móvil con la mano mientras hablas.
- **Variante B:** "En 48 horas TikTok te va a contar el final de GTA VI. Evítalo en 30 segundos."

## Guion segundo a segundo

> La tabla muestra los tiempos base. En el MP4 final con voz en off (Piper, `src/videos/voiceover.json`) algunas escenas se alargan 0,5–2 s para que la frase quepa completa. La columna "Voz en off" es el texto pensado para grabar con tu propia voz; la versión sintética usa una variante escrita fonéticamente.

| Tiempo | Plano / ángulo | Visual y b-roll | Texto en pantalla | Voz en off (opcional) | SFX |
|---|---|---|---|---|---|
| 0.0–3.0 | Plano cerrado, temblor + glitch | Fondo rojo | NO SIGAS BAJANDO · ESTE ES EL **ÚLTIMO** VIDEO DE GTA VI QUE DEBERÍAS VER | "Este es el último video de GTA VI que deberías ver." | Glitch |
| 3.0–7.0 | Captions centrales | Captions de 2–3 palabras. *B-roll:* scroll rápido de un feed lleno de miniaturas de GTA | GTA VI SALIÓ **HOY**. EN 48 HORAS EL ALGORITMO TE VA A ENSEÑAR **EL FINAL**. | "Salió hoy. En 48 horas el algoritmo te va a enseñar el final." | Pops |
| 7.0–9.0 | Punch-in con icono | Ojo tachado | A MENOS QUE HAGAS **ESTO** | "A menos que hagas esto." | Impacto + flash |
| 9.0–15.5 | Mockup de móvil entrando inclinado | Ruta tocada paso a paso (círculo de "tap"), luego chips de palabras | **TIKTOK** · Perfil y menú → Ajustes y privacidad → Preferencias de contenido → Filtrar palabras clave · chips: GTA final · GTA ending · Jason · Lucia · Leonida | "TikTok: Ajustes y privacidad, Preferencias de contenido, Filtrar palabras clave. Mete estas." | Pops + ticks |
| 15.5–21.0 | Mockup de móvil | Igual para X | **X / TWITTER** · Configuración → Privacidad y seguridad → Silenciar y bloquear → Palabras silenciadas · chips: GTA 6 · GTAVI · spoiler | "En X: Privacidad y seguridad, Silenciar y bloquear, Palabras silenciadas." | Pops + ticks |
| 21.0–25.5 | Tarjeta tip 03 | Icono X | YOUTUBE **NO FILTRA** PALABRAS · tres puntos → No recomendar el canal | "YouTube no filtra palabras: en cada video sospechoso, tres puntos, no recomendar el canal." | Whoosh + pop |
| 25.5–30.0 | Tarjeta tip 04 | Icono campana. *B-roll:* chat de grupo con mensajes "NO VAN A CREER EL FINAL" | EL PELIGRO REAL: **WHATSAPP** · Silencia el grupo **1 semana** | "Y el peligro real: ese amigo que se lo pasa en un día. Silencia el grupo una semana." | Whoosh + pop |
| 30.0–33.8 | Checklist | ✔ ✔ ✔ ✖ | TU **ESCUDO** · TikTok filtrado ✔ · X silenciado ✔ · Grupos en silencio ✔ · Leer comentarios de otros videos de GTA ✖ | "Y ni se te ocurra leer los comentarios de otros videos de GTA." | Pops + glitch |
| 33.8–38.4 | CTA | Caja de comentario + botón; destello final → loop | ESTA CUENTA ES **ZONA CERO SPOILERS** · "ESCUDO activado" · SÍGUEME | "Esta cuenta es zona cero spoilers. Comenta ESCUDO si ya lo activaste." | Riser + impacto |

## CTA
"Comenta ESCUDO si ya lo activaste" (comentario de una palabra = mucha gente lo hace) + "esta cuenta es zona cero spoilers" (razón concreta para seguirte esta semana).

## Retención y replay
- El mockup del móvil con la ruta exacta hace que la gente **pause y guarde** el video (guardar es una señal fuerte para el algoritmo).
- Polémica suave: "no leas los comentarios de otros videos de GTA" → la gente comenta para discutirlo.

## Caption para publicar
```
Hazlo ANTES de seguir bajando 🛡️ Rutas exactas en el video (guárdalo).
Comenta ESCUDO cuando lo actives.
#GTA6 #GTAVI #sinspoilers #GTA6Lanzamiento #tiktoktips #gamerlatino
```
**Comentario fijado:** "Regla de esta cuenta: CERO spoilers en comentarios. Si ves uno, repórtalo y lo borro 🛡️"

## Notas de verificación
- Las rutas de menú son las actuales en español; si TikTok/X cambian el nombre de un menú, actualiza los textos en `src/videos/v2-spoilers.ts`.
- WhatsApp permite silenciar un chat 8 horas, 1 semana o siempre.
