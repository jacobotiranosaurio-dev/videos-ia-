import React from 'react';
import {interpolate, random, spring, useCurrentFrame, Easing} from 'remotion';
import {C, CX, FONT} from './theme';
import {useW} from './timing';
import {Arrow, Badge, clamp, Counter, Float, Label, Pop, Shadow, Sparkles, Strike, usePop} from './ui';
import {Eyes, Mouth} from './characters';
import {
  BigStadium, Bombo, Ball, Coin, Crane, Crowd, Floodlight, Ladder, Pitch, Player, S, SmallGround, Stopwatch, Ticket, Trophy, Truck, TVCamera,
} from './fut';

export type SceneDef = {id: string; anchor: number; bg: [string, string]; shakeAt?: number; C: React.FC};

// equipaciones genéricas (sin escudos reales)
const MODESTO = {shirt: C.red, stripe: C.white, shorts: C.ink};
const GRANDE = {shirt: C.white, shorts: C.ink, stripe: undefined as string | undefined};

const Enter: React.FC<{at?: number; dx?: number; dy?: number; children: React.ReactNode}> = ({at = 0, dx = 0, dy = 500, children}) => {
  const s = usePop(at, {damping: 13, stiffness: 120, mass: 1});
  return <g transform={`translate(${dx * (1 - s)} ${dy * (1 - s)})`}>{children}</g>;
};

