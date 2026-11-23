import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {Eyes, Mood, Mouth} from './characters';
import {clamp} from './ui';

export const S = {stroke: C.ink, strokeWidth: 8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

const Cheeks: React.FC<{y: number; gap: number}> = ({y, gap}) => (
  <g opacity={0.5}>
    <ellipse cx={-gap} cy={y} rx={20} ry={12} fill="#FF7A7A" />
    <ellipse cx={gap} cy={y} rx={20} ry={12} fill="#FF7A7A" />
  </g>
);

/** Balón con cara (mascota). Origen: centro. */
export const Ball: React.FC<{mood?: Mood; look?: [number, number]; seed?: number; spin?: number; arms?: 'none' | 'wave'}> = ({
  mood = 'happy', look = [0, 0], seed = 0, spin = 0, arms = 'none',
}) => {
  const f = useCurrentFrame();
  const wave = Math.sin(f * 0.35) * 22;
  const pent = (cx: number, cy: number, r: number, rot: number) => {
    let d = '';
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2 + rot;
      d += `${i ? 'L' : 'M'} ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r} `;
    }
    return d + 'Z';
  };
  return (
    <g>
      {arms === 'wave' ? (
        <g {...S} strokeWidth={14} fill="none">
          <path d="M -130 40 Q -200 50 -215 0" />
          <path d={`M 130 40 Q 200 20 ${215 + wave * 0.3} ${-70 + wave}`} />
          <circle cx={-215} cy={-6} r={20} fill={C.cream} strokeWidth={8} />
          <circle cx={215 + wave * 0.3} cy={-76 + wave} r={20} fill={C.cream} strokeWidth={8} />
        </g>
      ) : null}
      <clipPath id={`ball${seed}`}><circle r={150} /></clipPath>
      <circle r={150} fill={C.white} />
      <g clipPath={`url(#ball${seed})`} transform={`rotate(${spin})`}>
        <path d={pent(0, -95, 45, 0)} fill={C.ink} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (Math.PI * 2 * i) / 5 + Math.PI / 10;
          return <path key={i} d={pent(Math.cos(a) * 165, Math.sin(a) * 165, 55, a)} fill={C.ink} />;
        })}
      </g>
      <path d="M -95 -70 Q -125 -10 -105 50" stroke="#DDE3F0" strokeWidth={16} strokeLinecap="round" fill="none" />
      <circle r={150} fill="none" {...S} />
      <Eyes y={-10} gap={100} r={34} look={look} mood={mood} seed={seed} />
      <Cheeks y={42} gap={88} />
      <Mouth y={48} w={64} mood={mood} />
    </g>
  );
};

