import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/prohibidos.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Rank, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop} from '../engine/util';

const Y = '#ffd400';
const R = '#ff2d2d';

const Tape: React.FC<{frame: number; y: number; rot: number; dir?: number; text?: string}> = ({frame, y, rot, dir = 1, text = 'PROHIBIDO EL PASO'}) => (
	<div style={{position: 'absolute', left: -300, top: y, width: 1700, height: 80, background: `repeating-linear-gradient(45deg, ${Y} 0 40px, #111 40px 80px)`, transform: `rotate(${rot}deg)`, boxShadow: '0 10px 30px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
		<div style={{position: 'absolute', top: 10, left: ((frame * 6 * dir) % 600) - 600, whiteSpace: 'nowrap', fontFamily: anton, fontSize: 52, color: '#000', background: Y, padding: '0 20px', letterSpacing: 4}}>
			{`${text} · `.repeat(8)}
		</div>
	</div>
);

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #3a0d0d 0%, #0a0a0a 65%)'}} />
		<AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,212,0,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(255,212,0,0.06) 2px, transparent 2px)', backgroundSize: '90px 90px', backgroundPosition: `0 ${frame}px`}} />
		<Particles frame={frame} color="#ff6a3d" n={30} size={8} />
	</AbsoluteFill>
);

// isla vista desde arriba
const Island: React.FC<{frame: number; size?: number; color?: string}> = ({frame, size = 520, color = '#2f9e44'}) => (
	<svg width={size} height={size} viewBox="-100 -100 200 200">
		{[0, 1, 2].map((i) => (
			<circle key={i} r={70 + ((frame / 2 + i * 10) % 30)} fill="none" stroke="#7fe3ff" strokeWidth={1.5} opacity={1 - ((frame / 2 + i * 10) % 30) / 30} />
		))}
		<path d="M-60 -10 C-62 -45 -20 -66 15 -58 C55 -50 70 -15 62 15 C55 50 15 66 -15 60 C-50 54 -58 25 -60 -10Z" fill="#f2d49b" />
		<path d="M-50 -10 C-52 -38 -18 -55 12 -48 C45 -41 58 -12 52 12 C46 42 12 54 -12 50 C-42 45 -48 20 -50 -10Z" fill={color} />
		{new Array(18).fill(0).map((_, i) => (
			<circle key={i} cx={Math.cos(i * 2.4) * (i * 2.4)} cy={Math.sin(i * 2.4) * (i * 2.2)} r={7 + (i % 3) * 2} fill="#1f7a33" />
		))}
	</svg>
);

const Snake: React.FC<{frame: number; x: number; y: number; s?: number; phase?: number}> = ({frame, x, y, s = 1, phase = 0}) => {
	const pts = new Array(24).fill(0).map((_, i) => {
		const px = i * 14;
		const py = Math.sin(i / 2.5 - frame / 4 + phase) * 18;
		return `${px},${py}`;
	});
	return (
		<svg width={420 * s} height={140 * s} viewBox="-40 -70 420 140" style={{position: 'absolute', left: x, top: y}}>
			<polyline points={pts.join(' ')} fill="none" stroke="#c9a227" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
			<polyline points={pts.join(' ')} fill="none" stroke="#7a5b0b" strokeWidth={6} strokeDasharray="6 14" strokeLinecap="round" />
			<g transform={`translate(${23 * 14 + 10}, ${Math.sin(23 / 2.5 - frame / 4 + phase) * 18})`}>
				<ellipse rx={22} ry={14} fill="#d9b23a" />
				<circle cx={8} cy={-5} r={3} fill="#000" />
				{Math.sin(frame / 3 + phase) > 0.3 && <path d="M20 0 l18 -4 m-18 4 l18 4" stroke={R} strokeWidth={3} />}
			</g>
		</svg>
	);
};

const Sign: React.FC<{frame: number}> = ({frame}) => (
	<div style={{width: 640, background: '#f4f1e8', border: '12px solid #b50000', borderRadius: 16, padding: '26px 20px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: `rotate(${Math.sin(frame / 15) * 2}deg)`}}>
		<div style={{fontFamily: anton, fontSize: 70, color: '#b50000', lineHeight: 1}}>⚠ ZONA RESTRINGIDA</div>
		<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 38, color: '#111', marginTop: 16}}>INSTALACIÓN MILITAR</div>
		<div style={{fontFamily: anton, fontSize: 64, color: '#fff', background: '#b50000', marginTop: 16, padding: '6px 0'}}>FUERZA LETAL AUTORIZADA</div>
	</div>
);

