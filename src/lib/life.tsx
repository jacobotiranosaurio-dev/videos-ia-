import React from "react";
import { C, FONT, useSec } from "./core";

const INK = C.ink;

// ---------- Persona en la cama (vista frontal-cenital) ----------
export const Sleeper: React.FC<{ size?: number; awake?: number; color?: string }> = ({ size = 760, awake = 0, color = "#7FA8FF" }) => {
  const t = useSec();
  const breath = Math.sin(t * 2) * 4;
  const eyes = awake > 0.5;
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 760 590" style={{ overflow: "visible" }}>
      {/* cabecero */}
      <rect x={60} y={40} width={640} height={170} rx={40} fill="#8C6BFF" stroke={INK} strokeWidth={9} />
      {/* colchón */}
      <rect x={40} y={170} width={680} height={400} rx={40} fill="#fff" stroke={INK} strokeWidth={9} />
      {/* almohada */}
      <ellipse cx={380} cy={230} rx={190} ry={60} fill="#F4F1FF" stroke={INK} strokeWidth={8} />
      {/* cabeza */}
      <g transform={`translate(0 ${-awake * 30})`}>
        <ellipse cx={380} cy={215} rx={78} ry={84} fill="#F2C29B" stroke={INK} strokeWidth={8} />
        <path d="M302 200 Q300 130 380 125 Q460 130 458 200 Q440 165 380 165 Q320 165 302 200Z" fill="#3B2A20" stroke={INK} strokeWidth={7} />
        {eyes ? (
          <>
            <circle cx={350} cy={218} r={14} fill="#fff" stroke={INK} strokeWidth={5} />
            <circle cx={410} cy={218} r={14} fill="#fff" stroke={INK} strokeWidth={5} />
            <circle cx={352} cy={220} r={6} fill={INK} />
            <circle cx={412} cy={220} r={6} fill={INK} />
            <ellipse cx={380} cy={262} rx={10} ry={12} fill={INK} />
          </>
        ) : (
          <>
            <path d="M336 220 Q350 230 364 220 M396 220 Q410 230 424 220" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M370 258 Q380 264 390 258" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
      {/* manta */}
      <path d={`M40 ${300 + breath} Q380 ${270 + breath} 720 ${300 + breath} L720 530 Q720 570 680 570 L80 570 Q40 570 40 530Z`} fill={color} stroke={INK} strokeWidth={9} />
      <path d={`M40 ${330 + breath} Q380 ${300 + breath} 720 ${330 + breath}`} stroke="#fff" strokeWidth={14} opacity={0.6} fill="none" />
    </svg>
  );
};

// ---------- Reloj digital ----------
export const DigitalClock: React.FC<{ time: string; size?: number; color?: string; blink?: boolean }> = ({ time, size = 120, color = "#FF3B4E", blink = false }) => {
  const t = useSec();
  const on = !blink || Math.floor(t * 3) % 2 === 0;
  return (
    <div style={{ background: "#14082C", border: `9px solid ${INK}`, borderRadius: size * 0.25, padding: `${size * 0.08}px ${size * 0.3}px`, boxShadow: `0 12px 0 ${INK}, 0 0 50px ${color}66`, display: "inline-block" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color, textShadow: `0 0 24px ${color}`, fontVariantNumeric: "tabular-nums", letterSpacing: 4, opacity: on ? 1 : 0.35 }}>{time}</div>
    </div>
  );
};

// ---------- Despertador clásico ----------
export const AlarmClock: React.FC<{ size?: number; ringing?: boolean; hour?: number; minute?: number; color?: string }> = ({ size = 260, ringing = false, hour = 7, minute = 0, color = C.coral }) => {
  const t = useSec();
  const shake = ringing ? Math.sin(t * 60) * 8 : 0;
  const ha = ((hour % 12) + minute / 60) * 30;
  const ma = minute * 6;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 220 240" style={{ overflow: "visible", transform: `rotate(${shake}deg)` }}>
      <circle cx={55} cy={45} r={32} fill={C.yellow} stroke={INK} strokeWidth={8} />
      <circle cx={165} cy={45} r={32} fill={C.yellow} stroke={INK} strokeWidth={8} />
      <path d="M60 210 L40 235 M160 210 L180 235" stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <circle cx={110} cy={130} r={95} fill={color} stroke={INK} strokeWidth={9} />
      <circle cx={110} cy={130} r={74} fill="#fff" stroke={INK} strokeWidth={7} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M110 64 L110 76" stroke={INK} strokeWidth={6} transform={`rotate(${i * 30} 110 130)`} />
      ))}
      <path d="M110 130 L110 88" stroke={INK} strokeWidth={9} strokeLinecap="round" transform={`rotate(${ha} 110 130)`} />
      <path d="M110 130 L110 72" stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${ma} 110 130)`} />
      <circle cx={110} cy={130} r={9} fill={INK} />
      {ringing &&
        [0, 1].map((i) => (
          <path key={i} d={i ? "M200 40 Q225 70 205 100" : "M20 40 Q-5 70 15 100"} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 20)} />
        ))}
    </svg>
  );
};

// ---------- Sol ----------
export const Sun: React.FC<{ size?: number }> = ({ size = 300 }) => {
  const t = useSec();
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <g transform={`rotate(${t * 20} 100 100)`}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M100 8 L100 36" stroke="#FFB020" strokeWidth={12} strokeLinecap="round" transform={`rotate(${i * 30} 100 100)`} />
        ))}
      </g>
      <circle cx={100} cy={100} r={55} fill={C.yellow} stroke={INK} strokeWidth={8} />
      <circle cx={82} cy={95} r={7} fill={INK} />
      <circle cx={118} cy={95} r={7} fill={INK} />
      <path d="M80 118 Q100 135 120 118" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
    </svg>
  );
};

// ---------- Científico/a con bata (genérico) ----------
export const LabPerson: React.FC<{ size?: number; hair?: string; skin?: string }> = ({ size = 240, hair = "#C98B3A", skin = "#F2C29B" }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{ overflow: "visible" }}>
    <path d="M30 280 C30 200 60 175 100 175 C140 175 170 200 170 280Z" fill="#fff" stroke={INK} strokeWidth={8} />
    <path d="M100 175 L100 280" stroke={INK} strokeWidth={5} />
    <circle cx={100} cy={110} r={58} fill={skin} stroke={INK} strokeWidth={8} />
    <path d="M42 110 Q40 45 100 45 Q160 45 158 110 Q140 75 100 75 Q60 75 42 110Z" fill={hair} stroke={INK} strokeWidth={7} />
    <circle cx={80} cy={115} r={16} fill="#fff" stroke={INK} strokeWidth={5} />
    <circle cx={120} cy={115} r={16} fill="#fff" stroke={INK} strokeWidth={5} />
    <path d="M96 115 L104 115" stroke={INK} strokeWidth={5} />
    <circle cx={82} cy={117} r={6} fill={INK} />
    <circle cx={122} cy={117} r={6} fill={INK} />
    <path d="M86 145 Q100 156 114 145" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
  </svg>
);

// ---------- Perro (de lado) ----------
export const Dog: React.FC<{ size?: number; sniff?: boolean; glow?: boolean; tail?: boolean; body?: string; patch?: string }> = ({ size = 520, sniff = false, glow = false, tail = true, body = "#D9A066", patch = "#8B5A2B" }) => {
  const t = useSec();
  const wag = tail ? Math.sin(t * 14) * 18 : 0;
  const head = sniff ? 26 + Math.sin(t * 9) * 4 : Math.sin(t * 2) * 3;
  const leg = Math.sin(t * 6) * (sniff ? 6 : 2);
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 520 390" style={{ overflow: "visible" }}>
      <ellipse cx={260} cy={372} rx={200} ry={16} fill="rgba(0,0,0,0.18)" />
      {/* cola */}
      <path d="M120 190 Q60 150 70 90" stroke={INK} strokeWidth={30} fill="none" strokeLinecap="round" transform={`rotate(${wag} 120 190)`} />
      <path d="M120 190 Q60 150 70 90" stroke={body} strokeWidth={18} fill="none" strokeLinecap="round" transform={`rotate(${wag} 120 190)`} />
      {/* patas */}
      {[150, 200, 320, 370].map((x, i) => (
        <rect key={x} x={x - 18} y={250} width={36} height={115} rx={16} fill={i % 2 ? patch : body} stroke={INK} strokeWidth={7} transform={`rotate(${i % 2 ? leg : -leg} ${x} 250)`} />
      ))}
      {/* cuerpo */}
      <ellipse cx={260} cy={215} rx={160} ry={80} fill={body} stroke={INK} strokeWidth={9} />
      <ellipse cx={220} cy={195} rx={60} ry={40} fill={patch} opacity={0.85} />
      {/* cabeza */}
      <g transform={`rotate(${head} 390 170)`}>
        <ellipse cx={420} cy={140} rx={78} ry={66} fill={body} stroke={INK} strokeWidth={9} />
        <ellipse cx={485} cy={165} rx={45} ry={32} fill="#F2D2A9" stroke={INK} strokeWidth={8} />
        <ellipse cx={520} cy={152} rx={15} ry={12} fill={INK} />
        <path d="M380 90 Q350 70 352 140 Q372 160 392 120Z" fill={patch} stroke={INK} strokeWidth={8} />
        {glow ? (
          <>
            <circle cx={440} cy={120} r={18} fill="#B8FF5C" />
            <circle cx={440} cy={120} r={30} fill="#B8FF5C" opacity={0.3} />
          </>
        ) : (
          <>
            <circle cx={440} cy={120} r={11} fill={INK} />
            <circle cx={444} cy={116} r={4} fill="#fff" />
          </>
        )}
        <path d="M470 192 Q490 205 510 190" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        {!sniff && <path d="M478 196 Q485 230 500 200" fill={C.coral} stroke={INK} strokeWidth={5} />}
      </g>
      <rect x={340} y={175} width={60} height={20} rx={10} fill={C.coral} stroke={INK} strokeWidth={6} />
    </svg>
  );
};

// ---------- Pelota ----------
export const Ball: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#E8303A" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill={color} stroke={INK} strokeWidth={7} />
    <path d="M12 38 Q50 58 88 38 M12 62 Q50 82 88 62" stroke="rgba(255,255,255,0.7)" strokeWidth={6} fill="none" />
    <circle cx={34} cy={28} r={8} fill="#fff" opacity={0.6} />
  </svg>
);

// ---------- Ojo con conos ----------
export const EyeCones: React.FC<{ size?: number; cones: string[]; label: string }> = ({ size = 420, cones, label }) => {
  const t = useSec();
  return (
    <div style={{ width: size, textAlign: "center", fontFamily: FONT }}>
      <svg width={size} height={size * 0.62} viewBox="0 0 300 186">
        <path d="M10 93 Q150 -20 290 93 Q150 206 10 93Z" fill="#fff" stroke={INK} strokeWidth={8} />
        <circle cx={150} cy={93} r={52} fill="#6B8CFF" stroke={INK} strokeWidth={7} />
        <circle cx={150} cy={93} r={24} fill={INK} />
        <circle cx={164} cy={80} r={9} fill="#fff" />
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 10 }}>
        {cones.map((c, i) => (
          <svg key={i} width={70} height={110} viewBox="0 0 70 110" style={{ transform: `translateY(${Math.sin(t * 4 + i) * 6}px)` }}>
            <path d="M35 6 L62 100 Q35 110 8 100Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <div style={{ fontWeight: 900, fontSize: 46, color: "#fff", WebkitTextStroke: `7px ${INK}`, paintOrder: "stroke fill", marginTop: 8 }}>{label}</div>
    </div>
  );
};

// ---------- Libro antiguo ----------
export const OldBook: React.FC<{ size?: number; title: string; year: string }> = ({ size = 360, title, year }) => (
  <div style={{ width: size, height: size * 1.3, background: "linear-gradient(135deg,#8B5A2B,#5E3A18)", border: `9px solid ${INK}`, borderRadius: "14px 28px 28px 14px", boxShadow: `14px 14px 0 ${INK}`, position: "relative", fontFamily: FONT, textAlign: "center", color: "#F4E2B8", filter: "sepia(0.3)" }}>
    <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 10, background: "rgba(0,0,0,0.25)" }} />
    <div style={{ marginTop: size * 0.18, fontWeight: 900, fontSize: size * 0.1, padding: "0 30px", lineHeight: 1.1 }}>{title}</div>
    <div style={{ margin: "24px auto", width: size * 0.4, height: size * 0.4, borderRadius: "50%", border: "6px solid #F4E2B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.2 }}>🐕</div>
    <div style={{ fontWeight: 900, fontSize: size * 0.14 }}>{year}</div>
  </div>
);
