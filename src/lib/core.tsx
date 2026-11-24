import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  continueRender,
  delayRender,
} from "remotion";
import { loadFont } from "@remotion/fonts";

// ---------- Fuente ----------
const fontHandle = delayRender("fonts");
Promise.all(
  [700, 800, 900].map((w) =>
    loadFont({
      family: "Montserrat",
      url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`),
      weight: String(w),
    }),
  ),
).then(() => continueRender(fontHandle));

export const FONT = "Montserrat, sans-serif";

// ---------- Paleta "Ojo al Dato" ----------
export const C = {
  yellow: "#FFD23F",
  coral: "#FF5D73",
  mint: "#3DDC97",
  sky: "#4CC9F0",
  violet: "#7B2FF7",
  ink: "#1B1033",
  white: "#FFFFFF",
  pink: "#FF9EC4",
  orange: "#FF8A3D",
};

export const useSec = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/** spring que arranca en el segundo `at` (relativo a la secuencia) */
export const usePop = (at: number, damping = 12, stiffness = 140) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at * fps, fps, config: { damping, stiffness } });
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const lin = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], clamp);

// ---------- Fondo degradado con rayos y partículas ----------
export const Backdrop: React.FC<{
  from: string;
  to: string;
  rays?: boolean;
  dots?: string;
  seed?: number;
}> = ({ from, to, rays = true, dots = "rgba(255,255,255,0.18)", seed = 1 }) => {
  const t = useSec();
  const parts = React.useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const r = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
        const fr = r - Math.floor(r);
        const r2 = Math.sin(i * 4.1 + seed) * 9999;
        const fr2 = r2 - Math.floor(r2);
        return { x: fr * 1080, y: fr2 * 1920, s: 6 + (i % 5) * 5, sp: 20 + (i % 7) * 12, shape: i % 3 };
      }),
    [seed],
  );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${from} 0%, ${to} 75%)` }}>
      {rays && (
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.1 }}>
          <g transform={`translate(540 820) rotate(${t * 8})`}>
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M0 0 L-90 -1600 L90 -1600 Z" fill="#fff" transform={`rotate(${i * 22.5})`} />
            ))}
          </g>
        </svg>
      )}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {parts.map((p, i) => {
          const y = (((p.y - t * p.sp) % 1920) + 1920) % 1920;
          const x = p.x + Math.sin(t * 0.8 + i) * 20;
          return p.shape === 0 ? (
            <circle key={i} cx={x} cy={y} r={p.s / 2} fill={dots} />
          ) : p.shape === 1 ? (
            <rect key={i} x={x} y={y} width={p.s} height={p.s} rx={2} fill={dots} transform={`rotate(${t * 40 + i * 20} ${x} ${y})`} />
          ) : (
            <path key={i} d={`M${x} ${y - p.s} L${x + p.s} ${y + p.s} L${x - p.s} ${y + p.s}Z`} fill={dots} transform={`rotate(${-t * 30 + i * 10} ${x} ${y})`} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Cámara: siempre en movimiento ----------
export const Camera: React.FC<{
  children: React.ReactNode;
  zoom?: [number, number];
  drift?: number;
  dur: number;
  punchAt?: number[];
}> = ({ children, zoom = [1, 1.1], drift = 14, dur, punchAt = [] }) => {
  const t = useSec();
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  let s = interpolate(t, [0, dur], zoom, clamp);
  for (const p of punchAt) {
    const k = spring({ frame: f - p * fps, fps, config: { damping: 9, stiffness: 200 } });
    s += 0.06 * k * Math.exp(-Math.max(0, t - p) * 3);
  }
  const x = Math.sin(t * 0.7) * drift;
  const y = Math.cos(t * 0.55) * drift;
  const r = Math.sin(t * 0.45) * 0.8;
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)` }}>{children}</AbsoluteFill>
  );
};

// ---------- Entrada de escena (transición) ----------
export const SceneIn: React.FC<{ children: React.ReactNode; type?: "zoom" | "up" | "spin" | "left" }> = ({
  children,
  type = "zoom",
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: f, fps, config: { damping: 15, stiffness: 120 } });
  const o = interpolate(f, [0, 5], [0, 1], clamp);
  const tr =
    type === "zoom"
      ? `scale(${interpolate(k, [0, 1], [1.35, 1])})`
      : type === "up"
        ? `translateY(${interpolate(k, [0, 1], [700, 0])}px)`
        : type === "left"
          ? `translateX(${interpolate(k, [0, 1], [1080, 0])}px)`
          : `scale(${interpolate(k, [0, 1], [0.6, 1])}) rotate(${interpolate(k, [0, 1], [-25, 0])}deg)`;
  return <AbsoluteFill style={{ opacity: o, transform: tr }}>{children}</AbsoluteFill>;
};

// ---------- Texto grande con contorno ----------
export const Big: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  stroke?: number;
  style?: React.CSSProperties;
  weight?: number;
}> = ({ children, size = 120, color = C.white, stroke = 14, style, weight = 900 }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: weight,
      fontSize: size,
      color,
      WebkitTextStroke: `${stroke}px ${C.ink}`,
      paintOrder: "stroke fill",
      textShadow: `0 ${size * 0.07}px 0 ${C.ink}`,
      lineHeight: 1.02,
      textAlign: "center",
      letterSpacing: -1,
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------- Número que cuenta y explota ----------
export const CountUp: React.FC<{
  at: number;
  to: number;
  from?: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  rotate?: number;
}> = ({ at, to, from = 0, dur = 0.6, prefix = "", suffix = "", size = 200, color = C.yellow, x = 540, y = 900, rotate = -4 }) => {
  const t = useSec();
  const k = usePop(at, 8, 180);
  if (t < at) return null;
  const v = Math.round(interpolate(t, [at, at + dur], [from, to], clamp));
  const wob = Math.sin((t - at) * 6) * 2 * Math.exp(-(t - at) * 2);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${k}) rotate(${rotate + wob}deg)`,
      }}
    >
      <Big size={size} color={color} stroke={size * 0.09}>
        {prefix}
        {v}
        {suffix}
      </Big>
    </div>
  );
};

// ---------- Etiqueta tipo "sticker" ----------
export const Tag: React.FC<{
  at: number;
  x: number;
  y: number;
  bg?: string;
  color?: string;
  size?: number;
  rotate?: number;
  children: React.ReactNode;
}> = ({ at, x, y, bg = C.yellow, color = C.ink, size = 56, rotate = -3, children }) => {
  const t = useSec();
  const k = usePop(at, 10, 170);
  if (t < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${k}) rotate(${rotate + Math.sin(t * 2) * 1.5}deg)`,
        background: bg,
        color,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        padding: `${size * 0.25}px ${size * 0.5}px`,
        borderRadius: size * 0.35,
        border: `6px solid ${C.ink}`,
        boxShadow: `0 10px 0 ${C.ink}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// ---------- Mapa de tiempos (voz original -> voz con silencios recortados) ----------
export const makeMapper = (tm: [number, number][]) => (t: number) => {
  let i = tm.length - 2;
  for (let j = 0; j < tm.length - 1; j++) if (t < tm[j + 1][0]) { i = j; break; }
  const [x0, y0] = tm[i], [x1, y1] = tm[i + 1];
  return x1 === x0 ? y0 : y0 + ((t - x0) * (y1 - y0)) / (x1 - x0);
};
