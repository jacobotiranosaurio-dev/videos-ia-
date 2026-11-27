import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/blanconulo.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop} from '../engine/util';

const W = '#eaf6ff'; // blanco
const C = '#5fd3ff';
const R = '#ff3b4f'; // nulo
const G = '#4dff88';
const Y = '#ffd400';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'linear-gradient(90deg, #0d2347 0%, #0d2347 50%, #2a0b16 50%, #2a0b16 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, transparent 30%, rgba(0,0,0,0.6) 100%)'}} />
		<Particles frame={frame} color={C} n={18} size={8} blur={3} />
		<Particles frame={frame + 400} color={R} n={14} size={8} blur={3} dir={1} />
	</AbsoluteFill>
);

// sobre electoral
const Sobre: React.FC<{open?: number; size?: number; color?: string}> = ({open = 0, size = 360, color = '#f3e7c8'}) => (
	<svg width={size} height={size * 0.75} viewBox="0 0 200 150" style={{overflow: 'visible'}}>
		<rect x={10} y={30} width={180} height={115} rx={8} fill={color} stroke="#b9a77c" strokeWidth={3} />
		<path d={`M10 30 L100 ${30 + 70 * (1 - open) - 60 * open} L190 30`} fill="#e6d6ad" stroke="#b9a77c" strokeWidth={3} />
		<path d="M10 145 L100 85 L190 145" fill="none" stroke="#cdbb8e" strokeWidth={2} />
	</svg>
);

// papeleta genérica (sin partidos reales)
const Papeleta: React.FC<{color?: string; size?: number; scribble?: boolean; cross?: boolean; rot?: number}> = ({color = '#3f7cff', size = 200, scribble, cross, rot = 0}) => (
	<svg width={size} height={size * 1.35} viewBox="0 0 100 135" style={{transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.45))'}}>
		<rect x={2} y={2} width={96} height={131} rx={4} fill="#fff" />
		<rect x={2} y={2} width={96} height={26} rx={4} fill={color} />
		<text x={50} y={20} textAnchor="middle" fontFamily={anton} fontSize={13} fill="#fff">PAPELETA</text>
		{[0, 1, 2, 3, 4, 5].map((i) => (
			<rect key={i} x={12} y={40 + i * 14} width={i % 2 ? 60 : 76} height={6} rx={3} fill="#c9d1e0" />
		))}
		{scribble && <path d="M14 60 q10 -18 20 0 t20 0 t20 0 t20 0 M18 95 q12 -14 24 0 t24 0 t24 0" stroke={R} strokeWidth={4} fill="none" strokeLinecap="round" />}
		{cross && <path d="M10 36 L90 126 M90 36 L10 126" stroke={R} strokeWidth={7} strokeLinecap="round" />}
	</svg>
);

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 100}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

// gráfico de barras con el mínimo del 3 %
const Bars: React.FC<{frame: number; threshold: number; drop?: number}> = ({frame, threshold, drop = 0}) => {
	const vals = [30, 24, 16, 8, 4.2];
	const colors = ['#7d8bff', '#ff9f43', '#2ed1a3', '#c77dff', '#ffd400'];
	const H = 520;
	const scale = (v: number) => Math.sqrt(v / 32) * H; // escala raíz: deja ver la diferencia en los valores pequeños
	return (
		<div style={{position: 'relative', width: 900, height: H + 40}}>
			{vals.map((v, i) => {
				const out = i === 4 && drop > 0.5;
				const grow = ease(frame, i * 3, i * 3 + 18);
				return (
					<div key={i} style={{position: 'absolute', bottom: 40, left: 40 + i * 170, width: 120, height: Math.max(scale(v) * grow, 6), background: out ? '#555' : colors[i], borderRadius: '12px 12px 0 0', transition: 'none', opacity: out ? 0.6 : 1}}>
						{out && <div style={{position: 'absolute', top: -150, left: -20, width: 160, textAlign: 'center', fontFamily: anton, fontSize: 50, color: R, textShadow: '0 4px 0 #000'}}>FUERA</div>}
					</div>
				);
			})}
			{/* línea del mínimo */}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 40 + scale(threshold), borderTop: `6px dashed ${R}`}}>
				<div style={{position: 'absolute', left: 0, top: -54, fontFamily: anton, fontSize: 40, color: R}}>MÍNIMO</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 34, height: 6, background: '#fff', opacity: 0.6}} />
		</div>
	);
};

