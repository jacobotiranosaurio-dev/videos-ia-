import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Backdrop, Big, C, Camera, FONT, SceneIn, Tag, clamp, lin, makeWordClock, useSec } from "../lib/core";
import { Brain, EyeMascot } from "../lib/chars";
import { Captions, Word } from "../lib/Captions";
import { Stamp } from "../lib/politics";
import { AlarmClock, DigitalClock, LabPerson, Sleeper, Sun } from "../lib/life";
import wordsJson from "./words.json";

// SIN VOZ por ahora: words.json son tiempos ESTIMADOS (tools/estimate_timing.py).
// Cuando llegue la voz, se sustituye words.json por los tiempos reales y todo se resincroniza (las escenas se anclan a palabras).
export const HAS_VOICE = false;
const words = wordsJson as Word[];
const W = makeWordClock(words);
const B = (tok: string, n = 1, pre = 0.2) => W(tok, n) - pre;
const END = W("sígueme", 1, true) + 0.9; // el vídeo termina justo después de "sígueme"
export const V06_DURATION = Math.round(END * 30) / 30;

const KEYWORDS = [
  "6:59", "7:00", "casualidad", "cerebro", "hora", "reloj", "20.000", "neuronas", "ópticos", "ritmo", "1999", "alemanes",
  "experimento", "6:00", "5:00", "hormona", "ACTH", "cortisol", "marcha", "9:00", "sorpresa", "nada", "avisado", "despertador",
  "siempre", "adelanta", "alarma", "consejo", "misma", "todos", "fin", "semana", "luz", "comentarios", "sígueme",
];

