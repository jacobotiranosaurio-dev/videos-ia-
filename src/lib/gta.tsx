import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, useSec } from "./core";

const INK = C.ink;
export const N = {
  sky1: "#0B0420",
  sky2: "#3A0A63",
  magenta: "#FF2E88",
  cyan: "#22E3FF",
  purple: "#8A2BE2",
  red: "#FF2D3D",
  blue: "#2D6BFF",
  gold: "#FFC93C",
  car: "#1EE3CF",
};

// ---------- Ciudad de neón con carretera en perspectiva ----------
export const NeonCity: React.FC<{ speed?: number; sirens?: boolean; tint?: string; road?: boolean }> = ({
  speed = 1,
  sirens = false,
  tint,
  road = true,
}) => {
  const t = useSec();
  const horizon = 1180;
  const buildings = React.useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const r = Math.abs(Math.sin(i * 91.7) * 1000) % 1;
        return { x: i * 52 - 20, w: 46 + (i % 3) * 14, h: 220 + r * 420, layer: i % 2 };
      }),
    [],
  );
  const flash = Math.floor(t * 5) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${N.sky1} 0%, ${N.sky2} 45%, #A0177A 62%, ${N.sky1} 62.2%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {/* sol synthwave */}
        <defs>
          <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD93C" />
            <stop offset="1" stopColor={N.magenta} />
          </linearGradient>
        </defs>
        <circle cx={540} cy={horizon - 120} r={260} fill="url(#sun)" opacity={0.9} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={260} y={horizon - 220 + i * 34 + ((t * 20) % 34)} width={560} height={6 + i * 2} fill="#A0177A" />
        ))}
        {/* estrellas del cielo */}
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 137) % 1080} cy={(i * 241) % 700} r={1.5 + (i % 3)} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />
        ))}
        {/* edificios */}
        {buildings.map((b, i) => {
          const off = Math.sin(t * 0.2) * (b.layer ? 12 : 24);
          return (
            <g key={i} transform={`translate(${off} 0)`}>
              <rect x={b.x} y={horizon - b.h} width={b.w} height={b.h} fill={b.layer ? "#1C0A3D" : "#2A0F55"} stroke={b.layer ? "none" : N.magenta} strokeOpacity={0.35} strokeWidth={2} />
              {Array.from({ length: Math.floor(b.h / 36) }, (_, k) =>
                [0, 1].map((c) => {
                  const on = Math.sin(i * 7 + k * 3 + c) > 0.1;
                  return on ? <rect key={`${k}-${c}`} x={b.x + 8 + c * (b.w / 2 - 4)} y={horizon - b.h + 14 + k * 36} width={b.w / 2 - 14} height={14} fill={k % 3 ? N.cyan : "#FFB3E0"} opacity={0.55} /> : null;
                }),
              )}
            </g>
          );
        })}
        {/* palmeras */}
        {[60, 1010].map((x, i) => (
          <g key={x} transform={`translate(${x} ${horizon}) rotate(${Math.sin(t + i) * 3})`}>
            <path d="M0 0 C-6 -120 6 -240 0 -330" stroke="#140628" strokeWidth={18} fill="none" />
            {[-60, -25, 15, 50, 80].map((a, k) => (
              <path key={k} d="M0 -330 q60 -30 130 20 q-70 -15 -130 -10z" fill="#140628" transform={`rotate(${a + 180 * (k % 2)} 0 -330)`} />
            ))}
          </g>
        ))}
        {/* carretera */}
        {road && (
          <g>
            <path d={`M500 ${horizon} L580 ${horizon} L1300 1920 L-220 1920Z`} fill="#140A2A" />
            <path d={`M500 ${horizon} L-220 1920`} stroke={N.magenta} strokeWidth={8} />
            <path d={`M580 ${horizon} L1300 1920`} stroke={N.magenta} strokeWidth={8} />
            {Array.from({ length: 8 }, (_, i) => {
              const p = (((i / 8 + t * 0.9 * speed) % 1) + 1) % 1;
              const z = p * p;
              const y = horizon + z * (1920 - horizon);
              const h = 10 + z * 140;
              const w = 4 + z * 26;
              return <rect key={i} x={540 - w / 2} y={y} width={w} height={h} fill={N.gold} opacity={0.9} />;
            })}
            {/* rejilla del suelo */}
            {Array.from({ length: 10 }, (_, i) => {
              const p = (((i / 10 + t * 0.9 * speed) % 1) + 1) % 1;
              const y = horizon + p * p * (1920 - horizon);
              return <path key={i} d={`M-300 ${y} L1380 ${y}`} stroke={N.purple} strokeWidth={2} opacity={0.35} />;
            })}
          </g>
        )}
      </svg>
      {tint && <AbsoluteFill style={{ background: tint }} />}
      {sirens && (
        <AbsoluteFill
          style={{
            background: flash
              ? `radial-gradient(circle at 0% 60%, rgba(255,45,61,0.55), transparent 55%)`
              : `radial-gradient(circle at 100% 60%, rgba(45,107,255,0.55), transparent 55%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ---------- Coche deportivo (vista trasera) ----------
export const SportsCar: React.FC<{ size?: number; color?: string }> = ({ size = 560, color = N.car }) => {
  const t = useSec();
  const bounce = Math.sin(t * 18) * 2;
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 400 220" style={{ overflow: "visible" }}>
      <ellipse cx={200} cy={205} rx={190} ry={16} fill="rgba(0,0,0,0.5)" />
      <g transform={`translate(0 ${bounce})`}>
        <rect x={40} y={150} width={60} height={50} rx={12} fill="#120822" />
        <rect x={300} y={150} width={60} height={50} rx={12} fill="#120822" />
        <path d="M95 60 Q110 20 200 18 Q290 20 305 60 L330 100 L70 100Z" fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M118 62 Q130 34 200 32 Q270 34 282 62Z" fill="#2A1550" stroke={INK} strokeWidth={5} />
        <path d="M20 110 Q30 92 70 96 L330 96 Q370 92 380 110 L384 160 Q380 175 360 175 L40 175 Q20 175 16 160Z" fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <rect x={40} y={112} width={95} height={22} rx={10} fill={N.red} />
        <rect x={265} y={112} width={95} height={22} rx={10} fill={N.red} />
        <rect x={40} y={112} width={95} height={22} rx={10} fill="none" stroke="#FF8A95" strokeWidth={3} />
        <rect x={265} y={112} width={95} height={22} rx={10} fill="none" stroke="#FF8A95" strokeWidth={3} />
        <rect x={160} y={140} width={80} height={24} rx={5} fill="#fff" stroke={INK} strokeWidth={4} />
        <text x={200} y={158} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={16} fill={INK}>OJO 6</text>
        <path d="M60 70 L340 70" stroke={INK} strokeWidth={0} />
      </g>
      {/* luces traseras con resplandor */}
      <ellipse cx={88} cy={123 + bounce} rx={70} ry={26} fill={N.red} opacity={0.25 + 0.1 * Math.sin(t * 6)} />
      <ellipse cx={312} cy={123 + bounce} rx={70} ry={26} fill={N.red} opacity={0.25 + 0.1 * Math.sin(t * 6)} />
    </svg>
  );
};

// ---------- Estrella ----------
const starPath = (cx: number, cy: number, R: number, r: number) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r : R;
    d += `${i ? "L" : "M"}${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr} `;
  }
  return d + "Z";
};
export const Star: React.FC<{ size?: number; on?: boolean; color?: string; glow?: boolean }> = ({ size = 120, on = true, color = "#fff", glow = true }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    {on && glow && <path d={starPath(50, 52, 54, 24)} fill={color} opacity={0.35} />}
    <path d={starPath(50, 52, 44, 19)} fill={on ? color : "rgba(255,255,255,0.08)"} stroke={on ? INK : "rgba(255,255,255,0.75)"} strokeWidth={on ? 6 : 4} strokeLinejoin="round" />
  </svg>
);

// ---------- Fila de 6 estrellas (HUD) ----------
export const StarsHUD: React.FC<{ count: number; lit6?: "none" | "ghost" | "gold"; locked?: boolean; changedAt?: number; size?: number }> = ({
  count,
  lit6 = "none",
  locked = false,
  changedAt = -9,
  size = 128,
}) => {
  const t = useSec();
  const flash = Math.floor(t * 6) % 2 === 0;
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", position: "relative" }}>
      {Array.from({ length: 6 }, (_, i) => {
        const on = i < count;
        const is6 = i === 5;
        let color = "#fff";
        if (count >= 6 || (is6 && lit6 === "gold")) color = N.gold;
        else if (on && flash && count >= 3) color = i % 2 ? "#FFB3B3" : "#B3C8FF";
        const pop = Math.max(0, 1 - Math.abs(t - changedAt - i * 0.06) * 6);
        const ghost = is6 && !on && lit6 === "ghost";
        return (
          <div key={i} style={{ transform: `scale(${1 + pop * 0.35 + (ghost ? Math.sin(t * 8) * 0.08 : 0)})`, opacity: ghost ? 0.6 + Math.sin(t * 8) * 0.4 : 1 }}>
            <Star size={size} on={on || (is6 && lit6 === "gold")} color={ghost ? N.red : color} />
          </div>
        );
      })}
      {locked && (
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-30%) rotate(${Math.sin(t * 3) * 5}deg)` }}>
          <Padlock size={150} />
        </div>
      )}
    </div>
  );
};

