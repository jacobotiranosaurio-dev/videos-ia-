import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Backdrop, Big, C, Camera, CountUp, FONT, SceneIn, Tag, clamp, lin, usePop, useSec } from "../lib/core";
import { Bed, Book, Brain, Bulb, Cabinet, CalendarCard, EyeMascot, Flashcard, Folder, Scientist } from "../lib/chars";
import { Captions, Word } from "../lib/Captions";
import wordsJson from "./words.json";
import timemap from "./timemap.json";

// Mapa de tiempos (voz original -> voz con silencios recortados). Todos los tiempos del guion se escriben
// en segundos de la voz ORIGINAL y m() los traslada a la voz recortada.
const TM = timemap as [number, number][];
const m = (t: number) => {
  let i = TM.length - 2;
  for (let j = 0; j < TM.length - 1; j++) if (t < TM[j + 1][0]) { i = j; break; }
  const [x0, y0] = TM[i], [x1, y1] = TM[i + 1];
  return x1 === x0 ? y0 : y0 + ((t - x0) * (y1 - y0)) / (x1 - x0);
};

const words = wordsJson as Word[];
const ORIG_END = 66.6;
export const V01_DURATION = Math.round(m(ORIG_END) * 30) / 30;

const KEYWORDS = [
  "olvidado", "culpa", "1885", "Ebbinghaus", "brutal", "sílabas", "meses", "miedo", "20", "minutos", "42%", "hora", "mitad",
  "2", "3", "borradas", "curva", "olvido", "2015", "mismo", "doblar", "releas", "prueba", "2006", "50%", "semana",
  "repasa", "olvidar", "siguiente", "días", "duerme", "cerebro", "importante", "atrás", "comentarios", "sígueme", "datos", "1",
];

// Escenas [inicio, fin] en segundos absolutos
const S0 = {
  hook: [0, 5.0],
  ebb: [5.0, 18.9],
  curve: [18.9, 29.4],
  name: [29.4, 34.4],
  bend: [34.4, 36.3],
  t1: [36.3, 46.4],
  t2: [46.4, 52.1],
  t3: [52.1, 57.1],
  cta: [57.1, ORIG_END],
} as const;
const S = Object.fromEntries(Object.entries(S0).map(([k, [x, y]]) => [k, [m(x), m(y)]])) as Record<keyof typeof S0, [number, number]>;

const OVER = 0.25; // solape para transiciones

const Scene: React.FC<{ k: keyof typeof S; children: React.ReactNode }> = ({ k, children }) => {
  const { fps } = useVideoConfig();
  const [a, b] = S[k];
  return (
    <Sequence name={k} from={Math.round(a * fps)} durationInFrames={Math.round((b - a + OVER) * fps)}>
      {children}
    </Sequence>
  );
};

