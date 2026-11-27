import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/gta6.timing.json';
import {At, Chip, FollowCTA, Glow, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop, rand} from '../engine/util';

const PINK = '#ff3fa4';
const CYAN = '#3ff2ff';
const ORANGE = '#ffb03f';
const RED = '#ff2d3d';

// atardecer de neón genérico: degradado, sol a rayas, rejilla y palmeras (sin arte del juego)
const Palm: React.FC<{x: number; s: number; frame: number}> = ({x, s, frame}) => (
	<svg width={260 * s} height={520 * s} viewBox="0 0 130 260" style={{position: 'absolute', left: x, bottom: 640, transform: `rotate(${Math.sin(frame / 40 + x) * 1.5}deg)`, transformOrigin: 'bottom center'}}>
		<path d="M64 260 Q58 160 70 60" stroke="#1a0a2e" strokeWidth={9} fill="none" />
		{[-70, -35, 0, 35, 70, 110, -110].map((a, i) => (
			<path key={i} d="M70 60 q30 -10 60 18 q-30 -6 -60 -4z" fill="#1a0a2e" transform={`rotate(${a} 70 60)`} />
		))}
	</svg>
);

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #1a0638 0%, #5a0f5e 38%, #ff5f6d 62%, #ffb03f 72%, #1a0638 73%)'}} />
		<div style={{position: 'absolute', left: 290, top: 980, width: 500, height: 250, overflow: 'hidden'}}>
			<div style={{width: 500, height: 500, borderRadius: '50%', background: `repeating-linear-gradient(180deg, #ffd56b 0 26px, transparent 26px 36px)`, opacity: 0.85}} />
		</div>
		<div style={{position: 'absolute', left: -400, right: -400, top: 1230, height: 800, backgroundImage: `linear-gradient(${PINK} 3px, transparent 3px), linear-gradient(90deg, ${PINK} 3px, transparent 3px)`, backgroundSize: '90px 90px', backgroundPosition: `0 ${frame * 3}px`, transform: 'perspective(500px) rotateX(60deg)', transformOrigin: 'top center', opacity: 0.45}} />
		<Palm x={-40} s={1.1} frame={frame} />
		<Palm x={840} s={1.2} frame={frame} />
	</AbsoluteFill>
);

// estrella de búsqueda
const Star: React.FC<{size: number; state: 'off' | 'on' | 'hollow' | 'red'; glow?: boolean}> = ({size, state, glow}) => {
	const fill = state === 'on' ? '#fff' : state === 'red' ? RED : 'none';
	const stroke = state === 'off' ? 'rgba(255,255,255,0.25)' : state === 'red' ? RED : '#fff';
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{filter: glow ? `drop-shadow(0 0 14px ${state === 'red' ? RED : '#fff'})` : undefined}}>
			<path d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 71 L21 92 L32 58 L4 38 L38 38Z" fill={fill} stroke={stroke} strokeWidth={6} strokeLinejoin="round" />
		</svg>
	);
};

const Stars: React.FC<{n: number; total?: number; size?: number; state?: 'on' | 'hollow' | 'red'; frame?: number}> = ({n, total = 6, size = 120, state = 'on', frame = 0}) => (
	<div style={{display: 'flex', gap: size * 0.12}}>
		{new Array(total).fill(0).map((_, i) => (
			<div key={i} style={{transform: `scale(${i < n ? 1 + 0.06 * Math.sin(frame / 3 + i) : 0.9})`}}>
				<Star size={size} state={i < n ? state : 'off'} glow={i < n} />
			</div>
		))}
	</div>
);

// sirena (luces rojo/azul por los laterales)
const Siren: React.FC<{frame: number; o?: number}> = ({frame, o = 0.35}) => {
	const blue = Math.floor(frame / 6) % 2 === 0;
	return (
		<AbsoluteFill style={{background: `linear-gradient(90deg, ${blue ? 'rgba(40,90,255,' + o + ')' : 'transparent'} 0%, transparent 30%, transparent 70%, ${!blue ? 'rgba(255,30,50,' + o + ')' : 'transparent'} 100%)`, pointerEvents: 'none'}} />
	);
};

