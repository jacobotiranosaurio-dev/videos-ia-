import React from "react";
import { C, FONT, useSec } from "./core";

const INK = C.ink;
export const MP = {
  land: "#E9EEF3",
  block: "#FFFFFF",
  park: "#BFE8C4",
  water: "#9ED3F5",
  road: "#FFFFFF",
  green: "#22C55E",
  orange: "#FF9F1C",
  red: "#EF2B3C",
  dark: "#8B0A1A",
  you: "#2F6BFF",
};

// ---------- Mapa base (vista cenital, diseño propio) ----------
export const MapBase: React.FC<{ children?: React.ReactNode; tilt?: number }> = ({ children, tilt = 0 }) => {
  const blocks = React.useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        x: (i % 7) * 165 - 40 + ((Math.floor(i / 7) % 2) * 40),
        y: Math.floor(i / 7) * 205 - 40,
        w: 120 + ((i * 37) % 30),
        h: 150 + ((i * 53) % 30),
        park: i % 11 === 3 || i % 13 === 7,
      })),
    [],
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: MP.land, transform: `perspective(1600px) rotateX(${tilt}deg)`, transformOrigin: "50% 70%" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {blocks.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={16} fill={b.park ? MP.park : MP.block} stroke="#D5DEE8" strokeWidth={3} />
        ))}
        <path d="M-50 1580 C300 1500 600 1700 1150 1560 L1150 1680 C600 1820 300 1620 -50 1700Z" fill={MP.water} />
      </svg>
      {children}
    </div>
  );
};