/** Futbolista cartoon. Origen: cintura. Altura aprox. 560 (cabeza a pies). */
export const Player: React.FC<{
  shirt: string; stripe?: string; shorts?: string; skin?: string; hair?: string; mood?: Mood; look?: [number, number]; arm?: 'down' | 'up' | 'point'; seed?: number; num?: string; run?: boolean;
}> = ({shirt, stripe, shorts = C.ink, skin = C.skin, hair = C.brown, mood = 'happy', look = [0, 0], arm = 'down', seed = 0, num, run = false}) => {
  const f = useCurrentFrame();
  const sw = run ? Math.sin(f * 0.6 + seed) * 18 : 0;
  const armL = arm === 'up' ? 'M -95 -150 Q -150 -230 -140 -300' : 'M -95 -150 Q -140 -80 -130 -20';
  const armR = arm === 'down' ? 'M 95 -150 Q 140 -80 130 -20' : arm === 'up' ? 'M 95 -150 Q 150 -230 140 -300' : 'M 95 -150 Q 180 -170 250 -200';
  const handL = arm === 'up' ? [-140, -305] : [-130, -15];
  const handR = arm === 'down' ? [130, -15] : arm === 'up' ? [140, -305] : [255, -202];
  const id = `pl${seed}`;
  return (
    <g>
      {/* piernas */}
      <g transform={`rotate(${sw} -40 0)`}>
        <rect x={-68} y={0} width={50} height={150} rx={20} fill={skin} {...S} />
        <rect x={-70} y={90} width={54} height={70} rx={12} fill={stripe ?? C.white} {...S} />
        <path d="M -78 160 L -10 160 Q 0 185 -20 190 L -80 190 Z" fill={C.ink} />
      </g>
      <g transform={`rotate(${-sw} 40 0)`}>
        <rect x={18} y={0} width={50} height={150} rx={20} fill={skin} {...S} />
        <rect x={16} y={90} width={54} height={70} rx={12} fill={stripe ?? C.white} {...S} />
        <path d="M 10 160 L 78 160 Q 90 185 70 190 L 10 190 Z" fill={C.ink} />
      </g>
      <path d="M -95 -20 L 95 -20 L 100 60 L 8 60 L 0 30 L -8 60 L -100 60 Z" fill={shorts} {...S} />
      {/* brazos */}
      <path d={armL} stroke={C.ink} strokeWidth={46} strokeLinecap="round" fill="none" />
      <path d={armL} stroke={skin} strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d={armR} stroke={C.ink} strokeWidth={46} strokeLinecap="round" fill="none" />
      <path d={armR} stroke={skin} strokeWidth={30} strokeLinecap="round" fill="none" />
      <circle cx={handL[0]} cy={handL[1]} r={22} fill={skin} {...S} strokeWidth={6} />
      <circle cx={handR[0]} cy={handR[1]} r={22} fill={skin} {...S} strokeWidth={6} />
      {/* camiseta */}
      <clipPath id={id}><path d="M -100 -190 Q -100 -215 -60 -215 L 60 -215 Q 100 -215 100 -190 L 100 -10 L -100 -10 Z" /></clipPath>
      <path d="M -100 -190 Q -100 -215 -60 -215 L 60 -215 Q 100 -215 100 -190 L 100 -10 L -100 -10 Z" fill={shirt} />
      {stripe ? (
        <g clipPath={`url(#${id})`}>
          {[-75, -25, 25, 75].map((x) => <rect key={x} x={x - 12} y={-220} width={24} height={220} fill={stripe} />)}
        </g>
      ) : null}
      <path d="M -100 -190 Q -100 -215 -60 -215 L 60 -215 Q 100 -215 100 -190 L 100 -10 L -100 -10 Z" fill="none" {...S} />
      <path d="M -30 -215 Q 0 -180 30 -215" fill="none" {...S} strokeWidth={6} />
      {num ? <text x={0} y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.white} stroke={C.ink} strokeWidth={8} paintOrder="stroke">{num}</text> : null}
      {/* cabeza */}
      <circle cx={0} cy={-310} r={100} fill={skin} {...S} />
      <path d="M -100 -320 Q -105 -420 0 -420 Q 105 -420 100 -320 Q 60 -370 0 -360 Q -60 -370 -100 -320 Z" fill={hair} {...S} />
      <g transform="translate(0 -300)">
        <Eyes gap={76} r={27} look={look} mood={mood} seed={seed} />
        <Cheeks y={36} gap={64} />
        <g transform="translate(0 38)"><Mouth w={50} mood={mood} /></g>
      </g>
    </g>
  );
};

/** Gente en la grada: filas de cabezas que botan. */
export const Crowd: React.FC<{x: number; y: number; w: number; rows: number; size?: number; seed?: string; colors?: string[]; hype?: number}> = ({
  x, y, w, rows, size = 26, seed = 'c', colors = [C.red, C.white, C.honey, C.teal, '#FF7AA2'], hype = 1,
}) => {
  const f = useCurrentFrame();
  const items = [];
  for (let r = 0; r < rows; r++) {
    const n = Math.floor(w / (size * 2.1));
    for (let i = 0; i < n; i++) {
      const px = x + i * size * 2.1 + (r % 2) * size + size;
      const py = y + r * size * 2.2;
      const b = Math.max(0, Math.sin(f * 0.45 + random(seed + r + '-' + i) * 6)) * 14 * hype;
      const col = colors[Math.floor(random(seed + 'k' + r + i) * colors.length)];
      items.push(
        <g key={`${r}-${i}`} transform={`translate(${px} ${py - b})`}>
          <rect x={-size * 0.95} y={size * 0.6} width={size * 1.9} height={size * 1.6} rx={size * 0.6} fill={col} stroke={C.ink} strokeWidth={4} />
          <circle r={size * 0.8} fill={random(seed + 's' + r + i) > 0.5 ? C.skin : C.skin2} stroke={C.ink} strokeWidth={4} />
        </g>,
      );
    }
  }
  return <g>{items}</g>;
};

