import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/carteles.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop} from '../engine/util';

const Y = '#ffd400';
const R = '#ff3348';
const B = '#3fa9ff';

// partidos reales (solo nombre y color, sin logotipos); se trata a todos por igual
const PARTIES = [
	{name: 'PSOE', c1: '#e30613', c2: '#ffd1d4'},
	{name: 'PP', c1: '#1d5bbf', c2: '#cfe2ff'},
	{name: 'VOX', c1: '#5cb82a', c2: '#e3f7d3'},
	{name: 'PODEMOS', c1: '#6b2a7e', c2: '#ecd3f5'},
] as const;


const Poster: React.FC<{p: number; w?: number; tear?: number; frame?: number}> = ({p, w = 300, tear = 0, frame = 0}) => {
	const P = PARTIES[p % PARTIES.length];
	const h = w * 1.4;
	const inner = (
		<div style={{width: w, height: h, background: `linear-gradient(160deg, ${P.c1}, ${P.c1}cc 60%, #111 140%)`, borderRadius: 8, border: '6px solid #fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: w * 0.06}}>
			<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: w * 0.1, color: P.c2, letterSpacing: 2}}>VOTA</div>
			<div style={{fontFamily: anton, fontSize: w * (P.name.length > 5 ? 0.2 : 0.3), color: '#fff', lineHeight: 1, textAlign: 'center'}}>{P.name}</div>
			<div style={{width: w * 0.5, height: w * 0.025, background: P.c2, borderRadius: 4}} />
		</div>
	);
	if (tear <= 0) return inner;
	// rasgado: la mitad inferior se despega y cae
	return (
		<div style={{position: 'relative', width: w, height: h}}>
			<div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 0,100% 0,100% 48%,80% 52%,60% 46%,40% 55%,20% 47%,0 53%)'}}>{inner}</div>
			<div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 53%,20% 47%,40% 55%,60% 46%,80% 52%,100% 48%,100% 100%,0 100%)', transform: `translate(${tear * 60}px, ${tear * tear * 320}px) rotate(${tear * 35}deg)`, transformOrigin: '100% 50%', opacity: 1 - tear * tear}}>{inner}</div>
		</div>
	);
};

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #0b1230 0%, #151a3a 55%, #0a0a12 100%)'}} />
		{/* pared de ladrillo */}
		<AbsoluteFill style={{opacity: 0.12, backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '120px 60px', backgroundPosition: `${frame * 0.4}px 0`}} />
		{/* farola */}
		<div style={{position: 'absolute', left: 900, top: 0, width: 400, height: 1400, background: `radial-gradient(ellipse at 30% 10%, rgba(255,214,120,${0.25 + 0.05 * Math.sin(frame / 9)}), transparent 60%)`}} />
		<Particles frame={frame} color={B} n={24} size={8} blur={3} />
	</AbsoluteFill>
);

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 96}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

