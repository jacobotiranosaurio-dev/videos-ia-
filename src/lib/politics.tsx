import React from "react";
import { C, FONT, useSec } from "./core";

const INK = C.ink;
export const P = {
  red: "#C8102E",
  red2: "#7A0A1C",
  gold: "#FFC93C",
  navy: "#1A2350",
  green: "#2BB673",
  bill: "#8FD18B",
  paper: "#FFF8EC",
};

// ---------- Diputado (genérico, original) ----------
export const Deputy: React.FC<{ size?: number; mood?: "smile" | "smug" | "shock" | "wink"; armUp?: number }> = ({ size = 420, mood = "smile", armUp = 0 }) => {
  const t = useSec();
  const blink = t % 3.2 > 3.08;
  const bob = Math.sin(t * 2.4) * 4;
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 400 500" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        {/* cuerpo traje */}
        <path d="M80 500 C80 370 130 320 200 320 C270 320 320 370 320 500Z" fill="#26305E" stroke={INK} strokeWidth={8} />
        <path d="M200 322 L165 330 L200 420 L235 330Z" fill="#fff" stroke={INK} strokeWidth={6} />
        <path d="M200 340 L188 360 L200 440 L212 360Z" fill={P.red} stroke={INK} strokeWidth={5} />
        <path d="M165 330 L200 420 L150 380Z M235 330 L200 420 L250 380Z" fill="#1C2448" stroke={INK} strokeWidth={5} />
        <rect x={255} y={385} width={30} height={10} rx={3} fill={P.gold} />
        {/* brazo levantado */}
        <g transform={`rotate(${-armUp * 140} 300 360)`}>
          <path d="M300 360 L340 460" stroke="#26305E" strokeWidth={46} strokeLinecap="round" />
          <circle cx={342} cy={466} r={24} fill="#F2C29B" stroke={INK} strokeWidth={6} />
        </g>
        {/* cabeza */}
        <ellipse cx={200} cy={210} rx={92} ry={104} fill="#F2C29B" stroke={INK} strokeWidth={8} />
        <path d="M110 190 Q105 100 200 95 Q295 100 290 190 Q270 140 200 140 Q140 140 110 190Z" fill="#3B2A20" stroke={INK} strokeWidth={7} />
        <ellipse cx={110} cy={215} rx={14} ry={22} fill="#F2C29B" stroke={INK} strokeWidth={6} />
        <ellipse cx={290} cy={215} rx={14} ry={22} fill="#F2C29B" stroke={INK} strokeWidth={6} />
        {blink ? (
          <path d="M150 205 L178 205 M222 205 L250 205" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        ) : mood === "wink" ? (
          <>
            <circle cx={165} cy={205} r={11} fill={INK} />
            <path d="M222 205 Q236 195 250 205" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={165} cy={205} r={mood === "shock" ? 8 : 11} fill={INK} />
            <circle cx={235} cy={205} r={mood === "shock" ? 8 : 11} fill={INK} />
          </>
        )}
        <path d="M145 180 L182 175 M218 175 L255 180" stroke="#3B2A20" strokeWidth={9} strokeLinecap="round" />
        <ellipse cx={140} cy={245} rx={16} ry={9} fill="#F49A8A" opacity={0.6} />
        <ellipse cx={260} cy={245} rx={16} ry={9} fill="#F49A8A" opacity={0.6} />
        {mood === "shock" ? (
          <ellipse cx={200} cy={265} rx={16} ry={20} fill={INK} />
        ) : mood === "smug" ? (
          <path d="M170 262 Q205 280 232 255" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
        ) : (
          <path d="M165 255 Q200 295 235 255 Z" fill={INK} />
        )}
      </g>
    </svg>
  );
};