export const Padlock: React.FC<{ size?: number }> = ({ size = 150 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <path d="M25 50 V32 a25 25 0 0 1 50 0 V50" stroke={INK} strokeWidth={14} fill="none" />
    <path d="M25 50 V32 a25 25 0 0 1 50 0 V50" stroke="#C9C9D6" strokeWidth={7} fill="none" />
    <rect x={10} y={48} width={80} height={62} rx={14} fill={N.gold} stroke={INK} strokeWidth={6} />
    <circle cx={50} cy={74} r={9} fill={INK} />
    <rect x={46} y={76} width={8} height={18} rx={3} fill={INK} />
  </svg>
);

// ---------- Policía ----------
export const Cop: React.FC<{ size?: number; fallen?: number }> = ({ size = 300, fallen = 0 }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 200 320" style={{ overflow: "visible", transform: `rotate(${fallen * -88}deg)`, transformOrigin: "50% 100%" }}>
    <rect x={62} y={200} width={34} height={110} rx={12} fill="#1E2A5A" stroke={INK} strokeWidth={6} />
    <rect x={104} y={200} width={34} height={110} rx={12} fill="#1E2A5A" stroke={INK} strokeWidth={6} />
    <rect x={45} y={105} width={110} height={110} rx={28} fill="#2D4BB8" stroke={INK} strokeWidth={7} />
    <path d="M100 115 l8 16 18 2 -13 12 4 18 -17 -9 -17 9 4 -18 -13 -12 18 -2z" fill={N.gold} stroke={INK} strokeWidth={3} />
    <circle cx={100} cy={70} r={42} fill="#E8B48A" stroke={INK} strokeWidth={7} />
    <path d="M52 52 Q100 0 148 52 L150 62 L50 62Z" fill="#1E2A5A" stroke={INK} strokeWidth={6} />
    <rect x={44} y={56} width={112} height={12} rx={6} fill="#14204A" />
    {fallen > 0.5 ? (
      <>
        <path d="M80 72 l12 12 M92 72 l-12 12 M108 72 l12 12 M120 72 l-12 12" stroke={INK} strokeWidth={5} />
      </>
    ) : (
      <>
        <circle cx={86} cy={78} r={6} fill={INK} />
        <circle cx={114} cy={78} r={6} fill={INK} />
      </>
    )}
  </svg>
);

// ---------- Furgón SWAT ----------
export const SwatVan: React.FC<{ size?: number }> = ({ size = 360 }) => {
  const t = useSec();
  const f = Math.floor(t * 6) % 2 === 0;
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 360 225" style={{ overflow: "visible" }}>
      <rect x={20} y={40} width={320} height={150} rx={22} fill="#20232E" stroke={INK} strokeWidth={8} />
      <rect x={50} y={65} width={110} height={55} rx={8} fill="#5C6BA8" stroke={INK} strokeWidth={5} />
      <rect x={200} y={65} width={110} height={55} rx={8} fill="#5C6BA8" stroke={INK} strokeWidth={5} />
      <text x={180} y={165} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#fff">SWAT</text>
      <rect x={120} y={18} width={55} height={24} rx={8} fill={f ? N.red : "#5A1A20"} stroke={INK} strokeWidth={5} />
      <rect x={185} y={18} width={55} height={24} rx={8} fill={!f ? N.blue : "#1A2A5A"} stroke={INK} strokeWidth={5} />
      <circle cx={80} cy={195} r={28} fill="#111" stroke={INK} strokeWidth={6} />
      <circle cx={280} cy={195} r={28} fill="#111" stroke={INK} strokeWidth={6} />
    </svg>
  );
};

