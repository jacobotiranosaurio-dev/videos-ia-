import React from "react";
import { C, FONT, useSec } from "./core";

const INK = C.ink;

// ---------- Cerebro con cara ----------
export type Mood = "happy" | "worried" | "shock" | "sleep" | "wink";
export const Brain: React.FC<{ size?: number; mood?: Mood; sweat?: boolean; color?: string }> = ({
  size = 520,
  mood = "happy",
  sweat = false,
  color = "#FF9EC4",
}) => {
  const t = useSec();
  const blink = mood !== "sleep" && (t % 3.1 > 2.95);
  const bob = Math.sin(t * 3) * 6;
  const squash = 1 + Math.sin(t * 3) * 0.015;
  const dark = "#E86A9E";
  const eyeY = 190;
  const eye = (cx: number) =>
    mood === "sleep" ? (
      <path d={`M${cx - 22} ${eyeY} Q${cx} ${eyeY + 18} ${cx + 22} ${eyeY}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
    ) : blink ? (
      <path d={`M${cx - 22} ${eyeY} L${cx + 22} ${eyeY}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx} cy={eyeY} rx={mood === "shock" ? 30 : 26} ry={mood === "shock" ? 36 : 30} fill="#fff" stroke={INK} strokeWidth={7} />
        <circle cx={cx + 4} cy={eyeY + 4} r={mood === "shock" ? 10 : 14} fill={INK} />
        <circle cx={cx + 9} cy={eyeY - 3} r={5} fill="#fff" />
      </g>
    );
  const mouth =
    mood === "happy" ? (
      <path d="M170 245 Q200 280 230 245 Z" fill={INK} />
    ) : mood === "worried" ? (
      <path d="M172 262 Q200 240 228 262" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
    ) : mood === "shock" ? (
      <ellipse cx={200} cy={258} rx={20} ry={26} fill={INK} />
    ) : mood === "sleep" ? (
      <ellipse cx={200} cy={255} rx={10} ry={8} fill={INK} />
    ) : (
      <path d="M172 248 Q200 272 228 248" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
    );
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 400 340" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob}) scale(${2 - squash} ${squash})`} style={{ transformOrigin: "200px 300px" }}>
        <ellipse cx={200} cy={325} rx={150} ry={14} fill="rgba(0,0,0,0.18)" />
        <path
          d="M200 40 C255 20 320 45 335 95 C385 110 395 175 365 210 C380 260 335 305 280 295 C250 320 150 320 120 295 C65 305 20 260 35 210 C5 175 15 110 65 95 C80 45 145 20 200 40Z"
          fill={color}
          stroke={INK}
          strokeWidth={9}
        />
        <path d="M200 45 L200 140" stroke={dark} strokeWidth={8} strokeLinecap="round" />
        <path d="M110 90 Q140 110 120 140 M290 90 Q260 110 280 140 M70 160 Q100 150 105 175 M330 160 Q300 150 295 175 M150 70 Q165 95 145 110 M250 70 Q235 95 255 110" stroke={dark} strokeWidth={8} fill="none" strokeLinecap="round" />
        <ellipse cx={120} cy={235} rx={22} ry={12} fill="#FF6F9F" opacity={0.6} />
        <ellipse cx={280} cy={235} rx={22} ry={12} fill="#FF6F9F" opacity={0.6} />
        {eye(160)}
        {eye(240)}
        {mood === "worried" && (
          <>
            <path d="M135 150 L180 160" stroke={INK} strokeWidth={8} strokeLinecap="round" />
            <path d="M265 150 L220 160" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          </>
        )}
        {mouth}
        {sweat && <path d={`M330 ${120 + (t * 60) % 60} q12 22 0 30 q-12 -8 0 -30z`} fill={C.sky} stroke={INK} strokeWidth={5} />}
      </g>
    </svg>
  );
};