/** Torre de focos. on: 0..1 */
export const Floodlight: React.FC<{x: number; y: number; on?: number; s?: number; flip?: boolean}> = ({x, y, on = 1, s = 1, flip = false}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {on > 0 ? <path d="M -90 -470 L 520 400 L 120 400 L 90 -470 Z" fill={C.honeyLight} opacity={0.22 * on} /> : null}
    <rect x={-14} y={-470} width={28} height={520} fill={C.steel} {...S} strokeWidth={6} />
    <rect x={-110} y={-580} width={220} height={130} rx={12} fill="#3A4466" {...S} />
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
      <circle key={`${r}${c}`} cx={-75 + c * 50} cy={-548 + r * 40} r={16}
        fill={on > 0.5 ? C.honeyLight : '#59627F'} stroke={C.ink} strokeWidth={3} />
    )))}
    {on > 0 ? <rect x={-130} y={-600} width={260} height={170} rx={30} fill={C.honeyLight} opacity={0.25 * on} /> : null}
  </g>
);

export const TVCamera: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d="M -10 120 L -110 330 M 10 120 L 110 330 M 0 120 L 0 330" {...S} strokeWidth={14} />
      <rect x={-170} y={-60} width={280} height={170} rx={24} fill="#2C3555" {...S} />
      <rect x={110} y={-30} width={110} height={110} rx={14} fill="#3A4466" {...S} />
      <circle cx={225} cy={25} r={52} fill="#141A30" {...S} />
      <circle cx={225} cy={25} r={28} fill="#35D0E8" opacity={0.8} />
      <circle cx={238} cy={12} r={9} fill={C.white} />
      <rect x={-140} y={-120} width={150} height={60} rx={12} fill="#3A4466" {...S} />
      <circle cx={-125} cy={-25} r={14} fill={Math.floor(f / 10) % 2 ? C.red : '#7A1F27'} />
      <text x={-60} y={65} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.white}>TV</text>
    </g>
  );
};

export const Trophy: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -150 -170 Q -250 -170 -230 -70 Q -210 20 -110 30" fill="none" stroke={C.ink} strokeWidth={36} />
    <path d="M 150 -170 Q 250 -170 230 -70 Q 210 20 110 30" fill="none" stroke={C.ink} strokeWidth={36} />
    <path d="M -150 -170 Q -250 -170 -230 -70 Q -210 20 -110 30" fill="none" stroke={C.honey} strokeWidth={20} />
    <path d="M 150 -170 Q 250 -170 230 -70 Q 210 20 110 30" fill="none" stroke={C.honey} strokeWidth={20} />
    <path d="M -170 -220 L 170 -220 Q 170 60 30 110 L 30 180 L -30 180 L -30 110 Q -170 60 -170 -220 Z" fill={C.honey} {...S} />
    <path d="M -110 -190 Q -120 -40 -60 40" stroke={C.white} strokeWidth={20} strokeLinecap="round" fill="none" opacity={0.5} />
    <rect x={-110} y={175} width={220} height={50} rx={10} fill={C.amber} {...S} />
    <rect x={-140} y={225} width={280} height={60} rx={12} fill={C.brown} {...S} />
  </g>
);

/** Bombo de sorteo con bolas. */
export const Bombo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-30} y={190} width={60} height={160} fill={C.steel} {...S} />
      <rect x={-150} y={340} width={300} height={40} rx={14} fill="#3A4466" {...S} />
      <circle r={230} fill="#BFEFFF" opacity={0.25} />
      {new Array(14).fill(0).map((_, i) => {
        const a = f * (0.08 + random('ba' + i) * 0.05) + random('bp' + i) * 7;
        const rr = 60 + random('br' + i) * 120;
        const x = Math.cos(a) * rr;
        const y = Math.sin(a * 1.3) * rr * 0.8 + 40;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={34} fill={i % 3 ? C.white : C.honey} {...S} strokeWidth={5} />
            <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.ink}>{(i * 7) % 99 + 1}</text>
          </g>
        );
      })}
      <circle r={230} fill="none" {...S} strokeWidth={10} />
      <path d="M -150 -150 Q -200 -60 -180 40" stroke={C.white} strokeWidth={18} strokeLinecap="round" fill="none" opacity={0.6} />
    </g>
  );
};