// ---------- Barrera ----------
export const Barrier: React.FC<{ size?: number }> = ({ size = 380 }) => (
  <svg width={size} height={size * 0.45} viewBox="0 0 380 170">
    <rect x={30} y={100} width={22} height={70} fill="#ddd" stroke={INK} strokeWidth={5} />
    <rect x={328} y={100} width={22} height={70} fill="#ddd" stroke={INK} strokeWidth={5} />
    <rect x={10} y={40} width={360} height={60} rx={10} fill="#fff" stroke={INK} strokeWidth={7} />
    {Array.from({ length: 6 }, (_, i) => (
      <path key={i} d={`M${20 + i * 60} 95 L${60 + i * 60} 45 L${90 + i * 60} 45 L${50 + i * 60} 95Z`} fill={N.red} />
    ))}
    <rect x={10} y={40} width={360} height={60} rx={10} fill="none" stroke={INK} strokeWidth={7} />
  </svg>
);

// ---------- Helicóptero con foco ----------
export const Heli: React.FC<{ size?: number; beam?: boolean }> = ({ size = 360, beam = true }) => {
  const t = useSec();
  const rot = Math.sin(t * 40) * 160;
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 360 580" style={{ overflow: "visible" }}>
      {beam && <path d={`M170 130 L${40 + Math.sin(t * 1.5) * 60} 580 L${300 + Math.sin(t * 1.5) * 60} 580Z`} fill="#FFF7C2" opacity={0.25} />}
      <path d="M220 90 L340 70 L345 85 L230 110Z" fill="#20232E" stroke={INK} strokeWidth={6} />
      <ellipse cx={160} cy={100} rx={110} ry={55} fill="#2B2F45" stroke={INK} strokeWidth={8} />
      <path d="M80 90 Q100 55 150 52 L150 100 L75 105Z" fill="#7FD6FF" stroke={INK} strokeWidth={6} />
      <rect x={150} y={30} width={20} height={22} fill={INK} />
      <rect x={160 - rot} y={20} width={rot * 2} height={10} rx={5} fill={INK} transform={`translate(${rot < 0 ? 0 : 0} 0)`} />
      <path d="M90 160 L260 160 M120 150 L110 160 M220 150 L230 160" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <circle cx={170} cy={140} r={10} fill="#FFF7C2" stroke={INK} strokeWidth={4} />
    </svg>
  );
};

