import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/sinhumanos.timing.json';
import {At, Chip, FollowCTA, Glow, Planet, Stage, Stars, Stat} from '../engine/kit';
import {anton} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop, rand} from '../engine/util';

const GR = '#5dff8f';
const AM = '#ffcf4a';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #050b1f 0%, #0c2a2a 60%, #0a1a10 100%)'}} />
		<Stars frame={frame} n={80} speed={0.3} />
	</AbsoluteFill>
);

// skyline con ventanas que se apagan (off: 0..1) y vegetación (green: 0..1)
const City: React.FC<{frame: number; off: number; green?: number; collapse?: number}> = ({frame, off, green = 0, collapse = 0}) => {
	const bs = [
		[0, 380],
		[120, 520],
		[230, 300],
		[330, 640],
		[460, 450],
		[560, 700],
		[690, 380],
		[790, 560],
		[910, 420],
	];
	return (
		<svg width={1080} height={760} viewBox="0 0 1080 760">
			{bs.map(([x, h], i) => {
				const fall = collapse * (rand(i * 3) > 0.4 ? 1 : 0.2);
				const hh = h * (1 - fall * 0.6);
				return (
					<g key={i} transform={`rotate(${fall * (rand(i) - 0.5) * 20} ${x + 55} 760)`}>
						<rect x={x} y={760 - hh} width={110} height={hh} fill={green > 0.5 ? '#2a3a33' : '#1b2338'} stroke="#000" />
						{new Array(Math.floor(hh / 46)).fill(0).map((_, r) =>
							[0, 1, 2].map((c) => {
								const id = i * 100 + r * 3 + c;
								const lit = rand(id) > off && rand(id + 7) > 0.25;
								return <rect key={`${r}-${c}`} x={x + 14 + c * 32} y={760 - hh + 18 + r * 46} width={20} height={26} fill={lit ? AM : '#0d1220'} opacity={lit ? 0.6 + 0.4 * Math.sin(frame / 5 + id) ** 2 : 1} />;
							}),
						)}
						{green > 0 &&
							new Array(6).fill(0).map((_, k) => (
								<circle key={k} cx={x + rand(i * 9 + k) * 110} cy={760 - hh + rand(k * 5 + i) * hh} r={30 * green * (0.5 + rand(i + k * 2))} fill={k % 2 ? '#2f9e44' : '#43c45d'} opacity={0.9} />
							))}
					</g>
				);
			})}
			{green > 0 && <rect x={0} y={760 - 80 * green} width={1080} height={80 * green} fill="#2f9e44" />}
		</svg>
	);
};

const Tree: React.FC<{g: number; x: number; s?: number}> = ({g, x, s = 1}) => (
	<svg width={240 * s} height={420 * s} viewBox="0 0 120 210" style={{position: 'absolute', left: x, bottom: 0, transform: `scale(${g})`, transformOrigin: 'bottom center'}}>
		<rect x={52} y={110} width={16} height={100} fill="#6b4423" />
		<circle cx={60} cy={80} r={50} fill="#2f9e44" />
		<circle cx={35} cy={100} r={32} fill="#43c45d" />
		<circle cx={85} cy={100} r={32} fill="#38b04f" />
	</svg>
);

