import React from 'react';
import {interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {clamp} from './ui';

const S = {stroke: C.ink, strokeWidth: 8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

export type Mood = 'happy' | 'wow' | 'wink' | 'sad' | 'worried' | 'dead';

/** Ojos grandes estilo cartoon con parpadeo y mirada. */
export const Eyes: React.FC<{x?: number; y?: number; gap?: number; r?: number; look?: [number, number]; mood?: Mood; seed?: number}> = ({
  x = 0, y = 0, gap = 70, r = 34, look = [0, 0], mood = 'happy', seed = 0,
}) => {
  const f = useCurrentFrame();
  const t = (f + seed * 37) % 96;
  const blink = t < 4 ? Math.abs(t - 2) / 2 : 1;
  const eye = (cx: number, side: number) => {
    if (mood === 'dead') {
      return (
        <g key={side} transform={`translate(${cx} ${y})`}>
          <path d={`M ${-r * 0.6} ${-r * 0.6} L ${r * 0.6} ${r * 0.6} M ${r * 0.6} ${-r * 0.6} L ${-r * 0.6} ${r * 0.6}`} {...S} strokeWidth={10} fill="none" />
        </g>
      );
    }
    if (mood === 'wink' && side === 1) {
      return <path key={side} d={`M ${cx - r * 0.8} ${y + 4} Q ${cx} ${y - r * 0.9} ${cx + r * 0.8} ${y + 4}`} {...S} strokeWidth={10} fill="none" />;
    }
    const ry = r * 1.15 * blink;
    return (
      <g key={side}>
        <ellipse cx={cx} cy={y} rx={r} ry={Math.max(ry, 3)} fill={C.white} {...S} />
        {blink > 0.4 ? (
          <>
            <ellipse cx={cx + look[0] * r * 0.35} cy={y + look[1] * r * 0.35} rx={r * 0.58} ry={r * 0.66 * blink} fill={C.ink} />
            <circle cx={cx + look[0] * r * 0.35 + r * 0.2} cy={y + look[1] * r * 0.35 - r * 0.25} r={r * 0.2} fill={C.white} />
          </>
        ) : null}
        {mood === 'worried' || mood === 'sad' ? (
          <path d={`M ${cx - r} ${y - r * 1.5 + (side ? -r * 0.3 : r * 0.3)} L ${cx + r} ${y - r * 1.5 + (side ? r * 0.3 : -r * 0.3)}`} {...S} strokeWidth={9} fill="none" />
        ) : null}
      </g>
    );
  };
  return <g transform={`translate(${x} 0)`}>{eye(-gap / 2, 0)}{eye(gap / 2, 1)}</g>;
};

export const Mouth: React.FC<{y?: number; w?: number; mood?: Mood; open?: number}> = ({y = 0, w = 60, mood = 'happy', open = 0}) => {
  if (mood === 'wow') return <ellipse cx={0} cy={y + 10} rx={w * 0.32} ry={w * 0.42} fill={C.ink} />;
  if (mood === 'sad' || mood === 'worried' || mood === 'dead')
    return <path d={`M ${-w / 2} ${y + 18} Q 0 ${y - 16} ${w / 2} ${y + 18}`} {...S} strokeWidth={9} fill="none" />;
  const h = 26 + open * 30;
  return (
    <g>
      <path d={`M ${-w / 2} ${y} Q 0 ${y + h * 1.6} ${w / 2} ${y} Z`} fill={C.ink} {...S} strokeWidth={7} />
      <path d={`M ${-w * 0.22} ${y + h * 0.75} Q 0 ${y + h * 0.45} ${w * 0.22} ${y + h * 0.75} Q 0 ${y + h * 1.15} ${-w * 0.22} ${y + h * 0.75}`} fill="#FF6B8B" />
    </g>
  );
};

const Cheeks: React.FC<{y: number; gap: number}> = ({y, gap}) => (
  <g opacity={0.55}>
    <ellipse cx={-gap} cy={y} rx={22} ry={13} fill="#FF7A7A" />
    <ellipse cx={gap} cy={y} rx={22} ry={13} fill="#FF7A7A" />
  </g>
);

/** Tarro de miel con cara. Origen: centro del cuerpo. */
export const HoneyJar: React.FC<{
  mood?: Mood; look?: [number, number]; crystal?: number; pale?: boolean; arms?: 'none' | 'wave' | 'up'; label?: string; talk?: boolean; seed?: number; glow?: number;
}> = ({mood = 'happy', look = [0, 0], crystal = 0, pale = false, arms = 'none', label = 'MIEL', talk = false, seed = 0, glow = 0}) => {
  const f = useCurrentFrame();
  const body = 'M -150 -130 Q -175 -130 -175 -95 L -175 125 Q -175 185 -115 185 L 115 185 Q 175 185 175 125 L 175 -95 Q 175 -130 150 -130 Z';
  const fill = pale ? '#F6E7A6' : interpolateColors(crystal, [0, 1], [C.amber, '#F2C46B']);
  const top = pale ? '#FFF3C4' : interpolateColors(crystal, [0, 1], [C.honey, '#FBE3A6']);
  const wave = Math.sin(f * 0.35) * 25;
  const open = talk ? (Math.sin(f * 0.9) + 1) / 2 : 0;
  const id = `jar${seed}${pale ? 'p' : ''}`;
  return (
    <g>
      {glow > 0 ? <circle r={330} fill={C.honeyLight} opacity={0.25 * glow} /> : null}
      {arms !== 'none' ? (
        <g {...S} strokeWidth={14} fill="none">
          <path d="M -170 20 Q -235 30 -250 -20" />
          <path d={arms === 'wave' ? `M 170 20 Q 240 0 ${255 + wave * 0.3} ${-90 + wave}` : 'M 170 20 Q 240 0 255 -70'} />
          <circle cx={-250} cy={-26} r={20} fill={C.cream} strokeWidth={8} />
          <circle cx={arms === 'wave' ? 255 + wave * 0.3 : 255} cy={arms === 'wave' ? -96 + wave : -76} r={20} fill={C.cream} strokeWidth={8} />
        </g>
      ) : null}
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={fill} />
        </linearGradient>
        <clipPath id={id + 'c'}>
          <path d={body} />
        </clipPath>
      </defs>
      {/* cuello y tapa */}
      <rect x={-118} y={-168} width={236} height={50} rx={14} fill={top} {...S} />
      <rect x={-140} y={-232} width={280} height={74} rx={22} fill={C.brown} {...S} />
      <rect x={-140} y={-205} width={280} height={18} fill="#A8643A" />
      <rect x={-140} y={-232} width={280} height={74} rx={22} fill="none" {...S} />
      <path d={body} fill={`url(#${id})`} {...S} />
      <g clipPath={`url(#${id}c)`}>
        <path d="M -120 -100 Q -140 0 -128 120" stroke={C.white} strokeWidth={22} strokeLinecap="round" fill="none" opacity={0.45} />
        <circle cx={-110} cy={-105} r={9} fill={C.white} opacity={0.6} />
        {crystal > 0
          ? new Array(26).fill(0).map((_, i) => {
              const cx = -160 + random(`cr${i}`) * 320;
              const cy = -120 + random(`cy${i}`) * 300;
              const s = 10 + random(`cs${i}`) * 18;
              return (
                <path key={i} d={`M ${cx} ${cy - s} L ${cx + s * 0.87} ${cy - s / 2} L ${cx + s * 0.87} ${cy + s / 2} L ${cx} ${cy + s} L ${cx - s * 0.87} ${cy + s / 2} L ${cx - s * 0.87} ${cy - s / 2} Z`}
                  fill={C.white} opacity={0.75 * crystal} />
              );
            })
          : null}
      </g>
      {/* goteo de miel sobre la tapa */}
      {!pale ? (
        <path d="M -60 -170 Q -60 -128 -48 -128 Q -36 -128 -36 -150 Q -36 -118 -24 -118 Q -12 -118 -12 -170 Z" fill={C.honey} {...S} strokeWidth={6} />
      ) : null}
      {/* etiqueta */}
      {label ? (
        <g>
          <rect x={-95} y={95} width={190} height={62} rx={18} fill={C.cream} {...S} strokeWidth={6} />
          <text x={0} y={140} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={label.length > 5 ? 30 : 38} fill={C.ink}>{label}</text>
        </g>
      ) : null}
      <Eyes y={-35} gap={110} r={36} look={look} mood={mood} seed={seed} />
      <Cheeks y={20} gap={95} />
      <Mouth y={28} w={70} mood={mood} open={open} />
    </g>
  );
};

/** Abeja simpática. Origen: centro del cuerpo. */
export const Bee: React.FC<{flip?: boolean; mood?: Mood; look?: [number, number]; seed?: number}> = ({flip = false, mood = 'happy', look = [0, 0], seed = 0}) => {
  const f = useCurrentFrame();
  const flap = 0.55 + Math.abs(Math.sin(f * 1.3 + seed)) * 0.45;
  return (
    <g transform={flip ? 'scale(-1 1)' : undefined}>
      <g transform={`translate(-20 -80) scale(1 ${flap})`}>
        <ellipse cx={-30} cy={-50} rx={52} ry={78} fill="#DDF6FF" opacity={0.85} {...S} strokeWidth={6} transform="rotate(-25 -30 -50)" />
        <ellipse cx={40} cy={-45} rx={46} ry={70} fill="#DDF6FF" opacity={0.85} {...S} strokeWidth={6} transform="rotate(20 40 -45)" />
      </g>
      <path d="M -150 10 L -205 25 L -150 40 Z" fill={C.ink} />
      <defs>
        <clipPath id={`bee${seed}`}>
          <ellipse cx={0} cy={20} rx={150} ry={112} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={20} rx={150} ry={112} fill={C.honey} />
      <g clipPath={`url(#bee${seed})`}>
        <rect x={-95} y={-120} width={42} height={260} fill={C.ink} />
        <rect x={-20} y={-120} width={42} height={260} fill={C.ink} />
      </g>
      <ellipse cx={0} cy={20} rx={150} ry={112} fill="none" {...S} />
      {/* cabeza */}
      <circle cx={120} cy={-10} r={92} fill={C.honeyLight} {...S} />
      <path d="M 95 -95 Q 80 -150 50 -165" {...S} strokeWidth={7} fill="none" />
      <path d="M 145 -95 Q 160 -150 195 -160" {...S} strokeWidth={7} fill="none" />
      <circle cx={50} cy={-165} r={12} fill={C.ink} />
      <circle cx={195} cy={-160} r={12} fill={C.ink} />
      <g transform="translate(125 -25)">
        <Eyes gap={70} r={26} look={look} mood={mood} seed={seed + 3} />
        <Cheeks y={38} gap={58} />
        <g transform="translate(0 30)"><Mouth w={44} mood={mood} /></g>
      </g>
    </g>
  );
};

/** Bacteria con mala pinta; dry: 0 → 1 se deshidrata. */
export const Bacteria: React.FC<{dry?: number; seed?: number; r?: number}> = ({dry = 0, seed = 0, r = 90}) => {
  const f = useCurrentFrame();
  const n = 48;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + 0.08 * Math.sin(a * 5 + f * 0.15 + seed) + dry * 0.1 * Math.sin(a * 13 + seed));
    d += `${i === 0 ? 'M' : 'L'} ${Math.cos(a) * rr * 1.15} ${Math.sin(a) * rr} `;
  }
  const col = interpolateColors(dry, [0, 1], ['#9BE15D', '#B9A27C']);
  const sc = interpolate(dry, [0, 1], [1, 0.55], clamp);
  return (
    <g transform={`scale(${sc})`}>
      {new Array(8).fill(0).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + seed;
        const w = Math.sin(f * 0.3 + i) * 0.2;
        return (
          <line key={i} x1={Math.cos(a) * r} y1={Math.sin(a) * r * 0.9} x2={Math.cos(a + w) * r * 1.45} y2={Math.sin(a + w) * r * 1.3} {...S} strokeWidth={7} />
        );
      })}
      <path d={d + 'Z'} fill={col} {...S} />
      <circle cx={-r * 0.55} cy={r * 0.45} r={r * 0.12} fill="#000" opacity={0.15} />
      <circle cx={r * 0.6} cy={r * 0.35} r={r * 0.09} fill="#000" opacity={0.15} />
      <g transform={`translate(0 ${-r * 0.15})`}>
        <Eyes gap={r * 0.7} r={r * 0.24} mood={dry > 0.85 ? 'dead' : 'worried'} seed={seed} />
      </g>
      <g transform={`translate(0 ${r * 0.35})`}><Mouth w={r * 0.5} mood={dry > 0.3 ? 'sad' : 'wow'} /></g>
    </g>
  );
};