const Tank: React.FC<{size?: number}> = ({size = 420}) => (
	<svg width={size} height={size * 0.5} viewBox="0 0 200 100">
		<rect x={18} y={62} width={164} height={28} rx={14} fill="#2b3320" />
		{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={34 + i * 26} cy={76} r={9} fill="#4a5535" />)}
		<path d="M30 62 L45 40 L160 40 L172 62Z" fill="#4f5d36" />
		<rect x={70} y={22} width={60} height={22} rx={6} fill="#5d6c40" />
		<rect x={128} y={28} width={66} height={8} rx={4} fill="#3f4a2b" />
	</svg>
);

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 100}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: `0 0 30px ${PINK}, 0 8px 0 rgba(0,0,0,0.6)`}}>{t}</div>
);

export const gta6: VideoDef = {
	id: 'gta6',
	timing,
	endAt: 61.4, // 1 s de pantalla final tras "Y sígueme"
	music: 'music/gta6.mp3',
	theme: {bg1: '#1a0638', bg2: '#1a0638', accent: ORANGE, accent2: CYAN, text: '#fff'},
	label: 'VIDEOJUEGOS',
	Background: Bg,
	keywords: ['estrellas', 'escapatoria', 'maximo', 'sexta', 'destruccion', 'masiva', 'tanque', 'militar', 'tanques', 'ejercito', 'helicopteros', 'camiones', 'barricadas', 'peor', 'baja', 'escondas', 'mapa', 'arrestan', 'mueres', 'huecas', 'rojas', 'guarda'],
	replacements: [
		{match: ['GTA', 'seis'], show: 'GTA VI'},
		{match: ['GTA', 'cinco'], show: 'GTA V'},
		{match: ['seis', 'estrellas'], show: '6 estrellas'},
		{match: ['cinco', 'estrellas'], show: '5 estrellas'},
	],
	scenes: [
		// 0 HOOK: se encienden las 6 estrellas con sirenas
		{
			camera: 'shake',
			pops: ['seis'],
			booms: ['escapatoria'],
			render: ({frame, at}) => {
				const n = Math.min(6, Math.floor(interpolate(frame, [at('seis') - 8, at('seis') + 22], [0, 6.99], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
				return (
					<Stage>
						<Siren frame={frame} />
						<At x={540} y={90}>
							<Title t="6 ESTRELLAS" frame={frame} color="#fff" size={130} />
						</At>
						<At x={540} y={350}>
							<Stars n={n} size={130} frame={frame} />
						</At>
						<At x={540} y={560}>
							<div style={{fontSize: 170, transform: `translateX(${Math.sin(frame / 4) * 20}px)`}}>🚓</div>
						</At>
						<At x={540} y={800}>
							<Stamp text="SIN ESCAPATORIA" color={RED} frame={frame} at={at('escapatoria')} size={90} rot={-6} />
						</At>
					</Stage>
				);
			},
		},
		// 1 GTA V: 5 · GTA VI: 6
		{
			camera: 'pull',
			pops: ['cinco', 'sexta'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={150}>
						<div style={{fontFamily: anton, fontSize: 80, color: '#fff', opacity: 0.85}}>GTA V</div>
					</At>
					<At x={540} y={280}>
						<div style={{opacity: frame >= at('cinco') ? 1 : 0.3}}>
							<Stars n={frame >= at('cinco') ? 5 : 0} total={5} size={110} frame={frame} />
						</div>
					</At>
					<At x={540} y={480}>
						<div style={{fontFamily: anton, fontSize: 100, color: ORANGE, textShadow: `0 0 30px ${PINK}`}}>GTA VI</div>
					</At>
					<At x={540} y={630}>
						<Stars n={frame >= at('sexta') ? 6 : 5} size={110} frame={frame} />
					</At>
					<At x={540} y={830}>
						<Chip text="⭐ Vuelve la sexta estrella" color={ORANGE} frame={frame} at={at('sexta')} size={50} />
					</At>
				</Stage>
			),
		},
		// 2 Cómo llegar: destrucción masiva + tanque de la base militar
		{
			camera: 'push',
			pops: ['destruccion', 'tanque'],
			booms: ['masiva'],
			render: ({frame, at}) => {
				const tx = interpolate(frame, [at('tanque') - 4, at('tanque') + 30], [-450, 540], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<Stage>
						<At x={540} y={80}>
							<Title t="DESTRUCCIÓN MASIVA" frame={frame} color={ORANGE} size={96} />
						</At>
						{frame >= at('masiva') &&
							new Array(7).fill(0).map((_, i) => (
								<At key={i} x={140 + rand(i) * 800} y={250 + rand(i * 3) * 280}>
									<div style={{fontSize: 110 + rand(i * 7) * 60, transform: `scale(${pop(frame, at('masiva') + i * 3)})`}}>💥</div>
								</At>
							))}
						<At x={tx} y={640}>
							<Tank size={460} />
						</At>
						<At x={540} y={840}>
							<Chip text="🪖 Robar un tanque de la base militar" color={CYAN} frame={frame} at={at('tanque')} size={42} dark />
						</At>
					</Stage>
				);
			},
		},
		// 3 Llega el ejército entero
		{
			camera: 'tilt',
			pops: ['tanques', 'helicopteros', 'camiones', 'barricadas'],
			booms: ['ejercito'],
			render: ({frame, at}) => {
				const items: [string, string, string][] = [
					['🪖', 'Tanques', 'tanques'],
					['🚁', 'Helicópteros de ataque', 'helicopteros'],
					['🚚', 'Camiones con torreta', 'camiones'],
					['🚧', 'Barricadas', 'barricadas'],
				];
				return (
					<Stage>
						<Siren frame={frame} o={0.25} />
						<At x={540} y={60}>
							<Title t="EL EJÉRCITO ENTERO" frame={frame} color={RED} size={96} />
						</At>
						{[0, 1].map((i) => (
							<At key={i} x={((frame * (6 + i * 3) + i * 500) % 1500) - 200} y={170 + i * 60}>
								<div style={{fontSize: 90, transform: 'scaleX(-1)'}}>🚁</div>
							</At>
						))}
						{items.map(([e, t, k], i) => {
							const t0 = at(k);
							if (frame < t0) return null;
							const p = ease(frame, t0, t0 + 10);
							return (
								<div key={i} style={{position: 'absolute', left: 80, top: 330 + i * 140, width: 900, display: 'flex', alignItems: 'center', gap: 24, transform: `translateX(${(1 - p) * -600}px)`, opacity: p, background: 'rgba(0,0,0,0.6)', border: `4px solid ${i === 0 ? ORANGE : RED}`, borderRadius: 24, padding: '14px 26px'}}>
									<div style={{fontSize: 70}}>{e}</div>
									<div style={{fontFamily: anton, fontSize: 56, color: '#fff'}}>{t.toUpperCase()}</div>
									{i === 0 && <div style={{marginLeft: 'auto', fontFamily: montserrat, fontWeight: 900, fontSize: 30, color: ORANGE}}>ya con 5★</div>}
								</div>
							);
						})}
					</Stage>
				);
			},
		},
		// 4 Lo peor: el nivel ya no baja
		{
			camera: 'push',
			pops: ['baja'],
			booms: ['peor'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={80}>
						<Title t="LO PEOR" frame={frame} color={RED} size={120} />
					</At>
					<At x={540} y={330}>
						<Stars n={6} size={120} state="on" frame={frame} />
					</At>
					<At x={540} y={330}>
						<div style={{fontSize: 200, transform: `scale(${frame >= at('baja') ? pop(frame, at('baja')) : 0})`}}>🔒</div>
					</At>
					<At x={540} y={600}>
						<Stamp text="YA NO BAJA" color={RED} frame={frame} at={at('baja')} size={100} rot={-6} />
					</At>
					<At x={540} y={820}>
						<Chip text="🙈 Da igual dónde te escondas" color={CYAN} frame={frame} at={at('escondas')} size={46} dark />
					</At>
				</Stage>
			),
		},
		// 5 Persecución por todo el mapa
		{
			camera: 'shake',
			pops: ['arrestan'],
			booms: ['mueres'],
			render: ({frame, at, dur}) => {
				const k = ease(frame, 0, dur);
				return (
					<Stage>
						<At x={540} y={360}>
							<div style={{position: 'relative', width: 820, height: 560, borderRadius: 30, background: '#16324a', border: `6px solid ${CYAN}`, overflow: 'hidden'}}>
								<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)', backgroundSize: '70px 70px'}} />
								<div style={{position: 'absolute', left: 180, top: 120, width: 420, height: 300, borderRadius: '40% 60% 50% 45%', background: '#2a5d3a'}} />
								{new Array(12).fill(0).map((_, i) => {
									const sx = rand(i) * 820, sy = rand(i * 5) * 560;
									return <div key={i} style={{position: 'absolute', left: sx + (410 - sx) * k * 0.85 - 10, top: sy + (280 - sy) * k * 0.85 - 10, width: 20, height: 20, borderRadius: '50%', background: i % 2 ? RED : '#3f6bff', boxShadow: `0 0 12px ${i % 2 ? RED : '#3f6bff'}`}} />;
								})}
								<div style={{position: 'absolute', left: 395, top: 265, width: 30, height: 30, borderRadius: '50%', background: '#fff', border: `5px solid ${ORANGE}`}} />
							</div>
						</At>
						<At x={300} y={790}>
							<Chip text="🚔 Arrestado" color={CYAN} frame={frame} at={at('arrestan')} size={46} />
						</At>
						<At x={770} y={790}>
							<Chip text="💀 O muerto" color={RED} frame={frame} at={at('mueres')} size={46} />
						</At>
					</Stage>
				);
			},
		},
		// 6 Ojo al dato: estrellas huecas y rojas
		{
			camera: 'panR',
			pops: ['huecas', 'rojas'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={50}>
						<Chip text="👁 OJO AL DATO" color={ORANGE} frame={frame} at={0} size={52} />
					</At>
					{frame >= at('huecas') && (
						<div style={{position: 'absolute', left: 60, top: 170, width: 960, background: 'rgba(0,0,0,0.6)', border: '4px solid #fff', borderRadius: 26, padding: '22px 26px', transform: `scale(${pop(frame, at('huecas'))})`}}>
							<Stars n={3} total={3} size={90} state="hollow" frame={frame} />
							<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 38, color: '#fff', marginTop: 14}}>HUECAS: hay un aviso… pero no saben quién eres</div>
						</div>
					)}
					{frame >= at('rojas') && (
						<div style={{position: 'absolute', left: 60, top: 520, width: 960, background: 'rgba(0,0,0,0.6)', border: `4px solid ${RED}`, borderRadius: 26, padding: '22px 26px', transform: `scale(${pop(frame, at('rojas'))})`}}>
							<Stars n={3} total={3} size={90} state="red" frame={frame} />
							<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 38, color: '#fff', marginTop: 14}}>ROJAS: te han perdido de vista… pero tienen info sobre ti</div>
						</div>
					)}
				</Stage>
			),
		},
		// 7 Consejo
		{
			camera: 'pull',
			pops: ['guarda'],
			booms: ['sale'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={70}>
						<Title t="CONSEJO" frame={frame} color={ORANGE} />
					</At>
					<At x={540} y={360}>
						<div style={{fontSize: 240, transform: `scale(${frame >= at('guarda') ? pop(frame, at('guarda')) : 0.001})`}}>💾</div>
					</At>
					<At x={540} y={580}>
						<Chip text="Guarda la partida ANTES" color={CYAN} frame={frame} at={at('guarda')} size={56} />
					</At>
					<At x={540} y={780}>
						<Stamp text="DE 6★ NO SE SALE" color={RED} frame={frame} at={at('sale')} size={84} rot={-6} />
					</At>
				</Stage>
			),
		},
		// 8 CTA (sin bucle)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={200} r={320} color={PINK} o={0.35} />
					<At x={540} y={190}>
						<Stars n={6} size={110} frame={frame} />
					</At>
					<At x={540} y={640}>
						<FollowCTA frame={frame} at={at('sigueme')} color={ORANGE} question="¿Cuánto has aguantado tú con 6 estrellas?" />
					</At>
				</Stage>
			),
		},
	],
};