const Rays: React.FC<{x: number; y: number; color?: string; o?: number; n?: number}> = ({x, y, color = C.honeyLight, o = 0.14, n = 14}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${f * 0.6})`} opacity={o}>
      {new Array(n).fill(0).map((_, i) => <path key={i} d="M 0 0 L -70 -1100 L 70 -1100 Z" fill={color} transform={`rotate(${(i / n) * 360})`} />)}
    </g>
  );
};

const QMark: React.FC<{x: number; y: number; at: number; rot?: number; size?: number; ch?: string; color?: string}> = ({x, y, at, rot = 0, size = 140, ch = '?', color = C.honey}) => (
  <Pop x={x} y={y} at={at} rot={rot}>
    <Float amp={10} speed={0.12} phase={x}>
      <text textAnchor="middle" y={size * 0.35} fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} stroke={C.ink} strokeWidth={14} paintOrder="stroke">{ch}</text>
    </Float>
  </Pop>
);

/* ---------- escenas ---------- */

const Hook: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Rays x={CX} y={1080} />
      <Enter at={0}>
        <g transform={`translate(${CX} 1080) scale(1.05)`}><Bombo /></g>
      </Enter>
      <QMark x={150} y={800} at={w(1)} rot={-14} />
      <QMark x={780} y={760} at={w(2)} rot={12} size={110} />
      <Label text="SORTEO" x={CX} y={640} at={w(4)} size={84} rot={-4} />
      <Pop x={CX + 270} y={1380} at={w(7)} rot={8}>
        <g transform="scale(0.45)"><Float amp={16} speed={0.15}><Trophy /></Float></g>
      </Pop>
    </g>
  );
};

const Ronda: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const draw = interpolate(f, [0, 18], [1, 0], clamp);
  const rows = [780, 940, 1100, 1260];
  return (
    <g>
      <g stroke={C.white} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1}>
        {rows.map((y, i) => (
          <path key={i} d={`M 120 ${y} L 300 ${y} L 300 ${i % 2 ? y - 80 : y + 80} L 420 ${i % 2 ? y - 80 : y + 80}`} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        ))}
        <path d="M 420 860 L 560 860 L 560 1020 L 700 1020 M 420 1180 L 560 1180 L 560 1020" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
      </g>
      {rows.map((y, i) => (
        <Pop key={i} x={110} y={y} at={2 + i * 2}>
          <circle r={36} fill={i % 2 ? C.honey : C.teal} {...S} strokeWidth={6} />
        </Pop>
      ))}
      <Pop x={760} y={1020} at={10}><g transform="scale(0.3)"><Trophy /></g></Pop>
      <Label text="PASAR DE RONDA" x={CX} y={650} at={w(12)} size={60} bg={C.cream} rot={-2} />
      <Strike x1={CX - 300} y1={670} x2={CX + 300} y2={630} at={w(14, 3)} w={20} />
      <Badge ok={false} x={CX + 250} y={1380} at={w(14, 5)} r={75} />
    </g>
  );
};

const Casa: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Rays x={CX} y={1100} o={0.2} />
      <Pop x={CX} y={1120} at={0}>
        <path d="M -360 -60 L 0 -360 L 360 -60" fill="none" stroke={C.ink} strokeWidth={58} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M -360 -60 L 0 -360 L 360 -60" fill="none" stroke={C.red} strokeWidth={40} strokeLinejoin="round" strokeLinecap="round" />
        <rect x={-290} y={-60} width={580} height={400} rx={30} fill={C.cream} {...S} strokeWidth={10} />
        <g transform="translate(0 200) scale(0.6)"><Pitch w={900} h={360} /></g>
      </Pop>
      <Pop x={CX} y={1080} at={w(16)}>
        <g transform="scale(0.85)"><Float amp={12} speed={0.2}><Ball mood="happy" arms="wave" seed={1} /></Float></g>
      </Pop>
      <Label text="JUGAR EN CASA" x={CX} y={650} at={w(18)} size={66} bg={C.green} rot={-3} />
      <Badge ok x={CX + 300} y={820} at={w(18, 4)} r={70} />
    </g>
  );
};

const Equipos: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const shown = interpolate(f, [2, w(25)], [0, 112], clamp);
  const dots = [];
  for (let i = 0; i < 112; i++) {
    const c = i % 11;
    const r = Math.floor(i / 11);
    const s = interpolate(shown - i, [0, 4], [0, 1], clamp);
    const col = [C.red, C.white, C.honey, C.teal, C.green, '#FF7AA2', '#8C7CFF'][Math.floor(random('t' + i) * 7)];
    dots.push(
      <g key={i} transform={`translate(${60 + c * 77} ${880 + r * 62}) scale(${s})`}>
        <path d="M -24 -26 L 24 -26 L 24 4 Q 24 26 0 32 Q -24 26 -24 4 Z" fill={col} stroke={C.ink} strokeWidth={5} />
      </g>,
    );
  }
  return (
    <g>
      {dots}
      <Counter to={112} a={w(22)} b={w(24, 6)} x={CX} y={640} size={170} color={C.honey} at={w(21)} />
      <Label text="EQUIPOS" x={CX} y={790} at={w(25)} size={56} bg={C.cream} rot={3} />
    </g>
  );
};

const Partidos: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const join = spring({frame: f - 4, fps: 30, config: {damping: 12, stiffness: 90}});
  return (
    <g>
      <g transform={`translate(${CX - 330 + join * 120} 1180) scale(0.75)`}><Ball mood="happy" look={[1, 0]} seed={2} spin={f * 3} /></g>
      <g transform={`translate(${CX + 330 - join * 120} 1180) scale(0.75)`}><Ball mood="wow" look={[-1, 0]} seed={3} spin={-f * 3} /></g>
      <Pop x={CX} y={1180} at={8}>
        <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={900} fontSize={90} fill={C.white} stroke={C.ink} strokeWidth={12} paintOrder="stroke">VS</text>
      </Pop>
      <Counter to={56} a={w(28)} b={w(29, 8)} x={CX} y={650} size={170} color={C.honey} at={w(27)} />
      <Label text="PARTIDOS" x={CX} y={800} at={w(30)} size={54} bg={C.cream} rot={-3} out={w(33, -3)} />
      <Label text="PARTIDO ÚNICO" x={CX} y={800} at={w(33)} size={64} bg={C.teal} rot={3} />
    </g>
  );
};

const Regla: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  return (
    <g>
      <Rays x={CX} y={1100} o={0.12} color={C.teal} />
      <Pop x={CX - 60} y={1130} at={0}>
        <g transform={`rotate(${-6 + Math.sin(f * 0.1) * 2})`}>
          <rect x={-230} y={-290} width={460} height={580} rx={26} fill="#2C3E8A" {...S} strokeWidth={10} />
          <rect x={-200} y={-260} width={400} height={520} rx={18} fill="#3550B0" />
          <rect x={-160} y={-150} width={320} height={110} rx={14} fill={C.honey} {...S} strokeWidth={6} />
          <text y={-80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>REGLAS</text>
          <path d="M -120 60 L 120 60 M -120 120 L 120 120 M -120 180 L 60 180" stroke={C.white} strokeWidth={14} strokeLinecap="round" opacity={0.6} />
        </g>
      </Pop>
      {/* silbato */}
      <Pop x={CX + 250} y={900} at={w(37)} rot={-15}>
        <g transform={`rotate(${Math.sin(f * 0.8) * 8})`}>
          <path d="M -90 -40 L 60 -40 Q 110 -40 110 10 Q 110 60 60 60 L -10 60 Q -90 60 -90 -20 Z" fill={C.steel} {...S} />
          <rect x={-150} y={-40} width={70} height={36} rx={8} fill={C.steel} {...S} />
          <circle cx={40} cy={10} r={22} fill={C.ink} />
        </g>
      </Pop>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${CX + 380} ${860 + i * 40} l 60 ${-20 + i * 20}`} stroke={C.white} strokeWidth={10} strokeLinecap="round"
          opacity={f > w(37, 4) ? 0.5 + 0.5 * Math.sin(f * 0.6 + i) : 0} />
      ))}
      <Label text="REGLA CLARA" x={CX} y={650} at={w(37)} size={70} rot={-3} />
    </g>
  );
};