export const blanconulo: VideoDef = {
	id: 'blanconulo',
	timing,
	endAt: 56.82, // 1 s de pantalla final tras "Y sígueme"
	music: 'music/blanconulo.mp3',
	theme: {bg1: '#0d2347', bg2: '#2a0b16', accent: Y, accent2: C, text: '#fff'},
	label: 'ELECCIONES',
	Background: Bg,
	keywords: ['blanco', 'nulo', 'pequenos', 'vacio', 'valido', 'clave', 'escanos', 'minimo', 'congreso', 'dificil', 'escrita', 'tachada', 'distintos', 'nada', 'mismo', 'cuenta', 'diferencia'],
	replacements: [
		{match: ['tres', 'por', 'ciento.'], show: '3 %'},
		{match: ['dos', 'papeletas'], show: '2 papeletas'},
		{match: ['un', 'solo', 'voto.'], show: '1 solo voto'},
	],
	scenes: [
		// 0 HOOK: BLANCO vs NULO
		{
			camera: 'push',
			pops: ['mismo'],
			booms: ['pequenos'],
			render: ({frame, at}) => (
				<Stage>
					<At x={270} y={90}>
						<Title t="BLANCO" frame={frame} color={W} size={110} />
					</At>
					<At x={810} y={90}>
						<Title t="NULO" frame={frame} color={R} size={110} />
					</At>
					<At x={270} y={420}>
						<Sobre open={ease(frame, 10, 30)} size={360} />
					</At>
					<At x={810} y={430}>
						<Papeleta size={220} cross rot={6} />
					</At>
					<At x={540} y={420}>
						<div style={{fontFamily: anton, fontSize: frame >= at('mismo') ? 170 : 120, color: Y, textShadow: '0 0 40px #000, 0 8px 0 #000', transform: `scale(${frame >= at('mismo') ? pop(frame, at('mismo')) : 1})`}}>{frame >= at('mismo') ? '≠' : 'VS'}</div>
					</At>
					<At x={540} y={820}>
						<Chip text="⚠️ Uno deja fuera a los pequeños" color={Y} frame={frame} at={at('pequenos')} size={46} />
					</At>
				</Stage>
			),
		},
		// 1 Voto en blanco: sobre vacío → válido
		{
			camera: 'pull',
			pops: ['vacio'],
			booms: ['valido'],
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={420} r={400} color={C} o={0.3} />
					<At x={540} y={70}>
						<Title t="VOTO EN BLANCO" frame={frame} color={W} />
					</At>
					<At x={540} y={430}>
						<Sobre open={ease(frame, at('sobre'), at('sobre') + 15)} size={480} color="#fff8e1" />
					</At>
					<At x={540} y={360}>
						<Chip text="📭 Sobre vacío" color={W} frame={frame} at={at('vacio')} size={50} dark />
					</At>
					<At x={540} y={790}>
						<Stamp text="VÁLIDO ✓" color={G} frame={frame} at={at('valido')} size={110} rot={-8} />
					</At>
				</Stage>
			),
		},
		// 2 El mínimo para entrar: 3 %
		{
			camera: 'tilt',
			pops: ['tres'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Title t="LA CLAVE" frame={frame} color={Y} />
					</At>
					<At x={540} y={450}>
						<Bars frame={frame} threshold={3} />
					</At>
					<At x={540} y={820}>
						<Stat value="3 %" label="mínimo en el Congreso" color={R} frame={frame} at={at('tres')} size={140} count={false} />
					</At>
				</Stage>
			),
		},
		// 3 Más blancos → sube el mínimo → el pequeño se queda fuera
		{
			camera: 'push',
			booms: ['dificil'],
			render: ({frame, at, dur}) => {
				const rise = ease(frame, 10, dur * 0.7);
				const pile = Math.round(rise * 12);
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="+ BLANCOS = MÍNIMO MÁS ALTO" frame={frame} color={W} size={76} />
						</At>
						<At x={540} y={440}>
							<Bars frame={frame + 60} threshold={3 + rise * 1.8} drop={ease(frame, at('dificil'), at('dificil') + 6)} />
						</At>
						<div style={{position: 'absolute', left: 60, top: 760, display: 'flex', gap: 8}}>
							{new Array(pile).fill(0).map((_, i) => (
								<div key={i} style={{width: 66, height: 46, background: '#fff8e1', border: '3px solid #b9a77c', borderRadius: 6, transform: `rotate(${(i % 3) - 1}deg)`}} />
							))}
						</div>
					</Stage>
				);
			},
		},
		// 4 Voto nulo: qué lo anula
		{
			camera: 'panR',
			pops: ['escrita', 'tachada', 'dos'],
			render: ({frame, at}) => {
				const items: [string, React.ReactNode][] = [
					['escrita', <Papeleta key="a" size={180} scribble rot={-6} />],
					['tachada', <Papeleta key="b" size={180} cross rot={4} />],
					['dos', (
						<div key="c" style={{position: 'relative', width: 230, height: 260}}>
							<div style={{position: 'absolute', left: 0, top: 0}}><Papeleta size={150} color="#3f7cff" rot={-10} /></div>
							<div style={{position: 'absolute', left: 70, top: 30}}><Papeleta size={150} color="#ff7a00" rot={10} /></div>
						</div>
					)],
				];
				return (
					<Stage>
						<At x={540} y={70}>
							<Title t="VOTO NULO" frame={frame} color={R} />
						</At>
						<div style={{position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 30}}>
							{items.map(([k, node], i) => (
								<div key={i} style={{transform: `scale(${frame >= at(k) ? pop(frame, at(k)) : 0})`}}>{node}</div>
							))}
						</div>
						<At x={540} y={760}>
							<Chip text="✍️ Escrita · ❌ Tachada · 2 partidos" color={R} frame={frame} at={at('dos')} size={40} />
						</At>
					</Stage>
				);
			},
		},
		// 5 No cuenta para nada
		{
			camera: 'shake',
			booms: ['nada'],
			pops: ['votar'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={380}>
						<div style={{filter: frame >= at('nada') ? 'grayscale(1) brightness(0.6)' : undefined}}>
							<Papeleta size={300} cross />
						</div>
					</At>
					<At x={540} y={380}>
						<Stamp text="NO CUENTA" color={R} frame={frame} at={at('nada')} size={110} rot={-12} />
					</At>
					<At x={540} y={800}>
						<Chip text="Solo suma como participación" color={W} frame={frame} at={at('votar')} size={44} dark />
					</At>
				</Stage>
			),
		},
		// 6 Ojo al dato: 2 papeletas del mismo partido = 1 voto
		{
			camera: 'push',
			pops: ['mismo', 'solo'],
			render: ({frame, at}) => {
				const merge = ease(frame, at('cuenta'), at('cuenta') + 18);
				return (
					<Stage>
						<At x={540} y={60}>
							<Chip text="👁 OJO AL DATO" color={Y} frame={frame} at={0} size={52} />
						</At>
						<At x={540 - 120 * (1 - merge)} y={400}>
							<Papeleta size={230} color="#2ed1a3" rot={-6 * (1 - merge)} />
						</At>
						<At x={540 + 120 * (1 - merge)} y={400}>
							<div style={{opacity: 1 - merge}}>
								<Papeleta size={230} color="#2ed1a3" rot={6} />
							</div>
						</At>
						<At x={540} y={800}>
							<Stat value="= 1 VOTO ✓" label="mismo partido" color={G} frame={frame} at={at('solo')} size={130} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 7 Consejo: tabla comparativa
		{
			camera: 'panL',
			pops: ['blanco', 'nulo'],
			render: ({frame, at}) => {
				const rows: [string, string, string, string, string][] = [
					['📭', 'BLANCO', 'CUENTA ✓', G, 'blanco'],
					['❌', 'NULO', 'NO CUENTA ✗', R, 'nulo'],
				];
				return (
					<Stage>
						<At x={540} y={70}>
							<Title t="CONSEJO" frame={frame} color={Y} />
						</At>
						{rows.map(([e, t, v, col, k], i) => {
							const t0 = at(k);
							if (frame < t0) return null;
							const p = ease(frame, t0, t0 + 12);
							return (
								<div key={i} style={{position: 'absolute', left: 60, top: 260 + i * 210, width: 920, display: 'flex', alignItems: 'center', gap: 26, transform: `translateX(${(1 - p) * -600}px)`, opacity: p, background: 'rgba(0,0,0,0.55)', border: `5px solid ${col}`, borderRadius: 28, padding: '26px 30px'}}>
									<div style={{fontSize: 90}}>{e}</div>
									<div style={{fontFamily: anton, fontSize: 70, color: '#fff'}}>{t}</div>
									<div style={{marginLeft: 'auto', fontFamily: anton, fontSize: 56, color: col}}>{v}</div>
								</div>
							);
						})}
						<At x={540} y={760}>
							<Chip text="Elige sabiendo lo que haces" color={W} frame={frame} at={at('elige')} size={44} dark />
						</At>
					</Stage>
				);
			},
		},
		// 8 CTA (sin bucle)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<At x={330} y={180}>
						<Sobre open={1} size={240} />
					</At>
					<At x={760} y={190}>
						<Papeleta size={150} cross rot={8} />
					</At>
					<At x={540} y={640}>
						<FollowCTA frame={frame} at={at('sigueme')} color={Y} question="¿Tú sabías la diferencia?" />
					</At>
				</Stage>
			),
		},
	],
};