// ======================= ESCENA 1: HOOK =======================
const Hook: React.FC = () => {
  const t = useSec();
  const pct = Math.round(interpolate(t, [0.15, 2.4], [100, 33], clamp));
  const barColor = pct > 66 ? C.mint : pct > 45 ? C.yellow : C.coral;
  const shake = t < m(3.3) ? Math.sin(t * 50) * 5 * (t > 0.5 ? 1 : 0) : 0;
  const items = ["ABC", "π", "E=mc²", "7×8", "París", "√2", "H₂O", "1492", "do re mi", "x²"];
  const alarm = t < m(3.3) && Math.floor(t * 4) % 2 === 0;
  const after = t >= m(3.3);
  return (
    <AbsoluteFill>
      <Backdrop from="#6A2CF0" to="#1B0A3A" seed={3} />
      {alarm && <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(255,60,90,0.65)" }} />}
      <Camera dur={5} zoom={[1.05, 1.15]} punchAt={[0, m(3.3)]}>
        {/* barra de memoria */}
        <div style={{ position: "absolute", left: 150, top: 640, width: 780 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", marginBottom: 10, display: "flex", justifyContent: "space-between", WebkitTextStroke: `8px ${C.ink}`, paintOrder: "stroke fill" }}>
            <span>MEMORIA</span>
            <span style={{ color: barColor }}>{pct}%</span>
          </div>
          <div style={{ height: 70, background: "#2A1950", border: `8px solid ${C.ink}`, borderRadius: 40, overflow: "hidden", boxShadow: `0 10px 0 ${C.ink}` }}>
            <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 30, boxShadow: "inset 0 -12px 0 rgba(0,0,0,0.15)" }} />
          </div>
        </div>
        {/* objetos que escapan del cerebro */}
        {!after &&
          items.map((it, i) => {
            const p = ((t * 0.9 + i / items.length) % 1);
            const ang = -90 + (i % 2 ? 1 : -1) * (25 + (i * 17) % 50);
            const d = 120 + p * 520;
            const x = 540 + Math.cos((ang * Math.PI) / 180) * d;
            const y = 1060 + Math.sin((ang * Math.PI) / 180) * d * 0.7 + p * p * 200;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${p * 200 * (i % 2 ? 1 : -1)}deg) scale(${0.6 + p * 0.6})`, opacity: 1 - p }}>
                <Big size={64} color={[C.yellow, C.sky, C.mint, "#fff"][i % 4]} stroke={9}>{it}</Big>
              </div>
            );
          })}
        <div style={{ position: "absolute", left: 540 - 280, top: 920, transform: `translateX(${shake}px)` }}>
          <Brain size={560} mood={after ? "wink" : "worried"} sweat={!after} />
        </div>
        {after && <Tag at={m(3.3)} x={540} y={1480} bg={C.mint} size={60} rotate={3}>¡NO ES TU CULPA!</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= ESCENA 2: EBBINGHAUS =======================
const Stopwatch: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const t = useSec();
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 200 230">
      <rect x={85} y={0} width={30} height={30} rx={6} fill={C.coral} stroke={C.ink} strokeWidth={7} />
      <circle cx={100} cy={130} r={88} fill="#fff" stroke={C.ink} strokeWidth={9} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M100 52 L100 66" stroke={C.ink} strokeWidth={6} transform={`rotate(${i * 30} 100 130)`} />
      ))}
      <path d="M100 130 L100 65" stroke={C.coral} strokeWidth={9} strokeLinecap="round" transform={`rotate(${t * 360} 100 130)`} />
      <circle cx={100} cy={130} r={10} fill={C.ink} />
    </svg>
  );
};

const Ebbinghaus: React.FC = () => {
  const O = S.ebb[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  const calK = usePop(a(5.3), 11, 120);
  const calToCorner = lin(t, a(7.2), a(7.8));
  const sciK = usePop(a(7.3), 13, 110);
  const fear = t >= a(17.0);
  const flash = t > a(17.7) && t < a(17.9);
  const syll = ["BAF", "DUK", "ZOL", "MEP", "TIV", "GOS", "KIR", "NUP"];
  return (
    <AbsoluteFill>
      <Backdrop from={fear ? "#7A1030" : "#E9A15B"} to={fear ? "#16040C" : "#6B2F1A"} seed={5} dots="rgba(255,240,200,0.2)" />
      {/* estanterías */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: fear ? 0.15 : 0.35 }}>
        {[0, 1, 2].map((r) => (
          <g key={r} transform={`translate(${-60 + Math.sin(t * 0.3) * 20} ${1480 + r * 0})`}>
            {Array.from({ length: 14 }, (_, i) => (
              <rect key={i} x={i * 85} y={-200 - (i % 3) * 30} width={60} height={200 + (i % 3) * 30} rx={6} fill={["#7A3B20", "#9C4E2A", "#5E2C16"][i % 3]} />
            ))}
          </g>
        ))}
        <rect x={0} y={1480} width={1080} height={40} fill="#4A2010" />
      </svg>
      <Camera dur={14} zoom={[1, 1.12]} punchAt={[a(10.6), a(17.0)]}>
        {/* tarjeta 1885 */}
        <div
          style={{
            position: "absolute",
            left: interpolate(calToCorner, [0, 1], [540, 230]),
            top: interpolate(calToCorner, [0, 1], [950, 700]),
            transform: `translate(-50%,-50%) scale(${calK * interpolate(calToCorner, [0, 1], [1.3, 0.62])}) rotateY(${(1 - calK) * 180}deg) rotate(${-4 + Math.sin(t * 2) * 2}deg)`,
          }}
        >
          <CalendarCard label="AÑO" value="1885" />
        </div>
        {/* científico */}
        {t > a(7.2) && (
          <div style={{ position: "absolute", left: 540, top: 1180, transform: `translate(-50%,-50%) translateY(${(1 - sciK) * 700}px) scale(${fear ? 1 + lin(t, a(17), a(17.3)) * 0.15 : 1})` }}>
            <Scientist size={520} shock={fear} />
          </div>
        )}
        {t > a(8.1) && !fear && <Tag at={a(8.1)} x={540} y={1530} bg="#fff" size={50}>HERMANN EBBINGHAUS</Tag>}
        {t > a(10.6) && t < a(11.9) && <Tag at={a(10.6)} x={760} y={700} bg={C.coral} color="#fff" size={58} rotate={6}>¡BRUTAL!</Tag>}
        {/* sílabas sin sentido */}
        {t > a(11.9) &&
          !fear &&
          syll.map((s, i) => {
            const k = Math.min(1, Math.max(0, (t - a(11.9) - i * 0.18) * 3));
            const ang = (i / syll.length) * Math.PI * 2 + t * 0.6;
            const rx = 400, ry = 330;
            return (
              <div key={s} style={{ position: "absolute", left: 540 + Math.cos(ang) * rx, top: 1120 + Math.sin(ang) * ry, transform: `translate(-50%,-50%) scale(${k}) rotate(${Math.sin(t * 2 + i) * 8}deg)` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, background: "#FFF6E0", color: C.ink, padding: "10px 22px", borderRadius: 18, border: `6px solid ${C.ink}`, boxShadow: `0 8px 0 ${C.ink}` }}>{s}</div>
              </div>
            );
          })}
        {t > a(15.4) && !fear && (
          <div style={{ position: "absolute", left: 850, top: 700, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(15.4))})` }}>
            <Stopwatch size={190} />
          </div>
        )}
        {fear && (
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M0 -330 L0 -420" stroke="#fff" strokeWidth={12} strokeLinecap="round" transform={`translate(540 1150) rotate(${i * 30 + Math.sin(t * 30) * 3})`} opacity={0.8} />
            ))}
          </svg>
        )}
      </Camera>
      {flash && <AbsoluteFill style={{ background: "#fff", opacity: 0.85 }} />}
    </AbsoluteFill>
  );
};
// pop simple sin hooks (para usar dentro de condicionales)
const usePopSafe = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  return 1 - Math.exp(-x * 9) * Math.cos(x * 18);
};

