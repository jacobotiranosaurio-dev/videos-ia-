import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/miel.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop, rand} from '../engine/util';

const H = '#ffb21e'; // miel
const H2 = '#ffd45c';
const DARK = '#2a1503';

// fondo de panal hexagonal que se desplaza
const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, #6b3a05 0%, #1c0d02 70%)'}} />
		<svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.16}}>
			<defs>
				<pattern id="hex" width={104} height={180} patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${frame * 0.8})`}>
					<path d="M52 0 L104 30 L104 90 L52 120 L0 90 L0 30Z M52 120 L52 180" fill="none" stroke={H} strokeWidth={4} />
				</pattern>
			</defs>
			<rect width={1080} height={1920} fill="url(#hex)" />
		</svg>
		<Particles frame={frame} color={H2} n={34} size={9} blur={2} />
	</AbsoluteFill>
);

// tarro de miel con goteo
const Jar: React.FC<{frame: number; size?: number; level?: number; dusty?: boolean; crystal?: number}> = ({frame, size = 420, level = 0.82, dusty, crystal = 0}) => {
	const drip = (frame % 45) / 45;
	return (
		<svg width={size} height={size * 1.25} viewBox="0 0 200 250">
			<defs>
				<linearGradient id="honey" x1="0" x2="1">
					<stop offset="0%" stopColor="#c46a00" />
					<stop offset="45%" stopColor={H2} />
					<stop offset="100%" stopColor="#b35c00" />
				</linearGradient>
				<clipPath id="jarclip">
					<path d="M40 60 Q30 70 30 95 L30 215 Q30 240 60 240 L140 240 Q170 240 170 215 L170 95 Q170 70 160 60Z" />
				</clipPath>
			</defs>
			<path d="M40 60 Q30 70 30 95 L30 215 Q30 240 60 240 L140 240 Q170 240 170 215 L170 95 Q170 70 160 60Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.6)" strokeWidth={4} />
			<g clipPath="url(#jarclip)">
				<rect x={20} y={240 - 180 * level} width={160} height={200} fill="url(#honey)" />
				<path d={`M20 ${240 - 180 * level} ${[0, 1, 2, 3].map((i) => `Q ${40 + i * 40} ${240 - 180 * level - 6 * Math.sin(frame / 8 + i)} ${60 + i * 40} ${240 - 180 * level}`).join(' ')}`} stroke="#ffe39a" strokeWidth={3} fill="none" />
				{crystal > 0 &&
					new Array(40).fill(0).map((_, i) => <rect key={i} x={30 + rand(i) * 140} y={240 - 180 * level + rand(i * 3) * 180 * level} width={6} height={6} fill="#fff3c4" opacity={crystal * 0.8} transform={`rotate(45 ${30 + rand(i) * 140} ${240 - 180 * level + rand(i * 3) * 180 * level})`} />)}
				<rect x={42} y={70} width={14} height={150} rx={7} fill="#fff" opacity={0.25} />
			</g>
			<rect x={34} y={36} width={132} height={28} rx={8} fill="#8a4a0c" />
			<rect x={34} y={36} width={132} height={10} rx={5} fill="#b5671a" />
			{/* goteo por el borde */}
			<path d={`M150 64 Q156 ${64 + 30 * drip} 152 ${70 + 50 * drip}`} stroke={H} strokeWidth={10} strokeLinecap="round" fill="none" />
			<circle cx={152} cy={74 + 50 * drip} r={7 * (0.5 + drip)} fill={H} />
			<path d="M100 120 l26 15 v30 l-26 15 l-26 -15 v-30z" fill="#fff4d6" stroke="#8a4a0c" strokeWidth={3} />
			<text x={100} y={156} textAnchor="middle" fontFamily={anton} fontSize={20} fill="#8a4a0c">MIEL</text>
			{dusty && (
				<g opacity={0.7}>
					<path d="M30 70 L60 40 M30 70 L20 30 M60 40 L20 30 M45 55 L40 35" stroke="#ddd" strokeWidth={1.2} fill="none" />
					<rect x={30} y={60} width={140} height={180} fill="#b9a27a" opacity={0.18} />
				</g>
			)}
		</svg>
	);
};

const Bee: React.FC<{frame: number; size?: number}> = ({frame, size = 200}) => {
	const flap = Math.sin(frame * 1.6);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100">
			<ellipse cx={42} cy={30} rx={16} ry={22 * (0.6 + 0.4 * Math.abs(flap))} fill="#dff6ff" opacity={0.8} transform="rotate(-25 42 30)" />
			<ellipse cx={60} cy={30} rx={14} ry={20 * (0.6 + 0.4 * Math.abs(flap))} fill="#dff6ff" opacity={0.7} transform="rotate(20 60 30)" />
			<ellipse cx={50} cy={58} rx={30} ry={22} fill={H} />
			<rect x={36} y={38} width={8} height={40} fill="#1a1a1a" rx={4} />
			<rect x={52} y={37} width={8} height={42} fill="#1a1a1a" rx={4} />
			<circle cx={82} cy={54} r={13} fill="#1a1a1a" />
			<circle cx={86} cy={50} r={3} fill="#fff" />
			<path d="M18 58 L8 60 L18 63Z" fill="#1a1a1a" />
		</svg>
	);
};

const Bacteria: React.FC<{frame: number; dead: number; x: number; y: number; i: number}> = ({frame, dead, x, y, i}) => {
	const s = 1 - dead * 0.7;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${s}) rotate(${frame * 2 + i * 40}deg)`, filter: `grayscale(${dead})`, opacity: 1 - dead * 0.5}}>
			<svg width={110} height={110} viewBox="0 0 100 100">
				<ellipse cx={50} cy={50} rx={36} ry={22} fill="#59e35b" stroke="#1d7a2a" strokeWidth={4} />
				{[0, 1, 2, 3, 4, 5].map((k) => (
					<line key={k} x1={14 + k * 14} y1={30} x2={10 + k * 15} y2={14 + Math.sin(frame / 3 + k) * 4} stroke="#1d7a2a" strokeWidth={3} />
				))}
				<circle cx={40} cy={48} r={5} fill="#000" />
				<circle cx={58} cy={48} r={5} fill="#000" />
				{dead > 0.5 && <path d="M34 42 l10 10 m0 -10 l-10 10 M52 42 l10 10 m0 -10 l-10 10" stroke="#000" strokeWidth={3} />}
			</svg>
		</div>
	);
};

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 96}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