const Local: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Enter at={0} dx={-500} dy={0}>
        <g transform={`translate(${CX - 200} 1240) scale(0.72)`}>
          <Shadow x={0} y={190} rx={150} />
          <Player {...MODESTO} mood="happy" look={[1, 0]} arm="up" seed={1} />
        </g>
      </Enter>
      <Enter at={3} dx={500} dy={0}>
        <g transform={`translate(${CX + 220} 1250) scale(0.95)`}>
          <Shadow x={0} y={190} rx={150} />
          <Player {...GRANDE} mood="wow" look={[-1, 0]} hair={C.ink} skin={C.skin2} seed={2} num="10" />
        </g>
      </Enter>
      <Label text="LOCAL" x={CX - 200} y={790} at={w(40)} size={70} bg={C.green} rot={-5} />
      <Arrow d={`M ${CX - 200} 850 Q ${CX - 240} 880 ${CX - 210} 905`} head={[CX - 210, 905, 70]} at={w(40, 3)} />
    </g>
  );
};

const Categoria: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const hi = f >= w(44) ? 5 : -1;
  return (
    <g>
      <Enter at={0}>
        <g transform={`translate(${CX} 940) scale(1.15)`}><Ladder hi={hi} /></g>
      </Enter>
      <Pop x={120} y={1060} at={w(44, 3)}>
        <g transform="scale(0.45)"><Player {...MODESTO} mood="happy" arm="up" seed={3} /></g>
      </Pop>
      <Label text="MENOR CATEGORÍA" x={CX} y={650} at={w(44)} size={58} bg={C.honey} rot={-3} />
    </g>
  );
};

const Humilde: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const crowd = interpolate(f, [w(52), w(54)], [0.15, 1], clamp);
  return (
    <g>
      <Enter at={0}>
        <g transform={`translate(${CX} 1150) scale(0.95)`}><SmallGround crowd={crowd} lights={0.6} seed="hu" /></g>
      </Enter>
      {f >= w(56) - 2
        ? [-300, -60, 200].map((x, i) => (
            <Pop key={i} x={CX + x} y={890} at={w(56, i * 2)}>
              <line x1={0} y1={0} x2={0} y2={-150} stroke={C.ink} strokeWidth={8} />
              <path d={`M 0 -150 Q 60 ${-160 + Math.sin(f * 0.4 + i) * 15} 120 -150 L 120 -90 Q 60 ${-100 + Math.sin(f * 0.4 + i) * 15} 0 -90 Z`} fill={i === 1 ? C.white : C.red} {...S} strokeWidth={5} />
            </Pop>
          ))
        : null}
      <Label text="¡LLENO!" x={CX} y={650} at={w(56)} size={84} bg={C.red} fg={C.white} rot={-4} />
    </g>
  );
};

