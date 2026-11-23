import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const usePop = (at: number, config = {damping: 9, stiffness: 160, mass: 0.8}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config});
};

/** Escala desde 0 con rebote (spring) alrededor de (x, y). */
export const Pop: React.FC<{x: number; y: number; at: number; rot?: number; children: React.ReactNode; out?: number}> = ({
  x, y, at, rot = 0, children, out,
}) => {
  const frame = useCurrentFrame();
  const s = usePop(at);
  const o = out !== undefined ? interpolate(frame, [out, out + 6], [1, 0], clamp) : 1;
  const r = interpolate(s, [0, 1], [rot - 18, rot]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (out !== undefined ? interpolate(frame, [out, out + 6], [1, 0.6], clamp) : 1)}) rotate(${r})`} opacity={o}>
      {children}
    </g>
  );
};

/** Balanceo / flotación continua. */
export const Float: React.FC<{amp?: number; speed?: number; phase?: number; rotAmp?: number; children: React.ReactNode}> = ({
  amp = 12, speed = 0.08, phase = 0, rotAmp = 0, children,
}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(0 ${Math.sin(f * speed + phase) * amp}) rotate(${Math.sin(f * speed * 0.7 + phase) * rotAmp})`}>{children}</g>
  );
};

export const Label: React.FC<{
  text: string; x: number; y: number; at: number; size?: number; bg?: string; fg?: string; rot?: number; out?: number; sub?: string;
}> = ({text, x, y, at, size = 72, bg = C.honey, fg = C.ink, rot = -3, out, sub}) => {
  const w = text.length * size * 0.72 + size * 0.9;
  const h = size * 1.45 + (sub ? size * 0.7 : 0);
  return (
    <Pop x={x} y={y} at={at} rot={rot} out={out}>
      <rect x={-w / 2 + 8} y={-h / 2 + 12} width={w} height={h} rx={size * 0.35} fill={C.ink} opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={size * 0.35} fill={bg} stroke={C.ink} strokeWidth={8} />
      <text x={0} y={sub ? -h / 2 + size * 1.12 : size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={fg}>
        {text}
      </text>
      {sub ? (
        <text x={0} y={h / 2 - size * 0.38} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size * 0.45} fill={fg} opacity={0.85}>
          {sub}
        </text>
      ) : null}
    </Pop>
  );
};

/** Cifra que cuenta hacia arriba entre los frames a y b. */
export const Counter: React.FC<{
  from?: number; to: number; a: number; b: number; x: number; y: number; size?: number; fmt?: (n: number) => string; color?: string; at?: number;
}> = ({from = 0, to, a, b, x, y, size = 150, fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), color = C.cream, at}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [a, b], [from, to], {...clamp, easing: Easing.out(Easing.cubic)});
  const done = interpolate(frame, [b, b + 4, b + 10], [1, 1.15, 1], clamp);
  return (
    <Pop x={x} y={y} at={at ?? a - 4}>
      <g transform={`scale(${done})`}>
        <text x={0} y={size * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color}
          stroke={C.ink} strokeWidth={size * 0.12} paintOrder="stroke" strokeLinejoin="round">
          {fmt(v)}
        </text>
      </g>
    </Pop>
  );
};

/** Insignia ✓ / ✗ con trazo dibujado. */
export const Badge: React.FC<{ok: boolean; x: number; y: number; at: number; r?: number}> = ({ok, x, y, at, r = 70}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at + 3, at + 12], [1, 0], clamp);
  const d = ok
    ? `M ${-r * 0.45} ${r * 0.02} L ${-r * 0.1} ${r * 0.36} L ${r * 0.5} ${-r * 0.34}`
    : `M ${-r * 0.36} ${-r * 0.36} L ${r * 0.36} ${r * 0.36} M ${r * 0.36} ${-r * 0.36} L ${-r * 0.36} ${r * 0.36}`;
  return (
    <Pop x={x} y={y} at={at} rot={ok ? -6 : 6}>
      <circle cx={6} cy={10} r={r} fill={C.ink} opacity={0.35} />
      <circle r={r} fill={ok ? C.green : C.red} stroke={C.ink} strokeWidth={8} />
      <path d={d} fill="none" stroke={C.white} strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
    </Pop>
  );
};

/** Tachado animado. */
export const Strike: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; color?: string; w?: number}> = ({
  x1, y1, x2, y2, at, color = C.red, w = 18,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={w} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />;
};

/** Flecha curva que se dibuja. */
export const Arrow: React.FC<{d: string; at: number; color?: string; head: [number, number, number]}> = ({d, at, color = C.cream, head}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [1, 0], clamp);
  const ho = interpolate(frame, [at + 8, at + 12], [0, 1], clamp);
  const [hx, hy, ang] = head;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={p} />
      <g transform={`translate(${hx} ${hy}) rotate(${ang}) scale(${ho})`}>
        <path d="M -30 -26 L 6 0 L -30 26" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const starPath = (r: number) => {
  let d = '';
  for (let i = 0; i < 8; i++) {
    const rr = i % 2 === 0 ? r : r * 0.32;
    const a = (Math.PI / 4) * i - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'} ${Math.cos(a) * rr} ${Math.sin(a) * rr} `;
  }
  return d + 'Z';
};

/** Destellos que titilan alrededor de un punto. */
export const Sparkles: React.FC<{x: number; y: number; spread?: number; n?: number; seed?: string; color?: string; at?: number; fade?: number}> = ({
  x, y, spread = 260, n = 9, seed = 's', color = C.honeyLight, at = 0, fade,
}) => {
  const frame = useCurrentFrame();
  const fo = fade !== undefined ? interpolate(frame, [fade, fade + 15], [1, 0], clamp) : 1;
  return (
    <g opacity={fo}>
      {new Array(n).fill(0).map((_, i) => {
        const px = x + (random(seed + i) - 0.5) * spread * 2;
        const py = y + (random(seed + 'y' + i) - 0.5) * spread * 2;
        const ph = random(seed + 'p' + i) * Math.PI * 2;
        const s = Math.max(0, Math.sin((frame - at) * 0.18 + ph)) * interpolate(frame, [at, at + 8], [0, 1], clamp);
        return <path key={i} d={starPath(26 + random(seed + 'r' + i) * 22)} transform={`translate(${px} ${py}) scale(${s}) rotate(${frame * 2})`} fill={color} />;
      })}
    </g>
  );
};

export const Shadow: React.FC<{x: number; y: number; rx: number; o?: number}> = ({x, y, rx, o = 0.25}) => (
  <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.18} fill={C.ink} opacity={o} />
);
