import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/votoobligatorio.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop, rand} from '../engine/util';

const C = '#39e0ff'; // cian institucional
const Y = '#ffd400';
const R = '#ff3b4f';
const G = '#4dff88';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(frame / 70) * 15}% 30%, #10306b 0%, #070b1f 65%)`}} />
		<AbsoluteFill style={{opacity: 0.08, backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '46px 46px', backgroundPosition: `0 ${frame * 0.5}px`}} />
		<Particles frame={frame} color={C} n={26} size={8} blur={3} />
	</AbsoluteFill>
);

// urna con papeleta que cae
const Urna: React.FC<{frame: number; size?: number; drop?: boolean}> = ({frame, size = 420, drop = true}) => {
	const t = (frame % 50) / 50;
	const y = drop ? interpolate(t, [0, 0.6, 1], [-40, 60, 60]) : 60;
	const o = drop ? interpolate(t, [0, 0.55, 0.62], [1, 1, 0]) : 0;
	return (
		<svg width={size} height={size * 1.1} viewBox="0 0 200 220">
			<g opacity={o} transform={`translate(0 ${y})`}>
				<rect x={76} y={10} width={48} height={62} rx={4} fill="#fff" stroke="#c9d3e6" strokeWidth={2} />
				<path d="M86 30 h28 M86 40 h28 M86 50 h18" stroke="#8aa0c8" strokeWidth={3} />
			</g>
			<rect x={30} y={90} width={140} height={120} rx={10} fill="rgba(210,235,255,0.28)" stroke="#e6f3ff" strokeWidth={5} />
			<rect x={22} y={78} width={156} height={22} rx={6} fill="#e6f3ff" />
			<rect x={76} y={84} width={48} height={8} rx={4} fill="#0b1a3a" />
			<rect x={56} y={130} width={88} height={40} rx={6} fill="#0b1a3a" opacity={0.65} />
			<text x={100} y={158} textAnchor="middle" fontFamily={anton} fontSize={22} fill="#e6f3ff">URNA</text>
		</svg>
	);
};

const Flag: React.FC<{e: string; frame: number; at?: number; size?: number}> = ({e, frame, at = 0, size = 220}) => (
	<div style={{fontSize: size, lineHeight: 1, transform: `scale(${pop(frame, at)}) rotate(${Math.sin(frame / 10) * 4}deg)`, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'}}>{e}</div>
);

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 100}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

// globo con puntos (países con voto obligatorio)
const Globe: React.FC<{frame: number; dots: number}> = ({frame, dots}) => (
	<div style={{position: 'relative', width: 560, height: 560, borderRadius: '50%', overflow: 'hidden', background: 'radial-gradient(circle at 35% 30%, #5fb7ff, #1d5fb5 55%, #0a2458)', boxShadow: `0 0 90px ${C}55`}}>
		{[0, 1, 2, 3, 4].map((i) => (
			<div key={i} style={{position: 'absolute', left: ((i * 190 + frame * 1.5) % 900) - 220, top: 80 + (i % 3) * 140, width: 220, height: 150, borderRadius: '45% 55% 50% 40%', background: '#3fae5a', opacity: 0.9}} />
		))}
		{new Array(dots).fill(0).map((_, i) => (
			<div key={i} style={{position: 'absolute', left: 60 + rand(i * 3) * 440, top: 60 + rand(i * 7) * 440, width: 22, height: 22, borderRadius: '50%', background: R, boxShadow: `0 0 18px ${R}`, transform: `scale(${0.8 + 0.3 * Math.sin(frame / 5 + i)})`}} />
		))}
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 30% 28%, transparent 50%, rgba(0,0,0,0.55) 100%)'}} />
	</div>
);