const Taquilla: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  return (
    <g>
      <Rays x={CX} y={1100} o={0.18} />
      <Pop x={CX} y={1110} at={0}>
        <g transform={`rotate(${-8 + Math.sin(f * 0.12) * 3}) scale(1.9)`}><Ticket text="ENTRADA" /></g>
      </Pop>
      {new Array(12).fill(0).map((_, i) => {
        const t = f - 2 - i * 2;
        if (t < 0) return null;
        const x = 70 + random('cx' + i) * 780;
        const y = 760 + ((t * (10 + random('cv' + i) * 6) + random('co' + i) * 700) % 760);
        return <g key={i} transform={`translate(${x} ${y}) rotate(${t * 9}) scale(${0.6 + random('cs' + i) * 0.4})`}><Coin /></g>;
      })}
      <Label text="TAQUILLA" x={CX} y={650} at={w(58)} size={84} rot={-3} />
    </g>
  );
};

const Grande: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const drop = spring({frame: f - w(63), fps: 30, config: {damping: 10, stiffness: 120}});
  return (
    <g>
      <g transform={`translate(${CX} 1260) scale(0.8)`}><SmallGround lights={0.6} crowd={1} seed="gr" /></g>
      <g transform={`translate(${CX - 260} 1360) scale(0.36)`}><Player {...MODESTO} mood="wow" look={[1, -1]} seed={4} /></g>
      <g transform={`translate(${CX - 120} 1400) scale(0.36)`}><Player {...MODESTO} mood="wow" look={[1, -1]} seed={5} hair={C.ink} /></g>
      <g transform={`translate(${CX + 160} ${interpolate(drop, [0, 1], [400, 1180])}) scale(1.05)`}>
        <Player {...GRANDE} mood="happy" look={[-1, 0.4]} hair={C.honey} seed={6} num="9" arm="up" />
      </g>
      {f > w(64, 4) ? <Sparkles x={CX + 160} y={950} spread={240} n={8} at={w(64, 4)} seed="st" /> : null}
      <Label text="UN GRANDE" x={CX} y={650} at={w(64)} size={78} bg={C.cream} rot={-3} />
    </g>
  );
};

const Twist: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 3, 10], [0, 0.6, 0], clamp);
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={C.white} opacity={flash} />
      <Rays x={CX} y={1120} o={0.12} color={C.white} n={10} />
      <Pop x={CX} y={1130} at={w(68)}>
        <g transform={`rotate(${Math.sin(f * 0.9) * 4})`}>
          <path d="M 0 -300 L 300 230 L -300 230 Z" fill={C.honey} {...S} strokeWidth={14} />
          <rect x={-26} y={-150} width={52} height={230} rx={26} fill={C.ink} />
          <circle cx={0} cy={150} r={32} fill={C.ink} />
        </g>
      </Pop>
      <Label text="PERO…" x={CX - 160} y={650} at={w(68)} size={78} bg={C.cream} rot={-6} out={w(72, -3)} />
      <Label text="¡PROBLEMA!" x={CX} y={650} at={w(72)} size={84} bg={C.red} fg={C.white} rot={3} />
    </g>
  );
};

const NoVale: React.FC = () => {
  const w = useW();
  const s = usePop(w(75), {damping: 8, stiffness: 200, mass: 0.6});
  return (
    <g>
      <g transform={`translate(${CX} 1180) scale(0.9)`}><SmallGround lights={0} crowd={0} seed="nv" /></g>
      <g transform={`translate(${CX} 1130) rotate(-12) scale(${interpolate(s, [0, 1], [2.5, 1])})`} opacity={s > 0.02 ? 1 : 0}>
        <rect x={-260} y={-90} width={520} height={180} rx={24} fill="none" stroke={C.red} strokeWidth={18} />
        <text y={42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={C.red}>NO VALE</text>
      </g>
      <Label text="CUALQUIER CAMPO" x={CX} y={650} at={w(75)} size={58} bg={C.cream} rot={-3} />
    </g>
  );
};

const Luz: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const on = interpolate(f, [w(80), w(80, 3)], [0, 1], clamp) * (f < w(80, 6) ? (f % 2 ? 1 : 0.4) : 1);
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={C.honeyLight} opacity={on * 0.08} />
      <Floodlight x={250} y={1180} s={0.9} on={on} />
      <Pop x={CX + 150} y={1230} at={w(82)}>
        <g transform="scale(1.15)"><TVCamera /></g>
      </Pop>
      <Label text="LUZ PARA LA TELE" x={CX} y={650} at={w(80)} size={60} bg={C.honey} rot={-3} />
      <Badge ok x={CX + 300} y={830} at={w(83)} r={65} />
    </g>
  );
};

