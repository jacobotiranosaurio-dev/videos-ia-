import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/planetas.timing.json';
import {At, Chip, FollowCTA, Glow, Planet, Stage, Stars, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop} from '../engine/util';

const A = '#ffd23f';
const C = '#3ff2ff';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 70% 20%, #3a1468 0%, transparent 55%), radial-gradient(circle at 20% 80%, #0b3a6b 0%, transparent 55%)'}} />
		<Stars frame={frame} />
	</AbsoluteFill>
);

const Thermo: React.FC<{frame: number; hot: number; cold: number}> = ({frame, hot, cold}) => {
	const toCold = ease(frame, cold, cold + 15);
	const level = frame < hot ? 0.1 : interpolate(toCold, [0, 1], [0.95, 0.08]) * ease(frame, hot, hot + 15) + 0.05;
	const col = toCold > 0.5 ? C : '#ff4d2e';
	return (
		<svg width={110} height={460} viewBox="0 0 110 460">
			<rect x={30} y={10} width={50} height={370} rx={25} fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth={5} />
			<rect x={40} y={20 + 350 * (1 - level)} width={30} height={350 * level} rx={15} fill={col} />
			<circle cx={55} cy={400} r={50} fill={col} stroke="#fff" strokeWidth={5} />
		</svg>
	);
};

// silueta de astronauta
const Astro: React.FC<{size?: number; rot?: number}> = ({size = 180, rot = 0}) => (
	<svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{transform: `rotate(${rot}deg)`}}>
		<rect x={22} y={45} width={56} height={55} rx={18} fill="#e9eef5" />
		<rect x={10} y={50} width={16} height={42} rx={8} fill="#d5dce6" />
		<rect x={74} y={50} width={16} height={42} rx={8} fill="#d5dce6" />
		<rect x={28} y={95} width={18} height={32} rx={8} fill="#d5dce6" />
		<rect x={54} y={95} width={18} height={32} rx={8} fill="#d5dce6" />
		<circle cx={50} cy={30} r={26} fill="#e9eef5" />
		<ellipse cx={50} cy={31} rx={18} ry={14} fill="#1b2a4a" />
		<ellipse cx={44} cy={26} rx={6} ry={3} fill="#7fd9ff" opacity={0.8} />
		<rect x={38} y={60} width={24} height={14} rx={3} fill={A} />
	</svg>
);

const P = {
	mercury: {c: ['#d9d4cc', '#8d867c', '#3b3631'] as [string, string, string], craters: true},
	venus: {c: ['#fff1b8', '#e8a83c', '#7a3d0c'] as [string, string, string], clouds: true, glow: '#ffb347'},
	mars: {c: ['#ffb08a', '#d2462a', '#5e1608'] as [string, string, string], craters: true},
	jupiter: {c: ['#f6e3c8', '#c99467', '#5b3a22'] as [string, string, string], bands: ['#a9673f', '#f3d6ae', '#8d4f2c', '#e9c49b', '#b0703f', '#f0d2a6', '#9a5a33'], spot: '#c5452a'},
	saturn: {c: ['#fbecc4', '#d9b56e', '#6b4f1e'] as [string, string, string], bands: ['#e5c98c', '#c9a35a', '#efd9a5', '#b88f48'], rings: '#e8d29b'},
	uranus: {c: ['#d8fbff', '#6fd3e0', '#1d5c6c'] as [string, string, string]},
	neptune: {c: ['#9ec5ff', '#3557d6', '#0c1a5c'] as [string, string, string], bands: ['#2c48b8', '#4b6ee6', '#2c48b8']},
	earth: {c: ['#9fe3ff', '#2a7fd4', '#0a2a5e'] as [string, string, string], continents: true, clouds: true, glow: '#6cc6ff'},
};

const Name: React.FC<{t: string; frame: number; color?: string}> = ({t, frame, color = '#fff'}) => {
	const p = pop(frame, 2, 30, 12);
	return <div style={{fontFamily: anton, fontSize: 130, color, letterSpacing: 6, transform: `scale(${p})`, textShadow: '0 10px 0 rgba(0,0,0,0.5)'}}>{t}</div>;
};

