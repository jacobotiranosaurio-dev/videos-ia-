import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/congresosenado.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop, rand} from '../engine/util';

const WHITE = '#f4f7ff';
const SEPIA = '#d9b47a';
const SEPIA_D = '#8a6a3a';
const GOLD = '#ffd400';
const RED = '#ff3b4f';
const GREEN = '#4dff88';
const BLUE = '#5fb0ff';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'linear-gradient(90deg, #142240 0%, #142240 50%, #2b1d10 50%, #2b1d10 100%)'}} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, transparent 30%, rgba(0,0,0,0.6) 100%)'}} />
		<Particles frame={frame} color={WHITE} n={16} size={7} blur={3} />
		<Particles frame={frame + 300} color={SEPIA} n={16} size={7} blur={3} dir={1} />
	</AbsoluteFill>
);

// papeleta del Congreso (lista cerrada) o del Senado (candidatos con casillas) — genéricas, sin partidos reales
const Papeleta: React.FC<{tipo: 'congreso' | 'senado'; size?: number; marks?: number; extraMark?: boolean; locked?: boolean; rot?: number}> = ({tipo, size = 300, marks = 0, extraMark, locked, rot = 0}) => {
	const sen = tipo === 'senado';
	const partyColors = ['#5fb0ff', '#ff8a3d', '#3ddc84', '#c77dff'];
	return (
		<div style={{position: 'relative', width: size, height: size * 1.4, background: sen ? SEPIA : WHITE, borderRadius: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: `rotate(${rot}deg)`, padding: size * 0.06, boxSizing: 'border-box', overflow: 'hidden'}}>
			<div style={{fontFamily: anton, fontSize: size * 0.11, color: sen ? '#3a2a12' : '#1a2a4a', textAlign: 'center'}}>{sen ? 'SENADO' : 'CONGRESO'}</div>
			{!sen && (
				<>
					<div style={{height: size * 0.12, background: '#1a2a4a', borderRadius: 6, marginTop: size * 0.04, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: montserrat, fontWeight: 900, fontSize: size * 0.06, color: '#fff'}}>PARTIDO</div>
					{new Array(6).fill(0).map((_, i) => (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: size * 0.03, marginTop: size * 0.05}}>
							<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: size * 0.05, color: '#1a2a4a', width: size * 0.06}}>{i + 1}</div>
							<div style={{flex: 1, height: size * 0.04, borderRadius: 4, background: '#c3cbe0'}} />
						</div>
					))}
					{locked && <div style={{position: 'absolute', right: size * 0.05, bottom: size * 0.05, fontSize: size * 0.22}}>🔒</div>}
				</>
			)}
			{sen &&
				new Array(8).fill(0).map((_, i) => {
					const marked = i < marks ? [0, 3, 5][i] : -1;
					const isMarked = [0, 3, 5].slice(0, marks).includes(i) || (extraMark && i === 7);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: size * 0.04, marginTop: size * 0.045}}>
							<div style={{width: size * 0.08, height: size * 0.08, border: `3px solid #3a2a12`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: anton, fontSize: size * 0.08, color: extraMark && i === 7 ? RED : '#1a1a1a', lineHeight: 1}}>{isMarked ? '✕' : ''}</div>
							<div style={{width: size * 0.06, height: size * 0.06, borderRadius: '50%', background: partyColors[Math.floor(i / 2) % 4]}} />
							<div style={{flex: 1, height: size * 0.035, borderRadius: 4, background: SEPIA_D, opacity: 0.7}} />
							{marked > -1 ? null : null}
						</div>
					);
				})}
		</div>
	);
};

// hemiciclo de escaños
const Hemiciclo: React.FC<{n: number; total: number; color: string; grey?: number; size?: number}> = ({n, total, color, grey = 0, size = 860}) => {
	const rows = 8;
	const seats: [number, number][] = [];
	const all = total + grey;
	for (let r = 0; r < rows; r++) {
		const rad = 0.42 + r * 0.075;
		const count = Math.round((all / rows) * (0.7 + r * 0.085));
		for (let k = 0; k < count && seats.length < all; k++) {
			const a = Math.PI * (k / Math.max(1, count - 1));
			seats.push([0.5 - Math.cos(a) * rad * 0.5, 0.95 - Math.sin(a) * rad * 0.95]);
		}
	}
	return (
		<div style={{position: 'relative', width: size, height: size * 0.55}}>
			{seats.map(([x, y], i) => (
				<div key={i} style={{position: 'absolute', left: x * size - 6, top: y * size * 0.55 - 6, width: 12, height: 12, borderRadius: '50%', background: i < n ? color : i >= total && i < total + grey ? '#777' : 'rgba(255,255,255,0.12)'}} />
			))}
		</div>
	);
};

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 100}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