const Aforo: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const fill = interpolate(f, [2, 30], [0, 1], clamp);
  const seats = [];
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 10; c++) {
      const i = r * 10 + c;
      const occ = random('a' + i) < fill * 1.05;
      seats.push(
        <g key={i} transform={`translate(${110 + c * 76 + (r % 2) * 20} ${880 + r * 82})`}>
          <rect x={-30} y={-6} width={60} height={46} rx={10} fill="#3550B0" stroke={C.ink} strokeWidth={4} />
          {occ ? (
            <g transform={`translate(0 ${-Math.max(0, Math.sin(f * 0.4 + i)) * 8})`}>
              <rect x={-24} y={-4} width={48} height={34} rx={14} fill={[C.red, C.white, C.honey, C.teal][i % 4]} stroke={C.ink} strokeWidth={4} />
              <circle cy={-22} r={20} fill={random('sk' + i) > 0.5 ? C.skin : C.skin2} stroke={C.ink} strokeWidth={4} />
            </g>
          ) : null}
        </g>,
      );
    }
  return (
    <g>
      {seats}
      <Label text="AFORO SUFICIENTE" x={CX} y={650} at={w(84)} size={58} bg={C.teal} rot={3} />
    </g>
  );
};

const Cesped: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const blades = [];
  for (let i = 0; i < 34; i++) {
    const x = -20 + i * 34;
    const h = 220 + random('g' + i) * 140;
    const sway = Math.sin(f * 0.12 + i) * 14;
    blades.push(<path key={i} d={`M ${x - 18} 1560 Q ${x + sway} ${1560 - h * 0.6} ${x + sway * 2} ${1560 - h} Q ${x + 6} ${1560 - h * 0.5} ${x + 18} 1560 Z`} fill={i % 2 ? C.grass : C.green} stroke={C.ink} strokeWidth={4} />);
  }
  return (
    <g>
      <rect x={-20} y={1500} width={1120} height={500} fill={C.grassDark} />
      {blades}
      {/* calendario */}
      <Pop x={CX} y={1000} at={w(91)}>
        <g transform="rotate(-4)">
          <rect x={-170} y={-170} width={340} height={340} rx={30} fill={C.white} {...S} strokeWidth={10} />
          <rect x={-170} y={-170} width={340} height={90} rx={30} fill={C.red} {...S} strokeWidth={10} />
          <circle cx={-90} cy={-170} r={16} fill={C.ink} />
          <circle cx={90} cy={-170} r={16} fill={C.ink} />
          <text y={-108} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.white}>MÁXIMO</text>
          <text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill={C.ink}>
            {Math.round(interpolate(f, [w(92), w(94)], [1, 8], clamp))}
          </text>
          <text y={140} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>AÑOS</text>
        </g>
      </Pop>
      <Label text="NATURAL" x={CX - 190} y={760} at={w(88)} size={52} bg={C.green} rot={-5} />
      <Label text="ARTIFICIAL" x={CX + 170} y={800} at={w(90)} size={52} bg={C.teal} rot={5} />
      <Label text="MENOS DE 8 AÑOS" x={CX} y={650} at={w(94)} size={60} bg={C.honey} rot={-2} />
    </g>
  );
};