export const sinhumanos: VideoDef = {
	id: 'sinhumanos',
	timing,
	music: 'music/sinhumanos.mp3',
	theme: {bg1: '#050b1f', bg2: '#0a1a10', accent: GR, accent2: AM, text: '#fff'},
	label: 'FUTURO',
	Background: Bg,
	keywords: ['humanos', 'hoy', 'oscuras', 'centrales', 'apagan', 'metro', 'inunda', 'bosques', 'chernobil', 'lobos', 'ciervos', 'caballos', 'casas', 'derrumban', 'raices', 'puentes', 'plastico', 'radio', 'siempre', 'final'],
	replacements: [
		{match: ['dos', 'días'], show: '48 horas'},
		{match: ['veinte', 'años,'], show: '20 años,'},
		{match: ['cien', 'años,'], show: '100 años,'},
		{match: ['trescientos,'], show: '300 años,'},
		{match: ['Nueva', 'York'], show: 'Nueva York'},
	],
	scenes: [
		// 0 HOOK: la ciudad se apaga
		{
			camera: 'push',
			booms: ['oscuras'],
			render: ({frame, at, dur}) => {
				const off = interpolate(frame, [at('menos'), dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<Stage>
						<At x={540} y={120}>
							<div style={{fontFamily: anton, fontSize: 110, color: '#fff', textAlign: 'center', lineHeight: 1, transform: `scale(${pop(frame, 0)})`, textShadow: '0 8px 0 #000'}}>
								0 HUMANOS
								<br />
								<span style={{color: GR}}>¿QUÉ PASA?</span>
							</div>
						</At>
						<div style={{position: 'absolute', top: 300, left: 0}}>
							<City frame={frame} off={off} />
						</div>
						<At x={540} y={400}>
							<Stat value="48 H" label="para el apagón" color={AM} frame={frame} at={at('dos')} size={150} />
						</At>
					</Stage>
				);
			},
		},
		// 1 Centrales eléctricas
		{
			pops: ['apagan'],
			render: ({frame, at}) => {
				const off = frame > at('apagan');
				return (
					<Stage>
						<At x={540} y={420}>
							<div style={{fontSize: 320, filter: off ? 'grayscale(1) brightness(0.4)' : `drop-shadow(0 0 50px ${AM})`, transform: `rotate(${off ? 0 : Math.sin(frame) * 2}deg)`}}>⚡</div>
						</At>
						<At x={540} y={200}>
							<div style={{fontSize: 180, transform: `translateY(${Math.sin(frame / 10) * 8}px)`}}>🏭</div>
						</At>
						<At x={540} y={800}>
							<Stat value="APAGÓN" label="total" color={AM} frame={frame} at={at('apagan')} size={150} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 2 Metro de Nueva York inundado
		{
			camera: 'tilt',
			pops: ['nueva', 'bombas'],
			render: ({frame, dur, at}) => {
				const lvl = ease(frame, 10, dur);
				return (
					<Stage>
						<At x={540} y={420}>
							<svg width={900} height={700} viewBox="0 0 900 700">
								<path d="M50 700 L50 250 Q450 -20 850 250 L850 700Z" fill="#1d2433" stroke="#56607a" strokeWidth={10} />
								<rect x={150} y={420} width={600} height={170} rx={20} fill="#c7ced9" />
								{[0, 1, 2, 3].map((i) => (
									<rect key={i} x={180 + i * 140} y={445} width={100} height={70} rx={8} fill="#5b7ea8" />
								))}
								<rect x={150} y={500} width={600} height={14} fill="#e8233a" />
								<rect x={50} y={700 - 520 * lvl} width={800} height={520 * lvl} fill="#2f7fd1" opacity={0.6} />
								<path d={`M50 ${700 - 520 * lvl} ${new Array(10).fill(0).map((_, i) => `Q ${95 + i * 80} ${700 - 520 * lvl - 18 * Math.sin(frame / 4 + i)} ${130 + i * 80} ${700 - 520 * lvl}`).join(' ')}`} stroke="#9fd4ff" strokeWidth={6} fill="none" />
							</svg>
						</At>
						<At x={540} y={70}>
							<Chip text="🚇 Nueva York" color="#9fd4ff" frame={frame} at={at('nueva')} size={56} />
						</At>
						<At x={540} y={850}>
							<Chip text="Bombas de agua: OFF" color="#e8233a" frame={frame} at={at('bombas')} size={48} />
						</At>
					</Stage>
				);
			},
		},
		// 3 20 años: bosques + Chernóbil
		{
			camera: 'panR',
			pops: ['veinte', 'chernobil'],
			render: ({frame, at, dur}) => {
				const g = ease(frame, 5, 90);
				return (
					<Stage>
						<div style={{position: 'absolute', top: 160, left: 0}}>
							<City frame={frame} off={1} green={g} />
						</div>
						<div style={{position: 'absolute', top: 0, left: 0, width: 1080, height: 920}}>
							<Tree g={g} x={-40} s={1.1} />
							<Tree g={g * 0.9} x={820} s={1.2} />
						</div>
						<At x={540} y={90}>
							<Stat value="20 AÑOS" label="calles = bosques" color={GR} frame={frame} at={at('veinte')} size={130} />
						</At>
						{frame > at('lobos') &&
							['🐺', '🦌', '🐎'].map((e, i) => {
								const t0 = at(['lobos', 'ciervos', 'caballos'][i]);
								if (frame < t0) return null;
								return (
									<At key={i} x={interpolate(frame, [t0, dur], [1150, 250 + i * 260], {extrapolateRight: 'clamp'})} y={830}>
										<div style={{fontSize: 120, transform: `scaleX(-1) translateY(${Math.abs(Math.sin(frame / 4 + i)) * -14}px)`}}>{e}</div>
									</At>
								);
							})}
						<At x={540} y={300}>
							<Chip text="☢ Chernóbil ya lo demuestra" color={GR} frame={frame} at={at('chernobil')} size={44} dark />
						</At>
					</Stage>
				);
			},
		},
		// 4 100 años: casas derrumbadas
		{
			camera: 'shake',
			pops: ['cien', 'raices'],
			booms: ['derrumban'],
			render: ({frame, at}) => {
				const c = ease(frame, at('derrumban'), at('derrumban') + 25);
				return (
					<Stage>
						<div style={{position: 'absolute', top: 160, left: 0}}>
							<City frame={frame} off={1} green={1} collapse={c} />
						</div>
						<At x={540} y={90}>
							<Stat value="100 AÑOS" label="casas en ruinas" color={AM} frame={frame} at={at('cien')} size={130} />
						</At>
						<At x={540} y={500}>
							<Chip text="🌱 Las raíces rompen el hormigón" color={GR} frame={frame} at={at('raices')} size={42} />
						</At>
					</Stage>
				);
			},
		},
		// 5 300 años: puentes
		{
			camera: 'pull',
			pops: ['trescientos'],
			booms: ['puentes'],
			render: ({frame, at}) => {
				const c = ease(frame, at('caen'), at('caen') + 30);
				return (
					<Stage>
						<At x={540} y={560}>
							<svg width={1000} height={500} viewBox="0 0 1000 500">
								<rect x={0} y={380} width={1000} height={120} fill="#1f5f9e" />
								<rect x={230} y={40} width={30} height={360} fill="#c0392b" />
								<rect x={740} y={40} width={30} height={360} fill="#c0392b" transform={`rotate(${c * 14} 755 400)`} />
								<path d={`M0 260 Q245 ${40} 500 ${230 + c * 120} Q755 40 1000 260`} stroke="#c0392b" strokeWidth={8} fill="none" />
								<g transform={`rotate(${c * 18} 245 300)`}>
									<rect x={0} y={290} width={500} height={22} fill="#7f8c8d" />
								</g>
								<g transform={`rotate(${-c * 22} 755 300)`}>
									<rect x={500} y={290} width={500} height={22} fill="#7f8c8d" />
								</g>
							</svg>
						</At>
						<At x={540} y={110}>
							<Stat value="300 AÑOS" label="caen los puentes" color="#ff6b4a" frame={frame} at={at('trescientos')} size={130} />
						</At>
					</Stage>
				);
			},
		},
		// 6 Lo último: plástico y ondas de radio
		{
			camera: 'pull',
			pops: ['plastico', 'radio'],
			render: ({frame, at}) => (
				<Stage>
					<At x={300} y={520}>
						<Planet id="t" size={300} frame={frame} c={['#9fe3ff', '#2a7fd4', '#0a2a5e']} continents clouds glow="#6cc6ff" />
					</At>
					{frame > at('radio') &&
						[0, 1, 2, 3, 4].map((i) => {
							const r = ((frame - at('radio')) * 6 + i * 120) % 600;
							return <div key={i} style={{position: 'absolute', left: 300 - r, top: 520 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `6px solid ${GR}`, opacity: 1 - r / 600, clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)'}} />;
						})}
					<At x={780} y={200}>
						<div style={{fontSize: 160, transform: `rotate(${frame * 2}deg) scale(${pop(frame, at('plastico'))})`}}>{frame >= at('plastico') ? '🧴' : ''}</div>
					</At>
					<At x={540} y={850}>
						<Stat value="PARA SIEMPRE" color={GR} frame={frame} at={at('siempre')} size={120} count={false} />
					</At>
					<Glow x={300} y={520} r={260} color="#6cc6ff" o={0.4} />
				</Stage>
			),
		},
		// 7 CTA + bucle (vuelve a la ciudad iluminada)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<div style={{position: 'absolute', top: 260, left: 0, opacity: 0.55}}>
						<City frame={frame} off={0.1} />
					</div>
					<At x={540} y={500}>
						<FollowCTA frame={frame} at={at('sigueme')} color={GR} question="¿Qué quedaría al final?" />
					</At>
				</Stage>
			),
		},
	],
};
