import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/roma.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Stage, Stamp, Stat} from '../engine/kit';
import {cinzel, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop} from '../engine/util';

const GOLD = '#ffc94a';
const RED = '#e8233a';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #4a0d12 0%, #12030a 70%)'}} />
		{/* columnas */}
		{[60, 1020].map((x, i) => (
			<div key={i} style={{position: 'absolute', left: x - 55 + (i ? -1 : 1) * Math.sin(frame / 50) * 8, top: 0, width: 110, height: 1920, background: 'repeating-linear-gradient(90deg, #3a2a20 0 18px, #5a4636 18px 26px)', opacity: 0.45}} />
		))}
		<Particles frame={frame} color="#ff8a2a" n={40} size={7} blur={1} />
	</AbsoluteFill>
);

const RomanTitle: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = GOLD, size = 96}) => (
	<div style={{fontFamily: cinzel, fontWeight: 900, fontSize: size, color, letterSpacing: 6, textAlign: 'center', lineHeight: 1.05, whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: `0 0 30px ${color}88, 0 8px 0 #000`}}>{t}</div>
);

const Laurel: React.FC<{size?: number}> = ({size = 600}) => (
	<svg width={size} height={size * 0.6} viewBox="0 0 200 120">
		{[-1, 1].map((s) => (
			<g key={s} transform={`translate(100 110) scale(${s} 1)`}>
				{new Array(9).fill(0).map((_, i) => {
					const a = (-90 + i * 12) * (Math.PI / 180);
					const x = Math.cos(a) * 80 * -1;
					const y = Math.sin(a) * 80;
					return <ellipse key={i} cx={x - 10} cy={y} rx={13} ry={6} fill={GOLD} transform={`rotate(${-i * 12 + 50} ${x - 10} ${y})`} />;
				})}
			</g>
		))}
	</svg>
);

// saco de cuero que se agita
const Sack: React.FC<{frame: number; size?: number}> = ({frame, size = 380}) => {
	const w = Math.sin(frame / 2.5) * 6;
	return (
		<svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{transform: `rotate(${w}deg)`}}>
			<path d="M30 25 C10 40 8 95 25 110 C40 120 60 120 75 110 C92 95 90 40 70 25Z" fill="#7a4a22" />
			<path d="M30 25 C10 40 8 95 25 110" stroke="#4d2c10" strokeWidth={3} fill="none" />
			<path d="M35 22 L65 22 L60 30 L40 30Z" fill="#5a3416" />
			<path d="M38 20 Q50 5 62 20" stroke="#c9a37a" strokeWidth={3} fill="none" />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<line key={i} x1={20 + i * 2} y1={45 + i * 10} x2={26 + i * 2} y2={48 + i * 10} stroke="#d8b48a" strokeWidth={1.5} />
			))}
			<ellipse cx={50 + Math.sin(frame / 3) * 10} cy={70 + Math.cos(frame / 4) * 8} rx={12} ry={8} fill="#000" opacity={0.25} />
		</svg>
	);
};

const Shield: React.FC<{red?: boolean; size?: number}> = ({red, size = 150}) => (
	<svg width={size} height={size * 1.35} viewBox="0 0 60 80">
		<rect x={2} y={2} width={56} height={76} rx={8} fill={red ? RED : '#9b1c1c'} stroke={GOLD} strokeWidth={4} />
		<circle cx={30} cy={40} r={8} fill={GOLD} />
		<path d="M30 10 L30 70 M8 40 L52 40" stroke={GOLD} strokeWidth={3} />
	</svg>
);