export const planetas: VideoDef = {
	id: 'planetas',
	timing,
	music: 'music/planetas.mp3',
	theme: {bg1: '#07051a', bg2: '#0d0630', accent: A, accent2: C, text: '#fff'},
	label: 'ESPACIO',
	Background: Bg,
	keywords: ['planeta', 'segundo', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno', 'tierra', 'suelo', 'oxigeno', 'aplastaria', 'aplastara', 'cocinaria', 'minutos', 'minuto', 'horas', 'conocimiento'],
	replacements: [
		{match: ['cuatrocientos', 'treinta', 'grados'], show: '430 °C'},
		{match: ['ciento', 'ochenta', 'bajo', 'cero'], show: '-180 °C'},
		{match: ['cuatrocientos', 'sesenta', 'y', 'cinco', 'grados'], show: '465 °C'},
		{match: ['noventa', 'veces'], show: 'x90'},
		{match: ['quince', 'segundos'], show: '15 s'},
		{match: ['mil', 'ochocientos', 'kilómetros', 'por', 'hora.'], show: '1.800 km/h'},
		{match: ['doscientos', 'grados', 'bajo', 'cero.'], show: '-200 °C'},
		{match: ['ochenta', 'años.'], show: '80 años'},
	],
	scenes: [
		// 0 HOOK: el astronauta cae hacia el sistema solar, cronómetro corriendo
		{
			camera: 'push',
			booms: ['segundo'],
			render: ({frame, at}) => {
				const order = [P.mercury, P.venus, P.mars, P.jupiter, P.saturn, P.uranus, P.neptune];
				const sec = Math.max(0, 0.99 - frame / 200).toFixed(2);
				return (
					<Stage>
						{order.map((p, i) => {
							const ang = (i / order.length) * Math.PI * 2 + frame / 60;
							const r = 330;
							return (
								<At key={i} x={540 + Math.cos(ang) * r} y={450 + Math.sin(ang) * r * 0.55}>
									<Planet id={`h${i}`} size={i === 3 || i === 4 ? 120 : 80} frame={frame} {...p} />
								</At>
							);
						})}
						<At x={540} y={450}>
							<div style={{width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,#fff6c2,#ffb800 50%,#ff6a00 75%,transparent 76%)', boxShadow: '0 0 120px #ffae00'}} />
						</At>
						<At x={540} y={0}>
							<div style={{fontFamily: anton, fontSize: 112, color: '#fff', textAlign: 'center', lineHeight: 1, transform: `scale(${pop(frame, 0, 30, 10)})`, textShadow: '0 0 40px #ff3b3b, 0 8px 0 #000'}}>¿CUÁNTO <span style={{color: A}}>DURARÍAS?</span></div>
						</At>
						<At x={540 + Math.sin(frame / 9) * 20} y={interpolate(frame, [0, 200], [170, 420])}>
							<Astro size={120} rot={frame * 4} />
						</At>
						<At x={540} y={830}>
							<div style={{fontFamily: anton, fontSize: 150, color: frame > at('segundo') ? '#ff3b3b' : '#fff', textShadow: '0 0 40px #ff3b3b'}}>⏱ {sec}s</div>
						</At>
					</Stage>
				);
			},
		},
		// 1 Mercurio
		{
			pops: ['cuatrocientos', 'ciento', 'minutos'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Name t="MERCURIO" frame={frame} />
					</At>
					<At x={420} y={430}>
						<Planet id="me" size={420} frame={frame} {...P.mercury} />
					</At>
					<At x={900} y={430}>
						<Thermo frame={frame} hot={at('cuatrocientos')} cold={at('ciento')} />
					</At>
					<At x={420} y={780}>
						{frame < at('ciento') ? (
							<Stat value="430 °C" label="de día" color="#ff4d2e" frame={frame} at={at('cuatrocientos')} />
						) : frame < at('minutos') - 6 ? (
							<Stat value="-180 °C" label="de noche" color={C} frame={frame} at={at('ciento')} rotate={3} />
						) : (
							<Stat value="≈2 MIN" label="sin traje" color={A} frame={frame} at={at('minutos') - 6} count={false} />
						)}
					</At>
				</Stage>
			),
		},
		// 2 Venus
		{
			camera: 'shake',
			pops: ['cuatrocientos', 'noventa'],
			booms: ['aplastaria'],
			render: ({frame, at}) => {
				const heat = Math.sin(frame / 3) * 3;
				return (
					<Stage>
						<Glow x={540} y={430} r={520} color="#ff7b00" o={0.5} />
						<At x={540} y={60}>
							<Name t="VENUS" frame={frame} color="#ffcc66" />
						</At>
						<At x={540} y={440}>
							<div style={{filter: `hue-rotate(${heat}deg)`}}>
								<Planet id="ve" size={480} frame={frame * 2} {...P.venus} />
							</div>
						</At>
						<At x={300} y={800}>
							<Stat value="465 °C" color="#ff4d2e" frame={frame} at={at('cuatrocientos')} size={150} />
						</At>
						<At x={790} y={790}>
							<Stat value="x90" label="presión" color={A} frame={frame} at={at('noventa')} size={150} rotate={4} count={false} />
						</At>
						{frame > at('aplastaria') && (
							<At x={540} y={440}>
								<Chip text="☠ casi al instante" color="#ff3b3b" frame={frame} at={at('aplastaria')} size={56} />
							</At>
						)}
					</Stage>
				);
			},
		},
		// 3 Marte
		{
			pops: ['quince'],
			render: ({frame, at}) => {
				const t0 = at('quince');
				const left = frame < t0 ? 15 : Math.max(0, 15 - Math.floor((frame - t0) / 6));
				return (
					<Stage>
						<At x={540} y={60}>
							<Name t="MARTE" frame={frame} color="#ff7a59" />
						</At>
						<At x={540} y={430}>
							<Planet id="ma" size={440} frame={frame} {...P.mars} />
						</At>
						<At x={540} y={430}>
							<Chip text="O₂: 0,1 %" color={C} frame={frame} at={at('oxigeno')} dark />
						</At>
						<At x={540} y={790}>
							<Stat value={`${left} s`} label="hasta desmayarte" color="#ff4d2e" frame={frame} at={t0} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 4 Júpiter: caída sin fin
		{
			camera: 'tilt',
			pops: ['suelo'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Name t="JÚPITER" frame={frame} color="#f3c58f" />
					</At>
					<At x={540} y={470 + frame * 0.6}>
						<Planet id="ju" size={620} frame={frame} {...P.jupiter} />
					</At>
					<At x={540} y={300 + Math.sin(frame / 7) * 30}>
						<Astro size={110} rot={frame * 6} />
					</At>
					{new Array(12).fill(0).map((_, i) => (
						<div key={i} style={{position: 'absolute', left: 80 + ((i * 97) % 920), top: ((i * 173 - frame * 30) % 900 + 900) % 900, width: 4, height: 120, background: 'rgba(255,255,255,0.35)'}} />
					))}
					<At x={540} y={800}>
						<Stat value="SIN SUELO" color="#f3a35b" frame={frame} at={at('suelo')} size={140} count={false} />
					</At>
				</Stage>
			),
		},
		// 5 Saturno: vientos
		{
			camera: 'panR',
			pops: ['mil'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Name t="SATURNO" frame={frame} color="#f6dc9c" />
					</At>
					<At x={540} y={430}>
						<Planet id="sa" size={380} frame={frame} {...P.saturn} />
					</At>
					{new Array(14).fill(0).map((_, i) => (
						<div key={i} style={{position: 'absolute', top: 180 + i * 45, left: ((i * 211 + frame * 45) % 1500) - 300, width: 260, height: 6, borderRadius: 3, background: 'linear-gradient(90deg,transparent,#fff)', opacity: 0.6}} />
					))}
					<At x={540} y={800}>
						<Stat value="1.800 km/h" label="vientos" color={C} frame={frame} at={at('mil')} size={150} />
					</At>
				</Stage>
			),
		},
		// 6 Urano y Neptuno
		{
			pops: ['doscientos'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<div style={{fontFamily: anton, fontSize: 96, color: '#bff4ff', whiteSpace: 'nowrap'}}>URANO + NEPTUNO</div>
					</At>
					<At x={320} y={400}>
						<Planet id="ur" size={330} frame={frame} {...P.uranus} />
					</At>
					<At x={780} y={480}>
						<Planet id="ne" size={330} frame={frame} {...P.neptune} />
					</At>
					
					<At x={540} y={800}>
						<Stat value="-200 °C" label="o menos" color={C} frame={frame} at={at('doscientos')} />
					</At>
				</Stage>
			),
		},
		// 7 Tierra + CTA que conecta con el inicio
		{
			camera: 'pull',
			pops: ['ochenta'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={330}>
						<Planet id="ea" size={420} frame={frame} {...P.earth} />
					</At>
					<At x={540} y={110}>
						<Stat value="80 AÑOS" label="en la Tierra" color="#3fdc7c" frame={frame} at={at('ochenta')} size={130} />
					</At>
					<At x={540} y={720}>{frame > at('dime') && <FollowCTA frame={frame - at('dime')} at={at('sigueme') - at('dime')} color={A} question="¿En cuál durarías más?" />}</At>
				</Stage>
			),
		},
	],
};

export const _f = montserrat;
