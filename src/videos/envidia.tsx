import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/envidia.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Rank, Stage, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop} from '../engine/util';

const G = '#39ff88';
const V = '#b46bff';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(frame / 60) * 20}% 30%, #2b0f4d 0%, #090514 60%)`}} />
		<Particles frame={frame} color={G} n={26} size={9} blur={3} />
		<Particles frame={frame} color={V} n={22} size={12} dir={1} blur={4} />
	</AbsoluteFill>
);

// persona estilizada
const Person: React.FC<{color: string; shirt?: string; size?: number; face?: 'smile' | 'evil' | 'none'; flip?: boolean}> = ({color, shirt, size = 300, face = 'none', flip}) => (
	<svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{transform: flip ? 'scaleX(-1)' : undefined}}>
		<circle cx={50} cy={32} r={24} fill={color} />
		<path d="M14 140 C14 85 30 66 50 66 C70 66 86 85 86 140Z" fill={shirt ?? color} />
		{face === 'smile' && (
			<>
				<circle cx={41} cy={29} r={3} fill="#000" />
				<circle cx={59} cy={29} r={3} fill="#000" />
				<path d="M38 40 Q50 50 62 40" stroke="#000" strokeWidth={3} fill="none" />
			</>
		)}
		{face === 'evil' && (
			<>
				<path d="M35 24 L46 29 M65 24 L54 29" stroke="#000" strokeWidth={3} />
				<circle cx={41} cy={31} r={3.5} fill={G} />
				<circle cx={59} cy={31} r={3.5} fill={G} />
				<path d="M38 43 Q50 38 62 43" stroke="#000" strokeWidth={3} fill="none" />
			</>
		)}
	</svg>
);

const Bubble: React.FC<{text: string; frame: number; at: number; color?: string}> = ({text, frame, at, color = '#fff'}) => {
	if (frame < at) return null;
	return (
		<div style={{transform: `scale(${pop(frame, at, 30, 10)})`, background: color, color: '#111', fontFamily: montserrat, fontWeight: 900, fontSize: 52, padding: '20px 34px', borderRadius: 40, position: 'relative', whiteSpace: 'nowrap'}}>
			{text}
			<div style={{position: 'absolute', bottom: -24, left: 70, width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: `30px solid ${color}`}} />
		</div>
	);
};