// ---------- Camión militar ----------
export const ArmyTruck: React.FC<{ size?: number }> = ({ size = 420 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 420 250">
    <path d="M20 60 Q20 30 60 30 L270 30 L270 190 L20 190Z" fill="#4E6B2E" stroke={INK} strokeWidth={8} />
    <path d="M40 60 L250 60 M40 100 L250 100 M40 140 L250 140" stroke="#3B5222" strokeWidth={10} />
    <path d="M270 80 L360 80 L400 130 L400 190 L270 190Z" fill="#5E7D38" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M300 95 L350 95 L378 128 L300 128Z" fill="#7FD6FF" stroke={INK} strokeWidth={5} />
    {[80, 200, 340].map((x) => (
      <circle key={x} cx={x} cy={200} r={34} fill="#141414" stroke={INK} strokeWidth={7} />
    ))}
  </svg>
);

// ---------- Tanque ----------
export const Tank: React.FC<{ size?: number; tracker?: boolean }> = ({ size = 520, tracker = false }) => {
  const t = useSec();
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 500 310" style={{ overflow: "visible" }}>
      {tracker &&
        [0, 1, 2].map((i) => {
          const p = ((t * 0.8 + i / 3) % 1);
          return <circle key={i} cx={250} cy={120} r={40 + p * 260} fill="none" stroke={N.red} strokeWidth={8} opacity={1 - p} />;
        })}
      <rect x={250} y={95} width={230} height={26} rx={10} fill="#556B2F" stroke={INK} strokeWidth={7} />
      <path d="M150 140 Q160 70 250 70 Q330 70 345 140Z" fill="#6B8E3A" stroke={INK} strokeWidth={8} />
      <path d="M40 150 L460 150 L430 220 L70 220Z" fill="#5A7A30" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <rect x={40} y={215} width={420} height={70} rx={35} fill="#2A2A2A" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={85 + i * 55} cy={250} r={20} fill="#555" stroke={INK} strokeWidth={5} transform={`rotate(${t * 300} ${85 + i * 55} 250)`} />
      ))}
      <path d="M190 105 L215 105" stroke={INK} strokeWidth={6} />
      {tracker && <circle cx={250} cy={60} r={14} fill={Math.floor(t * 4) % 2 ? N.red : "#fff"} stroke={INK} strokeWidth={5} />}
    </svg>
  );
};