// ---------- Hemiciclo con N escaños ----------
export const Hemicycle: React.FC<{ size?: number; filled?: number; total?: number; color?: string; emptyColor?: string }> = ({ size = 900, filled = 350, total = 350, color = P.red, emptyColor = "rgba(255,255,255,0.15)" }) => {
  const rows = 10;
  const seats: [number, number][] = [];
  const radii = Array.from({ length: rows }, (_, i) => 150 + i * 30);
  const sumR = radii.reduce((a, b) => a + b, 0);
  radii.forEach((r) => {
    const n = Math.round((total * r) / sumR);
    for (let k = 0; k < n; k++) {
      const a = Math.PI - (Math.PI * (k + 0.5)) / n;
      seats.push([450 + Math.cos(a) * r, 470 - Math.sin(a) * r]);
    }
  });
  seats.sort((p, q) => Math.atan2(470 - p[1], p[0] - 450) - Math.atan2(470 - q[1], q[0] - 450)).reverse();
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 900 500">
      {seats.slice(0, total).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={11} fill={i < filled ? color : emptyColor} stroke={i < filled ? INK : "none"} strokeWidth={3} />
      ))}
      {emptyColor !== "transparent" && <rect x={380} y={455} width={140} height={40} rx={8} fill={P.gold} stroke={INK} strokeWidth={5} />}
    </svg>
  );
};

// ---------- Billete ----------
export const Bill: React.FC<{ w?: number; value?: string }> = ({ w = 260, value = "100" }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 260 130">
    <rect x={4} y={4} width={252} height={122} rx={12} fill={P.bill} stroke={INK} strokeWidth={6} />
    <rect x={20} y={20} width={220} height={90} rx={8} fill="none" stroke="#3E8E3A" strokeWidth={4} />
    <circle cx={130} cy={65} r={30} fill="#BDE8B6" stroke="#3E8E3A" strokeWidth={4} />
    <text x={130} y={78} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill="#2B6B28">€</text>
    <text x={46} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#2B6B28">{value}</text>
    <text x={214} y={104} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#2B6B28">{value}</text>
  </svg>
);

/** Lluvia continua de billetes */
export const MoneyRain: React.FC<{ n?: number; speed?: number; opacity?: number }> = ({ n = 14, speed = 1, opacity = 1 }) => {
  const t = useSec();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const p = ((t * 0.35 * speed + i / n) % 1);
        const x = ((i * 397) % 1000) + Math.sin(t * 2 + i) * 40;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: -150 + p * 2100, transform: `rotate(${Math.sin(t * 3 + i) * 40 + i * 25}deg) scale(${0.5 + (i % 3) * 0.2})`, opacity }}>
            <Bill w={220} value={i % 2 ? "50" : "100"} />
          </div>
        );
      })}
    </>
  );
};

// ---------- Nómina ----------
export const Payslip: React.FC<{ rows: { l: string; v: string; on: boolean; hl?: string }[]; total?: string; showTotal?: boolean; w?: number }> = ({ rows, total, showTotal, w = 820 }) => (
  <div style={{ width: w, background: P.paper, border: `9px solid ${INK}`, borderRadius: 30, boxShadow: `0 16px 0 ${INK}`, fontFamily: FONT, overflow: "hidden" }}>
    <div style={{ background: P.red, color: "#fff", fontWeight: 900, fontSize: 52, padding: "16px 34px", borderBottom: `8px solid ${INK}`, display: "flex", justifyContent: "space-between" }}>
      <span>NÓMINA</span>
      <span style={{ fontSize: 36, alignSelf: "center", opacity: 0.85 }}>DIPUTADO/A</span>
    </div>
    <div style={{ padding: "16px 34px 10px" }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 40, fontWeight: 800, color: INK, padding: "14px 0", borderBottom: "4px dashed #E2D6C2", opacity: r.on ? 1 : 0, transform: `translateX(${r.on ? 0 : -40}px)` }}>
          <span>{r.l}</span>
          <span style={{ fontWeight: 900, color: r.hl ?? INK, fontSize: 48 }}>{r.v}</span>
        </div>
      ))}
      {showTotal && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 50, fontWeight: 900, color: INK, padding: "18px 0 10px" }}>
          <span>TOTAL</span>
          <span style={{ color: P.red, fontSize: 64 }}>{total}</span>
        </div>
      )}
    </div>
  </div>
);

