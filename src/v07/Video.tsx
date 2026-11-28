import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Backdrop, Big, C, Camera, FONT, SceneIn, Tag, clamp, lin, makeWordClock, useSec } from "../lib/core";
import { EyeMascot } from "../lib/chars";
import { Captions, Word } from "../lib/Captions";
import { Stamp } from "../lib/politics";
import { Ball, Dog, EyeCones } from "../lib/life";
import wordsJson from "./words.json";

// Voz: Dan (ElevenLabs, generada por el usuario). words.json = tiempos reales por palabra (transcripción ElevenLabs Scribe).
export const HAS_VOICE = true;
const words = wordsJson as Word[];
const W = makeWordClock(words);
const B = (tok: string, n = 1, pre = 0.2) => W(tok, n) - pre;
const END = W("nada", 1, true) + 0.6; // el audio del usuario termina en "…que no te cuesta nada"
export const V07_DURATION = Math.round(END * 30) / 30;

const KEYWORDS = [
  "perro", "pelota", "roja", "torpe", "invisible", "final", "2", "colores", "primera", "blanco", "negro", "mentira", "tuyos", "3",
  "conos", "color", "azul", "amarillo", "rojo", "verde", "mismo", "daltónica", "marrón", "amarillenta", "hocico", "ojos", "bueno",
  "noche", "gana", "bastones", "espejo", "brillan", "cámbiale", "diferencia", "dato", "comentarios", "sígueme", "nada",
];

const SCENES = (() => {
  const b = {
    hook: 0,
    conos: B("colores", 2, 0.4),
    espectro: B("resultado", 1, 0.3),
    pelota: B("así", 1),
    noche: B("ahora", 1, 0.35),
    tip: B("colores", 3, 0.55),
    cta: B("sabías", 1, 0.3),
  };
  const keys = Object.keys(b) as (keyof typeof b)[];
  return Object.fromEntries(keys.map((k, i) => [k, [b[k], i + 1 < keys.length ? b[keys[i + 1]] : END]])) as Record<keyof typeof b, [number, number]>;
})();
type K = keyof typeof SCENES;
const OVER = 0.25;
const Scene: React.FC<{ k: K; children: React.ReactNode }> = ({ k, children }) => {
  const { fps } = useVideoConfig();
  const [a, b] = SCENES[k];
  return (
    <Sequence name={k} from={Math.round(a * fps)} durationInFrames={Math.max(1, Math.round((b - a + OVER) * fps))}>
      {children}
    </Sequence>
  );
};
const useR = (k: K) => (tok: string, n = 1) => W(tok, n) - SCENES[k][0];
const pop = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  return t < at ? 0 : 1 - Math.exp(-x * 9) * Math.cos(x * 18);
};