export const votoobligatorio: VideoDef = {
	id: 'votoobligatorio',
	timing,
	endAt: 50.23, // 1 s de pantalla final tras "Y sígueme"
	music: 'music/votoobligatorio.mp3',
	theme: {bg1: '#070b1f', bg2: '#0b1430', accent: Y, accent2: C, text: '#fff'},
	label: 'ELECCIONES',
	Background: Bg,
	keywords: ['paises', 'votar', 'obligatorio', 'castigan', 'mundo', 'belgica', 'primeros', 'australia', 'excusa', 'multa', 'brasil', 'pasaporte', 'singapur', 'borran', 'censo', 'espana', 'mesa', 'delito'],
	replacements: [
		{match: ['veinte', 'países'], show: '20 países'},
		{match: ['mil', 'ochocientos', 'noventa', 'y', 'tres.'], show: '1893'},
		{match: ['veinte', 'dólares.'], show: '20 $'},
		{match: ['noventa', 'por', 'ciento.'], show: '90 %'},
		{match: ['un', 'euro…'], show: '1 €…'},
		{match: ['tres', 'veces'], show: '3 veces'},
	],
	scenes: [
		// 0 HOOK: urna + OBLIGATORIO + castigo
		{
			camera: 'push',
			pops: ['obligatorio'],
			booms: ['castigan'],
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={430} r={420} color={C} o={0.35} />
					<At x={540} y={40}>
						<Title t="¿VOTAR, OBLIGATORIO?" frame={frame} color={Y} size={92} />
					</At>
					<At x={540} y={450}>
						<Urna frame={frame} size={420} />
					</At>
					<At x={540} y={430}>
						<Stamp text="OBLIGATORIO" color={Y} frame={frame} at={at('obligatorio')} size={96} rot={-10} />
					</At>
					<At x={540} y={830}>
						<Chip text="⚠️ Y si no vas… castigo" color={R} frame={frame} at={at('castigan')} size={54} />
					</At>
				</Stage>
			),
		},
		// 1 Unos 20 países
		{
			camera: 'pull',
			pops: ['veinte'],
			render: ({frame, at}) => {
				const n = Math.round(interpolate(frame, [at('veinte'), at('veinte') + 20], [0, 20], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
				return (
					<Stage>
						<At x={540} y={380}>
							<Globe frame={frame} dots={n} />
						</At>
						<At x={540} y={810}>
							<Stat value="≈20 PAÍSES" label="con voto obligatorio" color={R} frame={frame} at={at('veinte')} size={140} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 2 Bélgica 1893
		{
			camera: 'panR',
			pops: ['mil'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Title t="BÉLGICA" frame={frame} />
					</At>
					<At x={540} y={380}>
						<Flag e="🇧🇪" frame={frame} size={300} />
					</At>
					<At x={540} y={780}>
						<Stat value="DESDE 1893" label="de los primeros del mundo" color={Y} frame={frame} at={at('mil')} size={140} />
					</At>
				</Stage>
			),
		},
		// 3 Australia: multa + 90 %
		{
			camera: 'tilt',
			pops: ['veinte', 'noventa'],
			render: ({frame, at}) => {
				const fill = ease(frame, at('noventa'), at('noventa') + 25) * 0.9;
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="AUSTRALIA" frame={frame} />
						</At>
						<At x={250} y={330}>
							<Flag e="🇦🇺" frame={frame} size={220} />
						</At>
						<At x={760} y={330}>
							<div style={{fontSize: 200, transform: `translateY(${frame > at('llega') ? 0 : -400}px) rotate(${Math.sin(frame / 8) * 6}deg)`, transition: 'none'}}>✉️</div>
						</At>
						<At x={760} y={480}>
							<Stat value="20 $" label="multa" color={R} frame={frame} at={at('veinte')} size={110} count={false} />
						</At>
						{frame >= at('noventa') && (
							<div style={{position: 'absolute', left: 90, top: 700, width: 900}}>
								<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 40, color: '#fff', marginBottom: 12}}>PARTICIPACIÓN</div>
								<div style={{width: 900, height: 70, borderRadius: 35, background: 'rgba(255,255,255,0.15)', overflow: 'hidden'}}>
									<div style={{width: 900 * fill, height: 70, borderRadius: 35, background: `linear-gradient(90deg, ${G}, ${C})`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 24, boxSizing: 'border-box', fontFamily: anton, fontSize: 48, color: '#000'}}>
										+{Math.round(fill * 100)} %
									</div>
								</div>
							</div>
						)}
					</Stage>
				);
			},
		},
		// 4 Brasil: multa mínima, pero pasaporte bloqueado
		{
			camera: 'shake',
			pops: ['euro', 'tres'],
			booms: ['pasaporte'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Title t="BRASIL" frame={frame} color={G} />
					</At>
					<At x={250} y={290}>
						<Flag e="🇧🇷" frame={frame} size={200} />
					</At>
					<At x={740} y={290}>
						<Chip text="Multa < 1 €" color={Y} frame={frame} at={at('euro')} size={52} />
					</At>
					<div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40}}>
						{[0, 1, 2].map((i) => (
							<div key={i} style={{fontSize: 110, transform: `scale(${frame >= at('tres') + i * 5 ? pop(frame, at('tres') + i * 5) : 0})`}}>❌</div>
						))}
					</div>
					<At x={540} y={760}>
						<div style={{fontSize: 170, transform: `scale(${pop(frame, at('pasaporte'))})`, opacity: frame >= at('pasaporte') ? 1 : 0}}>🛂</div>
					</At>
					<At x={540} y={760}>
						<Stamp text="PASAPORTE BLOQUEADO" color={R} frame={frame} at={at('pasaporte') + 6} size={70} rot={-8} />
					</At>
				</Stage>
			),
		},
		// 5 Singapur: te borran del censo
		{
			camera: 'push',
			pops: ['borran'],
			render: ({frame, at}) => {
				const names = ['TAN WEI MING', 'LIM HUI LING', 'TÚ', 'ONG KAI JUN', 'NG MEI XIN'];
				const strike = ease(frame, at('borran'), at('borran') + 14);
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="SINGAPUR" frame={frame} />
						</At>
						<At x={190} y={260}>
							<Flag e="🇸🇬" frame={frame} size={170} />
						</At>
						<div style={{position: 'absolute', left: 340, top: 170, width: 620, background: '#f4f6fb', borderRadius: 16, padding: '26px 30px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', transform: `rotate(${Math.sin(frame / 20) * 1.5}deg)`}}>
							<div style={{fontFamily: anton, fontSize: 44, color: '#0b1a3a', marginBottom: 12}}>CENSO ELECTORAL</div>
							{names.map((n, i) => (
								<div key={i} style={{position: 'relative', fontFamily: montserrat, fontWeight: 900, fontSize: 38, color: n === 'TÚ' ? R : '#2b3a5c', padding: '10px 0', borderBottom: '2px solid #dde3ef', opacity: n === 'TÚ' ? 1 - strike * 0.5 : 1}}>
									{n}
									{n === 'TÚ' && <div style={{position: 'absolute', left: -10, top: '50%', height: 8, width: `${strike * 105}%`, background: R, borderRadius: 4}} />}
								</div>
							))}
						</div>
						<At x={540} y={830}>
							<Stamp text="BORRADO DEL CENSO" color={R} frame={frame} at={at('censo')} size={76} rot={-6} />
						</At>
					</Stage>
				);
			},
		},
		// 6 España: votar no; mesa electoral sí
		{
			camera: 'panL',
			pops: ['obligatorio', 'mesa'],
			booms: ['delito'],
			render: ({frame, at}) => {
				const rows: [string, string, string, string][] = [
					['🗳️', 'VOTAR', 'NO OBLIGATORIO', 'obligatorio'],
					['🪑', 'MESA ELECTORAL', 'OBLIGATORIA', 'mesa'],
				];
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="¿Y EN ESPAÑA?" frame={frame} color={Y} />
						</At>
						<At x={540} y={250}>
							<Flag e="🇪🇸" frame={frame} size={170} />
						</At>
						{rows.map(([e, t, v, k], i) => {
							const t0 = at(k);
							if (frame < t0) return null;
							const p = ease(frame, t0, t0 + 12);
							const ok = i === 0;
							return (
								<div key={i} style={{position: 'absolute', left: 60, top: 400 + i * 190, width: 920, display: 'flex', alignItems: 'center', gap: 24, transform: `translateX(${(1 - p) * -600}px)`, opacity: p, background: 'rgba(0,0,0,0.55)', border: `5px solid ${ok ? G : R}`, borderRadius: 26, padding: '20px 28px'}}>
									<div style={{fontSize: 80}}>{e}</div>
									<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 40, color: '#fff'}}>{t}</div>
									<div style={{marginLeft: 'auto', fontFamily: anton, fontSize: 46, color: ok ? G : R}}>{v}</div>
								</div>
							);
						})}
						<At x={540} y={830}>
							<Chip text="⚖️ No ir puede ser delito" color={R} frame={frame} at={at('delito')} size={48} />
						</At>
					</Stage>
				);
			},
		},
		// 7 CTA (sin bucle; termina en "Y sígueme")
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={190}>
						<Urna frame={frame} size={280} />
					</At>
					<At x={540} y={660}>
						<FollowCTA frame={frame} at={at('sigueme')} color={Y} question="¿Debería ser obligatorio en España?" />
					</At>
				</Stage>
			),
		},
	],
};