const Mudanza: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const go = interpolate(f, [w(100), w(102, 6)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const x = interpolate(go, [0, 1], [-500, CX]);
  return (
    <g>
      <rect x={-20} y={1340} width={1120} height={120} fill="#3A4466" />
      <path d="M 0 1400 L 1080 1400" stroke={C.white} strokeWidth={10} strokeDasharray="60 50" strokeDashoffset={-f * 8} />
      <QMark x={CX} y={1000} at={w(97)} size={220} />
      <g transform={`translate(${x + 40} ${1300 + Math.sin(f * 0.8) * 3 * (1 - go)}) scale(0.95)`} opacity={go > 0 ? 1 : 0}>
        <Truck t={f} />
      </g>
      <Label text="¿Y SI NO CUMPLE?" x={CX} y={650} at={w(96)} size={60} bg={C.cream} rot={-3} out={w(101, -3)} />
      <Label text="A OTRO ESTADIO" x={CX} y={650} at={w(101)} size={62} bg={C.red} fg={C.white} rot={3} />
    </g>
  );
};

const Tavernes: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Rays x={CX} y={1150} o={0.15} color={C.red} />
      <Enter at={0}>
        <g transform={`translate(${CX} 1260) scale(0.95)`}>
          <Shadow x={0} y={190} rx={160} />
          <Float amp={8} speed={0.15}><Player {...MODESTO} mood="happy" arm="up" seed={7} /></Float>
        </g>
      </Enter>
      <Label text="TAVERNES" x={CX} y={650} at={w(108)} size={80} bg={C.red} fg={C.white} rot={-3} />
      <Label text="CATEGORÍA REGIONAL" x={CX} y={800} at={w(113)} size={46} bg={C.cream} rot={3} />
    </g>
  );
};

const Mestalla: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Floodlight x={60} y={1050} s={0.7} on={1} />
      <Floodlight x={860} y={1050} s={0.7} on={1} flip />
      <Enter at={0} dy={700}>
        <g transform={`translate(${CX} 1130) scale(0.82)`}><BigStadium name={undefined} seed="me" /></g>
      </Enter>
      <Pop x={CX} y={1400} at={w(118)}>
        <rect x={-210} y={-48} width={420} height={96} rx={20} fill={C.ink} />
        <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.white}>MESTALLA</text>
      </Pop>
      <Label text="VS VALENCIA" x={CX} y={650} at={w(116)} size={66} bg={C.white} rot={-3} />
    </g>
  );
};

const Visitante: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const flip = f >= w(125);
  const blink = flip && Math.floor((f - w(125)) / 4) % 2 === 0;
  return (
    <g>
      <Enter at={0} dy={-600}>
        <g transform={`translate(${CX} 860)`}>
          <rect x={-380} y={-170} width={760} height={340} rx={30} fill="#141A30" {...S} strokeWidth={12} />
          <g fontFamily={FONT} fontWeight={900}>
            <text x={-330} y={-70} fontSize={38} fill={C.honey}>LOCAL</text>
            <text x={-330} y={-15} fontSize={58} fill={C.white}>TAVERNES</text>
            <text x={-330} y={65} fontSize={38} fill={blink ? C.red : C.honey}>VISITANTE</text>
            <text x={-330} y={125} fontSize={58} fill={C.white}>VALENCIA</text>
          </g>
          <circle cx={300} cy={-40} r={14} fill={C.red} opacity={Math.floor(f / 8) % 2} />
        </g>
      </Enter>
      <g transform={`translate(${CX} 1370) scale(0.62)`}>
        <Player {...GRANDE} mood={flip ? 'wow' : 'worried'} look={[0, -1]} hair={C.ink} skin={C.skin2} seed={8} />
      </g>
      <QMark x={CX - 230} y={1150} at={w(125)} rot={-12} size={120} />
      <QMark x={CX + 240} y={1110} at={w(126)} rot={12} size={100} />
      <Label text="¡VISITANTE EN CASA!" x={CX} y={650} at={w(125)} size={54} bg={C.red} fg={C.white} rot={-2} />
    </g>
  );
};

const Obras: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  return (
    <g>
      <Enter at={0} dx={-500} dy={0}>
        <g transform={`translate(${CX - 260} 1450) scale(0.95)`}><Crane t={f} /></g>
      </Enter>
      <Pop x={CX + 160} y={1130} at={w(134)}>
        <g transform="scale(0.85)"><Stopwatch p={interpolate(f, [w(134), w(135, 20)], [0, 0.85], clamp)} /></g>
      </Pop>
      <Label text="CONTRARRELOJ" x={CX} y={650} at={w(135)} size={70} bg={C.honey} rot={-3} />
    </g>
  );
};