// ---------- Mapa de península (ficticio) ----------
export const PeninsulaMap: React.FC<{ heat?: number; size?: number }> = ({ heat = 0, size = 760 }) => {
  const t = useSec();
  const d =
    "M120 60 L640 60 L660 140 L600 170 L560 260 L590 360 L620 470 L610 580 L560 690 L500 770 L440 800 L400 760 L380 660 L330 560 L280 470 L230 380 L160 300 L110 260 L80 180Z";
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 720 810" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="land">
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill="#2B1660" stroke={N.cyan} strokeWidth={8} strokeLinejoin="round" />
      <g clipPath="url(#land)">
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={`M0 ${i * 60} L720 ${i * 60 + 40}`} stroke={N.cyan} strokeWidth={2} opacity={0.25} />
        ))}
        <circle cx={520} cy={700} r={heat * 1100} fill={N.red} opacity={0.55 + Math.sin(t * 6) * 0.1} />
      </g>
      <circle cx={520} cy={700} r={12} fill="#fff" />
      <text x={360} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">LEONIDA</text>
    </svg>
  );
};

// ---------- Esposas ----------
export const Cuffs: React.FC<{ size?: number }> = ({ size = 320 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 320 220">
    <path d="M120 110 Q160 70 200 110" stroke="#C9C9D6" strokeWidth={14} fill="none" strokeDasharray="18 8" />
    <circle cx={80} cy={120} r={62} fill="none" stroke={INK} strokeWidth={30} />
    <circle cx={80} cy={120} r={62} fill="none" stroke="#C9C9D6" strokeWidth={18} />
    <circle cx={240} cy={120} r={62} fill="none" stroke={INK} strokeWidth={30} />
    <circle cx={240} cy={120} r={62} fill="none" stroke="#C9C9D6" strokeWidth={18} />
  </svg>
);

// ---------- Lápida ----------
export const Tomb: React.FC<{ size?: number }> = ({ size = 300 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 300 330">
    <path d="M40 320 L40 120 Q40 20 150 20 Q260 20 260 120 L260 320Z" fill="#8C8CA6" stroke={INK} strokeWidth={9} />
    <text x={150} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={INK}>R.I.P.</text>
    <rect x={10} y={300} width={280} height={26} rx={10} fill="#3C6E2E" stroke={INK} strokeWidth={6} />
  </svg>
);

// ---------- Iconos rojos de "te delata" ----------
export const ClueIcon: React.FC<{ kind: "shirt" | "car" | "face" | "cam"; ok?: boolean; size?: number }> = ({ kind, ok = false, size = 190 }) => {
  const col = ok ? C.mint : N.red;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <circle cx={100} cy={100} r={88} fill={col} stroke={INK} strokeWidth={9} />
      <g fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round">
        {kind === "shirt" && <path d="M70 55 L50 70 L35 100 L58 112 L62 100 L62 150 L138 150 L138 100 L142 112 L165 100 L150 70 L130 55 Q100 80 70 55Z" fill={ok ? "#FFD23F" : "#fff"} />}
        {kind === "car" && (
          <>
            <path d="M40 120 L50 90 Q55 78 70 78 L130 78 Q145 78 150 90 L160 120 L160 140 L40 140Z" fill={ok ? C.sky : "#fff"} />
            <circle cx={68} cy={142} r={13} fill={INK} />
            <circle cx={132} cy={142} r={13} fill={INK} />
          </>
        )}
        {kind === "face" && (
          <>
            <circle cx={100} cy={100} r={45} />
            <circle cx={84} cy={94} r={5} fill={INK} />
            <circle cx={116} cy={94} r={5} fill={INK} />
            <path d="M84 118 Q100 128 116 118" fill="none" />
          </>
        )}
        {kind === "cam" && (
          <>
            <rect x={45} y={80} width={80} height={45} rx={8} transform="rotate(-15 85 102)" />
            <path d="M125 85 L160 70 L160 120Z" />
          </>
        )}
      </g>
      {ok && <path d="M140 40 l14 14 26 -30" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" />}
    </svg>
  );
};

// ---------- Trofeo ----------
export const Trophy: React.FC<{ size?: number }> = ({ size = 340 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 300 330">
    <path d="M70 40 L230 40 L220 150 Q150 210 80 150Z" fill={N.gold} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M70 60 Q20 60 30 110 Q40 150 85 150 M230 60 Q280 60 270 110 Q260 150 215 150" stroke={INK} strokeWidth={14} fill="none" />
    <path d="M70 60 Q20 60 30 110 Q40 150 85 150 M230 60 Q280 60 270 110 Q260 150 215 150" stroke={N.gold} strokeWidth={6} fill="none" />
    <rect x={130} y={180} width={40} height={60} fill={N.gold} stroke={INK} strokeWidth={8} />
    <rect x={85} y={240} width={130} height={50} rx={10} fill="#8A5A1A" stroke={INK} strokeWidth={8} />
    <path d="M110 80 Q115 60 135 55" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
  </svg>
);

// ---------- Barrotes de cárcel ----------
export const Bars: React.FC<{ drop: number }> = ({ drop }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    <g transform={`translate(0 ${(drop - 1) * 1400})`}>
      <rect x={120} y={560} width={840} height={30} rx={12} fill="#6E6E86" stroke={INK} strokeWidth={8} />
      <rect x={120} y={1420} width={840} height={30} rx={12} fill="#6E6E86" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={150 + i * 125} y={570} width={34} height={870} rx={14} fill="#9A9AB2" stroke={INK} strokeWidth={8} />
      ))}
    </g>
  </svg>
);

// ---------- Móvil para el CTA ----------
export const Phone: React.FC<{ size?: number; children?: React.ReactNode }> = ({ size = 360, children }) => (
  <div style={{ width: size, height: size * 1.9, background: "#14082C", border: `12px solid ${INK}`, borderRadius: 56, boxShadow: `0 16px 0 ${INK}, 0 0 60px ${N.magenta}`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: "50%", width: 90, height: 22, background: INK, borderRadius: 12, transform: "translateX(-50%)" }} />
    {children}
  </div>
);