// ---------- Carretera con tráfico coloreado ----------
/** path d de la carretera; segs: lista [desde, hasta (0..1), color] */
export const TrafficRoad: React.FC<{ d: string; segs: [number, number, string][]; width?: number; reveal?: number }> = ({ d, segs, width = 46, reveal = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path d={d} stroke="#C9D3DE" strokeWidth={width + 16} fill="none" strokeLinecap="round" />
    <path d={d} stroke={MP.road} strokeWidth={width} fill="none" strokeLinecap="round" />
    {segs.map(([a, b, c], i) => {
      const bb = Math.min(b, reveal);
      if (bb <= a) return null;
      return <path key={i} d={d} pathLength={1} stroke={c} strokeWidth={width * 0.55} fill="none" strokeLinecap="butt" strokeDasharray={`0 ${a} ${bb - a} 2`} />;
    })}
  </svg>
);

// ---------- Punto "tú" (flecha de navegación) ----------
export const YouPuck: React.FC<{ size?: number; angle?: number }> = ({ size = 90, angle = 0 }) => {
  const t = useSec();
  return (
    <svg width={size * 2} height={size * 2} viewBox="-100 -100 200 200" style={{ overflow: "visible" }}>
      <circle r={70 + Math.sin(t * 4) * 8} fill={MP.you} opacity={0.2} />
      <circle r={46} fill="#fff" stroke={INK} strokeWidth={6} />
      <path d="M0 -30 L22 26 L0 14 L-22 26Z" fill={MP.you} stroke={INK} strokeWidth={5} strokeLinejoin="round" transform={`rotate(${angle})`} />
    </svg>
  );
};

// ---------- Chincheta ----------
export const Pin: React.FC<{ size?: number; color?: string; label?: string }> = ({ size = 120, color = MP.red, label }) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 100 135" style={{ overflow: "visible" }}>
    <ellipse cx={50} cy={128} rx={18} ry={6} fill="rgba(0,0,0,0.25)" />
    <path d="M50 128 C20 90 8 70 8 48 a42 42 0 0 1 84 0 C92 70 80 90 50 128Z" fill={color} stroke={INK} strokeWidth={7} />
    <circle cx={50} cy={48} r={17} fill="#fff" stroke={INK} strokeWidth={5} />
    {label && <text x={50} y={56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill={INK}>{label}</text>}
  </svg>
);

// ---------- Coche visto desde arriba ----------
export const CarTop: React.FC<{ color?: string; size?: number; brake?: boolean; ping?: boolean; phase?: number }> = ({ color = "#5B8CFF", size = 70, brake = false, ping = false, phase = 0 }) => {
  const t = useSec();
  const p = ((t * 0.9 + phase) % 1);
  return (
    <svg width={size} height={size * 1.7} viewBox="0 0 60 100" style={{ overflow: "visible" }}>
      {ping && <circle cx={30} cy={50} r={20 + p * 60} fill="none" stroke={MP.you} strokeWidth={4} opacity={1 - p} />}
      <rect x={6} y={6} width={48} height={88} rx={16} fill={color} stroke={INK} strokeWidth={5} />
      <rect x={12} y={22} width={36} height={18} rx={6} fill="#BFE3FF" stroke={INK} strokeWidth={3} />
      <rect x={12} y={62} width={36} height={14} rx={5} fill="#BFE3FF" stroke={INK} strokeWidth={3} />
      <rect x={10} y={88} width={12} height={6} rx={2} fill={brake ? "#FF2D3D" : "#7A1A22"} />
      <rect x={38} y={88} width={12} height={6} rx={2} fill={brake ? "#FF2D3D" : "#7A1A22"} />
      {brake && <ellipse cx={30} cy={96} rx={30} ry={10} fill="#FF2D3D" opacity={0.35} />}
    </svg>
  );
};

// ---------- Móvil con mapa ----------
export const MapPhone: React.FC<{ size?: number; children?: React.ReactNode; pings?: boolean }> = ({ size = 360, children, pings = true }) => {
  const t = useSec();
  return (
    <div style={{ position: "relative", width: size, height: size * 1.9 }}>
      {pings &&
        [0, 1, 2].map((i) => {
          const p = ((t * 0.7 + i / 3) % 1);
          return <div key={i} style={{ position: "absolute", left: size / 2, top: size * 0.95, width: size * (0.6 + p * 1.8), height: size * (0.6 + p * 1.8), transform: "translate(-50%,-50%)", borderRadius: "50%", border: `8px solid ${MP.you}`, opacity: 1 - p }} />;
        })}
      <div style={{ position: "absolute", inset: 0, background: "#111", border: `12px solid ${INK}`, borderRadius: size * 0.15, boxShadow: `0 16px 0 ${INK}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: MP.land }}>{children}</div>
        <div style={{ position: "absolute", top: 14, left: "50%", width: size * 0.25, height: 20, background: INK, borderRadius: 12, transform: "translateX(-50%)" }} />
      </div>
    </div>
  );
};

// ---------- Burbuja de dato ----------
export const DataChip: React.FC<{ icon: string; text: string; color?: string }> = ({ icon, text, color = "#fff" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: color, border: `7px solid ${INK}`, borderRadius: 999, padding: "10px 30px 10px 14px", boxShadow: `0 10px 0 ${INK}`, fontFamily: FONT, fontWeight: 900, fontSize: 50, color: INK, whiteSpace: "nowrap" }}>
    <span style={{ width: 70, height: 70, borderRadius: 35, background: MP.you, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, border: `5px solid ${INK}` }}>{icon}</span>
    {text}
  </div>
);

// ---------- Máscara de anonimato ----------
export const Mask: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
    <path d="M10 30 Q100 -10 190 30 Q195 95 130 100 Q100 70 70 100 Q5 95 10 30Z" fill={INK} stroke="#fff" strokeWidth={6} />
    <ellipse cx={60} cy={50} rx={24} ry={16} fill="#fff" />
    <ellipse cx={140} cy={50} rx={24} ry={16} fill="#fff" />
  </svg>
);

// ---------- Velocímetro ----------
export const Speedo: React.FC<{ v: number; max?: number; size?: number }> = ({ v, max = 120, size = 300 }) => {
  const ang = -120 + (Math.min(v, max) / max) * 240;
  const col = v > 60 ? MP.green : v > 30 ? MP.orange : MP.red;
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 200 160">
      <path d="M30 140 A85 85 0 1 1 170 140" stroke="#E4E4EC" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M30 140 A85 85 0 1 1 170 140" stroke={col} strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.min(v, max) / max} 1`} />
      <path d="M100 95 L100 30" stroke={INK} strokeWidth={9} strokeLinecap="round" transform={`rotate(${ang} 100 95)`} />
      <circle cx={100} cy={95} r={12} fill={INK} />
      <text x={100} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={INK}>{Math.round(v)}</text>
    </svg>
  );
};

// ---------- Red neuronal ----------
export const NeuralNet: React.FC<{ size?: number }> = ({ size = 800 }) => {
  const t = useSec();
  const layers = [3, 5, 5, 2];
  const pts = layers.map((n, li) => Array.from({ length: n }, (_, k) => [80 + li * 210, 300 - ((n - 1) * 110) / 2 + k * 110] as [number, number]));
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 800 600">
      {pts.slice(0, -1).map((L, li) =>
        L.map(([x1, y1], i) =>
          pts[li + 1].map(([x2, y2], j) => {
            const on = (Math.sin(t * 5 - li * 1.4 + i + j) + 1) / 2;
            return <line key={`${li}-${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={on > 0.7 ? C.yellow : "rgba(255,255,255,0.25)"} strokeWidth={on > 0.7 ? 6 : 3} />;
          }),
        ),
      )}
      {pts.flat().map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={30} fill={(Math.sin(t * 4 + i) + 1) / 2 > 0.6 ? C.yellow : "#7B8CFF"} stroke={INK} strokeWidth={6} />
      ))}
    </svg>
  );
};

// ---------- Carrito con móviles (experimento de Berlín) ----------
export const PhoneCart: React.FC<{ size?: number }> = ({ size = 420 }) => {
  const t = useSec();
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 420 340" style={{ overflow: "visible" }}>
      <path d="M380 140 L420 40" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={40 + (i % 8) * 40} y={60 + Math.floor(i / 8) * 34 + Math.sin(t * 6 + i) * 2} width={30} height={52} rx={6} fill="#20232E" stroke="#fff" strokeWidth={2} />
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={`s${i}`} x={44 + (i % 8) * 40} y={66 + Math.floor(i / 8) * 34 + Math.sin(t * 6 + i) * 2} width={22} height={30} rx={3} fill={(i + Math.floor(t * 3)) % 5 ? MP.land : MP.red} />
      ))}
      <path d="M20 140 L390 140 L360 240 L50 240Z" fill="#E23A3A" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {[100, 310].map((x) => (
        <g key={x} transform={`rotate(${t * 200} ${x} 270)`}>
          <circle cx={x} cy={270} r={38} fill="#333" stroke={INK} strokeWidth={8} />
          <path d={`M${x - 30} 270 L${x + 30} 270 M${x} 240 L${x} 300`} stroke="#777" strokeWidth={6} />
        </g>
      ))}
    </svg>
  );
};

// ---------- Persona caminando (perfil) ----------
export const Walker: React.FC<{ size?: number }> = ({ size = 300 }) => {
  const t = useSec();
  const s = Math.sin(t * 7) * 22;
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 200 320" style={{ overflow: "visible" }}>
      <path d="M90 200 L70 300" stroke="#26305E" strokeWidth={26} strokeLinecap="round" transform={`rotate(${s} 90 200)`} />
      <path d="M110 200 L130 300" stroke="#1C2448" strokeWidth={26} strokeLinecap="round" transform={`rotate(${-s} 110 200)`} />
      <rect x={65} y={100} width={70} height={110} rx={30} fill="#FF8A3D" stroke={INK} strokeWidth={7} />
      <path d="M95 120 L30 170" stroke="#FF8A3D" strokeWidth={22} strokeLinecap="round" />
      <circle cx={100} cy={65} r={38} fill="#F2C29B" stroke={INK} strokeWidth={7} />
      <path d="M62 60 Q70 20 110 25 Q140 30 138 60 Q120 45 90 48Z" fill="#3B2A20" stroke={INK} strokeWidth={5} />
      <circle cx={88} cy={68} r={5} fill={INK} />
    </svg>
  );
};