const Gradas: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const lights = f >= w(139) ? interpolate(f, [w(139), w(139, 4)], [0, 1], clamp) : 0;
  return (
    <g>
      <g transform={`translate(${CX} 1260) scale(0.85)`}>
        <SmallGround lights={lights} crowd={1} seed="ga" />
      </g>
      {/* gradas supletorias de andamio */}
      {[-1, 1].map((side) => (
        <Pop key={side} x={CX + side * 320} y={1000} at={w(136, side > 0 ? 3 : 0)}>
          <g>
            <Crowd x={-150} y={-110} w={300} rows={2} size={18} seed={'sup' + side} />
            <rect x={-150} y={-40} width={300} height={22} rx={6} fill={C.steel} {...S} strokeWidth={5} />
            {[0, 1, 2, 3].map((i) => <line key={i} x1={-140 + i * 93} y1={-20} x2={-140 + i * 93} y2={150} stroke={C.steel} strokeWidth={10} />)}
            {[0, 1, 2].map((i) => <line key={'d' + i} x1={-140 + i * 93} y1={i % 2 ? -20 : 150} x2={-47 + i * 93} y2={i % 2 ? 150 : -20} stroke={C.steel} strokeWidth={7} />)}
            <line x1={-150} y1={65} x2={150} y2={65} stroke={C.steel} strokeWidth={7} />
          </g>
        </Pop>
      ))}
      <Label text="GRADAS SUPLETORIAS" x={CX} y={650} at={w(136)} size={52} bg={C.cream} rot={-2} out={w(139, -3)} />
      <Label text="FOCOS NUEVOS" x={CX} y={650} at={w(139)} size={66} bg={C.honey} rot={3} />
    </g>
  );
};

const Prefieres: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const left = f >= w(144) && f < w(147);
  const right = f >= w(147);
  return (
    <g>
      <Pop x={CX - 220} y={1100} at={2}>
        <g transform={`scale(${left ? 1.08 : 0.95})`} opacity={right ? 0.55 : 1}>
          <rect x={-200} y={-200} width={400} height={400} rx={36} fill="#1E3A8A" stroke={left ? C.honey : C.ink} strokeWidth={left ? 16 : 8} />
          <g transform="translate(0 40) scale(0.4)"><SmallGround crowd={1} lights={1} seed="pl" /></g>
        </g>
      </Pop>
      <Pop x={CX + 220} y={1100} at={6}>
        <g transform={`scale(${right ? 1.08 : 0.95})`} opacity={left ? 0.55 : 1}>
          <rect x={-200} y={-200} width={400} height={400} rx={36} fill="#1E3A8A" stroke={right ? C.honey : C.ink} strokeWidth={right ? 16 : 8} />
          <g transform="translate(0 20) scale(0.34)"><BigStadium seed="pr" /></g>
        </g>
      </Pop>
      <Pop x={CX} y={1100} at={10}>
        <circle r={70} fill={C.red} {...S} />
        <text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={C.white}>VS</text>
      </Pop>
      <Label text="PEQUEÑO" x={CX - 220} y={1380} at={w(144)} size={50} bg={C.cream} rot={-4} />
      <Label text="GRANDE" x={CX + 220} y={1380} at={w(147)} size={50} bg={C.honey} rot={4} />
      <Label text="¿TÚ QUÉ PREFIERES?" x={CX} y={650} at={w(141)} size={56} bg={C.teal} rot={-2} />
    </g>
  );
};