const Radar: React.FC<{frame: number; size?: number}> = ({frame, size = 560}) => {
	const a = (frame * 5) % 360;
	return (
		<svg width={size} height={size} viewBox="-100 -100 200 200">
			<circle r={95} fill="#031a08" stroke="#2bff6a" strokeWidth={2} />
			{[30, 60].map((r) => (
				<circle key={r} r={r} fill="none" stroke="#2bff6a" strokeWidth={1} opacity={0.5} />
			))}
			<line x1={-95} x2={95} stroke="#2bff6a" opacity={0.4} />
			<line y1={-95} y2={95} stroke="#2bff6a" opacity={0.4} />
			<g transform={`rotate(${a})`}>
				<path d="M0 0 L95 0 A95 95 0 0 0 82 -47 Z" fill="#2bff6a" opacity={0.35} />
				<line x2={95} stroke="#2bff6a" strokeWidth={2} />
			</g>
			{[
				[40, -30],
				[-50, 20],
				[20, 55],
			].map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={4} fill={R} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 6 + i))} />
			))}
		</svg>
	);
};

export const prohibidos: VideoDef = {
	id: 'prohibidos',
	timing,
	music: 'music/prohibidos.mp3',
	theme: {bg1: '#0a0a0a', bg2: '#1a0505', accent: Y, accent2: '#ff6a3d', text: '#fff'},
	label: 'PROHIBIDO',
	Background: Bg,
	keywords: ['vivo', 'buscarte', 'sentinel', 'india', 'ilegal', 'misionero', 'volvio', 'serpientes', 'veneno', 'brasil', 'marina', 'nevada', 'letal', 'fuerza', 'drones', 'fotos', 'patrullas', 'quemada', 'existencia'],
	replacements: [
		{match: ['sesenta', 'mil', 'años'], show: '60.000 años'},
		{match: ['cinco', 'millas', 'náuticas'], show: '5 millas náuticas'},
		{match: ['dos', 'mil', 'dieciocho,'], show: '2018'},
		{match: ['cincuenta', 'y', 'uno,'], show: '51'},
		{match: ['dos', 'mil', 'trece.'], show: '2013'},
	],
	scenes: [
		// 0 HOOK: isla + cinta + sello PROHIBIDO
		{
			camera: 'push',
			booms: ['vivo'],
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={420} r={420} color={R} o={0.35} />
					<At x={540} y={420}>
						<Island frame={frame} size={600} />
					</At>
					<At x={540 + Math.sin(frame / 5) * 4} y={420}>
						<div style={{fontSize: 90, transform: `scale(${pop(frame, at('playa'), 30)})`}}>{frame > at('playa') ? '👣' : ''}</div>
					</At>
					<Tape frame={frame} y={60} rot={-8} />
					<Tape frame={frame} y={760} rot={7} dir={-1} />
					<At x={540} y={420}>
						<Stamp text="NO SALES VIVO" color={R} frame={frame} at={at('vivo')} />
					</At>
				</Stage>
			),
		},
		// 1 Isla Sentinel del Norte
		{
			pops: ['sesenta'],
			render: ({frame, at}) => (
				<Stage>
					<At x={210} y={130}>
						<Rank n="1" color={Y} frame={frame} />
					</At>
					<At x={620} y={110}>
						<div style={{fontFamily: anton, fontSize: 92, color: '#fff', lineHeight: 1, textAlign: 'center', transform: `scale(${pop(frame, 3)})`}}>
							ISLA SENTINEL
							<br />
							<span style={{color: Y}}>DEL NORTE</span>
						</div>
					</At>
					<At x={540} y={480}>
						<Island frame={frame} size={540} />
					</At>
					<At x={790} y={330}>
						<Chip text="📍 India" color={Y} frame={frame} at={at('india')} size={44} />
					</At>
					<At x={540} y={820}>
						<Stat value="60.000 AÑOS" label="aislados del mundo" color={Y} frame={frame} at={at('sesenta')} size={140} />
					</At>
				</Stage>
			),
		},
		// 2 zona de exclusión + 2018
		{
			camera: 'pull',
			pops: ['cinco', 'dos'],
			booms: ['volvio'],
			render: ({frame, at}) => {
				const k = ease(frame, at('cinco'), at('cinco') + 20);
				return (
					<Stage>
						<At x={540} y={420}>
							<div style={{width: 760 * k, height: 760 * k, borderRadius: '50%', border: `8px dashed ${R}`, background: 'rgba(255,45,45,0.12)', transform: `rotate(${frame}deg)`}} />
						</At>
						<At x={540} y={420}>
							<Island frame={frame} size={300} />
						</At>
						{/* barca que se acerca */}
						<At x={interpolate(frame, [0, 200], [1040, 780], {extrapolateRight: 'clamp'})} y={720}>
							<div style={{fontSize: 90}}>🛶</div>
						</At>
						<At x={300} y={90}>
							<Stat value="5 MILLAS" label="zona prohibida" color={R} frame={frame} at={at('cinco')} size={110} />
						</At>
						<At x={790} y={90}>
							<Stat value="2018" color={Y} frame={frame} at={at('dos')} size={110} rotate={4} />
						</At>
						<At x={540} y={420}>
							<Stamp text="NO VOLVIÓ" color={R} frame={frame} at={at('volvio')} size={110} />
						</At>
					</Stage>
				);
			},
		},
		// 3 Isla de la Quemada Grande: serpientes
		{
			camera: 'panL',
			pops: ['miles'],
			render: ({frame, at}) => (
				<Stage>
					<At x={210} y={130}>
						<Rank n="2" color={Y} frame={frame} />
					</At>
					<At x={630} y={110}>
						<div style={{fontFamily: anton, fontSize: 84, color: '#fff', lineHeight: 1, textAlign: 'center', transform: `scale(${pop(frame, 3)})`}}>
							ISLA DE LA
							<br />
							<span style={{color: '#6dff6d'}}>QUEMADA GRANDE</span>
						</div>
					</At>
					<At x={790} y={300}>
						<Chip text="📍 Brasil" color="#6dff6d" frame={frame} at={at('brasil')} size={44} />
					</At>
					{new Array(frame > at('miles') ? 7 : 2).fill(0).map((_, i) => (
						<Snake key={i} frame={frame} x={-40 + ((i * 263) % 700)} y={330 + ((i * 131) % 380)} s={0.9} phase={i} />
					))}
					<At x={540} y={830}>
						<Stat value="MILES" label="de serpientes venenosas" color="#6dff6d" frame={frame} at={at('miles')} size={150} count={false} />
					</At>
				</Stage>
			),
		},
		// 4 Solo la Marina
		{
			pops: ['marina'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={380}>
						<div style={{fontSize: 300, transform: `rotate(${Math.sin(frame / 8) * 8}deg)`}}>⚓</div>
					</At>
					<At x={540} y={700}>
						<Stamp text="SOLO LA MARINA" color={Y} frame={frame} at={at('marina')} size={100} rot={-6} />
					</At>
				</Stage>
			),
		},
		// 5 Área 51
		{
			camera: 'shake',
			pops: ['cincuenta'],
			booms: ['letal'],
			render: ({frame, at}) => (
				<Stage>
					<At x={210} y={130}>
						<Rank n="3" color={Y} frame={frame} />
					</At>
					<At x={640} y={130}>
						<div style={{fontFamily: anton, fontSize: 150, color: '#fff', lineHeight: 1, transform: `scale(${pop(frame, 3)})`}}>
							ÁREA <span style={{color: '#2bff6a'}}>51</span>
						</div>
					</At>
					<At x={800} y={260}>
						<Chip text="📍 Nevada" color="#2bff6a" frame={frame} at={at('nevada')} size={40} />
					</At>
					<At x={540} y={620}>{frame > at('carteles') ? <div style={{transform: `scale(${pop(frame, at('carteles'))})`}}><Sign frame={frame} /></div> : <div style={{fontSize: 200}}>🛸</div>}</At>
				</Stage>
			),
		},
		// 6 2013 + vigilancia
		{
			camera: 'push',
			pops: ['dos', 'drones', 'camaras'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={450}>
						<Radar frame={frame} />
					</At>
					<At x={540} y={100}>
						<Stat value="2013" label="año en que lo admitieron" color="#2bff6a" frame={frame} at={at('dos')} size={140} />
					</At>
					<At x={250} y={780}>
						<Chip text="🚫 drones" color={R} frame={frame} at={at('drones')} />
					</At>
					<At x={820} y={780}>
						<Chip text="🚫 fotos" color={R} frame={frame} at={at('fotos')} />
					</At>
					<At x={540} y={450}>
						<Chip text="👁 vigilado 24 h" color="#2bff6a" frame={frame} at={at('camaras')} dark />
					</At>
				</Stage>
			),
		},
		// 7 CTA + bucle
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30}}>
						{['🏝️', '🐍', '🛸'].map((e, i) => (
							<div key={i} style={{width: 230, height: 230, borderRadius: 30, background: 'rgba(0,0,0,0.5)', border: `5px solid ${Y}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 130, transform: `scale(${pop(frame, i * 5)}) translateY(${Math.sin(frame / 8 + i) * 10}px)`}}>
								{e}
							</div>
						))}
					</div>
					<At x={540} y={640}>
						<FollowCTA frame={frame} at={at('sigueme')} color={Y} question="¿A cuál entrarías?" />
					</At>
					<Tape frame={frame} y={-40} rot={-4} />
				</Stage>
			),
		},
	],
};