// ======================= ESCENA 3: LA CURVA =======================
const CHART = { x: 130, y: 620, w: 820, h: 560 };
const curvePts: [number, number][] = [
  [0, 100], [0.06, 75], [0.15, 58], [0.3, 44], [0.45, 38], [0.6, 34], [0.75, 28], [0.88, 25], [1, 21],
];
const P = (x: number, y: number) => [CHART.x + 60 + x * (CHART.w - 100), CHART.y + 40 + (1 - y / 100) * (CHART.h - 120)];
const pathFrom = (pts: [number, number][]) => {
  const p = pts.map(([x, y]) => P(x, y));
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return d;
};

const Marker: React.FC<{ at: number; until?: number; x: number; y: number; label: string; big: string; dx?: number; dy?: number }> = ({ at, until = 999, x, y, label, big, dx = 0, dy = -150 }) => {
  const t = useSec();
  const k = usePop(at, 9, 170);
  if (t < at) return null;
  const [px, py] = P(x, y);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={px} cy={py} r={22 * k} fill={C.coral} stroke={C.ink} strokeWidth={7} />
        <circle cx={px} cy={py} r={22 + ((t - at) * 60) % 50} fill="none" stroke={C.coral} strokeWidth={5} opacity={1 - (((t - at) * 60) % 50) / 50} />
      </svg>
      <div style={{ position: "absolute", left: px + dx, top: py + dy, transform: `translate(-50%,-50%) scale(${k * (1 - 0.5 * lin(t, until, until + 0.3))}) rotate(-5deg)`, textAlign: "center", opacity: 1 - 0.35 * lin(t, until, until + 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: C.ink, borderRadius: 14, padding: "4px 14px", display: "inline-block" }}>{label}</div>
        <Big size={110} color={C.yellow} stroke={11}>{big}</Big>
      </div>
    </>
  );
};