const CTA: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  return (
    <g>
      <Rays x={CX} y={1170} o={0.18} />
      <Enter at={0}>
        <g transform={`translate(${CX - 60} 1210) scale(1.05)`}>
          <Shadow x={0} y={170} rx={150} />
          <Float amp={14} speed={0.18}><Ball mood="happy" arms="wave" seed={9} spin={Math.sin(f * 0.1) * 10} /></Float>
        </g>
      </Enter>
      <Pop x={CX + 230} y={900} at={w(150)} rot={6}>
        <path d="M -150 -90 Q -150 -130 -110 -130 L 110 -130 Q 150 -130 150 -90 L 150 40 Q 150 80 110 80 L -40 80 L -90 140 L -80 80 L -110 80 Q -150 80 -150 40 Z" fill={C.white} {...S} />
        <circle cx={-60} cy={-25} r={18} fill={C.ink} />
        <circle cx={0} cy={-25} r={18} fill={C.ink} />
        <circle cx={60} cy={-25} r={18} fill={C.ink} />
      </Pop>
      <Label text="COMENTA" x={CX - 40} y={640} at={w(153)} size={66} bg={C.cream} rot={-4} out={w(155, -3)} />
      <Pop x={CX} y={640} at={w(155)} rot={-2}>
        <g transform={`scale(${1 + Math.max(0, Math.sin((f - w(155)) * 0.25)) * 0.05})`}>
          <rect x={-250} y={-70} width={500} height={140} rx={70} fill={C.red} {...S} strokeWidth={10} />
          <text x={30} y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill={C.white}>SÍGUEME</text>
          <g transform={`translate(-185 0) rotate(${Math.sin(f * 0.8) * 15})`}>
            <path d="M -30 20 Q -30 -40 0 -40 Q 30 -40 30 20 L 38 30 L -38 30 Z" fill={C.honey} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
            <circle cx={0} cy={38} r={9} fill={C.honey} stroke={C.ink} strokeWidth={5} />
          </g>
        </g>
      </Pop>
      <Sparkles x={CX} y={1100} spread={380} n={10} at={w(155)} seed="cta" />
    </g>
  );
};

const NIGHT: [string, string] = ['#0F1B3D', '#1E3A8A'];
const PITCHBG: [string, string] = ['#0F2A3D', '#1F6B4A'];

export const SCENES: SceneDef[] = [
  {id: 'hook', anchor: 0, bg: NIGHT, C: Hook},
  {id: 'ronda', anchor: 10, bg: ['#1A1745', '#3A2F7A'], C: Ronda},
  {id: 'casa', anchor: 15, bg: ['#123A2A', '#2FA84F'], C: Casa},
  {id: 'equipos', anchor: 19, bg: NIGHT, C: Equipos},
  {id: 'partidos', anchor: 26, bg: PITCHBG, C: Partidos},
  {id: 'regla', anchor: 34, bg: ['#1A1745', '#3A2F7A'], C: Regla},
  {id: 'local', anchor: 38, bg: PITCHBG, C: Local},
  {id: 'categoria', anchor: 43, bg: NIGHT, C: Categoria},
  {id: 'humilde', anchor: 46, bg: ['#0F1B3D', '#3A2F7A'], C: Humilde},
  {id: 'taquilla', anchor: 57, bg: ['#2A1F05', '#8A6A10'], C: Taquilla},
  {id: 'grande', anchor: 62, bg: ['#0F1B3D', '#2A4FA8'], C: Grande},
  {id: 'twist', anchor: 68, bg: ['#3A0A14', '#B3202E'], shakeAt: 68, C: Twist},
  {id: 'novale', anchor: 73, bg: ['#2A0F1A', '#6A2030'], C: NoVale},
  {id: 'luz', anchor: 77, bg: ['#070B1C', '#1A2550'], C: Luz},
  {id: 'aforo', anchor: 84, bg: NIGHT, C: Aforo},
  {id: 'cesped', anchor: 86, bg: ['#0F2A3D', '#3A8FBF'], C: Cesped},
  {id: 'mudanza', anchor: 96, bg: ['#1A1745', '#5A4FA8'], C: Mudanza},
  {id: 'tavernes', anchor: 105, bg: ['#2A0F1A', '#8A2030'], C: Tavernes},
  {id: 'mestalla', anchor: 114, bg: NIGHT, C: Mestalla},
  {id: 'visitante', anchor: 119, bg: ['#1A1745', '#3A2F7A'], shakeAt: 125, C: Visitante},
  {id: 'obras', anchor: 130, bg: ['#2A1F05', '#7A5A20'], C: Obras},
  {id: 'gradas', anchor: 136, bg: ['#0F1B3D', '#2A4FA8'], C: Gradas},
  {id: 'prefieres', anchor: 141, bg: ['#1A1745', '#3A2F7A'], C: Prefieres},
  {id: 'cta', anchor: 149, bg: ['#0F1B3D', '#2A4FA8'], C: CTA},
];