export const carteles: VideoDef = {
	id: 'carteles',
	timing,
	music: 'music/carteles.mp3',
	theme: {bg1: '#0b1230', bg2: '#0a0a12', accent: Y, accent2: B, text: '#fff'},
	label: 'ELECCIONES',
	Background: Bg,
	keywords: ['arrancas', 'carteles', 'electorales', 'euros', 'ayuntamiento', 'ley', 'gratis', 'igualdad', 'partidos', 'junta', 'electoral', 'multarte', 'rompes', 'delito', 'danos', 'ingresos', 'voz', 'campana', 'toques', 'foto', 'avisa', 'arrancado'],
	replacements: [
		{match: ['mil', 'euros.'], show: '1.000 €'},
		{match: ['cien', 'y', 'mil', 'euros.'], show: '100 y 1.000 €'},
		{match: ['uno', 'a', 'tres', 'meses'], show: '1 a 3 meses'},
	],
	scenes: [
		// 0 HOOK: un cartel se arranca en directo
		{
			camera: 'push',
			booms: ['mil'],
			render: ({frame, at}) => {
				const t0 = at('broma');
				const tear = ease(frame, t0, t0 + 22);
				const handY = interpolate(frame, [0, t0, t0 + 22], [560, 470, 640], {extrapolateRight: 'clamp'});
				return (
					<Stage>
						<At x={540} y={420}>
							<Poster p={0} w={420} tear={tear} frame={frame} />
						</At>
						<At x={interpolate(frame, [at('broma') + 10, at('broma') + 30], [740, 1000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} y={handY}>
							<div style={{fontSize: 170, transform: `rotate(${-20 + tear * 40}deg)`}}>✋</div>
						</At>
						{frame >= 8 && (
							<At x={540} y={20}>
								<div style={{fontFamily: anton, fontSize: 76, color: R, letterSpacing: 3, WebkitTextStroke: '6px #000', paintOrder: 'stroke fill', transform: `scale(${pop(frame, 8)}) rotate(-4deg) translateX(${Math.sin(frame * 1.3) * 3}px)`, opacity: 0.75 + 0.25 * Math.abs(Math.sin(frame / 6)), textShadow: `0 0 24px ${R}aa`}}>¿CÁRCEL?</div>
							</At>
						)}
						<At x={540} y={800}>
							<Stat value="1.000 €" label="lo que te puede costar" color={R} frame={frame} at={at('mil')} size={150} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 1 Ayuntamiento: espacios gratis por ley
		{
			camera: 'panR',
			pops: ['gratis'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={250}>
						<svg width={620} height={380} viewBox="0 0 310 190">
							<path d="M20 60 L155 10 L290 60Z" fill="#d6dbe4" />
							<rect x={30} y={60} width={250} height={12} fill="#b9c0cc" />
							{[0, 1, 2, 3, 4, 5].map((i) => (
								<rect key={i} x={42 + i * 42} y={72} width={18} height={95} fill="#eef1f6" />
							))}
							<rect x={20} y={167} width={270} height={18} fill="#b9c0cc" />
							<rect x={135} y={22} width={40} height={30} fill="#c8102e" />
							<rect x={135} y={22} width={40} height={10} fill="#ffc400" />
						</svg>
					</At>
					<At x={540} y={540}>
						<Chip text="🏛️ Ayuntamiento" color="#fff" frame={frame} at={at('ayuntamiento')} size={50} dark />
					</At>
					<At x={540} y={700}>
						<div style={{width: 760, height: 160, border: `8px dashed ${Y}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: anton, fontSize: 64, color: Y, transform: `scale(${pop(frame, at('espacios'))})`, opacity: frame >= at('espacios') ? 1 : 0}}>ESPACIO RESERVADO</div>
					</At>
					<At x={800} y={620}>
						<Stamp text="GRATIS" color="#4dff88" frame={frame} at={at('gratis')} size={84} rot={10} />
					</At>
				</Stage>
			),
		},
		// 2 Igualdad entre partidos
		{
			camera: 'pull',
			pops: ['igualdad'],
			render: ({frame, at}) => (
				<Stage>
					<div style={{position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24}}>
						{[0, 1, 2, 3].map((i) => (
							<div key={i} style={{transform: `scale(${pop(frame, i * 6)}) translateY(${Math.sin(frame / 10 + i) * 8}px)`}}>
								<Poster p={i} w={215} />
							</div>
						))}
					</div>
					<At x={540} y={620}>
						<div style={{fontSize: 170, transform: `rotate(${Math.sin(frame / 12) * 4}deg)`}}>⚖️</div>
					</At>
					<At x={540} y={830}>
						<Stat value="IGUALDAD" label="mismo espacio para todos" color={B} frame={frame} at={at('igualdad')} size={130} count={false} />
					</At>
				</Stage>
			),
		},
		// 3 Junta Electoral: multa 100–1.000 €
		{
			camera: 'shake',
			pops: ['cien'],
			booms: ['multarte'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={110}>
						<Title t="JUNTA ELECTORAL" frame={frame} color={Y} />
					</At>
					<At x={540} y={400}>
						<div style={{fontSize: 260, transform: `rotate(${frame > at('multarte') ? interpolate(frame - at('multarte'), [0, 6, 12], [-40, 10, 0], {extrapolateRight: 'clamp'}) : -40}deg)`, transformOrigin: '80% 80%'}}>🔨</div>
					</At>
					<At x={540} y={420}>
						<Stamp text="MULTA" color={R} frame={frame} at={at('multarte')} size={110} rot={-10} />
					</At>
					<At x={540} y={790}>
						<Stat value="100 – 1.000 €" label="para particulares" color={R} frame={frame} at={at('cien')} size={130} count={false} />
					</At>
				</Stage>
			),
		},
		// 4 Delito leve de daños
		{
			camera: 'tilt',
			pops: ['delito', 'uno'],
			render: ({frame, at}) => {
				const tear = ease(frame, at('rompes'), at('rompes') + 20);
				return (
					<Stage>
						<At x={250} y={330}>
							<Poster p={1} w={280} tear={tear} frame={frame} />
						</At>
						<At x={700} y={280}>
							<Chip text="⚖️ Código Penal" color="#fff" frame={frame} at={at('delito')} size={42} dark />
						</At>
						<At x={700} y={400}>
							<Chip text="Delito leve de daños" color={R} frame={frame} at={at('delito')} size={42} />
						</At>
						<At x={540} y={760}>
							<Stat value="1 – 3 MESES" label="de multa" color={Y} frame={frame} at={at('uno')} size={140} count={false} />
						</At>
						<At x={540} y={900}>
							<Chip text="💶 según tus ingresos" color={Y} frame={frame} at={at('ingresos')} size={42} dark />
						</At>
					</Stage>
				);
			},
		},
		// 5 ¿Por qué? Quitarle la voz a alguien
		{
			camera: 'push',
			pops: ['derecho'],
			booms: ['voz'],
			render: ({frame, at}) => {
				const muted = frame > at('voz');
				return (
					<Stage>
						<At x={540} y={90}>
							<Title t="¿POR QUÉ TAN SERIO?" frame={frame} color={Y} size={88} />
						</At>
						<At x={540} y={430}>
							<div style={{fontSize: 300, filter: muted ? 'grayscale(1) brightness(0.6)' : `drop-shadow(0 0 40px ${B})`}}>📢</div>
						</At>
						{!muted &&
							[0, 1, 2].map((i) => {
								const r = ((frame * 4 + i * 60) % 180) + 60;
								return <div key={i} style={{position: 'absolute', left: 700, top: 430 - r / 2, width: r, height: r, borderRadius: '50%', border: `6px solid ${B}`, opacity: 1 - (r - 60) / 180, clipPath: 'polygon(50% 0,100% 0,100% 100%,50% 100%)'}} />;
							})}
						{muted && (
							<At x={540} y={430}>
								<div style={{width: 360, height: 360, borderRadius: '50%', border: `22px solid ${R}`, transform: `scale(${pop(frame, at('voz'))})`, position: 'relative'}}>
									<div style={{position: 'absolute', left: '50%', top: -10, width: 22, height: 380, background: R, transform: 'translateX(-50%) rotate(45deg)'}} />
								</div>
							</At>
						)}
						<At x={540} y={800}>
							<Chip text="Todos tienen derecho a darse a conocer" color={B} frame={frame} at={at('derecho')} size={40} />
						</At>
					</Stage>
				);
			},
		},
		// 6 Consejo accionable
		{
			camera: 'panL',
			pops: ['toques', 'foto', 'avisa'],
			render: ({frame, at}) => {
				const items: [string, string, string][] = [
					['🚫', 'No lo toques', 'toques'],
					['📸', 'Hazle una foto', 'foto'],
					['🏛️', 'Avisa al ayuntamiento o a la Junta Electoral', 'avisa'],
				];
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="¿CARTEL MAL COLOCADO?" frame={frame} color={Y} size={84} />
						</At>
						{items.map(([e, t, k], i) => {
							const t0 = at(k);
							if (frame < t0) return null;
							const p = ease(frame, t0, t0 + 12);
							return (
								<div key={i} style={{position: 'absolute', left: 60, top: 220 + i * 200, width: 920, display: 'flex', alignItems: 'center', gap: 26, transform: `translateX(${(1 - p) * -600}px)`, opacity: p, background: 'rgba(0,0,0,0.55)', border: `4px solid ${Y}`, borderRadius: 26, padding: '22px 28px'}}>
									<div style={{fontSize: 84}}>{e}</div>
									<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 42, color: '#fff', textTransform: 'uppercase'}}>{t}</div>
									<div style={{marginLeft: 'auto', fontSize: 60, color: '#4dff88'}}>✔</div>
								</div>
							);
						})}
					</Stage>
				);
			},
		},
		// 7 CTA + bucle (vuelve a la pared de carteles)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={250} r={380} color={Y} o={0.25} />
					<div style={{position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20}}>
						{[0, 1, 2, 3].map((i) => (
							<div key={i} style={{transform: `rotate(${(i - 1.5) * 4}deg) scale(${pop(frame, i * 4)})`}}>
								<Poster p={i} w={200} />
							</div>
						))}
					</div>
					<At x={540} y={690}>
						<FollowCTA frame={frame} at={at('sigueme')} color={Y} question="¿Has visto alguno arrancado en tu calle?" />
					</At>
				</Stage>
			),
		},
	],
};