export const roma: VideoDef = {
	id: 'roma',
	timing,
	music: 'music/roma.mp3',
	musicVolume: 0.15,
	theme: {bg1: '#12030a', bg2: '#1e0508', accent: GOLD, accent2: '#ff6b4a', text: '#fff', titleFont: cinzel},
	label: 'HISTORIA',
	Background: Bg,
	keywords: ['roma', 'saco', 'animales', 'poena', 'cullei', 'padre', 'perro', 'gallo', 'serpiente', 'mono', 'rio', 'decimacion', 'legion', 'azar', 'palos', 'companeros', 'craso', 'espartaco', 'vestales', 'enterraban', 'vivas', 'sangre', 'cruel', 'peor'],
	replacements: [
		{match: ['cuatro', 'animales', 'vivos.'], show: '4 animales vivos.'},
		{match: ['grupos', 'de', 'diez.'], show: 'grupos de 10.'},
		{match: ['uno', 'de', 'cada', 'diez,'], show: '1 de cada 10,'},
	],
	scenes: [
		// 0 HOOK: saco que se mueve + 4 animales
		{
			camera: 'push',
			booms: ['cuatro'],
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={460} r={400} color={RED} o={0.35} />
					<At x={540} y={110}>
						<RomanTitle t="SPQR" frame={frame} size={120} />
					</At>
					<At x={540} y={480}>
						<Sack frame={frame} size={400} />
					</At>
					<At x={540} y={860}>
						<Stat value="4 ANIMALES VIVOS" color={RED} frame={frame} at={at('cuatro')} size={110} count={false} />
					</At>
				</Stage>
			),
		},
		// 1 Poena cullei
		{
			pops: ['poena', 'padre'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={590}>
						<Laurel size={700} />
					</At>
					<At x={540} y={360}>
						<RomanTitle t={'POENA\nCULLEI'} frame={frame} size={140} color="#fff" />
					</At>
					<At x={540} y={590}>
						<Chip text="«la pena del saco»" color={GOLD} frame={frame} at={at('poena') + 10} dark />
					</At>
					<At x={540} y={800}>
						<Chip text="Para quien mataba a su padre" color={RED} frame={frame} at={at('padre')} size={44} />
					</At>
				</Stage>
			),
		},
		// 2 los 4 animales + río
		{
			camera: 'tilt',
			pops: ['perro', 'gallo', 'serpiente', 'mono'],
			booms: ['rio'],
			render: ({frame, at}) => {
				const animals: [string, string][] = [
					['🐕', 'perro'],
					['🐓', 'gallo'],
					['🐍', 'serpiente'],
					['🐒', 'mono'],
				];
				const river = frame > at('rio');
				const sink = river ? ease(frame, at('rio'), at('rio') + 30) : 0;
				return (
					<Stage>
						<At x={540} y={330 + sink * 260}>
							<div style={{transform: `scale(${1 - sink * 0.4})`}}>
								<Sack frame={frame} size={230} />
							</div>
						</At>
						{animals.map(([e, w], i) => {
							const t0 = at(w);
							if (frame < t0) return null;
							const k = ease(frame, t0, t0 + 10);
							const x = [200, 880, 200, 880][i];
							const y = [180, 180, 500, 500][i];
							const tx = x + (540 - x) * sink;
							const ty = y + (430 - y) * sink;
							return (
								<At key={i} x={tx} y={ty}>
									<div style={{width: 210, height: 210, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: `5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, transform: `scale(${k * (1 - sink)})`}}>{e}</div>
								</At>
							);
						})}
						{river && (
							<div style={{position: 'absolute', left: 0, right: 0, top: 640 - sink * 60, height: 400, background: 'linear-gradient(180deg, #1f6fb5cc, #0a2a55ee)'}}>
								{[0, 1, 2].map((i) => (
									<div key={i} style={{position: 'absolute', top: i * 60 + 10, left: ((frame * 8 + i * 300) % 1400) - 300, width: 300, height: 8, borderRadius: 4, background: '#9fd4ff', opacity: 0.6}} />
								))}
							</div>
						)}
					</Stage>
				);
			},
		},
		// 3 Decimación: legión de 10
		{
			camera: 'panR',
			pops: ['decimacion', 'diez'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={80}>
						<RomanTitle t="DECIMATIO" frame={frame} size={110} />
					</At>
					<At x={540} y={190}>
						<Chip text="Si la legión huía…" color={GOLD} frame={frame} at={at('legion')} dark size={44} />
					</At>
					<div style={{position: 'absolute', top: 300, left: 60, width: 960, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22}}>
						{new Array(10).fill(0).map((_, i) => {
							const t0 = at('diez') - 20 + i * 2;
							return (
								<div key={i} style={{transform: `scale(${frame > t0 ? pop(frame, t0) : 0}) translateY(${Math.sin(frame / 6 + i) * 6}px)`}}>
									<Shield size={150} />
								</div>
							);
						})}
					</div>
					<At x={540} y={830}>
						<Stat value="GRUPOS DE 10" color={GOLD} frame={frame} at={at('diez')} size={120} count={false} />
					</At>
				</Stage>
			),
		},
		// 4 Uno de cada diez
		{
			camera: 'shake',
			pops: ['uno', 'craso'],
			booms: ['palos'],
			render: ({frame, at}) => {
				const chosen = Math.min(9, Math.floor(frame / 3) % 10);
				const lock = frame > at('azar') + 10;
				const pick = lock ? 6 : chosen;
				return (
					<Stage>
						<div style={{position: 'absolute', top: 60, left: 60, width: 960, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22}}>
							{new Array(10).fill(0).map((_, i) => (
								<div key={i} style={{transform: `scale(${i === pick ? 1.15 : 0.95})`, opacity: lock && i !== pick ? 0.4 : 1}}>
									<Shield size={150} red={i === pick} />
								</div>
							))}
						</div>
						<At x={540} y={620}>
							<Stat value="1 DE CADA 10" label="moría a palos" color={RED} frame={frame} at={at('uno')} size={130} count={false} />
						</At>
						<At x={540} y={850}>
							<Chip text="Craso · rebelión de Espartaco (71 a. C.)" color={GOLD} frame={frame} at={at('craso')} size={36} />
						</At>
					</Stage>
				);
			},
		},
		// 5 Vestales
		{
			camera: 'push',
			pops: ['vestales', 'pan'],
			booms: ['vivas'],
			render: ({frame, at}) => {
				const flame = 1 + 0.08 * Math.sin(frame / 2) + 0.05 * Math.sin(frame / 3.3);
				return (
					<Stage>
						<At x={540} y={80}>
							<RomanTitle t="VESTALES" frame={frame} size={120} color="#fff" />
						</At>
						<At x={540} y={420}>
							<svg width={520} height={420} viewBox="0 0 260 210">
								<path d="M10 60 L130 10 L250 60Z" fill="#e9dcc3" />
								<rect x={20} y={60} width={220} height={14} fill="#d6c7a8" />
								{[0, 1, 2, 3, 4].map((i) => (
									<rect key={i} x={30 + i * 46} y={74} width={20} height={110} fill="#efe4cf" />
								))}
								<rect x={10} y={184} width={240} height={20} fill="#d6c7a8" />
								<g transform={`translate(130 150) scale(${flame})`}>
									<path d="M0 -40 C18 -18 14 0 0 6 C-14 0 -18 -18 0 -40Z" fill="#ff9a1f" />
									<path d="M0 -22 C8 -10 6 0 0 3 C-6 0 -8 -10 0 -22Z" fill="#fff3a0" />
								</g>
							</svg>
						</At>
						<At x={540} y={720}>
							<Stamp text="ENTERRADAS VIVAS" color={RED} frame={frame} at={at('enterraban')} size={90} rot={-5} />
						</At>
						<At x={540} y={880}>
							<Chip text="🍞 pan · 💧 agua · 🪔 lámpara" color={GOLD} frame={frame} at={at('pan')} size={40} />
						</At>
					</Stage>
				);
			},
		},
		// 6 "así nadie manchaba sus manos" — lámpara que se apaga
		{
			camera: 'pull',
			render: ({frame, dur, at}) => {
				const dark = interpolate(frame, [0, dur], [0, 0.75]);
				const f = Math.max(0, 1 - frame / dur) * (1 + 0.15 * Math.sin(frame * 1.3));
				return (
					<Stage>
						<At x={540} y={450}>
							<div style={{fontSize: 260, filter: `drop-shadow(0 0 ${60 * f}px #ff9a1f)`}}>🪔</div>
						</At>
						<Glow x={540} y={380} r={300 * f + 10} color="#ff9a1f" o={0.6} />
						<div style={{position: 'absolute', left: -300, top: -600, width: 1700, height: 2800, background: '#000', opacity: dark}} />
						<At x={540} y={800}>
							<Chip text="sin derramar su sangre" color={RED} frame={frame} at={at('sangre')} dark size={48} />
						</At>
					</Stage>
				);
			},
		},
		// 7 CTA + bucle
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<div style={{position: 'absolute', top: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26}}>
						{['🎒', '🛡️', '🔥'].map((e, i) => (
							<div key={i} style={{width: 240, height: 260, borderRadius: 24, background: 'rgba(0,0,0,0.55)', border: `5px solid ${GOLD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(frame, i * 5)}) rotate(${(i - 1) * 4}deg)`}}>
								<div style={{fontSize: 120}}>{e}</div>
								<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 30, color: GOLD}}>{['SACO', 'DÉCIMA', 'VESTAL'][i]}</div>
							</div>
						))}
					</div>
					<At x={540} y={650}>
						<FollowCTA frame={frame} at={at('sigueme')} color={GOLD} question="¿Cuál te parece peor?" />
					</At>
				</Stage>
			),
		},
	],
};