const Title: React.FC<{t: string; frame: number; color?: string}> = ({t, frame, color = '#fff'}) => (
	<div style={{fontFamily: anton, fontSize: 96, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

export const envidia: VideoDef = {
	id: 'envidia',
	timing,
	music: 'music/envidia.mp3',
	theme: {bg1: '#090514', bg2: '#12061f', accent: G, accent2: V, text: '#fff'},
	label: 'PSICOLOGÍA',
	Background: Bg,
	keywords: ['envidia', 'sonrie', 'senales', 'minimiza', 'logros', 'suerte', 'copia', 'silencio', 'mal', 'schadenfreude', 'psicologia', 'planes', 'reacciones', 'compitas', 'elegancia', 'celebra', 'uno', 'dos', 'tres'],
	scenes: [
		// 0 HOOK: sonrisa que se convierte en mirada verde
		{
			camera: 'push',
			booms: ['tres'],
			render: ({frame, at}) => {
				const turn = frame > at('sonrie') + 12;
				return (
					<Stage>
						<Glow x={540} y={450} r={400} color={turn ? G : V} o={0.4} />
						<At x={540} y={460}>
							<div style={{transform: `scale(${turn ? 1.08 : 1})`}}>
								<Person color="#f2c9a0" shirt={V} size={380} face={turn ? 'evil' : 'smile'} />
							</div>
						</At>
						<At x={560} y={110}>
							<Bubble text="¡Me alegro por ti! 😊" frame={frame} at={at('sonrie')} />
						</At>
						<At x={540} y={850}>
							<Stat value="3 SEÑALES" color={G} frame={frame} at={at('tres')} size={140} />
						</At>
					</Stage>
				);
			},
		},
		// 1 Minimiza tus logros
		{
			pops: ['minimiza'],
			render: ({frame, at}) => {
				const shrink = frame > at('bueno') ? interpolate(frame, [at('bueno'), at('bueno') + 25], [1, 0.45], {extrapolateRight: 'clamp'}) : 1;
				return (
					<Stage>
						<At x={170} y={110}>
							<Rank n="1" color={G} frame={frame} />
						</At>
						<At x={620} y={110}>
							<Title t={'MINIMIZA\nTUS LOGROS'} frame={frame} />
						</At>
						<At x={540} y={520}>
							<div style={{fontSize: 330, transform: `scale(${shrink}) rotate(${Math.sin(frame / 6) * 4}deg)`, filter: `drop-shadow(0 0 40px #ffd400)`}}>🏆</div>
						</At>
						<At x={560} y={820}>
							<Bubble text="Bueno… tuviste suerte 🙄" frame={frame} at={at('bueno')} color={G} />
						</At>
					</Stage>
				);
			},
		},
		// 2 Te copia
		{
			camera: 'panR',
			pops: ['copia'],
			render: ({frame, at}) => {
				const copied = frame > at('ropa');
				return (
					<Stage>
						<At x={170} y={110}>
							<Rank n="2" color={G} frame={frame} />
						</At>
						<At x={620} y={110}>
							<Title t={'TE COPIA\nEN SILENCIO'} frame={frame} />
						</At>
						<At x={330} y={520}>
							<Person color="#f2c9a0" shirt="#ff8a00" size={280} face="smile" />
						</At>
						<At x={750} y={520}>
							<div style={{transform: `translateX(${Math.sin(frame / 10) * 10}px)`}}>
								<Person color="#c99a72" shirt={copied ? '#ff8a00' : '#555'} size={280} face="evil" flip />
							</div>
						</At>
						{['👕', '💡', '🗺️'].map((e, i) => {
							const t0 = at(['ropa', 'ideas', 'planes'][i]);
							if (frame < t0) return null;
							const k = ease(frame, t0, t0 + 14);
							return (
								<At key={i} x={330 + 420 * k} y={300 + i * 30 - Math.sin(k * Math.PI) * 150}>
									<div style={{fontSize: 100}}>{e}</div>
								</At>
							);
						})}
						<At x={540} y={850}>
							<Chip text="Nunca lo reconoce" color={V} frame={frame} at={at('nunca')} size={50} />
						</At>
					</Stage>
				);
			},
		},
		// 3 Aparece cuando te va mal
		{
			camera: 'tilt',
			pops: ['mal'],
			render: ({frame, at}) => {
				const k = ease(frame, 0, 60);
				const pts = [0, 0.2, 0.15, 0.45, 0.55, 0.9].map((v, i) => [80 + i * 160, 260 - (i < 4 ? 180 * (1 - v) : 180 * (v - 0.3))]);
				const down = [[80, 60], [240, 130], [400, 100], [560, 230], [720, 270], [880, 390]];
				return (
					<Stage>
						<At x={170} y={110}>
							<Rank n="3" color={G} frame={frame} />
						</At>
						<At x={620} y={110}>
							<Title t={'APARECE CUANDO\nTE VA MAL'} frame={frame} />
						</At>
						<At x={540} y={500}>
							<svg width={960} height={420} viewBox="0 0 960 420">
								<polyline points={down.map((p) => p.join(',')).join(' ')} fill="none" stroke="#ff3b5c" strokeWidth={14} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - k)} />
							</svg>
						</At>
						{frame > at('mal') && (
							<At x={interpolate(frame, [at('mal'), at('mal') + 20], [1200, 820], {extrapolateRight: 'clamp'})} y={560}>
								<Person color="#c99a72" shirt="#555" size={170} face="evil" />
							</At>
						)}
						{frame > at('bien') && (
							<At x={300} y={860}>
								<Chip text="Te va bien → desaparece" color={V} frame={frame} at={at('bien')} size={40} />
							</At>
						)}
					</Stage>
				);
			},
		},
		// 4 Schadenfreude
		{
			camera: 'push',
			pops: ['schadenfreude', 'estudios'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={360}>
						<div style={{fontSize: 260, filter: `drop-shadow(0 0 40px ${V})`, transform: `scale(${1 + 0.04 * Math.sin(frame / 5)})`}}>🧠</div>
					</At>
					<At x={540} y={640}>
						<Stat value="SCHADENFREUDE" color={G} frame={frame} at={at('schadenfreude')} size={120} count={false} />
					</At>
					<At x={540} y={790}>
						<Chip text="= alegrarse del mal ajeno" color={V} frame={frame} at={at('alegrarse')} size={44} />
					</At>
					<At x={540} y={130}>
						<Chip text="📚 Envidia ↔ Schadenfreude" color="#fff" frame={frame} at={at('estudios')} size={44} dark />
					</At>
				</Stage>
			),
		},
		// 5 Qué hacer: checklist accionable
		{
			camera: 'panL',
			pops: ['cuentes', 'fijate', 'compitas', 'celebra'],
			render: ({frame, at}) => {
				const items: [string, string][] = [
					['🤐', 'No cuentes tus planes'],
					['👀', 'Mira reacciones, no palabras'],
					['🚶', 'No compitas: aléjate'],
					['🎉', 'Celebra con quien celebra'],
				];
				const keys = ['cuentes', 'fijate', 'compitas', 'celebra'];
				return (
					<Stage>
						<At x={540} y={70}>
							<Title t="QUÉ HACER" frame={frame} color={G} />
						</At>
						{items.map(([e, t], i) => {
							const t0 = at(keys[i]);
							if (frame < t0) return null;
							const k = ease(frame, t0, t0 + 12);
							return (
								<div key={i} style={{position: 'absolute', left: 70, top: 200 + i * 175, width: 900, display: 'flex', alignItems: 'center', gap: 24, transform: `translateX(${(1 - k) * -600}px)`, opacity: k, background: 'rgba(0,0,0,0.5)', border: `4px solid ${G}`, borderRadius: 26, padding: '20px 26px'}}>
									<div style={{fontSize: 80}}>{e}</div>
									<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 44, color: '#fff', textTransform: 'uppercase'}}>{t}</div>
									<div style={{marginLeft: 'auto', fontSize: 60, color: G}}>✔</div>
								</div>
							);
						})}
					</Stage>
				);
			},
		},
		// 6 CTA: escribe un 1
		{
			camera: 'pull',
			pops: ['uno'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={250}>
						<div style={{fontFamily: anton, fontSize: 380, color: G, lineHeight: 1, transform: `scale(${pop(frame, at('uno'))}) rotate(-6deg)`, textShadow: `0 0 60px ${G}`}}>{frame >= at('uno') ? '1' : ''}</div>
					</At>
					<At x={540} y={700}>
						<FollowCTA frame={frame} at={at('sigueme')} color={G} question="Escribe 1 si ya sabes quién es" />
					</At>
				</Stage>
			),
		},
	],
};