/** Campo de fútbol en perspectiva. Origen: centro del césped. */
export const Pitch: React.FC<{w?: number; h?: number; stripes?: boolean}> = ({w = 900, h = 420, stripes = true}) => {
  const top = w * 0.62;
  const d = `M ${-top / 2} ${-h / 2} L ${top / 2} ${-h / 2} L ${w / 2} ${h / 2} L ${-w / 2} ${h / 2} Z`;
  return (
    <g>
      <clipPath id={`pitch${w}`}><path d={d} /></clipPath>
      <path d={d} fill={C.grass} {...S} />
      {stripes ? (
        <g clipPath={`url(#pitch${w})`}>
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-w} y={-h / 2 + i * (h / 6)} width={w * 2} height={h / 12} fill={C.grassDark} opacity={0.5} />)}
        </g>
      ) : null}
      <g stroke={C.white} strokeWidth={6} fill="none" opacity={0.9}>
        <line x1={-(top + w) / 4} y1={0} x2={(top + w) / 4} y2={0} />
        <ellipse cx={0} cy={0} rx={w * 0.12} ry={h * 0.12} />
      </g>
    </g>
  );
};

/** Campo municipal pequeño: grada mini + campo. */
export const SmallGround: React.FC<{crowd?: number; lights?: number; seed?: string}> = ({crowd = 0, lights = 0, seed = 'sg'}) => (
  <g>
    <rect x={-380} y={-260} width={760} height={150} fill="#7D8AAE" {...S} />
    {[0, 1, 2].map((r) => <line key={r} x1={-380} x2={380} y1={-215 + r * 40} y2={-215 + r * 40} stroke={C.ink} strokeWidth={4} opacity={0.4} />)}
    {crowd > 0 ? <g opacity={crowd}><Crowd x={-380} y={-262} w={740} rows={3} size={22} seed={seed} hype={crowd} /></g> : null}
    <rect x={-400} y={-282} width={800} height={26} rx={8} fill="#5A6487" {...S} />
    <g transform="translate(0 90)"><Pitch w={900} h={360} /></g>
    {lights >= 0 ? (
      <>
        <Floodlight x={-430} y={-80} s={0.5} on={lights} />
        <Floodlight x={430} y={-80} s={0.5} on={lights} flip />
      </>
    ) : null}
  </g>
);

/** Estadio grande genérico. */
export const BigStadium: React.FC<{name?: string; seed?: string}> = ({name, seed = 'bs'}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <ellipse cx={0} cy={0} rx={520} ry={330} fill="#3A4466" {...S} />
      <ellipse cx={0} cy={0} rx={470} ry={290} fill="#5A6487" />
      {new Array(160).fill(0).map((_, i) => {
        const a = (i / 160) * Math.PI * 2;
        const ring = i % 2 ? 0.9 : 0.8;
        const fl = Math.sin(f * 0.3 + i) > 0.6;
        return <circle key={i} cx={Math.cos(a) * 470 * ring} cy={Math.sin(a) * 290 * ring} r={9}
          fill={[C.white, C.ink, C.honey, C.red][i % 4]} opacity={fl ? 1 : 0.75} />;
      })}
      <ellipse cx={0} cy={0} rx={330} ry={180} fill={C.grass} {...S} />
      <ellipse cx={0} cy={0} rx={300} ry={160} fill="none" stroke={C.white} strokeWidth={5} opacity={0.8} />
      <line x1={0} y1={-160} x2={0} y2={160} stroke={C.white} strokeWidth={5} opacity={0.8} />
      <ellipse cx={0} cy={0} rx={60} ry={35} fill="none" stroke={C.white} strokeWidth={5} opacity={0.8} />
      <path d="M -540 -40 Q 0 -460 540 -40" fill="none" stroke={C.steel} strokeWidth={22} />
      <path d="M -540 -40 Q 0 -460 540 -40" fill="none" stroke={C.ink} strokeWidth={6} />
      {name ? (
        <g transform="translate(0 270)">
          <rect x={-230} y={-50} width={460} height={90} rx={20} fill={C.ink} />
          <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.white}>{name}</text>
        </g>
      ) : null}
    </g>
  );
};

export const Ticket: React.FC<{text?: string}> = ({text = 'ENTRADA'}) => (
  <g>
    <path d="M -170 -80 L 170 -80 L 170 -25 A 25 25 0 0 0 170 25 L 170 80 L -170 80 L -170 25 A 25 25 0 0 0 -170 -25 Z" fill={C.honey} {...S} />
    <line x1={90} y1={-70} x2={90} y2={70} stroke={C.ink} strokeWidth={5} strokeDasharray="10 10" />
    <text x={-35} y={13} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={C.ink}>{text}</text>
  </g>
);