export const miel: VideoDef = {
	id: 'miel',
	timing,
	music: 'music/miel.mp3',
	theme: {bg1: '#1c0d02', bg2: '#2a1503', accent: H2, accent2: '#ff8a1e', text: '#fff'},
	label: 'CURIOSIDADES',
	Background: Bg,
	keywords: ['miel', 'comer', 'egipto', 'arqueologos', 'comestible', 'georgia', 'antigua', 'secreto', 'agua', 'bacteria', 'muere', 'acida', 'naranja', 'enzima', 'oxigenada', 'heridas', 'abeja', 'cristaliza', 'mala', 'bano', 'maria', 'humedad', 'fermentar'],
	replacements: [
		{match: ['tres', 'mil', 'años…'], show: '3.000 años'},
		{match: ['tres', 'mil', 'años.'], show: '3.000 años'},
		{match: ['cinco', 'mil', 'quinientos', 'años.'], show: '5.500 años'},
		{match: ['una', 'décima', 'parte'], show: '1/10'},
	],
	scenes: [
		// 0 HOOK: tarro antiguo, cuenta de años hacia atrás
		{
			camera: 'push',
			booms: ['comer'],
			render: ({frame, at}) => {
				const yr = Math.round(interpolate(frame, [0, 70], [2026, -1000], {extrapolateRight: 'clamp'}));
				return (
					<Stage>
						<Glow x={540} y={470} r={420} color={H} o={0.45} />
						<At x={540} y={60}>
							<div style={{fontFamily: anton, fontSize: 96, color: '#fff', textAlign: 'center', lineHeight: 1, textShadow: '0 8px 0 #000'}}>
								AÑO <span style={{color: H2}}>{yr < 0 ? `${-yr} a. C.` : yr}</span>
							</div>
						</At>
						<At x={540} y={420}>
							<Jar frame={frame} size={360} dusty />
						</At>
						<At x={540} y={790}>
							<Stat value="3.000 AÑOS" label="y aún comestible" color={H} frame={frame} at={at('tres')} size={140} />
						</At>
					</Stage>
				);
			},
		},
		// 1 Egipto: tumbas
		{
			camera: 'panR',
			pops: ['tres'],
			booms: ['comestible'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={70}>
						<Title t="ANTIGUO EGIPTO" frame={frame} color={H2} />
					</At>
					<At x={540} y={430}>
						<svg width={900} height={420} viewBox="0 0 900 420">
							<path d="M150 400 L330 120 L510 400Z" fill="#d9a441" />
							<path d="M330 120 L510 400 L420 400Z" fill="#a8771f" />
							<path d="M480 400 L620 190 L760 400Z" fill="#c99236" />
							<path d="M620 190 L760 400 L690 400Z" fill="#8f6418" />
							<rect x={0} y={398} width={900} height={22} fill="#7a5414" />
							<circle cx={780} cy={80} r={50} fill="#ffdc6b" opacity={0.9} />
						</svg>
					</At>
					<At x={250} y={590}>
						<Jar frame={frame} size={190} dusty level={0.6} />
					</At>
					<At x={640} y={800}>
						<Stat value="+3.000 AÑOS" color={H} frame={frame} at={at('tres')} size={120} />
					</At>
					<At x={560} y={540}>
						<Stamp text="COMESTIBLE ✓" color="#4dff88" frame={frame} at={at('comestible')} size={80} rot={-8} />
					</At>
				</Stage>
			),
		},
		// 2 Georgia: la más antigua
		{
			camera: 'pull',
			pops: ['cinco'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={360}>
						<div style={{width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #9fe3ff, #2a7fd4 55%, #0a2a5e)', boxShadow: `0 0 80px ${H}55`, transform: `rotate(${frame / 3}deg)`, overflow: 'hidden', position: 'relative'}}>
							<div style={{position: 'absolute', left: 150, top: 120, width: 260, height: 180, borderRadius: '45% 55% 50% 40%', background: '#4caf50'}} />
							<div style={{position: 'absolute', left: 60, top: 300, width: 160, height: 120, borderRadius: '50%', background: '#43a047'}} />
						</div>
					</At>
					<At x={600} y={260}>
						<div style={{fontSize: 110, transform: `translateY(${-Math.abs(Math.sin(frame / 6)) * 20}px)`}}>📍</div>
					</At>
					<At x={540} y={110}>
						<Chip text="Georgia" color={H2} frame={frame} at={at('georgia')} size={56} />
					</At>
					<At x={540} y={740}>
						<Stat value="5.500 AÑOS" label="la más antigua del mundo" color={H} frame={frame} at={at('cinco')} size={130} />
					</At>
				</Stage>
			),
		},
		// 3 Bacterias que se secan
		{
			camera: 'push',
			pops: ['agua'],
			booms: ['muere'],
			render: ({frame, at, dur}) => {
				const dead = ease(frame, at('seca'), at('seca') + 25);
				const approach = ease(frame, 0, dur * 0.5);
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="¿EL SECRETO?" frame={frame} color={H2} />
						</At>
						<div style={{position: 'absolute', left: 0, right: 0, top: 360, height: 560, background: `linear-gradient(180deg, ${H2}, #c46a00)`, borderRadius: '50% 50% 0 0 / 14% 14% 0 0'}} />
						{[0, 1, 2, 3].map((i) => (
							<Bacteria key={i} i={i} frame={frame} dead={dead} x={80 + i * 240} y={140 + (1 - approach) * -120 + approach * 200 + (i % 2) * 40} />
						))}
						<At x={540} y={700}>
							<Stat value="≈17 % AGUA" label="demasiado seca para vivir" color="#7a3a00" frame={frame} at={at('agua')} size={120} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 4 Ácida + agua oxigenada
		{
			camera: 'tilt',
			pops: ['acida', 'naranja', 'oxigenada'],
			render: ({frame, at}) => {
				const needle = interpolate(ease(frame, at('acida'), at('acida') + 20), [0, 1], [7, 3.9]);
				return (
					<Stage>
						<At x={540} y={330}>
							<svg width={820} height={420} viewBox="0 0 820 420">
								{new Array(14).fill(0).map((_, i) => (
									<path key={i} d={`M410 400 L${410 + 380 * Math.cos(Math.PI - (i / 14) * Math.PI)} ${400 - 380 * Math.sin(Math.PI - (i / 14) * Math.PI)} A380 380 0 0 1 ${410 + 380 * Math.cos(Math.PI - ((i + 1) / 14) * Math.PI)} ${400 - 380 * Math.sin(Math.PI - ((i + 1) / 14) * Math.PI)}Z`} fill={`hsl(${i * 20}, 85%, 52%)`} />
								))}
								<line x1={410} y1={400} x2={410 + 330 * Math.cos(Math.PI - (needle / 14) * Math.PI)} y2={400 - 330 * Math.sin(Math.PI - (needle / 14) * Math.PI)} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
								<circle cx={410} cy={400} r={120} fill={DARK} />
								<text x={410} y={385} textAnchor="middle" fontFamily={anton} fontSize={60} fill="#fff">pH {needle.toFixed(1)}</text>
							</svg>
						</At>
						<At x={540} y={80}>
							<Title t="ÁCIDA" frame={frame} color="#ff8a1e" size={120} />
						</At>
						<At x={300} y={690}>
							<Chip text="🍊 como el zumo" color="#ff8a1e" frame={frame} at={at('naranja')} size={44} />
						</At>
						<At x={540} y={830}>
							<Stat value="H₂O₂" label="agua oxigenada natural" color="#7fe3ff" frame={frame} at={at('oxigenada')} size={130} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 5 Medicina egipcia
		{
			camera: 'panL',
			pops: ['heridas'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={380}>
						<div style={{width: 640, height: 460, background: 'linear-gradient(180deg,#f3dfa8,#d9bd7a)', borderRadius: 20, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', transform: `rotate(${Math.sin(frame / 20) * 2}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
							<div style={{fontSize: 130}}>🏺</div>
							{[0, 1, 2].map((i) => (
								<div key={i} style={{width: 460 - i * 60, height: 12, borderRadius: 6, background: '#8a5a1c', opacity: 0.6}} />
							))}
						</div>
					</At>
					<At x={820} y={600}>
						<div style={{fontSize: 160, transform: `scale(${pop(frame, at('heridas'))}) rotate(-15deg)`}}>{frame >= at('heridas') ? '🩹' : ''}</div>
					</At>
					<At x={540} y={830}>
						<Chip text="Antiséptico natural" color={H2} frame={frame} at={at('heridas')} size={56} />
					</At>
				</Stage>
			),
		},
		// 6 Ojo al dato: la abeja
		{
			camera: 'push',
			pops: ['decima', 'una'],
			render: ({frame, at, dur}) => (
				<Stage>
					<At x={540 + Math.sin(frame / 12) * 300} y={260 + Math.sin(frame / 7) * 80}>
						<div style={{transform: `scaleX(${Math.cos(frame / 12) > 0 ? 1 : -1})`}}>
							<Bee frame={frame} size={230} />
						</div>
					</At>
					{new Array(10).fill(0).map((_, i) => {
						const t = (frame - i * 3) / 12;
						return <div key={i} style={{position: 'absolute', left: 540 + Math.sin(t) * 300, top: 360 + Math.sin(((frame - i * 3) / 7)) * 80, width: 10, height: 10, borderRadius: '50%', background: '#fff', opacity: 0.35 - i * 0.03}} />;
					})}
					<At x={540} y={580}>
						<svg width={420} height={160} viewBox="0 0 420 160">
							<ellipse cx={120} cy={80} rx={100} ry={55} fill="#cfd8dc" stroke="#90a4ae" strokeWidth={6} />
							<rect x={210} y={70} width={200} height={22} rx={11} fill="#cfd8dc" stroke="#90a4ae" strokeWidth={6} />
							<ellipse cx={120} cy={80} rx={10 * ease(frame, at('decima'), at('decima') + 20)} ry={7 * ease(frame, at('decima'), at('decima') + 20)} fill={H} />
						</svg>
					</At>
					<At x={540} y={830}>
						<Stat value="< 1/10" label="de cucharadita en toda su vida" color={H} frame={frame} at={at('decima')} size={140} count={false} />
					</At>
					<At x={540} y={60}>
						<Chip text="👁 OJO AL DATO" color={H2} frame={frame} at={0} size={52} />
					</At>
				</Stage>
			),
		},
		// 7 Consejos accionables
		{
			camera: 'panR',
			pops: ['cristaliza', 'calientala', 'cierrala'],
			render: ({frame, at}) => {
				const items: [string, string, string][] = [
					['💎', '¿Cristalizada? No está mala', 'cristaliza'],
					['♨️', 'Baño maría (máx. 40 °C)', 'calientala'],
					['🔒', 'Ciérrala bien: la humedad la fermenta', 'cierrala'],
				];
				const cr = ease(frame, at('cristaliza'), at('cristaliza') + 20) * (1 - ease(frame, at('calientala') + 10, at('calientala') + 40));
				return (
					<Stage>
						<At x={540} y={50}>
							<Title t="CONSEJO" frame={frame} color={H2} />
						</At>
						<At x={540} y={290}>
							<Jar frame={frame} size={210} crystal={cr} />
						</At>
						{items.map(([e, t, k], i) => {
							const t0 = at(k);
							if (frame < t0) return null;
							const p = ease(frame, t0, t0 + 12);
							return (
								<div key={i} style={{position: 'absolute', left: 60, top: 500 + i * 140, width: 920, display: 'flex', alignItems: 'center', gap: 22, transform: `translateX(${(1 - p) * -600}px)`, opacity: p, background: 'rgba(0,0,0,0.55)', border: `4px solid ${H}`, borderRadius: 24, padding: '14px 24px'}}>
									<div style={{fontSize: 64}}>{e}</div>
									<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 38, color: '#fff', textTransform: 'uppercase'}}>{t}</div>
								</div>
							);
						})}
					</Stage>
				);
			},
		},
		// 8 CTA + bucle (vuelve al tarro del inicio)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={230}>
						<Jar frame={frame} size={260} />
					</At>
					<At x={540} y={660}>
						<FollowCTA frame={frame} at={at('sigueme')} color={H} question="¿Cuánto lleva la miel de tu casa?" />
					</At>
				</Stage>
			),
		},
	],
};
