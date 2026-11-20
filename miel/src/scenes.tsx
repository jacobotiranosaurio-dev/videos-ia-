import React from 'react';
import {interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, CX, FONT} from './theme';
import {useW} from './timing';
import {Arrow, Badge, clamp, Counter, Float, Label, Pop, Shadow, Sparkles, Strike, usePop} from './ui';
import {Bacteria, Bee, Explorer, Eyes, HoneyJar, Mouth, Orange} from './characters';

const S = {stroke: C.ink, strokeWidth: 8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

export type SceneDef = {
  id: string;
  anchor: number; // índice de palabra que dispara la escena
  bg: [string, string];
  shakeAt?: number; // índice de palabra para sacudida de cámara
  C: React.FC;
};

/* ---------- utilidades de escena ---------- */

/** Entrada desde abajo con spring. */
const Enter: React.FC<{at?: number; dx?: number; dy?: number; children: React.ReactNode}> = ({at = 0, dx = 0, dy = 500, children}) => {
  const s = usePop(at, {damping: 13, stiffness: 120, mass: 1});
  return <g transform={`translate(${dx * (1 - s)} ${dy * (1 - s)})`}>{children}</g>;
};

const Rays: React.FC<{x: number; y: number; color?: string; o?: number; n?: number}> = ({x, y, color = C.honeyLight, o = 0.18, n = 14}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${f * 0.6})`} opacity={o}>
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * 360;
        return <path key={i} d="M 0 0 L -70 -1100 L 70 -1100 Z" fill={color} transform={`rotate(${a})`} />;
      })}
    </g>
  );
};

const QMark: React.FC<{x: number; y: number; at: number; rot?: number; size?: number}> = ({x, y, at, rot = 0, size = 140}) => (
  <Pop x={x} y={y} at={at} rot={rot}>
    <Float amp={10} speed={0.12} phase={x}>
      <text textAnchor="middle" y={size * 0.35} fontFamily={FONT} fontWeight={900} fontSize={size} fill={C.honey} stroke={C.ink} strokeWidth={14} paintOrder="stroke">?</text>
    </Float>
  </Pop>
);

const Thermometer: React.FC<{x: number; y: number; level: number; color?: string}> = ({x, y, level, color = C.red}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-34} y={-260} width={68} height={300} rx={34} fill={C.white} {...S} />
    <rect x={-16} y={-240 + (1 - level) * 250} width={32} height={260 - (1 - level) * 250} rx={16} fill={color} />
    <circle cx={0} cy={70} r={62} fill={color} {...S} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={14} x2={34} y1={-200 + i * 55} y2={-200 + i * 55} stroke={C.ink} strokeWidth={6} />)}
  </g>
);

const Flames: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-90, 0, 90].map((dx, i) => {
        const h = 120 + Math.sin(f * 0.7 + i * 2) * 25;
        return (
          <g key={i} transform={`translate(${dx} 0)`}>
            <path d={`M 0 ${-h} Q 55 -40 40 0 L -40 0 Q -55 -40 0 ${-h} Z`} fill={C.amber} {...S} strokeWidth={6} />
            <path d={`M 0 ${-h * 0.6} Q 25 -25 18 -4 L -18 -4 Q -25 -25 0 ${-h * 0.6} Z`} fill={C.honeyLight} />
          </g>
        );
      })}
    </g>
  );
};

const Drop: React.FC<{mood?: 'happy' | 'wow'; seed?: number}> = ({mood = 'happy', seed = 0}) => (
  <g>
    <path d="M 0 -170 Q 120 -20 110 50 Q 100 140 0 140 Q -100 140 -110 50 Q -120 -20 0 -170 Z" fill="#5EC8FF" {...S} />
    <path d="M -60 10 Q -70 60 -40 95" stroke={C.white} strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.6} />
    <Eyes y={20} gap={80} r={26} mood={mood} seed={seed} />
    <Mouth y={70} w={46} mood={mood} />
  </g>
);

/* ---------- escenas ---------- */

const Hook: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Rays x={CX} y={1120} />
      <QMark x={170} y={820} at={w(0)} rot={-14} />
      <QMark x={760} y={780} at={w(1, 3)} rot={12} size={110} />
      <Enter at={0}>
        <g transform={`translate(${CX} 1160) scale(1.25)`}>
          <Shadow x={0} y={205} rx={190} />
          <Float amp={14} speed={0.15}>
            <HoneyJar mood="wow" talk look={[0, -0.6]} glow={1} />
          </Float>
        </g>
      </Enter>
      <Counter to={3000} a={w(7)} b={w(9, 4)} x={CX} y={650} size={170} color={C.honey} />
      <Label text="AÑOS" x={CX} y={800} at={w(9)} size={64} bg={C.cream} rot={4} />
    </g>
  );
};

const Perfect: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Rays x={CX} y={1100} o={0.25} />
      <g transform={`translate(${CX} 1120) scale(1.35)`}>
        <Shadow x={0} y={205} rx={190} />
        <Float amp={10} speed={0.2} rotAmp={3}>
          <HoneyJar mood="wink" arms="up" />
        </Float>
      </g>
      <Sparkles x={CX} y={1050} spread={360} n={12} at={0} />
      <Badge ok x={CX + 250} y={760} at={w(12)} r={85} />
      <Label text="¡PERFECTA!" x={CX - 30} y={640} at={w(12)} size={78} />
    </g>
  );
};

const Pyramid: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -300 L 340 0 L -340 0 Z" fill="#F2B45A" {...S} />
    <path d="M 0 -300 L 340 0 L 60 0 Z" fill="#D98C3A" {...S} />
    {[1, 2, 3].map((i) => <line key={i} x1={-340 + i * 75} y1={-i * 66} x2={(340 - i * 75) * 0.18} y2={-i * 66} stroke={C.ink} strokeWidth={4} opacity={0.25} />)}
  </g>
);

const Egypt: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  return (
    <g>
      <circle cx={720} cy={720 - f * 0.4} r={150} fill="#FFF1B8" opacity={0.95} />
      <circle cx={720} cy={720 - f * 0.4} r={210} fill="#FFF1B8" opacity={0.25} />
      <Enter at={w(15)} dy={700}>
        <Pyramid x={CX + 230} y={1380} s={0.75} />
        <Pyramid x={CX - 120} y={1420} s={1.1} />
      </Enter>
      <path d={`M -100 1420 Q 300 ${1340 + Math.sin(f * 0.05) * 10} 600 1420 T 1200 1400 L 1200 2000 L -100 2000 Z`} fill="#E9A54E" {...S} />
      <path d="M -100 1560 Q 400 1480 1200 1580 L 1200 2000 L -100 2000 Z" fill="#D88E3C" />
      <g transform={`translate(${-200 + f * 4} 860)`}>
        <path d="M 0 0 q 30 -20 60 0 q 30 -20 60 0" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      </g>
      <Label text="EGIPTO" x={CX} y={640} at={w(18)} size={84} bg={C.cream} rot={-4} />
    </g>
  );
};

const Tomb: React.FC = () => {
  const w = useW();
  const bricks = [];
  for (let r = -3; r < 22; r++)
    for (let c = 0; c < 7; c++)
      bricks.push(<rect key={`${r}-${c}`} x={c * 170 - (r % 2) * 85 - 20} y={r * 80} width={160} height={70} rx={8} fill="#4A3352" opacity={0.6} />);
  return (
    <g>
      {bricks}
      {/* jeroglíficos */}
      <g opacity={0.5} stroke={C.honeyLight} strokeWidth={6} fill="none">
        <ellipse cx={150} cy={620} rx={50} ry={24} />
        <circle cx={150} cy={620} r={12} fill={C.honeyLight} />
        <path d="M 100 650 q 30 30 60 0" />
        <path d="M 820 640 l 0 120 m -30 -90 l 60 0" />
      </g>
      <circle cx={CX - 330} cy={950} r={260} fill={C.amber} opacity={0.18} />
      <Enter at={0} dx={-700} dy={0}>
        <g transform={`translate(${CX - 170} 1200) scale(0.95)`}>
          <Shadow x={0} y={205} rx={150} />
          <Explorer look={[1, 0.2]} />
        </g>
      </Enter>
      <g transform={`translate(${CX + 220} 1340)`}>
        <rect x={-150} y={-20} width={300} height={200} fill="#6B4A6E" {...S} />
        <rect x={-175} y={-50} width={350} height={40} fill="#7E5A80" {...S} />
      </g>
      <Pop x={CX + 220} y={1135} at={w(22)}>
        <g transform="scale(0.62)">
          <HoneyJar mood="happy" glow={1} label="ANTIGUA" seed={2} />
        </g>
      </Pop>
      <Sparkles x={CX + 220} y={1120} spread={190} n={7} at={w(22)} seed="t" />
      <Label text="+3.000 AÑOS" x={CX} y={650} at={w(28)} size={80} />
    </g>
  );
};

const Edible: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const dip = spring({frame: f - 2, fps: 30, config: {damping: 14, stiffness: 80}});
  const lift = interpolate(f, [w(32), w(33)], [0, 1], clamp);
  const sy = interpolate(dip, [0, 1], [-700, 0]) - lift * 220;
  return (
    <g>
      <Rays x={CX} y={1150} o={0.15} />
      <g transform={`translate(${CX} 1220) scale(1.2)`}>
        <Shadow x={0} y={205} rx={190} />
        <HoneyJar mood={lift > 0.5 ? 'happy' : 'wow'} look={[0.3, -1]} talk={lift > 0.5} />
      </g>
      {/* cuchara */}
      <g transform={`translate(${CX + 70} ${930 + sy}) rotate(${20 - lift * 10})`}>
        <rect x={-16} y={-420} width={32} height={380} rx={16} fill="#D9D9E6" {...S} />
        <ellipse cx={0} cy={0} rx={62} ry={80} fill="#D9D9E6" {...S} />
        <ellipse cx={0} cy={10} rx={46} ry={60} fill={C.honey} opacity={lift} />
        <path d={`M -10 70 Q 0 ${90 + lift * 120} 10 70`} fill={C.honey} stroke={C.ink} strokeWidth={5} opacity={lift} />
      </g>
      <Badge ok x={CX + 260} y={800} at={w(33)} r={85} />
      <Label text="COMESTIBLE" x={CX - 20} y={640} at={w(33)} size={78} bg={C.green} />
    </g>
  );
};

const Secret: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 40], [1, 1.25], clamp);
  return (
    <g>
      <Rays x={CX} y={1050} o={0.12} color={C.teal} />
      <Pop x={CX} y={1050} at={w(35, -6)}>
        <g transform={`scale(${z})`}>
          <path d="M -120 -60 L -120 -150 Q -120 -270 0 -270 Q 120 -270 120 -150 L 120 -60" fill="none" stroke={C.ink} strokeWidth={60} strokeLinecap="round" />
          <path d="M -120 -60 L -120 -150 Q -120 -270 0 -270 Q 120 -270 120 -150 L 120 -60" fill="none" stroke="#C9CDE0" strokeWidth={42} strokeLinecap="round" />
          <rect x={-210} y={-80} width={420} height={330} rx={50} fill={C.honey} {...S} />
          <circle cx={0} cy={50} r={44} fill={C.ink} />
          <path d="M -24 70 L 24 70 L 34 170 L -34 170 Z" fill={C.ink} />
        </g>
      </Pop>
      <QMark x={CX + 260} y={800} at={w(35)} rot={14} size={170} />
      <QMark x={CX - 270} y={860} at={w(35, 4)} rot={-14} size={120} />
    </g>
  );
};

const Water: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const fill = interpolate(f, [w(41), w(41, 18)], [0, 0.17], {...clamp, easing: Easing.out(Easing.cubic)});
  const bx = CX + 200;
  return (
    <g>
      <Enter at={0} dx={-500} dy={0}>
        <g transform={`translate(${CX - 180} 1230) scale(0.85)`}>
          <Shadow x={0} y={205} rx={180} />
          <Float amp={8} speed={0.12}><HoneyJar mood="happy" look={[1, 0]} /></Float>
        </g>
      </Enter>
      <Enter at={4} dx={500} dy={0}>
        <g>
          <rect x={bx - 95} y={800} width={190} height={600} rx={40} fill={C.white} opacity={0.25} {...S} />
          <clipPath id="wbar"><rect x={bx - 95} y={800} width={190} height={600} rx={40} /></clipPath>
          <g clipPath="url(#wbar)">
            <rect x={bx - 95} y={1400 - 600 * fill} width={190} height={600} fill="#5EC8FF" />
            <path d={`M ${bx - 95} ${1400 - 600 * fill} q 24 -14 48 0 t 48 0 t 48 0 t 48 0`} fill="#5EC8FF" />
          </g>
          <rect x={bx - 95} y={800} width={190} height={600} rx={40} fill="none" {...S} />
          {[0.25, 0.5, 0.75].map((p) => <line key={p} x1={bx + 50} x2={bx + 95} y1={1400 - 600 * p} y2={1400 - 600 * p} stroke={C.ink} strokeWidth={6} />)}
        </g>
      </Enter>
      <Pop x={bx} y={700} at={w(38)}>
        <g transform="scale(0.55)"><Float amp={14} speed={0.18}><Drop mood="wow" /></Float></g>
      </Pop>
      <Counter to={17} a={w(41)} b={w(41, 18)} x={CX - 180} y={720} size={180} fmt={(n) => `${Math.round(n)}%`} color={C.cream} />
      <Label text="AGUA" x={CX - 180} y={865} at={w(43)} size={62} bg="#5EC8FF" rot={4} />
    </g>
  );
};

const Germs: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const dry = interpolate(f, [w(51), w(53, 4)], [0, 1], clamp);
  const pos: [number, number, number][] = [
    [CX - 290, 900, -600],
    [CX + 280, 960, 600],
    [CX - 250, 1380, -600],
    [CX + 260, 1360, 600],
  ];
  return (
    <g>
      <g transform={`translate(${CX} 1160) scale(0.8)`}>
        <Shadow x={0} y={205} rx={180} />
        <HoneyJar mood={dry > 0.6 ? 'happy' : 'worried'} look={[0, -0.4]} />
      </g>
      {pos.map(([x, y, dx], i) => {
        const s = spring({frame: f - i * 4, fps: 30, config: {damping: 14, stiffness: 70}});
        const jit = Math.sin(f * 0.4 + i) * 8 * (1 - dry);
        return (
          <g key={i} transform={`translate(${x + dx * (1 - s) + jit} ${y + Math.cos(f * 0.3 + i) * 10})`}>
            <Bacteria dry={dry} seed={i} r={78} />
            {/* gotas que se evaporan */}
            {[0, 1, 2].map((k) => {
              const t = f - w(51) - k * 5;
              const o = interpolate(t, [0, 6, 20], [0, 1, 0], clamp);
              return <path key={k} d="M 0 -18 Q 14 0 0 12 Q -14 0 0 -18 Z" fill="#5EC8FF" opacity={o} transform={`translate(${(k - 1) * 40} ${-90 - t * 5})`} />;
            })}
          </g>
        );
      })}
      <Label text="¡SE SECAN!" x={CX} y={650} at={w(52)} size={76} bg={C.cream} />
      <Badge ok={false} x={CX + 300} y={780} at={w(54)} r={80} />
    </g>
  );
};

const Gauge: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const ph = interpolate(f, [w(61), w(63, 6)], [7, 3.9], {...clamp, easing: Easing.out(Easing.back(2))});
  const wob = f < w(61) ? Math.sin(f * 0.5) * 0.4 : 0;
  const ang = -180 + ((ph + wob) / 14) * 180;
  const cols = ['#FF4D5A', '#FF8C1A', '#FFB627', '#FFD166', '#6CD47E', '#3DD6C6', '#4F8BFF'];
  const R = 330;
  return (
    <g transform={`translate(${CX} 1260)`}>
      <Enter at={0}>
        <g>
          {cols.map((c, i) => {
            const a0 = Math.PI + (i / 7) * Math.PI;
            const a1 = Math.PI + ((i + 1) / 7) * Math.PI;
            return (
              <path key={i} d={`M ${Math.cos(a0) * R} ${Math.sin(a0) * R} A ${R} ${R} 0 0 1 ${Math.cos(a1) * R} ${Math.sin(a1) * R} L ${Math.cos(a1) * 180} ${Math.sin(a1) * 180} A 180 180 0 0 0 ${Math.cos(a0) * 180} ${Math.sin(a0) * 180} Z`}
                fill={c} {...S} />
            );
          })}
          <text x={-300} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.cream}>0</text>
          <text x={300} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.cream}>14</text>
          <g transform={`rotate(${ang})`}>
            <path d="M 0 -22 L 290 0 L 0 22 Z" fill={C.ink} />
          </g>
          <circle r={44} fill={C.cream} {...S} />
        </g>
      </Enter>
      <g transform="translate(0 -520)">
        <Counter from={7} to={3.9} a={w(61)} b={w(63, 6)} x={0} y={0} size={150} fmt={(n) => `pH ${n.toFixed(1).replace('.', ',')}`} color={C.honey} at={w(59)} />
      </g>
      <Label text="ÁCIDA" x={0} y={-330} at={w(58)} size={70} bg={C.red} fg={C.white} rot={5} />
    </g>
  );
};

const OrangeEq: React.FC = () => {
  const w = useW();
  return (
    <g>
      <Enter at={0} dx={-500} dy={0}>
        <g transform={`translate(${CX - 210} 1150) scale(0.72)`}>
          <Shadow x={0} y={205} rx={180} />
          <Float amp={10} speed={0.15}><HoneyJar mood="happy" look={[1, 0]} /></Float>
        </g>
      </Enter>
      <Pop x={CX + 220} y={1170} at={w(66)}>
        <g transform="scale(0.95)">
          <Float amp={10} speed={0.15} phase={2}><Orange mood="wow" /></Float>
        </g>
      </Pop>
      <Pop x={CX + 10} y={1160} at={w(65)}>
        <text textAnchor="middle" y={40} fontFamily={FONT} fontWeight={900} fontSize={140} fill={C.cream} stroke={C.ink} strokeWidth={12} paintOrder="stroke">≈</text>
      </Pop>
      <Label text="pH 3,9" x={CX - 200} y={820} at={0} size={60} bg={C.honey} rot={-5} />
      <Label text="ZUMO DE NARANJA" x={CX} y={650} at={w(68)} size={58} bg="#FF9F1C" rot={3} />
    </g>
  );
};

const BeeEnzyme: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const bx = interpolate(p, [0, 1], [-250, CX + 120]);
  const by = 860 + Math.sin(p * Math.PI * 2) * -120 + Math.sin(f * 0.2) * 18;
  const pour = f > w(74);
  return (
    <g>
      <path d={`M -250 860 Q ${CX - 300} 600 ${CX - 100} 880 T ${bx} ${by}`} fill="none" stroke={C.cream} strokeWidth={8} strokeDasharray="4 26" strokeLinecap="round" opacity={0.6} />
      <g transform={`translate(${CX} 1290) scale(0.72)`}>
        <Shadow x={0} y={205} rx={180} />
        <HoneyJar mood={pour ? 'happy' : 'wow'} look={[0.5, -1]} glow={pour ? 1 : 0} />
      </g>
      {pour
        ? new Array(10).fill(0).map((_, i) => {
            const t = (f - w(74) - i * 3) % 30;
            if (t < 0) return null;
            const x = bx - 60 + random('e' + i) * 60;
            const y = by + 80 + t * 9;
            return <circle key={i} cx={x - t * 3} cy={y} r={10} fill={C.teal} stroke={C.ink} strokeWidth={4} opacity={interpolate(t, [0, 25, 30], [1, 1, 0])} />;
          })
        : null}
      <g transform={`translate(${bx} ${by}) scale(0.62) rotate(${Math.sin(f * 0.2) * 6})`}>
        <Bee flip mood="happy" look={[-0.4, 0.8]} />
      </g>
      <Sparkles x={CX} y={1200} spread={220} n={8} at={w(75)} color={C.teal} seed="enz" />
      <Label text="ENZIMA" x={CX} y={640} at={w(75)} size={80} bg={C.teal} rot={-4} />
    </g>
  );
};

const Peroxide: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const bx = CX + 200;
  return (
    <g>
      <Enter at={0} dx={-500} dy={0}>
        <g transform={`translate(${CX - 210} 1150) scale(0.9)`}>
          <Float amp={12} speed={0.16}><Drop mood="happy" seed={3} /></Float>
        </g>
      </Enter>
      <Arrow d={`M ${CX - 90} 1000 Q ${CX} 900 ${CX + 70} 1000`} head={[CX + 70, 1000, 55]} at={w(80)} />
      <Pop x={bx} y={1150} at={w(80)}>
        <g>
          {/* frasco */}
          <rect x={-55} y={-260} width={110} height={70} rx={16} fill="#E9EEF7" {...S} />
          <path d="M -60 -190 L 60 -190 L 60 -150 Q 140 -120 140 -40 L 140 170 Q 140 200 110 200 L -110 200 Q -140 200 -140 170 L -140 -40 Q -140 -120 -60 -150 Z" fill="#B9E6FF" {...S} />
          <rect x={-105} y={0} width={210} height={110} rx={18} fill={C.white} {...S} strokeWidth={6} />
          <text x={0} y={72} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill={C.ink}>H₂O₂</text>
          {new Array(6).fill(0).map((_, i) => {
            const t = (f + i * 9) % 50;
            return <circle key={i} cx={-80 + i * 32} cy={180 - t * 6} r={8 + (i % 3) * 3} fill={C.white} opacity={interpolate(t, [0, 40, 50], [0.9, 0.8, 0])} />;
          })}
        </g>
      </Pop>
      <Label text="AGUA OXIGENADA" x={CX} y={650} at={w(81)} size={62} bg="#B9E6FF" rot={-3} />
    </g>
  );
};

const Shield: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  return (
    <g>
      <Rays x={CX} y={1100} o={0.2} color={C.teal} />
      <Pop x={CX} y={1120} at={0}>
        <g transform={`scale(${1 + Math.sin(f * 0.15) * 0.02})`}>
          <path d="M 0 -330 L 280 -230 Q 290 120 0 330 Q -290 120 -280 -230 Z" fill={C.teal} {...S} strokeWidth={10} />
          <path d="M 0 -280 L 230 -195 Q 235 95 0 275 Q -235 95 -230 -195 Z" fill="#7FE7DC" />
          <g transform="translate(0 20) scale(0.6)"><HoneyJar mood="happy" /></g>
        </g>
      </Pop>
      {[0, 1, 2].map((i) => {
        const t = f - 8 - i * 6;
        const x = interpolate(t, [0, 10, 25], [i % 2 ? 900 : 0, i % 2 ? 760 : 160, i % 2 ? 1100 : -200], clamp);
        const y = 850 + i * 240;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${t * 8})`} opacity={interpolate(t, [0, 2], [0, 1], clamp)}>
            <Bacteria seed={i} r={55} dry={0.2} />
          </g>
        );
      })}
      <Label text="ANTISÉPTICO" sub="NATURAL" x={CX} y={660} at={w(84)} size={70} bg={C.green} rot={-3} />
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
      <Pop x={CX} y={1130} at={w(86)}>
        <g transform={`rotate(${Math.sin(f * 0.9) * 4})`}>
          <path d="M 0 -300 L 300 230 L -300 230 Z" fill={C.honey} {...S} strokeWidth={14} strokeLinejoin="round" />
          <rect x={-26} y={-150} width={52} height={230} rx={26} fill={C.ink} />
          <circle cx={0} cy={150} r={32} fill={C.ink} />
        </g>
      </Pop>
      <Label text="PERO…" x={CX - 160} y={650} at={w(86)} size={78} bg={C.cream} rot={-6} out={w(90, -3)} />
      <Label text="¡PROBLEMA!" x={CX} y={650} at={w(90)} size={84} bg={C.red} fg={C.white} rot={3} />
    </g>
  );
};