export const congresosenado: VideoDef = {
	id: 'congresosenado',
	timing,
	endAt: 58.24, // 1 s de pantalla final tras "Y sígueme"
	music: 'music/congresosenado.mp3',
	theme: {bg1: '#142240', bg2: '#2b1d10', accent: GOLD, accent2: BLUE, text: '#fff'},
	label: 'ELECCIONES',
	Background: Bg,
	keywords: ['congreso', 'senado', 'diferencian', 'blanca', 'partido', 'cerrada', 'orden', 'nombres', 'diputados', 'sepia', 'personas', 'candidatos', 'distintos', 'nulo', 'senadores', 'autonomicos', 'manda', 'presidente', 'veto', 'as', 'absoluta', 'articulo', 'mezclar'],
	replacements: [
		{match: ['veintinueve', 'ene'], show: '29N'},
		{match: ['dos', 'veces'], show: '2 veces'},
		{match: ['trescientos', 'cincuenta'], show: '350'},
		{match: ['doscientos', 'nueve'], show: '209'},
		{match: ['ciento', 'cincuenta', 'y', 'cinco'], show: '155'},
		{match: ['tres'], show: '3'},
	],
	scenes: [
		// 0 HOOK: 29N · ×2 papeletas
		{
			camera: 'push',
			pops: ['dos'],
			booms: ['diferencian'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Title t="29N" frame={frame} color={GOLD} size={150} />
					</At>
					<At x={290} y={470}>
						<div style={{transform: `scale(${frame >= at('congreso') ? pop(frame, at('congreso')) : 0})`}}>
							<Papeleta tipo="congreso" size={300} rot={-6} />
						</div>
					</At>
					<At x={790} y={470}>
						<div style={{transform: `scale(${frame >= at('senado') ? pop(frame, at('senado')) : 0})`}}>
							<Papeleta tipo="senado" size={300} rot={6} />
						</div>
					</At>
					<At x={540} y={760}>
						<Stamp text="VOTAS ×2" color={GOLD} frame={frame} at={at('dos')} size={90} rot={-8} />
					</At>
					<At x={540} y={880}>
						<Chip text="🤔 ¿En qué se diferencian?" color={GOLD} frame={frame} at={at('diferencian')} size={50} />
					</At>
				</Stage>
			),
		},
		// 1 Congreso: lista cerrada
		{
			camera: 'panR',
			pops: ['partido', 'cerrada'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={50}>
						<Title t="PAPELETA BLANCA" frame={frame} color={WHITE} size={96} />
					</At>
					<At x={540} y={420}>
						<Papeleta tipo="congreso" size={360} locked={frame >= at('cerrada')} />
					</At>
					<At x={540} y={770}>
						<Chip text="🗳️ Votas a un PARTIDO" color={BLUE} frame={frame} at={at('partido')} size={46} />
					</At>
					<At x={540} y={880}>
						<Chip text="🔒 Lista cerrada: ni orden ni nombres" color={WHITE} frame={frame} at={at('tocar')} size={40} dark />
					</At>
				</Stage>
			),
		},
		// 2 350 diputados
		{
			camera: 'pull',
			pops: ['trescientos'],
			render: ({frame, at}) => {
				const n = Math.round(interpolate(frame, [0, 40], [0, 350], {extrapolateRight: 'clamp'}));
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="CONGRESO" frame={frame} color={BLUE} size={110} />
						</At>
						<At x={540} y={420}>
							<Hemiciclo n={n} total={350} color={BLUE} />
						</At>
						<At x={540} y={760}>
							<Stat value="350" label="diputados" color={BLUE} frame={frame} at={at('trescientos')} size={160} />
						</At>
					</Stage>
				);
			},
		},
		// 3 Senado: votas a personas, hasta 3, de partidos distintos
		{
			camera: 'tilt',
			pops: ['personas', 'tres', 'distintos'],
			render: ({frame, at}) => {
				const marks = frame >= at('distintos') ? 3 : frame >= at('tres') ? 2 : frame >= at('puedes') ? 1 : 0;
				return (
					<Stage>
						<At x={540} y={50}>
							<Title t="PAPELETA SEPIA" frame={frame} color={SEPIA} size={96} />
						</At>
						<At x={330} y={440}>
							<Papeleta tipo="senado" size={360} marks={marks} />
						</At>
						<At x={800} y={300}>
							<Chip text="👤 Personas" color={SEPIA} frame={frame} at={at('personas')} size={42} />
						</At>
						<At x={800} y={430}>
							<Chip text="✕ Hasta 3" color={GOLD} frame={frame} at={at('tres')} size={46} />
						</At>
						<At x={800} y={560}>
							<Chip text="🎨 De partidos distintos" color={GREEN} frame={frame} at={at('distintos')} size={34} />
						</At>
					</Stage>
				);
			},
		},
		// 4 Más de 3 cruces: nulo
		{
			camera: 'shake',
			booms: ['nulo'],
			pops: ['tres'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={50}>
						<Title t="¡OJO!" frame={frame} color={RED} size={120} />
					</At>
					<At x={540} y={440}>
						<div style={{filter: frame >= at('nulo') ? 'grayscale(0.7) brightness(0.7)' : undefined}}>
							<Papeleta tipo="senado" size={340} marks={3} extraMark={frame >= at('tres')} rot={-3} />
						</div>
					</At>
					<At x={540} y={440}>
						<Stamp text="+3 = NULO" color={RED} frame={frame} at={at('nulo')} size={110} rot={-10} />
					</At>
				</Stage>
			),
		},
		// 5 209 senadores en las urnas + designados
		{
			camera: 'pull',
			pops: ['doscientos', 'resto'],
			render: ({frame, at}) => {
				const n = Math.round(interpolate(frame, [0, 40], [0, 209], {extrapolateRight: 'clamp'}));
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="SENADO" frame={frame} color={SEPIA} size={110} />
						</At>
						<At x={540} y={420}>
							<Hemiciclo n={n} total={209} color={SEPIA} grey={frame >= at('resto') ? 56 : 0} />
						</At>
						<At x={540} y={740}>
							<Stat value="209" label="en las urnas" color={SEPIA} frame={frame} at={at('doscientos')} size={150} />
						</At>
						<At x={540} y={890}>
							<Chip text="⚪ El resto: los parlamentos autonómicos" color="#cfcfcf" frame={frame} at={at('resto')} size={36} dark />
						</At>
					</Stage>
				);
			},
		},
		// 6 ¿Quién manda más? El Congreso
		{
			camera: 'push',
			pops: ['congreso', 'presidente', 'levantar'],
			render: ({frame, at}) => {
				const tilt = ease(frame, at('congreso'), at('congreso') + 20) * 14;
				return (
					<Stage>
						<At x={540} y={50}>
							<Title t="¿QUIÉN MANDA MÁS?" frame={frame} color={GOLD} size={92} />
						</At>
						<At x={540} y={330}>
							<svg width={760} height={360} viewBox="0 0 380 180">
								<rect x={186} y={40} width={8} height={130} fill="#ddd" />
								<rect x={140} y={168} width={100} height={10} rx={4} fill="#ddd" />
								<g transform={`rotate(${-tilt} 190 44)`}>
									<rect x={30} y={40} width={320} height={8} rx={4} fill="#ddd" />
									<rect x={20} y={60} width={110} height={60} rx={10} fill={BLUE} />
									<text x={75} y={98} textAnchor="middle" fontFamily={anton} fontSize={22} fill="#fff">CONGRESO</text>
									<rect x={250} y={60} width={110} height={60} rx={10} fill={SEPIA} />
									<text x={305} y={98} textAnchor="middle" fontFamily={anton} fontSize={22} fill="#3a2a12">SENADO</text>
								</g>
							</svg>
						</At>
						<At x={540} y={680}>
							<Chip text="👑 Solo él elige al presidente" color={BLUE} frame={frame} at={at('presidente')} size={44} />
						</At>
						<At x={540} y={810}>
							<Chip text="↩️ Levanta el veto del Senado" color={WHITE} frame={frame} at={at('levantar')} size={40} dark />
						</At>
					</Stage>
				);
			},
		},
		// 7 El as del Senado: artículo 155
		{
			camera: 'push',
			pops: ['as', 'absoluta'],
			booms: ['ciento'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Title t="EL AS DEL SENADO" frame={frame} color={SEPIA} size={100} />
					</At>
					<At x={540} y={420}>
						<div style={{width: 320, height: 440, borderRadius: 24, background: '#fffaf0', border: `8px solid ${SEPIA}`, boxShadow: `0 0 60px ${GOLD}66`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${frame >= at('as') ? pop(frame, at('as')) : 0}) rotate(${Math.sin(frame / 12) * 3}deg)`}}>
							<div style={{fontFamily: anton, fontSize: 70, color: '#3a2a12'}}>ART.</div>
							<div style={{fontFamily: anton, fontSize: 150, color: RED, lineHeight: 1}}>{frame >= at('ciento') ? '155' : '♠'}</div>
						</div>
					</At>
					<At x={540} y={810}>
						<Chip text="Necesita su mayoría absoluta" color={GOLD} frame={frame} at={at('absoluta')} size={44} />
					</At>
				</Stage>
			),
		},
		// 8 CTA (sin bucle)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={200} r={320} color={GOLD} o={0.25} />
					<At x={380} y={200}>
						<Papeleta tipo="congreso" size={170} rot={-8} />
					</At>
					<At x={700} y={200}>
						<Papeleta tipo="senado" size={170} marks={3} rot={8} />
					</At>
					<At x={540} y={660}>
						<FollowCTA frame={frame} at={at('sigueme')} color={GOLD} question="¿Sabías que podías mezclar partidos en el Senado?" />
					</At>
				</Stage>
			),
		},
	],
};