// ---------- Parque (paleta humana o "de perro") ----------
const PAL = {
  human: { sky1: "#7EC8F5", sky2: "#CDEBFF", grass: "#4CBF56", grass2: "#3A9E45", tree: "#2E8B3E", trunk: "#8B5A2B", ball: "#E8303A", flower: "#FF5DA2" },
  dog: { sky1: "#7E9BE0", sky2: "#C9D3EE", grass: "#C8B865", grass2: "#AFA057", tree: "#9C9255", trunk: "#7A6A45", ball: "#6E5E3E", flower: "#B9AC7A" },
  night: { sky1: "#0B1033", sky2: "#232B5C", grass: "#1F3B2A", grass2: "#18301F", tree: "#132A1C", trunk: "#2A1E14", ball: "#4A1A1E", flower: "#3A2A3A" },
};
const Park: React.FC<{ pal?: keyof typeof PAL; h?: number }> = ({ pal = "human", h = 1920 }) => {
  const p = PAL[pal];
  const t = useSec();
  const g = h * 0.58;
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${p.sky1} 0%, ${p.sky2} 58%, ${p.grass} 58.1%, ${p.grass2} 100%)`, overflow: "hidden" }}>
      <svg width={1080} height={h} style={{ position: "absolute" }}>
        {pal === "night" ? (
          <>
            <circle cx={820} cy={h * 0.2} r={70} fill="#FFF3B0" />
            {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 137) % 1080} cy={(i * 97) % (h * 0.5)} r={2 + (i % 3)} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />)}
          </>
        ) : (
          <circle cx={860} cy={h * 0.16} r={80} fill={pal === "dog" ? "#E8E0A0" : "#FFE066"} />
        )}
        {[[120, 1], [330, 0.8], [940, 1.1]].map(([x, s], i) => (
          <g key={i} transform={`translate(${x + Math.sin(t * 0.5 + i) * 4} ${g}) scale(${s})`}>
            <rect x={-18} y={-170} width={36} height={170} fill={p.trunk} />
            <circle cx={0} cy={-210} r={110} fill={p.tree} />
            <circle cx={-60} cy={-170} r={70} fill={p.tree} />
            <circle cx={60} cy={-170} r={70} fill={p.tree} />
          </g>
        ))}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 97) % 1080, y = g + 30 + ((i * 53) % (h - g - 40));
          return <path key={i} d={`M${x} ${y} l6 -22 l6 22`} stroke={p.grass2} strokeWidth={5} fill="none" />;
        })}
        {Array.from({ length: 8 }, (_, i) => <circle key={`f${i}`} cx={(i * 173 + 60) % 1080} cy={g + 60 + ((i * 131) % (h - g - 80))} r={9} fill={p.flower} />)}
      </svg>
    </div>
  );
};

// ================= 1. HOOK =================
const Hook: React.FC = () => {
  const r = useR("hook");
  const t = useSec();
  const gray = t >= r("blanco") - 0.1 && t < r("mentira");
  const back = t >= r("mentira");
  const invis = t >= r("invisible") && t < r("final");
  const teaser = t >= r("final") && t < r("toda");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, filter: gray ? "grayscale(1) contrast(1.1)" : "none" }}>
        <Camera dur={16} zoom={[1.08, 1.18]} punchAt={[0, r("torpe"), r("invisible"), r("final"), r("blanco"), r("mentira")]}>
          <Park />
          <div style={{ position: "absolute", left: 430, top: 1260, transform: "translate(-50%,-50%)" }}>
            <Dog size={600} sniff />
          </div>
          <div style={{ position: "absolute", left: 870, top: 1430, transform: `translate(-50%,-50%) scale(${1 + Math.sin(t * 4) * 0.04})`, opacity: invis ? 0.15 + 0.15 * Math.sin(t * 10) : 1 }}>
            <Ball size={110} />
          </div>
          {t < r("invisible") && (
            <div style={{ position: "absolute", left: 600, top: 930, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 6) * 10}deg)` }}>
              <Big size={170} color={C.yellow} stroke={15}>?</Big>
            </div>
          )}
          {t > r("torpe") && t < r("invisible") && <Tag at={r("torpe")} x={540} y={700} bg="#fff" size={56} rotate={-3}>NO ES TORPE 🐾</Tag>}
          {invis && <Tag at={r("invisible")} x={540} y={700} bg="#fff" size={56} rotate={3}>👻 CASI INVISIBLE</Tag>}
          {teaser && (
            <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) scale(${pop(t, r("final"))})`, textAlign: "center" }}>
              <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>
                {[0, 1].map((i) => (
                  <div key={i} style={{ width: 160, height: 160, borderRadius: 80, background: "#3A3A55", border: `8px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin(t * 5 + i) * 10}deg)` }}>
                    <Big size={110} color={C.yellow} stroke={10}>?</Big>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: "inline-block", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.ink, background: C.yellow, border: `7px solid ${C.ink}`, borderRadius: 999, padding: "6px 30px", whiteSpace: "nowrap" }}>🔒 LOS 2 COLORES… AL FINAL</div>
            </div>
          )}
          {gray && <Tag at={r("blanco")} x={540} y={700} bg="#fff" size={56} rotate={3}>¿EN BLANCO Y NEGRO?</Tag>}
        </Camera>
      </div>
      {back && (
        <div style={{ position: "absolute", left: 540, top: 760, transform: "translate(-50%,-50%)" }}>
          <Stamp text="MENTIRA" color={C.coral} k={lin(t, r("mentira"), r("mentira") + 0.25)} rotate={-8} size={110} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ================= 3. CONOS: 3 vs 2 =================
const Conos: React.FC = () => {
  const r = useR("conos");
  const t = useSec();
  return (
    <AbsoluteFill>
      <Backdrop from="#7B2FF7" to="#1B0A3A" seed={6} />
      <Camera dur={9} zoom={[1, 1.08]} punchAt={[r("tuyos"), r("3"), r("2", 2)]}>
        {t > r("colores") && (
          <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${pop(t, r("colores"))}) rotate(-3deg)` }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: C.ink, background: C.mint, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>🎨 {t > r("tuyos") ? "…PERO NO LOS TUYOS" : "SÍ VE COLORES"}</div>
          </div>
        )}
        {t < r("tienes") && (
          <div style={{ position: "absolute", left: 90, top: 820, width: 900 }}>
            {[
              { l: "TUS COLORES", c: ["#E8303A", "#FF8A3D", "#FFD23F", "#3FBF4C", "#22C3E6", "#3A6BFF", "#7B2FF7"], at: r("colores", 2) },
              { l: "LOS SUYOS", c: ["#8C7E45", "#C8B24A", "#D9C866", "#BDBDB0", "#8FA6D6", "#3A6BFF", "#3A3A9E"], at: r("tuyos") },
            ].map((row, j) => (
              <div key={row.l} style={{ marginBottom: 70, transform: `scale(${pop(t, row.at)})` }}>
                <Big size={52} color="#fff" stroke={8} style={{ textAlign: "left" }}>{row.l}</Big>
                <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                  {row.c.map((c, i) => (
                    <div key={i} style={{ width: 112, height: 112, borderRadius: 26, background: c, border: `7px solid ${C.ink}`, transform: `translateY(${Math.sin(t * 5 + i + j) * 8}px) scale(${pop(t, row.at + i * 0.05)})` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {t >= r("tienes") && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 780, display: "flex", justifyContent: "center", gap: 30 }}>
          <div style={{ transform: `scale(${pop(t, r("tienes"))})`, textAlign: "center" }}>
            <EyeCones size={470} cones={["#E8303A", "#3FBF4C", "#3A6BFF"]} label="TÚ" />
            {t > r("3") && <Big size={150} color={C.yellow} stroke={14}>3</Big>}
          </div>
          <div style={{ transform: `scale(${pop(t, r("2", 2) - 0.5)})`, textAlign: "center" }}>
            <EyeCones size={470} cones={["#3A6BFF", "#FFD23F"]} label="TU PERRO" />
            {t > r("2", 2) && <Big size={150} color={C.coral} stroke={14}>2</Big>}
          </div>
        </div>
        )}
        {t > r("conos") && t < r("2", 2) && <Tag at={r("conos")} x={540} y={1560} bg="#fff" size={44} rotate={2}>CONOS = CÉLULAS DEL COLOR</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 4. ESPECTRO =================
const Espectro: React.FC = () => {
  const r = useR("espectro");
  const t = useSec();
  const human = "linear-gradient(90deg,#7B2FF7,#3A6BFF,#22C3E6,#3FBF4C,#FFD23F,#FF8A3D,#E8303A)";
  const dog = "linear-gradient(90deg,#3A3A9E,#3A6BFF,#8FA6D6,#BDBDB0,#D9C866,#C8B24A,#8C7E45)";
  const mix = t > r("mismo");
  return (
    <AbsoluteFill>
      <Backdrop from="#16C3B0" to="#053B4A" seed={8} />
      <Camera dur={8} zoom={[1, 1.08]} punchAt={[r("azul"), r("amarillo"), r("mismo"), r("daltónica")]}>
        {[
          { l: "TÚ VES", g: human, at: 0.1 },
          { l: "TU PERRO VE", g: dog, at: r("resultado") },
        ].map((b, i) => (
          <div key={b.l} style={{ position: "absolute", left: 90, top: 760 + i * 300, width: 900, transform: `scale(${pop(t, b.at)})` }}>
            <Big size={50} color="#fff" stroke={8} style={{ textAlign: "left" }}>{b.l}</Big>
            <div style={{ height: 130, borderRadius: 30, background: b.g, border: `9px solid ${C.ink}`, boxShadow: `0 12px 0 ${C.ink}`, marginTop: 10 }} />
          </div>
        ))}
        {t > r("azul") && <div style={{ position: "absolute", left: 230, top: 1290, transform: `translate(-50%,-50%) scale(${pop(t, r("azul"))})` }}><Big size={64} color="#5B8CFF" stroke={9}>✓ AZUL</Big></div>}
        {t > r("amarillo") && <div style={{ position: "absolute", left: 790, top: 1290, transform: `translate(-50%,-50%) scale(${pop(t, r("amarillo"))})` }}><Big size={64} color={C.yellow} stroke={9}>✓ AMARILLO</Big></div>}
        {t > r("rojo") && (
          <div style={{ position: "absolute", left: 690, top: 1490, transform: `translate(-50%,-50%) scale(${pop(t, r("rojo"))})`, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 90, height: 90, borderRadius: 20, background: mix ? "#9C8E55" : "#E8303A", border: `7px solid ${C.ink}` }} />
            <Big size={70} color="#fff" stroke={9}>{mix ? "=" : "+"}</Big>
            <div style={{ width: 90, height: 90, borderRadius: 20, background: mix ? "#9C8E55" : "#3FBF4C", border: `7px solid ${C.ink}`, opacity: t > r("verde") ? 1 : 0 }} />
            {mix && <Big size={70} color={C.coral} stroke={9}>?!</Big>}
          </div>
        )}
        {t > r("daltónica") && <Tag at={r("daltónica")} x={300} y={1490} bg="#fff" size={44} rotate={-4}>COMO UN DALTÓNICO</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 5. LA PELOTA: TÚ vs ÉL =================
const Pelota: React.FC = () => {
  const r = useR("pelota");
  const t = useSec();
  const split = lin(t, r("mancha") - 0.3, r("mancha") + 0.2);
  const half = 960;
  const sniff = t > r("hocico") - 0.2;
  const Panel: React.FC<{ pal: "human" | "dog"; label: string; top: number }> = ({ pal, label, top }) => (
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: half, overflow: "hidden", borderBottom: `10px solid ${C.ink}` }}>
      <div style={{ position: "absolute", left: 0, top: -560, width: 1080, height: 1920 }}>
        <Park pal={pal} />
        <div style={{ position: "absolute", left: 620, top: 1300, transform: "translate(-50%,-50%)" }}>
          <Ball size={130} color={PAL[pal].ball} />
        </div>
        {pal === "dog" && sniff && (
          <div style={{ position: "absolute", left: 330, top: 1280, transform: "translate(-50%,-50%)" }}>
            <Dog size={420} sniff body="#BBA36E" patch="#7E6A45" />
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 40, top: pal === "human" ? 560 - 0 : 40 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: C.ink, background: pal === "human" ? "#fff" : C.yellow, border: `7px solid ${C.ink}`, borderRadius: 18, padding: "4px 22px" }}>{label}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Camera dur={9} zoom={[1, 1.05]} punchAt={[r("mancha"), r("hocico")]}>
        {split < 1 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - split }}>
            <Park />
            <div style={{ position: "absolute", left: 620, top: 1300, transform: `translate(-50%,-50%) scale(${pop(t, r("pelota", 3))})` }}>
              <Ball size={150} />
            </div>
            {t > r("césped") && <Tag at={r("césped")} x={540} y={1500} bg="#fff" size={50} rotate={-2}>ROJA SOBRE VERDE</Tag>}
          </div>
        )}
        {split > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: split }}>
            <Panel pal="human" label="TÚ VES" top={0} />
            <Panel pal="dog" label="ÉL VE" top={half} />
          </div>
        )}
        {t > r("hocico") && <Tag at={r("hocico")} x={540} y={1700} bg={C.mint} size={40} rotate={3}>👃 CON EL HOCICO, NO CON LOS OJOS</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 6. DE NOCHE TE GANA =================
const Noche: React.FC = () => {
  const r = useR("noche");
  const t = useSec();
  const flash = t > r("fotos") && t < r("fotos") + 0.12;
  return (
    <AbsoluteFill>
      <Camera dur={8} zoom={[1, 1.1]} punchAt={[r("gana"), r("brillan")]}>
        <Park pal="night" />
        <div style={{ position: "absolute", left: 540, top: 1260, transform: `translate(-50%,-50%) scale(${pop(t, 0.05)})` }}>
          <Dog size={620} glow={t > r("espejo") - 0.2} tail />
        </div>
        {t > r("bueno") && t < r("gana") && <Tag at={r("bueno")} x={540} y={700} bg={C.mint} size={62} rotate={3}>😎 LO BUENO…</Tag>}
        {t > r("gana") && t < r("bastones") && <Tag at={r("gana")} x={540} y={700} bg={C.yellow} size={62} rotate={-3}>🌙 DE NOCHE TE GANA</Tag>}
        {t > r("bastones") && t < r("espejo") && <Tag at={r("bastones")} x={540} y={700} bg="#fff" size={52} rotate={2}>+ BASTONES EN LA RETINA</Tag>}
        {t > r("espejo") && t < r("brillan") && <Tag at={r("espejo")} x={540} y={700} bg="#fff" size={44} rotate={-2}>🪞 CAPA QUE REFLEJA LA LUZ</Tag>}
        {t > r("brillan") && <Tag at={r("brillan")} x={540} y={700} bg="#B8FF5C" size={56} rotate={-2}>✨ POR ESO LE BRILLAN LOS OJOS</Tag>}
      </Camera>
      {flash && <AbsoluteFill style={{ background: "#fff", opacity: 0.9 }} />}
    </AbsoluteFill>
  );
};

// ================= 7. LOS 2 COLORES (revelación) =================
const Tip: React.FC = () => {
  const r = useR("tip");
  const t = useSec();
  return (
    <AbsoluteFill>
      <Backdrop from="#FFB347" to="#9A3412" seed={12} />
      <Camera dur={6} zoom={[1, 1.08]} punchAt={[r("colores", 3), r("azul", 2), r("amarillo", 2), r("cámbiale")]}>
        <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${pop(t, 0.05)}) rotate(-3deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 44px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>🔓 LOS 2 COLORES</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 900, display: "flex", justifyContent: "center", gap: 50, alignItems: "center" }}>
          {[
            { c: "#E8303A", ok: false, at: 0.15 },
            { c: "#3A6BFF", ok: true, at: r("azul", 2) },
            { c: "#FFD23F", ok: true, at: r("amarillo", 2) },
          ].map((b, i) => (
            <div key={i} style={{ textAlign: "center", transform: `scale(${pop(t, b.at) * (b.ok ? 1 + 0.08 * Math.sin(t * 6 + i) : 0.85)})`, opacity: b.ok ? 1 : 0.7 }}>
              <Ball size={230} color={b.c} />
              <div style={{ marginTop: 10 }}><Big size={110} color={b.ok ? C.mint : C.coral} stroke={12}>{b.ok ? "✓" : "✕"}</Big></div>
            </div>
          ))}
        </div>
        {t > r("cámbiale") && <Tag at={r("cámbiale")} x={540} y={1480} bg={C.mint} size={54} rotate={2}>¡CÁMBIALE LA PELOTA!</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 8. CTA =================
const CTA: React.FC = () => {
  const r = useR("cta");
  const t = useSec();
  const follow = t >= r("sígueme") - 0.15;
  const pressed = t > r("sígueme") + 0.3;
  return (
    <AbsoluteFill>
      <Backdrop from="#4CBF56" to="#14532D" seed={14} />
      <Camera dur={5} zoom={[1, 1.08]} punchAt={[r("dato"), r("comentarios"), r("sígueme")]}>
        {!follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 880, transform: `translate(-50%,-50%) scale(${pop(t, 0.05)}) rotate(-3deg)` }}>
              <Big size={74} color="#fff" stroke={10} style={{ whiteSpace: "nowrap" }}>¿SABÍAS ESTE DATO?</Big>
            </div>
            <div style={{ position: "absolute", left: 0, width: 1080, top: 1000, display: "flex", justifyContent: "center", gap: 30 }}>
              {["#E8303A", "#3A6BFF", "#FFD23F", "#3FBF4C"].map((c, i) => (
                <div key={c} style={{ transform: `scale(${pop(t, 0.2 + i * 0.12)}) translateY(${Math.sin(t * 5 + i) * 12}px)` }}><Ball size={150} color={c} /></div>
              ))}
            </div>
            {t > r("cuéntamelo") && (
              <div style={{ position: "absolute", left: 540, top: 1330, transform: `translate(-50%,-50%) scale(${pop(t, r("cuéntamelo"))}) rotate(${Math.sin(t * 6) * 3}deg)` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 30, padding: "12px 34px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>💬 CUÉNTAMELO</div>
              </div>
            )}
          </>
        )}
        {follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${pop(t, r("sígueme") - 0.15)})` }}>
              <EyeMascot size={360} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 1250, transform: `translate(-50%,-50%) scale(${pop(t, r("sígueme"))}) rotate(-3deg)` }}>
              <Big size={110} color={C.yellow} stroke={13}>OJO AL DATO</Big>
            </div>
            <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, r("sígueme") + 0.1)})` }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", background: pressed ? "#3A3A3A" : "#FF0033", border: `8px solid ${C.ink}`, borderRadius: 999, padding: "14px 56px", boxShadow: `0 10px 0 ${C.ink}` }}>
                {pressed ? "✓ SUSCRITO" : "SUSCRIBIRME"}
              </div>
            </div>
            {t > r("nada") && <Tag at={r("nada")} x={540} y={1580} bg={C.mint} size={46} rotate={-3}>¡ES GRATIS! 😉</Tag>}
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

const SFX = (): [number, string, number][] => [
  [0, "sniff", 0.45], [W("torpe"), "pop", 0.4], [W("invisible"), "whoosh", 0.35], [W("final"), "tick", 0.5], [W("blanco"), "whoosh", 0.4], [W("mentira"), "boom", 0.55], [W("mentira") + 0.05, "bark", 0.35],
  [SCENES.conos[0], "whoosh", 0.4], [W("tuyos"), "pop", 0.4], [W("3"), "ding", 0.4], [W("2", 2), "ding", 0.45],
  [SCENES.espectro[0], "whoosh", 0.4], [W("azul"), "pop", 0.4], [W("amarillo"), "pop", 0.4], [W("mismo"), "boom", 0.4], [W("daltónica"), "pop", 0.4],
  [SCENES.pelota[0], "whoosh", 0.4], [W("mancha"), "rise", 0.3], [W("hocico"), "sniff", 0.5],
  [SCENES.noche[0], "whoosh", 0.4], [W("bueno"), "rise", 0.3], [W("gana"), "pop", 0.4], [W("espejo"), "ding", 0.4], [W("fotos"), "tick", 0.5],
  [SCENES.tip[0], "whoosh", 0.4], [W("azul", 2), "ding", 0.45], [W("amarillo", 2), "ding", 0.45], [W("cámbiale"), "bark", 0.3],
  [SCENES.cta[0], "whoosh", 0.4], [W("cuéntamelo"), "pop", 0.4], [W("sígueme"), "whoosh", 0.4], [W("sígueme") + 0.3, "ding", 0.5],
];

export const Video07: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene k="hook"><Hook /></Scene>
      <Scene k="conos"><SceneIn type="up"><Conos /></SceneIn></Scene>
      <Scene k="espectro"><SceneIn type="left"><Espectro /></SceneIn></Scene>
      <Scene k="pelota"><SceneIn type="zoom"><Pelota /></SceneIn></Scene>
      <Scene k="noche"><SceneIn type="spin"><Noche /></SceneIn></Scene>
      <Scene k="tip"><SceneIn type="up"><Tip /></SceneIn></Scene>
      <Scene k="cta"><SceneIn type="zoom"><CTA /></SceneIn></Scene>

      <Captions words={words} keywords={KEYWORDS} top={300} />

      {HAS_VOICE && <Audio src={staticFile("v07/voz.mp3")} />}
      <Audio src={staticFile("v07/musica.mp3")} volume={(f) => interpolate(f / fps, [0, 0.8, END - 1.2, END - 0.6, END], [0, HAS_VOICE ? 0.12 : 0.3, HAS_VOICE ? 0.12 : 0.3, 0.22, 0], clamp)} />
      {SFX().map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * fps))} durationInFrames={Math.round(1.3 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`v07/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