const Shelf: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const jars: [number, boolean, number][] = [
    [CX - 280, false, 0],
    [CX, true, 1],
    [CX + 280, false, 2],
  ];
  return (
    <g>
      <rect x={-20} y={1300} width={1120} height={40} fill="#B07A4A" {...S} />
      <rect x={-20} y={1340} width={1120} height={220} fill="#7A4A2E" opacity={0.7} />
      <rect x={-20} y={820} width={1120} height={30} fill="#B07A4A" {...S} />
      {jars.map(([x, pale, i]) => (
        <Pop key={i} x={x} y={1170} at={w(91, i * 3)}>
          <g transform={`scale(0.6) rotate(${pale ? Math.sin(f * 0.4) * 4 : 0})`}>
            <HoneyJar pale={pale} mood={pale ? 'worried' : 'happy'} look={pale ? [0, 0] : [i === 0 ? 1 : -1, 0]} label={pale ? '¿MIEL?' : 'MIEL'} seed={i + 5} />
          </g>
        </Pop>
      ))}
      <QMark x={CX} y={930} at={w(94)} size={120} />
      <Label text="NO TODA ES IGUAL" x={CX} y={650} at={w(98, -4)} size={60} bg={C.cream} rot={-3} />
    </g>
  );
};

const Heat: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const lvl = interpolate(f, [w(101), w(102, 15)], [0.25, 0.95], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <g>
      <g transform={`translate(${CX - 90} 1100) scale(0.72) translate(${Math.sin(f * 1.6) * 4 * lvl} 0)`}>
        <HoneyJar mood={lvl > 0.6 ? 'sad' : 'worried'} look={[0, 1]} />
      </g>
      <rect x={CX - 320} y={1255} width={460} height={34} rx={10} fill="#5A5A70" {...S} />
      <Flames x={CX - 90} y={1390} s={0.9} />
      {/* ondas de calor */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${CX - 200 + i * 100} 890 q 20 -30 0 -60 q -20 -30 0 -60`} fill="none" stroke={C.amber} strokeWidth={10} strokeLinecap="round"
          opacity={0.4 + 0.4 * Math.sin(f * 0.3 + i)} transform={`translate(0 ${-((f * 2 + i * 20) % 40)})`} />
      ))}
      <Thermometer x={CX + 300} y={1150} level={lvl} />
      <Label text="DEMASIADO CALOR" x={CX} y={650} at={w(101)} size={58} bg={C.amber} rot={3} />
      <Badge ok={false} x={CX + 120} y={880} at={w(102, 8)} r={70} />
    </g>
  );
};

const Syrup: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const pour = interpolate(f, [w(105), w(105, 8)], [0, 1], clamp);
  const pale = interpolate(f, [w(105, 5), w(107, 10)], [0, 1], clamp);
  return (
    <g>
      <g transform={`translate(${CX - 40} 1220) scale(0.75)`}>
        <Shadow x={0} y={205} rx={180} />
        <g opacity={1 - pale}><HoneyJar mood="worried" look={[0.6, -1]} seed={8} /></g>
        <g opacity={pale}><HoneyJar mood="sad" pale look={[0.6, -1]} seed={9} label="¿MIEL?" /></g>
      </g>
      {pour > 0 ? (
        <path d={`M ${CX + 120} 830 Q ${CX + 40} 870 ${CX - 10} ${870 + 200 * pour}`} fill="none" stroke="#C9762E" strokeWidth={26} strokeLinecap="round" opacity={0.9} />
      ) : null}
      <Enter at={0} dx={500} dy={-300}>
        <g transform={`translate(${CX + 230} 760) rotate(${-110 * pour + 0})`}>
          <path d="M -70 -180 L 70 -180 L 80 140 Q 80 170 50 170 L -50 170 Q -80 170 -80 140 Z" fill="#E59A4C" {...S} />
          <rect x={-35} y={-250} width={70} height={74} rx={10} fill="#C0392B" {...S} />
          <rect x={-60} y={-40} width={120} height={110} rx={12} fill={C.white} {...S} strokeWidth={6} />
          <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.ink}>SIROPE</text>
        </g>
      </Enter>
      <Label text="+ SIROPES" x={CX - 60} y={650} at={w(107)} size={70} bg="#E59A4C" rot={-4} />
      <Badge ok={false} x={CX + 280} y={1150} at={w(107, 6)} r={75} />
    </g>
  );
};

const Magic: React.FC = () => {
  const w = useW();
  return (
    <g>
      <g transform={`translate(${CX} 1180) scale(0.95)`}>
        <Shadow x={0} y={205} rx={180} />
        <HoneyJar mood="sad" pale label="¿MIEL?" seed={11} />
      </g>
      <Sparkles x={CX} y={1140} spread={330} n={14} at={0} fade={w(110)} />
      <Label text="MAGIA" x={CX} y={660} at={w(113, -3)} size={84} bg={C.honey} rot={-3} />
      <Strike x1={CX - 210} y1={680} x2={CX + 210} y2={640} at={w(113, 6)} w={22} />
    </g>
  );
};

const Crystal: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const cr = interpolate(f, [w(117), w(117, 14)], [0, 1], clamp);
  const ok = f >= w(118);
  return (
    <g>
      <Rays x={CX} y={1150} o={ok ? 0.22 : 0.08} color={C.cream} />
      <g transform={`translate(${CX} 1190) scale(1.05)`}>
        <Shadow x={0} y={205} rx={190} />
        <Float amp={8} speed={0.15}><HoneyJar crystal={cr} mood={ok ? 'happy' : 'wow'} seed={12} arms={ok ? 'up' : 'none'} /></Float>
      </g>
      <Label text="¡OJO!" x={CX - 200} y={860} at={w(115)} size={70} bg={C.red} fg={C.white} rot={-8} out={w(117, -2)} />
      <Label text="CRISTALIZA" x={CX} y={650} at={w(117)} size={76} bg={C.cream} rot={-3} out={w(118, -2)} />
      <Label text="NO ESTÁ MALA" x={CX} y={650} at={w(118)} size={68} bg={C.green} rot={3} />
      <Badge ok x={CX + 260} y={860} at={w(120)} r={80} />
    </g>
  );
};

const BainMarie: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const lvl = interpolate(f, [w(122), w(128)], [0.15, 0.45], clamp);
  return (
    <g>
      <g transform={`translate(${CX - 80} 1150)`}>
        <g transform="translate(0 -40) scale(0.55)"><HoneyJar mood="happy" crystal={interpolate(f, [0, 60], [0.8, 0], clamp)} seed={13} /></g>
        {/* cazo */}
        <path d="M -240 -20 L 240 -20 L 220 200 Q 215 230 185 230 L -185 230 Q -215 230 -220 200 Z" fill="#9AA3BD" {...S} />
        <path d="M -232 40 L 232 40 L 220 200 Q 215 230 185 230 L -185 230 Q -215 230 -220 200 Z" fill="#5EC8FF" opacity={0.75} />
        <path d="M 240 0 L 400 -30" stroke={C.ink} strokeWidth={34} strokeLinecap="round" />
        <path d="M 240 0 L 400 -30" stroke="#6B6F86" strokeWidth={20} strokeLinecap="round" />
        <rect x={-260} y={-34} width={520} height={30} rx={14} fill="#B8C0D8" {...S} />
        {[0, 1, 2].map((i) => {
          const t = (f + i * 15) % 45;
          return (
            <path key={i} d={`M ${-120 + i * 120} -100 q 25 -35 0 -70 q -25 -35 0 -70`} fill="none" stroke={C.white} strokeWidth={14} strokeLinecap="round"
              opacity={interpolate(t, [0, 15, 45], [0, 0.7, 0])} transform={`translate(0 ${-t * 3})`} />
          );
        })}
        <Flames x={0} y={330} s={0.6} />
      </g>
      <Thermometer x={CX + 300} y={1050} level={lvl} color={C.teal} />
      <Label text="BAÑO MARÍA" x={CX} y={650} at={w(123)} size={66} bg="#B9E6FF" rot={-3} out={w(128, -3)} />
      <Label text="< 40 °C" x={CX} y={650} at={w(128)} size={84} bg={C.teal} rot={3} />
    </g>
  );
};

const Kilo: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const drop = spring({frame: f - 2, fps: 30, config: {damping: 9, stiffness: 140}});
  return (
    <g>
      <Rays x={CX} y={1150} o={0.15} />
      <g transform={`translate(${CX} ${interpolate(drop, [0, 1], [500, 1035])}) scale(0.7)`}>
        <HoneyJar mood="happy" seed={14} label="1 KG" />
      </g>
      {/* báscula */}
      <g transform={`translate(${CX} 1290) translate(0 ${Math.max(0, Math.sin(Math.min(drop, 1) * Math.PI)) * 10})`}>
        <rect x={-230} y={-30} width={460} height={34} rx={12} fill="#D9D9E6" {...S} />
        <path d="M -200 4 L 200 4 L 230 200 L -230 200 Z" fill="#E0E3F0" {...S} />
        <rect x={-110} y={60} width={220} height={100} rx={16} fill="#20313B" {...S} />
        <text x={0} y={132} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill="#7CFFB2">
          {f > 8 ? '1,000' : '0,000'}
        </text>
      </g>
      <Label text="1 KILO" x={CX} y={650} at={w(133)} size={84} bg={C.honey} rot={-4} />
    </g>
  );
};

const Flower: React.FC<{x: number; y: number; c: string; s?: number; at: number}> = ({x, y, c, s = 1, at}) => {
  const f = useCurrentFrame();
  const g = usePop(at, {damping: 10, stiffness: 120, mass: 1});
  return (
    <g transform={`translate(${x} ${y}) scale(${s * g}) rotate(${Math.sin(f * 0.08 + x) * 5})`}>
      <path d="M 0 0 L 0 160" stroke="#3E9B4F" strokeWidth={12} />
      {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={0} cy={-40} rx={26} ry={42} fill={c} {...S} strokeWidth={6} transform={`rotate(${i * 60})`} />)}
      <circle r={30} fill={C.honey} {...S} strokeWidth={6} />
    </g>
  );
};

const Flowers: React.FC = () => {
  const w = useW();
  const f = useCurrentFrame();
  const cols = ['#FF7AA2', '#FFFFFF', '#B48CFF', '#FF9F1C', '#FF4D5A'];
  const flowers = [];
  for (let i = 0; i < 16; i++) {
    const x = -40 + (i % 8) * 150 + (i >= 8 ? 75 : 0);
    const y = i >= 8 ? 1430 : 1300;
    flowers.push(<Flower key={i} x={x} y={y} c={cols[i % 5]} s={i >= 8 ? 1 : 0.8} at={i * 1.5} />);
  }
  const bx = interpolate(f, [0, 70], [-150, 980]);
  const by = 1110 + Math.sin(f * 0.25) * 70;
  return (
    <g>
      <circle cx={820} cy={560} r={110} fill="#FFF1B8" />
      <g opacity={0.9}>
        <ellipse cx={200 + f * 0.6} cy={1000} rx={120} ry={45} fill={C.white} />
        <ellipse cx={260 + f * 0.6} cy={970} rx={80} ry={45} fill={C.white} />
      </g>
      <rect x={-20} y={1380} width={1120} height={600} fill="#59B35F" />
      {flowers}
      <g transform={`translate(${bx} ${by}) scale(0.5) rotate(${Math.cos(f * 0.25) * 10})`}>
        <Bee seed={20} />
      </g>
      <Counter to={4000000} a={w(136)} b={w(138, 10)} x={CX} y={680} size={128} color={C.white} at={w(135)} />
      <Label text="FLORES" x={CX} y={830} at={w(140)} size={66} bg="#FF7AA2" rot={4} />
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
        <g transform={`translate(${CX - 60} 1210) scale(0.95)`}>
          <Shadow x={0} y={205} rx={180} />
          <Float amp={10} speed={0.18}><HoneyJar mood="happy" arms="wave" talk={f < w(154, 15)} seed={15} /></Float>
        </g>
      </Enter>
      <Pop x={CX + 220} y={830} at={w(141)} rot={6}>
        <path d="M -150 -90 Q -150 -130 -110 -130 L 110 -130 Q 150 -130 150 -90 L 150 40 Q 150 80 110 80 L -40 80 L -90 140 L -80 80 L -110 80 Q -150 80 -150 40 Z" fill={C.white} {...S} />
        <text x={0} y={-5} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.ink}>¿Y TÚ?</text>
      </Pop>
      <Label text="COMENTA" x={CX - 40} y={640} at={w(146)} size={66} bg={C.cream} rot={-4} out={w(151, -3)} />
      <Pop x={CX} y={640} at={w(151)} rot={-2}>
        <g transform={`scale(${1 + Math.max(0, Math.sin((f - w(151)) * 0.25)) * 0.05})`}>
          <rect x={-250} y={-70} width={500} height={140} rx={70} fill={C.red} {...S} strokeWidth={10} />
          <text x={30} y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill={C.white}>SÍGUEME</text>
          <g transform={`translate(-185 0) rotate(${Math.sin(f * 0.8) * 15})`}>
            <path d="M -30 20 Q -30 -40 0 -40 Q 30 -40 30 20 L 38 30 L -38 30 Z" fill={C.honey} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
            <circle cx={0} cy={38} r={9} fill={C.honey} stroke={C.ink} strokeWidth={5} />
          </g>
        </g>
      </Pop>
      <Sparkles x={CX} y={1100} spread={380} n={10} at={w(151)} seed="cta" />
    </g>
  );
};

export const SCENES: SceneDef[] = [
  {id: 'hook', anchor: 0, bg: ['#2D1B4E', '#8E3B73'], C: Hook},
  {id: 'perfect', anchor: 10, bg: ['#3A1F5C', '#B04A7A'], C: Perfect},
  {id: 'egypt', anchor: 13, bg: ['#FF9E5E', '#FFD98A'], C: Egypt},
  {id: 'tomb', anchor: 19, bg: ['#22162F', '#4A2C4E'], C: Tomb},
  {id: 'edible', anchor: 30, bg: ['#3A1F5C', '#C0567A'], C: Edible},
  {id: 'secret', anchor: 34, bg: ['#1E1640', '#4B2366'], C: Secret},
  {id: 'water', anchor: 36, bg: ['#23305E', '#4B6CB7'], C: Water},
  {id: 'germs', anchor: 44, bg: ['#22324A', '#3F6E5A'], C: Germs},
  {id: 'acid', anchor: 55, bg: ['#3B1F5C', '#D0703A'], C: Gauge},
  {id: 'orange', anchor: 64, bg: ['#5A2A6B', '#FF9F4A'], C: OrangeEq},
  {id: 'bee', anchor: 69, bg: ['#2D1B4E', '#8E3B73'], C: BeeEnzyme},
  {id: 'peroxide', anchor: 76, bg: ['#1E3A5F', '#3DA5B8'], C: Peroxide},
  {id: 'shield', anchor: 83, bg: ['#1F3F55', '#2FA59A'], C: Shield},
  {id: 'twist', anchor: 86, bg: ['#3A0A14', '#B3202E'], shakeAt: 86, C: Twist},
  {id: 'shelf', anchor: 91, bg: ['#4A1730', '#C2414F'], C: Shelf},
  {id: 'heat', anchor: 99, bg: ['#4A1022', '#E0532E'], C: Heat},
  {id: 'syrup', anchor: 103, bg: ['#3B1530', '#9C3A55'], C: Syrup},
  {id: 'magic', anchor: 108, bg: ['#2A1530', '#5A3050'], C: Magic},
  {id: 'crystal', anchor: 114, bg: ['#2D1B4E', '#6A6FB5'], C: Crystal},
  {id: 'bain', anchor: 121, bg: ['#1F3B5C', '#5A8FBF'], C: BainMarie},
  {id: 'kilo', anchor: 129, bg: ['#2D1B4E', '#8E3B73'], C: Kilo},
  {id: 'flowers', anchor: 134, bg: ['#4FA3E0', '#BFE6FF'], C: Flowers},
  {id: 'cta', anchor: 141, bg: ['#2D1B4E', '#C0567A'], C: CTA},
];