const Curve: React.FC = () => {
  const O = S.curve[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  // progreso del trazo sincronizado con la voz
  const prog = interpolate(t, [0, a(19.4), a(21.2), a(22.7), a(24.0), a(25.2), a(27.4)], [0, 0.04, 0.15, 0.2, 0.3, 0.4, 1], clamp);
  const d = pathFrom(curvePts);
  const bulbs = t > a(26.4);
  const bulbsK = usePop(a(26.4), 12, 140);
  const erase = lin(t, a(28.6), a(29.2));
  const chartLift = bulbs ? lin(t, a(26.4), a(26.9)) : 0;
  return (
    <AbsoluteFill>
      <Backdrop from="#1E5BFF" to="#0A1640" seed={8} />
      <Camera dur={11} zoom={[1, 1.08]} punchAt={[a(21.2), a(24.0), a(27.4)]}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-chartLift * 40}px) scale(${1 - chartLift * 0.1})`, transformOrigin: "50% 35%" }}>
          <div style={{ position: "absolute", left: CHART.x, top: CHART.y, width: CHART.w, height: CHART.h, background: "#fff", borderRadius: 40, border: `9px solid ${C.ink}`, boxShadow: `0 16px 0 ${C.ink}` }} />
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {[25, 50, 75].map((g) => {
              const [, gy] = P(0, g);
              return <path key={g} d={`M${CHART.x + 60} ${gy} L${CHART.x + CHART.w - 40} ${gy}`} stroke="#E4E0F5" strokeWidth={4} strokeDasharray="12 12" />;
            })}
            <path d={`${d} L${P(1, 0)[0]} ${P(1, 0)[1]} L${P(0, 0)[0]} ${P(0, 0)[1]}Z`} fill="rgba(255,93,115,0.15)" style={{ clipPath: `inset(0 ${(1 - prog) * 100}% 0 0)` }} />
            <path d={d} fill="none" stroke={C.coral} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} />
            <path d={`M${P(0, 0)[0]} ${P(0, 105)[1]} L${P(0, 0)[0]} ${P(0, 0)[1]} L${P(1.02, 0)[0]} ${P(0, 0)[1]}`} stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: CHART.x + 75, top: CHART.y + 22, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.ink }}>RECUERDAS</div>
          <div style={{ position: "absolute", left: CHART.x + CHART.w - 230, top: CHART.y + CHART.h - 70, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.ink }}>TIEMPO →</div>
          <Marker at={a(21.2)} until={a(24.0)} x={0.15} y={58} label="20 MIN" big="-42%" dx={90} dy={-110} />
          <Marker at={a(24.0)} until={a(26.4)} x={0.3} y={44} label="1 HORA" big="-56%" dx={160} dy={-140} />
          <Marker at={a(26.4)} x={0.6} y={34} label="1 DÍA" big="-67%" dx={110} dy={-150} />
        </div>
        {bulbs && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1210, display: "flex", justifyContent: "center", gap: 50, transform: `scale(${bulbsK})` }}>
            {[0, 1, 2].map((i) => {
              const off = i < 2 && t > a(i === 0 ? 26.8 : 27.3);
              const gone = i < 2 ? erase : 0;
              return (
                <div key={i} style={{ opacity: 1 - gone, transform: `translateY(${gone * -80}px) rotate(${gone * (i ? 30 : -30)}deg)` }}>
                  <Bulb on={!off} size={170} />
                </div>
              );
            })}
          </div>
        )}
        {t > a(28.6) && (
          <div style={{ position: "absolute", left: interpolate(erase, [0, 1], [150, 900]), top: 1330, transform: `translate(-50%,-50%) rotate(-20deg)` }}>
            <div style={{ width: 200, height: 90, background: C.pink, border: `8px solid ${C.ink}`, borderRadius: 18, boxShadow: `inset -60px 0 0 ${C.sky}` }} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= ESCENA 4: NOMBRE + 2015 =======================
const NameScene: React.FC = () => {
  const O = S.name[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  const tk = usePop(a(29.9), 10, 140);
  const up = lin(t, a(31.2), a(31.7));
  const stampK = usePop(a(33.2), 7, 260);
  return (
    <AbsoluteFill>
      <Backdrop from="#FF6B6B" to="#5A0F2E" seed={12} />
      <Camera dur={5} zoom={[1.02, 1.12]} punchAt={[a(33.2)]}>
        <div style={{ position: "absolute", left: 540, top: interpolate(up, [0, 1], [1050, 860]), whiteSpace: "nowrap", transform: `translate(-50%,-50%) scale(${tk * interpolate(up, [0, 1], [1, 0.75])}) rotate(-3deg)` }}>
          <Big size={130} color="#fff" stroke={14}>LA CURVA</Big>
          <Big size={150} color={C.yellow} stroke={15}>DEL OLVIDO</Big>
          <svg width={700} height={120} viewBox="0 0 700 120" style={{ display: "block", margin: "0 auto" }}>
            <path d="M20 20 C120 110 250 100 680 105" stroke={C.ink} strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lin(t, a(30.1), a(30.9))} />
          </svg>
        </div>
        {t > a(31.3) && (
          <div style={{ position: "absolute", left: 540, top: 1290, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(31.3))}) rotate(4deg)` }}>
            <CalendarCard label="AÑO" value="2015" color={C.violet} size={360} />
          </div>
        )}
        {t > a(33.2) && (
          <div style={{ position: "absolute", left: 540, top: 1310, transform: `translate(-50%,-50%) scale(${interpolate(stampK, [0, 1], [2.5, 1])}) rotate(-12deg)`, opacity: Math.min(1, stampK * 2) }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.mint, border: `12px solid ${C.mint}`, borderRadius: 24, padding: "6px 28px", background: "rgba(27,16,51,0.85)", textAlign: "center", lineHeight: 1 }}>
              ✓ MISMO
              <br />
              RESULTADO
            </div>
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= ESCENA 5: DOBLAR LA CURVA =======================
const BendScene: React.FC = () => {
  const O = S.bend[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  const mo = lin(t, a(35.5), a(36.1));
  const ease = 1 - Math.pow(1 - mo, 3);
  const y = (base: number, target: number) => base + (target - base) * ease;
  const pts: [number, number][] = [
    [0, 100], [0.15, y(58, 92)], [0.3, y(44, 88)], [0.6, y(34, 90)], [1, y(21, 95)],
  ];
  const d = pathFrom(pts);
  return (
    <AbsoluteFill>
      <Backdrop from={mo > 0.5 ? "#2FE6A0" : "#3B3B8F"} to={mo > 0.5 ? "#06614A" : "#141433"} seed={15} />
      <Camera dur={2} zoom={[1.05, 1.15]} punchAt={[a(35.7)]}>
        <div style={{ position: "absolute", left: CHART.x, top: CHART.y + 80, width: CHART.w, height: CHART.h, background: "#fff", borderRadius: 40, border: `9px solid ${C.ink}`, boxShadow: `0 16px 0 ${C.ink}` }} />
        <svg width={1080} height={1920} style={{ position: "absolute", top: 80 }}>
          <path d={d} fill="none" stroke={mo > 0.5 ? C.mint : C.coral} strokeWidth={18} strokeLinecap="round" />
          <path d={`M${P(0, 0)[0]} ${P(0, 105)[1]} L${P(0, 0)[0]} ${P(0, 0)[1]} L${P(1.02, 0)[0]} ${P(0, 0)[1]}`} stroke={C.ink} strokeWidth={8} fill="none" />
        </svg>
        {mo > 0.6 && <Tag at={a(35.9)} x={540} y={1430} bg={C.yellow} size={70} rotate={-4}>¡SE PUEDE DOBLAR!</Tag>}
        {mo > 0.3 &&
          Array.from({ length: 10 }, (_, i) => {
            const p = (t - a(35.6)) * 1.5;
            const ang = (i / 10) * Math.PI * 2;
            return <div key={i} style={{ position: "absolute", left: 860 + Math.cos(ang) * p * 300, top: 760 + Math.sin(ang) * p * 300, width: 26, height: 26, background: [C.yellow, "#fff", C.sky][i % 3], borderRadius: 6, transform: `rotate(${p * 400}deg)`, opacity: Math.max(0, 1 - p) }} />;
          })}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= Badge de truco =======================
const TipBadge: React.FC<{ n: number; color: string }> = ({ n, color }) => {
  const k = usePop(0.05, 9, 180);
  const t = useSec();
  return (
    <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%,-50%) scale(${k}) rotate(${-4 + Math.sin(t * 2.5) * 2}deg)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.ink, background: color, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}` }}>TRUCO #{n}</div>
    </div>
  );
};

// ======================= ESCENA 6: TRUCO 1 =======================
const Tip1: React.FC = () => {
  const O = S.t1[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  const phase = t < a(39.4) ? 0 : 1;
  const xK = usePop(a(37.2), 8, 220);
  const flip = lin(t, a(38.1), a(38.6));
  const bar1 = lin(t, a(42.0), a(42.9));
  const bar2 = lin(t, a(42.6), a(43.6));
  return (
    <AbsoluteFill>
      <Backdrop from="#FF8A3D" to="#8A1F12" seed={21} />
      <Camera dur={10} zoom={[1, 1.1]} punchAt={[a(37.2), a(43.7)]}>
        {phase === 0 && <TipBadge n={1} color={C.yellow} />}
        {phase === 0 && (
          <>
            <div style={{ position: "absolute", left: 300, top: 1080, transform: `translate(-50%,-50%) rotate(${-8 + Math.sin(t * 3) * 3}deg) scale(${1 - flip * 0.3})`, opacity: 1 - flip * 0.4 }}>
              <Book size={380} />
              {t > a(37.2) && (
                <svg width={380} height={300} style={{ position: "absolute", left: 0, top: -20, transform: `scale(${xK})` }}>
                  <path d="M40 40 L340 260 M340 40 L40 260" stroke={C.coral} strokeWidth={36} strokeLinecap="round" />
                </svg>
              )}
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Big size={56} color="#fff" stroke={8}>RELEER</Big>
              </div>
            </div>
            {t > a(38.1) && (
              <div style={{ position: "absolute", left: 760, top: 1080, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(38.1))}) rotateY(${t > a(38.9) ? 0 : 0}deg) rotate(6deg)` }}>
                <Flashcard size={360} text={t > a(38.9) ? "✓" : "?"} />
                <div style={{ textAlign: "center", marginTop: 26 }}>
                  <Big size={56} color={C.mint} stroke={8}>EXAMINARTE</Big>
                </div>
              </div>
            )}
          </>
        )}
        {phase === 1 && (
          <>
            <div style={{ position: "absolute", left: 90, top: 600, transform: `scale(${usePopSafe(t, a(39.4)) * 0.55}) rotate(-6deg)`, transformOrigin: "0 0" }}>
              <CalendarCard label="ESTUDIO" value="2006" color={C.violet} size={380} />
            </div>
            {/* barras */}
            <div style={{ position: "absolute", left: 180, top: 900, width: 720, height: 600, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
              {[
                { v: 40, k: bar1, c: C.coral, l: "RELEER" },
                { v: 61, k: bar2, c: C.mint, l: "EXAMINARSE" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 280 }}>
                  <Big size={80} color="#fff" stroke={10} style={{ opacity: b.k > 0 ? 1 : 0 }}>{Math.round(b.v * b.k)}%</Big>
                  <div style={{ width: 200, height: 6 * b.v * b.k, background: b.c, border: `8px solid ${C.ink}`, borderRadius: "24px 24px 0 0", boxShadow: "inset -24px 0 0 rgba(0,0,0,0.15)" }} />
                  <div style={{ marginTop: 14 }}><Big size={42} color="#fff" stroke={7}>{b.l}</Big></div>
                </div>
              ))}
            </div>
            <CountUp at={a(43.7)} to={50} from={20} dur={0.4} prefix="+" suffix="%" x={720} y={700} size={190} color={C.yellow} rotate={8} />
            {t > a(45.3) && <Tag at={a(45.3)} x={540} y={1620 - 60} bg="#fff" size={44}>1 SEMANA DESPUÉS</Tag>}
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= ESCENA 7: TRUCO 2 =======================
const Tip2: React.FC = () => {
  const O = S.t2[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  const reviews = [a(49.5), a(50.8), a(51.4)];
  const X0 = 170, X1 = 930, Y0 = 820, Y1 = 1330;
  const xs = [0, 0.3, 0.58, 0.8, 1];
  // curva en dientes de sierra: cada repaso sube a 100% y decae más lento
  const seg = (i: number) => {
    const xa = X0 + xs[i] * (X1 - X0), xb = X0 + xs[i + 1] * (X1 - X0);
    const drop = [0.75, 0.5, 0.28, 0.12][i];
    const ya = Y0, yb = Y0 + drop * (Y1 - Y0);
    return `M${xa} ${ya} C${xa + 40} ${yb - 20} ${xb - 60} ${yb} ${xb} ${yb} L${xb} ${Y0}`;
  };
  const visibleTill = interpolate(t, [a(47.4), reviews[0], reviews[1], reviews[2], a(52.1)], [0.15, 0.3, 0.58, 0.8, 1], clamp);
  return (
    <AbsoluteFill>
      <Backdrop from="#16C3B0" to="#053B4A" seed={33} />
      <Camera dur={6} zoom={[1, 1.1]} punchAt={reviews}>
        <TipBadge n={2} color={C.mint} />
        <div style={{ position: "absolute", left: 120, top: 760, width: 840, height: 650, background: "#fff", borderRadius: 40, border: `9px solid ${C.ink}`, boxShadow: `0 16px 0 ${C.ink}` }} />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <defs>
            <clipPath id="reveal">
              <rect x={0} y={0} width={X0 + visibleTill * (X1 - X0)} height={1920} />
            </clipPath>
          </defs>
          <g clipPath="url(#reveal)">
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={seg(i)} stroke={i === 0 ? C.coral : C.mint} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </g>
          <path d={`M${X0} ${Y0 - 30} L${X0} ${Y1 + 10} L${X1 + 10} ${Y1 + 10}`} stroke={C.ink} strokeWidth={8} fill="none" />
        </svg>
        {["1 DÍA", "3 DÍAS", "7 DÍAS"].map((l, i) => (
          <Tag key={l} at={reviews[i]} x={X0 + xs[i + 1] * (X1 - X0)} y={Y1 + 120} bg={[C.yellow, C.sky, C.pink][i]} size={46} rotate={i % 2 ? 4 : -4}>
            {l}
          </Tag>
        ))}
        {t > a(47.4) && <Tag at={a(47.4)} x={540} y={1610 - 40} bg="#fff" size={44} rotate={2}>REPASA ANTES DE OLVIDAR</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= ESCENA 8: TRUCO 3 =======================
const Tip3: React.FC = () => {
  const O = S.t3[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  const bedK = usePop(a(53.0), 13, 110);
  const store = t > a(55.9);
  return (
    <AbsoluteFill>
      <Backdrop from="#2C2A8C" to="#07071F" seed={44} dots="rgba(255,255,255,0.5)" rays={false} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={850} cy={820} r={90} fill="#FFF3B0" />
        <circle cx={890} cy={790} r={90} fill="#2C2A8C" opacity={0.0} />
        <circle cx={810} cy={800} r={14} fill="#F2E08A" />
        <circle cx={870} cy={860} r={20} fill="#F2E08A" />
      </svg>
      <Camera dur={5} zoom={[1.02, 1.1]}>
        <TipBadge n={3} color={C.sky} />
        <div style={{ position: "absolute", left: 160, top: 960, transform: `translateY(${(1 - bedK) * 800}px)` }}>
          <Bed size={760}>
            <div style={{ transform: "rotate(-8deg)" }}>
              <Brain size={270} mood="sleep" />
            </div>
          </Bed>
        </div>
        {/* Zzz */}
        {["Z", "z", "Z"].map((z, i) => {
          const p = ((t * 0.6 + i / 3) % 1);
          return (
            <div key={i} style={{ position: "absolute", left: 360 + p * 140 + i * 20, top: 980 - p * 260, opacity: 1 - p, transform: `scale(${0.6 + p})` }}>
              <Big size={80} color="#fff" stroke={9}>{z}</Big>
            </div>
          );
        })}
        {store && (
          <>
            <div style={{ position: "absolute", left: 830, top: 1200, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(55.9)) * 0.7})` }}>
              <Cabinet size={300} open={Math.min(1, (t - a(55.9)) * 3)} />
            </div>
            {[0, 1, 2].map((i) => {
              const p = Math.min(1, Math.max(0, (t - a(56.0) - i * 0.25) * 1.6));
              const x = interpolate(p, [0, 1], [330, 830]);
              const y = interpolate(p, [0, 0.5, 1], [1050, 900, 1120]);
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${p * 360}deg) scale(${1 - p * 0.5})`, opacity: p >= 1 ? 0 : 1 }}>
                  <Folder size={110} color={[C.yellow, C.mint, C.pink][i]} />
                </div>
              );
            })}
            <Tag at={a(56.4)} x={540} y={1530} bg={C.yellow} size={60} rotate={-3}>GUARDA LO IMPORTANTE</Tag>
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= ESCENA 9: CTA =======================
const CTA: React.FC = () => {
  const O = S.cta[0];
  const a = (x: number) => m(x) - O;
  const t = useSec();
  const quiz = t > a(58.9) && t < a(62.4);
  const follow = t >= a(62.4);
  const pressed = t > a(63.5);
  const press = usePop(a(63.5), 8, 260);
  return (
    <AbsoluteFill>
      <Backdrop from="#6A2CF0" to="#1B0A3A" seed={3} />
      <Camera dur={9.5} zoom={[1, 1.1]} punchAt={[a(59.0), a(62.5)]}>
        {t < a(58.9) && (
          <div style={{ position: "absolute", left: 540, top: 1050, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(57.4))})` }}>
            <svg width={360} height={360} viewBox="0 0 200 200">
              <circle cx={100} cy={100} r={90} fill="#fff" stroke={C.ink} strokeWidth={9} />
              <path d="M95 60 L50 100 L95 140Z M150 60 L105 100 L150 140Z" fill={C.violet} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
              {t > a(58.0) && <path d="M35 35 L165 165" stroke={C.coral} strokeWidth={20} strokeLinecap="round" />}
            </svg>
          </div>
        )}
        {quiz && (
          <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(58.9))}) rotate(-2deg)` }}>
            <div style={{ width: 820, background: "#fff", border: `9px solid ${C.ink}`, borderRadius: 40, boxShadow: `0 16px 0 ${C.ink}`, padding: "34px 30px", fontFamily: FONT }}>
              <div style={{ fontWeight: 900, fontSize: 56, color: C.ink, textAlign: "center", lineHeight: 1.1 }}>
                ¿CUÁNTO OLVIDAS EN <span style={{ color: C.coral }}>20 MIN</span>?
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
                {["A) 12%", "B) 42%", "C) 80%"].map((o, i) => (
                  <div key={o} style={{ fontWeight: 900, fontSize: 52, color: "#fff", background: [C.sky, C.violet, C.orange][i], border: `7px solid ${C.ink}`, borderRadius: 22, padding: "12px 18px", transform: `scale(${usePopSafe(t, a(59.6) + i * 0.25)})` }}>
                    {o}
                  </div>
                ))}
              </div>
            </div>
            {t > a(61.0) && (
              <div style={{ position: "absolute", right: -10, bottom: -170, transform: `scale(${usePopSafe(t, a(61.0))}) rotate(${Math.sin(t * 6) * 6}deg)` }}>
                <svg width={200} height={170} viewBox="0 0 200 170">
                  <path d="M20 20 H180 V120 H80 L40 160 V120 H20Z" fill={C.yellow} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
                  <circle cx={65} cy={70} r={11} fill={C.ink} />
                  <circle cx={100} cy={70} r={11} fill={C.ink} />
                  <circle cx={135} cy={70} r={11} fill={C.ink} />
                </svg>
              </div>
            )}
          </div>
        )}
        {follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(62.4))})` }}>
              <EyeMascot size={380} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 1260, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(62.6))}) rotate(-3deg)` }}>
              <Big size={110} color={C.yellow} stroke={13}>OJO AL DATO</Big>
            </div>
            <div style={{ position: "absolute", left: 540, top: 1440, transform: `translate(-50%,-50%) scale(${usePopSafe(t, a(62.9)) * (pressed ? 1 - 0.12 * Math.sin(Math.min(1, press) * Math.PI) : 1)})` }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", background: pressed ? "#3A3A3A" : "#FF0033", border: `8px solid ${C.ink}`, borderRadius: 999, padding: "14px 56px", boxShadow: `0 10px 0 ${C.ink}` }}>
                {pressed ? "✓ SUSCRITO" : "SUSCRIBIRME"}
              </div>
            </div>
            {/* dedo que pulsa */}
            {t > a(63.0) && (
              <div style={{ position: "absolute", left: interpolate(lin(t, a(63.0), a(63.5)), [0, 1], [900, 640]), top: interpolate(lin(t, a(63.0), a(63.5)), [0, 1], [1700, 1480]), transform: "rotate(-20deg)" }}>
                <svg width={120} height={160} viewBox="0 0 120 160">
                  <path d="M40 10 Q55 0 60 15 L60 70 L95 75 Q115 80 110 100 L100 150 L35 150 L15 95 Q10 80 25 80 L40 90Z" fill="#F7C8A0" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= SFX =======================
const SFX: [number, string, number][] = [
  [0, "whoosh", 0.5], [0.2, "rise", 0.25], [3.3, "pop", 0.5],
  [5.0, "whoosh", 0.45], [5.3, "pop", 0.5], [7.3, "whoosh", 0.3], [8.1, "pop", 0.4], [10.6, "boom", 0.35], [11.9, "tick", 0.5], [12.2, "tick", 0.5], [12.5, "tick", 0.5], [15.4, "pop", 0.4], [17.0, "boom", 0.6], [17.7, "whoosh", 0.4],
  [18.9, "whoosh", 0.45], [21.2, "ding", 0.4], [24.0, "ding", 0.4], [26.4, "ding", 0.4], [26.8, "pop", 0.4], [27.3, "pop", 0.4], [28.6, "whoosh", 0.4],
  [29.4, "whoosh", 0.45], [29.9, "pop", 0.4], [31.3, "pop", 0.5], [33.2, "boom", 0.6],
  [34.4, "whoosh", 0.4], [35.6, "rise", 0.45], [35.9, "ding", 0.4],
  [36.3, "whoosh", 0.45], [37.2, "pop", 0.5], [38.1, "pop", 0.4], [39.4, "whoosh", 0.35], [42.0, "rise", 0.3], [43.7, "ding", 0.5], [45.3, "pop", 0.4],
  [46.4, "whoosh", 0.45], [49.5, "ding", 0.4], [50.8, "ding", 0.4], [51.4, "ding", 0.4],
  [52.1, "whoosh", 0.45], [55.9, "pop", 0.4], [56.4, "pop", 0.4],
  [57.1, "whoosh", 0.45], [58.0, "pop", 0.4], [58.9, "pop", 0.5], [61.0, "pop", 0.4], [62.4, "whoosh", 0.4], [63.5, "ding", 0.5],
];

export const Video01: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene k="hook"><SceneIn type="zoom"><Hook /></SceneIn></Scene>
      <Scene k="ebb"><SceneIn type="up"><Ebbinghaus /></SceneIn></Scene>
      <Scene k="curve"><SceneIn type="left"><Curve /></SceneIn></Scene>
      <Scene k="name"><SceneIn type="spin"><NameScene /></SceneIn></Scene>
      <Scene k="bend"><SceneIn type="zoom"><BendScene /></SceneIn></Scene>
      <Scene k="t1"><SceneIn type="up"><Tip1 /></SceneIn></Scene>
      <Scene k="t2"><SceneIn type="left"><Tip2 /></SceneIn></Scene>
      <Scene k="t3"><SceneIn type="up"><Tip3 /></SceneIn></Scene>
      <Scene k="cta"><SceneIn type="spin"><CTA /></SceneIn></Scene>

      <Captions words={words} keywords={KEYWORDS} top={300} />

      <Audio src={staticFile("v01/voz.mp3")} />
      <Audio
        src={staticFile("v01/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1, m(64.5), m(65.5), V01_DURATION], [0.0, 0.13, 0.13, 0.3, 0.0], clamp)}
      />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.round(m(at) * fps)} durationInFrames={Math.round(1.3 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`v01/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