// ---------- Científico (Ebbinghaus estilizado, original) ----------
export const Scientist: React.FC<{ size?: number; shock?: boolean }> = ({ size = 520, shock = false }) => {
  const t = useSec();
  const blink = t % 2.7 > 2.58;
  const head = Math.sin(t * 2) * 3;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 400 440" style={{ overflow: "visible" }}>
      {/* cuerpo bata */}
      <path d="M90 440 C90 340 130 300 200 300 C270 300 310 340 310 440Z" fill="#F4F1EA" stroke={INK} strokeWidth={8} />
      <path d="M200 300 L175 440 M200 300 L225 440" stroke={INK} strokeWidth={6} />
      <path d="M170 300 L200 350 L230 300Z" fill="#5B4BDB" stroke={INK} strokeWidth={6} />
      <g transform={`rotate(${head} 200 200)`}>
        {/* cabeza */}
        <ellipse cx={200} cy={180} rx={95} ry={105} fill="#F7C8A0" stroke={INK} strokeWidth={8} />
        {/* pelo lateral */}
        <path d="M108 160 Q95 110 130 95 M292 160 Q305 110 270 95" stroke="#8B5E3C" strokeWidth={26} fill="none" strokeLinecap="round" />
        {/* barba grande */}
        <path d="M110 190 C110 300 160 340 200 340 C240 340 290 300 290 190 C270 230 240 245 200 245 C160 245 130 230 110 190Z" fill="#8B5E3C" stroke={INK} strokeWidth={8} />
        {/* bigote */}
        <path d="M155 228 Q178 210 200 225 Q222 210 245 228 Q222 242 200 232 Q178 242 155 228Z" fill="#6E472C" stroke={INK} strokeWidth={6} />
        {shock ? <ellipse cx={200} cy={262} rx={14} ry={18} fill={INK} /> : null}
        {/* gafas */}
        <circle cx={160} cy={175} r={30} fill="#fff" stroke={INK} strokeWidth={7} />
        <circle cx={240} cy={175} r={30} fill="#fff" stroke={INK} strokeWidth={7} />
        <path d="M190 175 L210 175" stroke={INK} strokeWidth={7} />
        {blink ? (
          <>
            <path d="M148 177 L172 177" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <path d="M228 177 L252 177" stroke={INK} strokeWidth={7} strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={163} cy={178} r={shock ? 7 : 11} fill={INK} />
            <circle cx={243} cy={178} r={shock ? 7 : 11} fill={INK} />
          </>
        )}
        <path d={shock ? "M130 125 L185 135 M270 125 L215 135" : "M130 135 L185 140 M270 135 L215 140"} stroke="#6E472C" strokeWidth={10} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ---------- Calendario que se voltea ----------
export const CalendarCard: React.FC<{ label: string; value: string; size?: number; color?: string }> = ({
  label,
  value,
  size = 380,
  color = C.coral,
}) => (
  <div
    style={{
      width: size,
      background: "#fff",
      border: `8px solid ${INK}`,
      borderRadius: 34,
      boxShadow: `0 16px 0 ${INK}`,
      overflow: "hidden",
      fontFamily: FONT,
      textAlign: "center",
    }}
  >
    <div style={{ background: color, color: "#fff", fontWeight: 900, fontSize: size * 0.13, padding: "14px 0", borderBottom: `8px solid ${INK}` }}>
      {label}
    </div>
    <div style={{ fontWeight: 900, fontSize: size * 0.34, color: INK, padding: "18px 0 22px" }}>{value}</div>
  </div>
);

// ---------- Bombilla (recuerdo) ----------
export const Bulb: React.FC<{ on: boolean; size?: number }> = ({ on, size = 200 }) => {
  const t = useSec();
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: "visible" }}>
      {on && (
        <g opacity={0.7 + Math.sin(t * 8) * 0.2}>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M100 -10 L100 -40" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" transform={`rotate(${i * 45 - 90 + 90} 100 90)`} />
          ))}
        </g>
      )}
      <path d="M100 10 C150 10 180 50 180 90 C180 130 145 150 140 180 L60 180 C55 150 20 130 20 90 C20 50 50 10 100 10Z" fill={on ? C.yellow : "#5C5A78"} stroke={INK} strokeWidth={9} />
      {on && <path d="M60 70 Q70 40 100 35" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />}
      <rect x={60} y={180} width={80} height={45} rx={10} fill="#B8B5C9" stroke={INK} strokeWidth={8} />
      <path d="M70 196 L130 196 M70 210 L130 210" stroke={INK} strokeWidth={5} />
    </svg>
  );
};