const SCENES = (() => {
  const b = {
    hook: 0,
    reloj: B("dentro"),
    exp: B("1999"),
    acth: B("qué", 1, 0.45),
    grupoB: B("otro", 1, 0.3),
    concl: B("sea", 1, 0.45),
    tip: B("consejo", 1, 0.45),
    cta: B("ti", 1, 0.45),
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
/** tiempo de palabra relativo a la escena */
const useR = (k: K) => (tok: string, n = 1) => W(tok, n) - SCENES[k][0];
const pop = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  return t < at ? 0 : 1 - Math.exp(-x * 9) * Math.cos(x * 18);
};
const Badge: React.FC<{ t: number; at: number; children: React.ReactNode; bg?: string; y?: number; size?: number }> = ({ t, at, children, bg = C.yellow, y = 650, size = 58 }) => (
  <div style={{ position: "absolute", left: 540, top: y, transform: `translate(-50%,-50%) scale(${pop(t, at)}) rotate(-3deg)` }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: C.ink, background: bg, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>{children}</div>
  </div>
);

// ================= 1. HOOK =================
const Hook: React.FC = () => {
  const r = useR("hook");
  const t = useSec();
  const awake = t >= r("6:59");
  const time = awake ? "6:59" : "6:58";
  return (
    <AbsoluteFill>
      <Backdrop from="#2C2A8C" to="#07071F" seed={3} dots="rgba(255,255,255,0.45)" rays={false} />
      <Camera dur={10} zoom={[1.08, 1.16]} punchAt={[0, r("6:59"), r("casualidad"), r("no")]}>
        <div style={{ position: "absolute", left: 540, top: 690, transform: `translate(-50%,-50%) scale(${awake ? 1 + 0.12 * Math.exp(-(t - r("6:59")) * 4) : 1})` }}>
          <DigitalClock time={time} size={140} blink={!awake} />
        </div>
        <div style={{ position: "absolute", left: 540, top: 1180, transform: "translate(-50%,-50%)" }}>
          <Sleeper size={780} awake={awake ? lin(t, r("6:59"), r("6:59") + 0.3) : 0} />
        </div>
        {!awake &&
          ["Z", "z", "Z"].map((z, i) => {
            const p = ((t * 0.7 + i / 3) % 1);
            return (
              <div key={i} style={{ position: "absolute", left: 640 + p * 120, top: 1000 - p * 220, opacity: 1 - p, transform: `scale(${0.6 + p})` }}>
                <Big size={80} color="#fff" stroke={9}>{z}</Big>
              </div>
            );
          })}
        {t > r("alarma") && (
          <div style={{ position: "absolute", left: 860, top: 900, transform: `translate(-50%,-50%) scale(${pop(t, r("alarma")) * 0.7}) rotate(8deg)` }}>
            <AlarmClock size={240} hour={7} minute={0} />
            <div style={{ textAlign: "center", marginTop: -10 }}><Big size={70} color={C.yellow} stroke={10}>7:00</Big></div>
          </div>
        )}
        {t > r("casualidad") && t < r("no") && (
          <div style={{ position: "absolute", left: 260, top: 900, transform: `translate(-50%,-50%) scale(${pop(t, r("casualidad"))}) rotate(${Math.sin(t * 6) * 8}deg)` }}>
            <Big size={220} color={C.yellow} stroke={16}>?</Big>
          </div>
        )}
        {t > r("no") && (
          <div style={{ position: "absolute", left: 540, top: 1460, transform: "translate(-50%,-50%)" }}>
            <Stamp text="NO ES CASUALIDAD" color={C.coral} k={lin(t, r("no"), r("no") + 0.25)} rotate={-6} size={74} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 2. RELOJ INTERNO =================
const Reloj: React.FC = () => {
  const r = useR("reloj");
  const t = useSec();
  const n = Math.round(interpolate(t, [r("20.000"), r("20.000") + 0.7], [0, 20000], clamp));
  return (
    <AbsoluteFill>
      <Backdrop from="#7B2FF7" to="#1B0A3A" seed={5} />
      <Camera dur={10} zoom={[1, 1.1]} punchAt={[r("reloj"), r("20.000"), r("ritmo")]}>
        <div style={{ position: "absolute", left: 540, top: 1040, transform: `translate(-50%,-50%) scale(${pop(t, 0.05)})` }}>
          <div style={{ position: "relative" }}>
            <Brain size={600} mood={t > r("ritmo") ? "happy" : "wink"} />
            {t > r("reloj") && (
              <div style={{ position: "absolute", left: 300 - 85, top: 70, transform: `scale(${pop(t, r("reloj")) * 0.75})` }}>
                <AlarmClock size={230} hour={4} minute={(t * 60) % 60} color={C.sky} />
              </div>
            )}
          </div>
        </div>
        {t > r("20.000") && (
          <div style={{ position: "absolute", left: 540, top: 690, transform: `translate(-50%,-50%) scale(${pop(t, r("20.000"))}) rotate(-3deg)`, textAlign: "center" }}>
            <Big size={130} color={C.yellow} stroke={14}>{n.toLocaleString("de-DE")}</Big>
            <Big size={54} color="#fff" stroke={8}>NEURONAS</Big>
          </div>
        )}
        {t > r("nervios") && t < r("ritmo") && <Tag at={r("nervios")} x={540} y={1470} bg="#fff" size={40} rotate={2}>NÚCLEO SUPRAQUIASMÁTICO</Tag>}
        {t > r("ritmo") && <Tag at={r("ritmo")} x={540} y={1470} bg={C.mint} size={56} rotate={-2}>⏱ MARCA TU RITMO</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 3. EXPERIMENTO 1999 =================
const Exp: React.FC = () => {
  const r = useR("exp");
  const t = useSec();
  return (
    <AbsoluteFill>
      <Backdrop from="#16C3B0" to="#053B4A" seed={7} />
      <Camera dur={9} zoom={[1, 1.1]} punchAt={[r("1999"), r("experimento"), r("6:00")]}>
        <div style={{ position: "absolute", left: 250, top: 720, transform: `translate(-50%,-50%) scale(${pop(t, r("1999")) * 0.8}) rotate(-6deg)` }}>
          <div style={{ width: 300, background: "#fff", border: `8px solid ${C.ink}`, borderRadius: 26, overflow: "hidden", textAlign: "center", fontFamily: FONT, boxShadow: `0 12px 0 ${C.ink}` }}>
            <div style={{ background: C.coral, color: "#fff", fontWeight: 900, fontSize: 40, padding: "8px 0" }}>AÑO</div>
            <div style={{ fontWeight: 900, fontSize: 96, color: C.ink }}>1999</div>
          </div>
        </div>
        {t > r("alemanes") && <Tag at={r("alemanes")} x={760} y={720} bg="#fff" size={48} rotate={4}>🔬 ALEMANIA</Tag>}
        <div style={{ position: "absolute", left: 300, top: 1200, transform: `translate(-50%,-50%) scale(${pop(t, r("científicos"))})` }}>
          <LabPerson size={300} />
        </div>
        {t > r("dijeron") && (
          <div style={{ position: "absolute", left: 720, top: 1000, transform: `translate(-50%,-50%) scale(${pop(t, r("dijeron"))}) rotate(2deg)` }}>
            <div style={{ width: 520, background: "#fff", border: `8px solid ${C.ink}`, borderRadius: 34, padding: "22px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink, textAlign: "center", boxShadow: `0 12px 0 ${C.ink}` }}>
              "Os despertaremos a las <span style={{ color: C.coral }}>{t > r("6:00") ? "6:00" : "…"}</span>"
            </div>
          </div>
        )}
        {t > r("grupo", 2) && <Tag at={r("grupo", 2)} x={720} y={1300} bg={C.yellow} size={52} rotate={-3}>GRUPO A</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= gráfica hormonal =================
const Chart: React.FC<{ t: number; riseAt: number; drawFrom: number; drawTo: number; rise: boolean; color: string; label: string; marker?: boolean; markerAt?: number }> = ({ t, riseAt, drawFrom, drawTo, rise, color, label, marker, markerAt = 0 }) => {
  const X0 = 140, X1 = 940, Y0 = 1360, Y1 = 900;
  const hx = (h: number) => X0 + ((h - 3) / 4) * (X1 - X0);
  const pts: [number, number][] = [];
  for (let h = 3; h <= 6.001; h += 0.05) {
    const v = rise && h > 5 ? Math.pow((h - 5) / 1, 1.6) : 0;
    pts.push([hx(h), Y0 - 40 - v * (Y0 - Y1 - 60) + Math.sin(h * 9) * 6]);
  }
  const prog = interpolate(t, [drawFrom, drawTo], [0, 1], clamp);
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 820, width: 900, height: 640, background: "#fff", borderRadius: 40, border: `9px solid ${C.ink}`, boxShadow: `0 16px 0 ${C.ink}` }} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[3, 4, 5, 6, 7].map((h) => (
          <g key={h}>
            <path d={`M${hx(h)} ${Y1 - 20} L${hx(h)} ${Y0}`} stroke="#E4E0F5" strokeWidth={4} strokeDasharray="10 10" />
            <text x={hx(h)} y={Y0 + 55} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={h === 6 ? C.coral : C.ink}>{h}:00</text>
          </g>
        ))}
        <path d={d} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} />
        {marker && t > markerAt && (
          <g>
            <circle cx={hx(5)} cy={Y0 - 40} r={20 * pop(t, markerAt)} fill={C.coral} stroke={C.ink} strokeWidth={6} />
            <circle cx={hx(5)} cy={Y0 - 40} r={20 + ((t - markerAt) * 60) % 50} fill="none" stroke={C.coral} strokeWidth={5} opacity={1 - (((t - markerAt) * 60) % 50) / 50} />
          </g>
        )}
        <path d={`M${X0} ${Y1 - 30} L${X0} ${Y0} L${X1 + 10} ${Y0}`} stroke={C.ink} strokeWidth={8} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: 170, top: 850, fontFamily: FONT, fontWeight: 900, fontSize: 38, color }}>{label}</div>
      {rise && t > riseAt && <div style={{ position: "absolute", left: hx(6) - 20, top: Y1 - 60, transform: `translate(-50%,-50%) scale(${pop(t, riseAt)})` }}><Big size={70} color={color} stroke={9}>↑</Big></div>}
    </>
  );
};

// ================= 4. SUBE LA ACTH =================
const Acth: React.FC = () => {
  const r = useR("acth");
  const t = useSec();
  return (
    <AbsoluteFill>
      <Backdrop from="#FF8A3D" to="#6A1E0C" seed={9} />
      <Camera dur={11} zoom={[1, 1.06]} punchAt={[r("antes"), r("acth"), r("cortisol")]}>
        <Chart t={t} riseAt={r("subir")} drawFrom={r("antes") - 0.6} drawTo={r("acth")} rise color={C.coral} label="GRUPO A · ACTH EN SANGRE" marker markerAt={r("5:00")} />
        {t > r("antes") && <Badge t={t} at={r("antes")} bg={C.yellow}>⏰ 1 HORA ANTES</Badge>}
        {t > r("acth") && t < r("cortisol") && <Tag at={r("acth")} x={540} y={1560} bg={C.coral} color="#fff" size={60} rotate={-3}>HORMONA ACTH</Tag>}
        {t > r("cortisol") && <Tag at={r("cortisol")} x={540} y={1560} bg={C.mint} size={56} rotate={2}>→ CORTISOL = ¡EN MARCHA! ⚡</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 5. GRUPO B =================
const GrupoB: React.FC = () => {
  const r = useR("grupoB");
  const t = useSec();
  const surprise = t > r("sorpresa");
  return (
    <AbsoluteFill>
      <Backdrop from="#4C5A80" to="#141B33" seed={11} />
      <Camera dur={10} zoom={[1, 1.06]} punchAt={[r("9:00"), r("sorpresa"), r("nada")]}>
        <Chart t={t} riseAt={999} drawFrom={r("otro")} drawTo={r("nada")} rise={false} color="#7B8CA8" label="GRUPO B · ACTH EN SANGRE" />
        <Badge t={t} at={r("otro")} bg="#fff" size={40}>
          GRUPO B: "dormiréis hasta las <span style={{ color: C.violet }}>{t > r("9:00") ? "9:00" : "…"}</span>"
        </Badge>
        {surprise && (
          <div style={{ position: "absolute", left: 830, top: 1000, transform: `translate(-50%,-50%) scale(${pop(t, r("sorpresa")) * 0.6})` }}>
            <AlarmClock size={240} ringing hour={6} minute={0} />
          </div>
        )}
        {t > r("nada") && (
          <div style={{ position: "absolute", left: 540, top: 1560, transform: "translate(-50%,-50%)" }}>
            <Stamp text="SIN AVISO = SIN SUBIDA" color={C.coral} k={lin(t, r("nada"), r("nada") + 0.25)} rotate={-5} size={60} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 6. CONCLUSIÓN =================
const Concl: React.FC = () => {
  const r = useR("concl");
  const t = useSec();
  const race = t > r("siempre");
  return (
    <AbsoluteFill>
      <Backdrop from="#2F6BFF" to="#0B1A4A" seed={13} />
      <Camera dur={9} zoom={[1, 1.1]} punchAt={[r("despertador"), r("adelanta")]}>
        {!race && (
          <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${pop(t, 0.05)})` }}>
            <div style={{ position: "relative" }}>
              <Brain size={560} mood="wink" />
              {t > r("programa") && (
                <div style={{ position: "absolute", left: 160, top: -120, transform: `scale(${pop(t, r("programa")) * 0.9})` }}>
                  <AlarmClock size={240} ringing={t > r("despertador")} hour={6} minute={59} color={C.yellow} />
                </div>
              )}
            </div>
          </div>
        )}
        {!race && t > r("despertador") && <Tag at={r("despertador")} x={540} y={1470} bg={C.yellow} size={56} rotate={-3}>TU PROPIO DESPERTADOR</Tag>}
        {race && (
          <>
            <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) scale(${pop(t, r("siempre"))})`, textAlign: "center" }}>
              <Big size={60} color="#fff" stroke={8}>TU CUERPO</Big>
              <DigitalClock time="6:59" size={130} color={C.mint} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 1250, transform: `translate(-50%,-50%) scale(${pop(t, r("misma")) * 0.85})`, textAlign: "center", opacity: t > r("adelanta") ? 0.45 : 1 }}>
              <Big size={60} color="#fff" stroke={8}>LA ALARMA</Big>
              <DigitalClock time="7:00" size={130} />
            </div>
            {t > r("adelanta") && <Tag at={r("adelanta")} x={540} y={1050} bg={C.mint} size={58} rotate={-4}>🏁 GANA TU CUERPO</Tag>}
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 7. CONSEJO =================
const Tip: React.FC = () => {
  const r = useR("tip");
  const t = useSec();
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const sun = t > r("luz");
  return (
    <AbsoluteFill>
      <Backdrop from={sun ? "#FFB347" : "#1FA36B"} to={sun ? "#B24A12" : "#063A26"} seed={15} />
      <Camera dur={10} zoom={[1, 1.08]} punchAt={[r("consejo"), r("fin"), r("luz")]}>
        <Badge t={t} at={r("consejo")}>💡 CONSEJO</Badge>
        {!sun && (
          <div style={{ position: "absolute", left: 60, top: 860, width: 960, display: "flex", justifyContent: "space-between" }}>
            {days.map((d, i) => {
              const on = t > r("todos") + i * 0.12;
              const wk = i >= 5 && t > r("fin");
              return (
                <div key={d} style={{ width: 124, background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 22, overflow: "hidden", textAlign: "center", fontFamily: FONT, transform: `scale(${pop(t, r("levántate") + i * 0.08) * (wk ? 1.12 : 1)})`, boxShadow: wk ? `0 0 0 8px ${C.yellow}` : "none" }}>
                  <div style={{ background: i >= 5 ? C.coral : C.violet, color: "#fff", fontWeight: 900, fontSize: 44, padding: "6px 0" }}>{d}</div>
                  <div style={{ fontWeight: 900, fontSize: 34, color: on ? C.ink : "#ccc", padding: "14px 0" }}>{on ? "7:00" : "--"}</div>
                </div>
              );
            })}
          </div>
        )}
        {!sun && t > r("fin") && <Tag at={r("fin")} x={540} y={1180} bg={C.yellow} size={52} rotate={3}>¡TAMBIÉN EL FINDE!</Tag>}
        {sun && (
          <>
            <div style={{ position: "absolute", left: 540, top: 1000 - lin(t, r("luz"), r("luz") + 0.8) * 120, transform: `translate(-50%,-50%) scale(${pop(t, r("luz")) * 1.3})` }}>
              <Sun size={340} />
            </div>
            {t > r("reloj", 2) && <Tag at={r("reloj", 2)} x={540} y={1400} bg="#fff" size={52} rotate={-2}>☀️ LUZ = PONE EN HORA EL RELOJ</Tag>}
          </>
        )}
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
      <Backdrop from="#2C2A8C" to="#07071F" seed={17} />
      <Camera dur={6} zoom={[1, 1.08]} punchAt={[r("comentarios"), r("sígueme")]}>
        {!follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 980, transform: `translate(-50%,-50%) scale(${pop(t, 0.05)})` }}>
              <DigitalClock time="?:??" size={150} color={C.yellow} blink />
            </div>
            {t > r("comentarios") && (
              <div style={{ position: "absolute", left: 540, top: 1320, transform: `translate(-50%,-50%) scale(${pop(t, r("comentarios"))}) rotate(${Math.sin(t * 6) * 3}deg)` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 30, padding: "12px 30px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>💬 ¿A QUÉ HORA TE DESPIERTAS?</div>
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
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

const SFX = (): [number, string, number][] => [
  [0, "tick", 0.5], [W("6:59"), "alarm", 0.35], [W("alarma"), "pop", 0.4], [W("casualidad"), "rise", 0.3], [W("no"), "boom", 0.55],
  [SCENES.reloj[0], "whoosh", 0.4], [W("reloj"), "tick", 0.5], [W("20.000"), "ding", 0.4], [W("ritmo"), "pop", 0.4],
  [SCENES.exp[0], "whoosh", 0.4], [W("1999"), "pop", 0.45], [W("dijeron"), "pop", 0.4], [W("6:00"), "ding", 0.4],
  [SCENES.acth[0], "whoosh", 0.4], [W("antes"), "pop", 0.45], [W("acth"), "ding", 0.4], [W("cortisol"), "rise", 0.35],
  [SCENES.grupoB[0], "whoosh", 0.4], [W("sorpresa"), "alarm", 0.35], [W("nada"), "boom", 0.5],
  [SCENES.concl[0], "whoosh", 0.4], [W("despertador"), "alarm", 0.3], [W("adelanta"), "ding", 0.45],
  [SCENES.tip[0], "whoosh", 0.4], [W("consejo"), "pop", 0.4], [W("fin"), "pop", 0.4], [W("luz"), "chime", 0.5],
  [SCENES.cta[0], "whoosh", 0.4], [W("comentarios"), "pop", 0.4], [W("sígueme"), "whoosh", 0.4], [W("sígueme") + 0.3, "ding", 0.5],
];

export const Video06: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene k="hook"><Hook /></Scene>
      <Scene k="reloj"><SceneIn type="zoom"><Reloj /></SceneIn></Scene>
      <Scene k="exp"><SceneIn type="up"><Exp /></SceneIn></Scene>
      <Scene k="acth"><SceneIn type="left"><Acth /></SceneIn></Scene>
      <Scene k="grupoB"><SceneIn type="left"><GrupoB /></SceneIn></Scene>
      <Scene k="concl"><SceneIn type="spin"><Concl /></SceneIn></Scene>
      <Scene k="tip"><SceneIn type="up"><Tip /></SceneIn></Scene>
      <Scene k="cta"><SceneIn type="zoom"><CTA /></SceneIn></Scene>

      <Captions words={words} keywords={KEYWORDS} top={300} />

      {HAS_VOICE && <Audio src={staticFile("v06/voz.mp3")} />}
      <Audio src={staticFile("v06/musica.mp3")} volume={(f) => interpolate(f / fps, [0, 0.8, END - 1.2, END - 0.6, END], [0, HAS_VOICE ? 0.12 : 0.3, HAS_VOICE ? 0.12 : 0.3, 0.22, 0], clamp)} />
      {SFX().map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * fps))} durationInFrames={Math.round(1.3 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`v06/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