export const Coin: React.FC = () => (
  <g>
    <circle r={50} fill={C.honey} {...S} />
    <circle r={34} fill="none" stroke={C.amber} strokeWidth={6} />
    <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.amberDark}>€</text>
  </g>
);

export const Truck: React.FC<{t: number; label?: string}> = ({t, label = 'MUDANZA'}) => (
  <g>
    <rect x={-300} y={-220} width={400} height={240} rx={16} fill={C.cream} {...S} />
    <text x={-100} y={-75} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.ink}>{label}</text>
    {/* portería en el techo */}
    <path d="M -260 -220 L -260 -330 L 60 -330 L 60 -220" fill="none" stroke={C.white} strokeWidth={18} />
    <path d="M -260 -220 L -260 -330 L 60 -330 L 60 -220" fill="none" stroke={C.ink} strokeWidth={5} />
    <path d="M 100 -150 L 210 -150 L 270 -60 L 270 20 L 100 20 Z" fill={C.red} {...S} />
    <path d="M 125 -130 L 200 -130 L 245 -65 L 125 -65 Z" fill="#BFEFFF" {...S} strokeWidth={5} />
    {[-200, 0, 200].map((x) => (
      <g key={x} transform={`translate(${x} 30) rotate(${t * 12})`}>
        <circle r={46} fill="#2C3555" {...S} />
        <circle r={16} fill={C.steel} />
        <line x1={-30} y1={0} x2={30} y2={0} stroke={C.steel} strokeWidth={6} />
      </g>
    ))}
  </g>
);

export const Stopwatch: React.FC<{p: number}> = ({p}) => (
  <g>
    <rect x={-25} y={-210} width={50} height={40} rx={8} fill={C.steel} {...S} />
    <circle r={170} fill={C.white} {...S} strokeWidth={10} />
    <path d={`M 0 0 L 0 -140 A 140 140 0 ${p > 0.5 ? 1 : 0} 1 ${Math.sin(p * Math.PI * 2) * 140} ${-Math.cos(p * Math.PI * 2) * 140} Z`} fill={C.red} opacity={0.85} />
    <line x1={0} y1={0} x2={Math.sin(p * Math.PI * 2) * 130} y2={-Math.cos(p * Math.PI * 2) * 130} stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
    <circle r={16} fill={C.ink} />
  </g>
);

export const Crane: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-30} y={-600} width={60} height={600} fill="none" stroke={C.honey} strokeWidth={10} />
    {new Array(10).fill(0).map((_, i) => <line key={i} x1={-30} y1={-i * 60} x2={30} y2={-i * 60 - 60} stroke={C.honey} strokeWidth={6} />)}
    <rect x={-120} y={-640} width={560} height={40} fill={C.honey} {...S} strokeWidth={6} />
    <rect x={-160} y={-660} width={80} height={80} fill="#3A4466" {...S} strokeWidth={6} />
    <line x1={320 + Math.sin(t * 0.08) * 30} y1={-600} x2={320 + Math.sin(t * 0.08) * 30} y2={-330} stroke={C.ink} strokeWidth={5} />
    <path d={`M ${300 + Math.sin(t * 0.08) * 30} -330 l 20 30 l 20 -30`} fill="none" stroke={C.ink} strokeWidth={8} />
  </g>
);

/** Escalera de categorías. hi: índice resaltado. */
export const Ladder: React.FC<{hi?: number; at?: number}> = ({hi = 4}) => {
  const f = useCurrentFrame();
  const cats = ['PRIMERA', 'SEGUNDA', '1ª FEDERACIÓN', '2ª FEDERACIÓN', '3ª FEDERACIÓN', 'REGIONAL'];
  return (
    <g>
      {cats.map((c, i) => {
        const w = 420 + i * 60;
        const on = i === hi;
        return (
          <g key={c} transform={`translate(0 ${i * 88})`}>
            <rect x={-w / 2} y={-38} width={w} height={76} rx={16} fill={on ? C.honey : '#3A4466'} {...S} strokeWidth={6}
              transform={on ? `scale(${1 + Math.sin(f * 0.3) * 0.03})` : undefined} />
            <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={on ? C.ink : C.white}>{c}</text>
          </g>
        );
      })}
    </g>
  );
};

export const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