// ---------- Libro ----------
export const Book: React.FC<{ size?: number; color?: string }> = ({ size = 300, color = C.sky }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 300 225">
    <path d="M150 40 C110 15 50 15 15 30 L15 205 C50 190 110 190 150 215 C190 190 250 190 285 205 L285 30 C250 15 190 15 150 40Z" fill={color} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M150 40 L150 215" stroke={INK} strokeWidth={8} />
    <path d="M40 70 L125 70 M40 100 L125 100 M40 130 L110 130 M175 70 L260 70 M175 100 L260 100 M175 130 L245 130" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.85} />
  </svg>
);

// ---------- Tarjeta de examen / flashcard ----------
export const Flashcard: React.FC<{ size?: number; text?: string; color?: string }> = ({ size = 320, text = "?", color = "#fff" }) => (
  <div
    style={{
      width: size,
      height: size * 0.68,
      background: color,
      border: `8px solid ${INK}`,
      borderRadius: 28,
      boxShadow: `0 14px 0 ${INK}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size * 0.4,
      color: C.violet,
    }}
  >
    {text}
  </div>
);

// ---------- Cama ----------
export const Bed: React.FC<{ size?: number; children?: React.ReactNode }> = ({ size = 760, children }) => (
  <div style={{ position: "relative", width: size, height: size * 0.6 }}>
    <svg width={size} height={size * 0.6} viewBox="0 0 760 456" style={{ position: "absolute" }}>
      <rect x={20} y={120} width={60} height={320} rx={20} fill="#8C6BFF" stroke={INK} strokeWidth={9} />
      <rect x={680} y={220} width={60} height={220} rx={20} fill="#8C6BFF" stroke={INK} strokeWidth={9} />
      <rect x={60} y={270} width={650} height={120} rx={24} fill="#B9A6FF" stroke={INK} strokeWidth={9} />
      <ellipse cx={190} cy={250} rx={110} ry={42} fill="#fff" stroke={INK} strokeWidth={8} />
    </svg>
    <div style={{ position: "absolute", left: 70, top: 20 }}>{children}</div>
    <svg width={size} height={size * 0.6} viewBox="0 0 760 456" style={{ position: "absolute" }}>
      <path d="M290 200 C350 180 640 180 700 210 L700 330 L270 330Z" fill={C.sky} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d="M330 230 L660 230 M330 270 L660 270" stroke="#fff" strokeWidth={6} opacity={0.5} />
    </svg>
  </div>
);

// ---------- Mascota del canal: el Ojo ----------
export const EyeMascot: React.FC<{ size?: number }> = ({ size = 360 }) => {
  const t = useSec();
  const blink = t % 2.4 > 2.28;
  const lx = Math.sin(t * 1.7) * 22;
  const ly = Math.cos(t * 1.3) * 10;
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
      <circle cx={150} cy={150} r={140} fill={C.yellow} stroke={INK} strokeWidth={10} />
      {blink ? (
        <path d="M60 150 Q150 200 240 150" stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <path d="M40 150 Q150 40 260 150 Q150 260 40 150Z" fill="#fff" stroke={INK} strokeWidth={10} />
          <circle cx={150 + lx} cy={150 + ly} r={50} fill={C.violet} stroke={INK} strokeWidth={8} />
          <circle cx={150 + lx} cy={150 + ly} r={24} fill={INK} />
          <circle cx={166 + lx} cy={134 + ly} r={11} fill="#fff" />
        </g>
      )}
    </svg>
  );
};

// ---------- Archivador ----------
export const Cabinet: React.FC<{ size?: number; open?: number }> = ({ size = 320, open = 0 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 300 330" style={{ overflow: "visible" }}>
    <rect x={20} y={20} width={260} height={300} rx={22} fill="#6C63FF" stroke={INK} strokeWidth={9} />
    <rect x={40} y={50 - open * 40} width={220} height={110} rx={14} fill="#8F88FF" stroke={INK} strokeWidth={8} transform={`translate(0 ${open * 40}) scale(1 1)`} />
    <rect x={40} y={180} width={220} height={110} rx={14} fill="#8F88FF" stroke={INK} strokeWidth={8} />
    <rect x={120} y={95} width={60} height={18} rx={9} fill={INK} />
    <rect x={120} y={225} width={60} height={18} rx={9} fill={INK} />
  </svg>
);

// ---------- Carpeta ----------
export const Folder: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = C.yellow }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 150 120">
    <path d="M10 20 L60 20 L72 34 L140 34 L140 110 L10 110Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  </svg>
);