/** Naranja con cara. */
export const Orange: React.FC<{mood?: Mood; seed?: number}> = ({mood = 'happy', seed = 0}) => (
  <g>
    <circle r={150} fill="#FF9F1C" {...S} />
    <path d="M -95 -80 Q -120 -20 -100 50" stroke={C.white} strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.35} />
    {new Array(14).fill(0).map((_, i) => (
      <circle key={i} cx={(random(`o${i}`) - 0.5) * 220} cy={(random(`oy${i}`) - 0.5) * 220} r={4} fill="#E07A00" opacity={0.6} />
    ))}
    <path d="M 0 -150 Q 10 -185 0 -200" {...S} fill="none" />
    <path d="M 5 -185 Q 60 -230 110 -190 Q 60 -160 5 -185 Z" fill={C.green} {...S} strokeWidth={7} />
    <Eyes y={-25} gap={95} r={30} mood={mood} seed={seed} />
    <Cheeks y={25} gap={80} />
    <Mouth y={30} w={60} mood={mood} />
  </g>
);

/** Arqueólogo con salacot y antorcha. Origen: centro del cuerpo. */
export const Explorer: React.FC<{seed?: number; look?: [number, number]}> = ({seed = 0, look = [1, 0]}) => {
  const f = useCurrentFrame();
  const fl = Math.sin(f * 0.6) * 6;
  return (
    <g>
      {/* antorcha */}
      <g transform="translate(-170 -40) rotate(-12)">
        <rect x={-14} y={-20} width={28} height={190} rx={10} fill={C.brown} {...S} />
        <path d={`M 0 ${-130 + fl} Q 50 -60 22 -20 L -22 -20 Q -50 -60 0 ${-130 + fl} Z`} fill={C.amber} {...S} strokeWidth={6} />
        <path d={`M 0 ${-90 + fl} Q 25 -50 10 -24 L -10 -24 Q -25 -50 0 ${-90 + fl} Z`} fill={C.honeyLight} />
      </g>
      <path d="M -130 100 Q -130 -10 0 -10 Q 130 -10 130 100 L 130 200 L -130 200 Z" fill="#C9A66B" {...S} />
      <path d="M -40 -10 L 0 60 L 40 -10" fill="#E8D3A3" {...S} strokeWidth={6} />
      <path d="M -130 40 Q -175 20 -170 -30" {...S} strokeWidth={16} fill="none" />
      <circle cx={0} cy={-120} r={105} fill={C.skin} {...S} />
      {/* salacot */}
      <path d="M -150 -150 Q 0 -190 150 -150 Q 0 -130 -150 -150 Z" fill="#B88B4A" {...S} />
      <path d="M -95 -160 Q -95 -265 0 -265 Q 95 -265 95 -160 Z" fill="#D9B06A" {...S} />
      <rect x={-95} y={-180} width={190} height={20} fill={C.brown} />
      <g transform="translate(0 -110)">
        <Eyes gap={80} r={28} look={look} mood="happy" seed={seed} />
        <path d="M -45 42 Q -20 25 0 40 Q 20 25 45 42 Q 20 58 0 48 Q -20 58 -45 42 Z" fill={C.brown} {...S} strokeWidth={5} />
      </g>
    </g>
  );
};