// ---------- Sello ----------
export const Stamp: React.FC<{ text: string; color?: string; k: number; rotate?: number; size?: number }> = ({ text, color = P.green, k, rotate = -12, size = 74 }) => (
  <div
    style={{
      transform: `scale(${2.4 - 1.4 * Math.min(1, k)}) rotate(${rotate}deg)`,
      opacity: Math.min(1, k * 2),
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      color,
      border: `12px solid ${color}`,
      borderRadius: 22,
      padding: "4px 26px",
      background: "rgba(255,255,255,0.92)",
      textAlign: "center",
      lineHeight: 1.02,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// ---------- Calculadora ----------
export const Calculator: React.FC<{ display: string; w?: number }> = ({ display, w = 420 }) => (
  <div style={{ width: w, background: "#2B2F45", border: `9px solid ${INK}`, borderRadius: 40, boxShadow: `0 16px 0 ${INK}`, padding: 26 }}>
    <div style={{ background: "#BFE3B0", border: `6px solid ${INK}`, borderRadius: 16, padding: "10px 18px", fontFamily: FONT, fontWeight: 900, fontSize: display.length > 6 ? 46 : 64, whiteSpace: "nowrap", overflow: "hidden", textAlign: "right", color: INK, fontVariantNumeric: "tabular-nums" }}>{display}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 22 }}>
      {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"].map((k) => (
        <div key={k} style={{ height: 62, background: "+−×÷=".includes(k) ? P.gold : "#4A4F6E", border: `5px solid ${INK}`, borderRadius: 14, color: "+−×÷=".includes(k) ? INK : "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</div>
      ))}
    </div>
  </div>
);

// ---------- Balanza ----------
export const Scale: React.FC<{ size?: number }> = ({ size = 520 }) => {
  const t = useSec();
  const tilt = Math.sin(t * 1.6) * 12;
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 500 450" style={{ overflow: "visible" }}>
      <rect x={235} y={80} width={30} height={320} fill={P.gold} stroke={INK} strokeWidth={7} />
      <rect x={150} y={390} width={200} height={40} rx={12} fill={P.gold} stroke={INK} strokeWidth={7} />
      <g transform={`rotate(${tilt} 250 90)`}>
        <rect x={40} y={80} width={420} height={20} rx={10} fill={P.gold} stroke={INK} strokeWidth={7} />
        {[60, 440].map((x, i) => (
          <g key={x} transform={`rotate(${-tilt} ${x} 90)`}>
            <path d={`M${x} 90 L${x - 60} 220 M${x} 90 L${x + 60} 220`} stroke={INK} strokeWidth={5} />
            <path d={`M${x - 80} 220 L${x + 80} 220 Q${x} 290 ${x - 80} 220Z`} fill={P.gold} stroke={INK} strokeWidth={7} />
            <text x={x} y={205} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">{i ? "POCO" : "MUCHO"}</text>
          </g>
        ))}
      </g>
      <circle cx={250} cy={85} r={18} fill={P.red} stroke={INK} strokeWidth={6} />
    </svg>
  );
};

// ---------- Ventana de navegador ----------
export const Browser: React.FC<{ w?: number; url: string; children?: React.ReactNode }> = ({ w = 820, url, children }) => (
  <div style={{ width: w, background: "#fff", border: `9px solid ${INK}`, borderRadius: 30, boxShadow: `0 16px 0 ${INK}`, overflow: "hidden", fontFamily: FONT }}>
    <div style={{ background: "#E8E4F5", borderBottom: `6px solid ${INK}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      {[C.coral, C.yellow, C.mint].map((c) => (
        <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c, border: `4px solid ${INK}` }} />
      ))}
      <div style={{ flex: 1, marginLeft: 12, background: "#fff", border: `4px solid ${INK}`, borderRadius: 999, padding: "6px 20px", fontWeight: 800, fontSize: 30, color: INK }}>🔒 {url}</div>
    </div>
    <div style={{ padding: 26 }}>{children}</div>
  </div>
);

// ---------- Puerta de salida ----------
export const ExitDoor: React.FC<{ open?: number; size?: number }> = ({ open = 0, size = 300 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 200 300" style={{ overflow: "visible" }}>
    <rect x={20} y={20} width={160} height={270} fill="#1A1033" stroke={INK} strokeWidth={8} />
    <rect x={20} y={20} width={160} height={270} fill="#8B5A2B" stroke={INK} strokeWidth={8} transform={`skewY(${-open * 12}) scale(${1 - open * 0.55} 1)`} style={{ transformOrigin: "20px 155px" }} />
    <rect x={40} y={-30} width={120} height={40} rx={8} fill={C.mint} stroke={INK} strokeWidth={6} />
    <text x={100} y={-2} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={INK}>SALIDA</text>
  </svg>
);
