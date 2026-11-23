import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/copa.timing.json';
import {At, Chip, FollowCTA, Glow, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop, rand} from '../engine/util';

const GOLD = '#ffcf3f';
const GR = '#3ee07a';
const R = '#ff3b4f';
const B = '#4d8dff';

// estadio de noche: césped a rayas en perspectiva + focos
const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #050a18 0%, #0b1a33 45%, #0b3d1f 70%, #062612 100%)'}} />
		<div style={{position: 'absolute', left: -300, right: -300, top: 1150, height: 900, background: 'repeating-linear-gradient(90deg, #136b32 0 120px, #0f5a2a 120px 240px)', transform: 'perspective(600px) rotateX(55deg)', transformOrigin: 'top center', opacity: 0.85}} />
		{[120, 960].map((x, i) => (
			<div key={i} style={{position: 'absolute', left: x - 260, top: -120, width: 520, height: 1400, background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,230,${0.22 + 0.04 * Math.sin(frame / 7 + i)}) 0%, transparent 60%)`, transform: `rotate(${i ? -12 : 12}deg)`}} />
		))}
		{/* público en la grada */}
		{new Array(60).fill(0).map((_, i) => (
			<div key={i} style={{position: 'absolute', left: (i * 37) % 1080, top: 1080 + (i % 4) * 26 - Math.abs(Math.sin(frame / 6 + i)) * 8, width: 18, height: 18, borderRadius: '50%', background: ['#ffcf3f', '#ff3b4f', '#4d8dff', '#fff'][i % 4], opacity: 0.35}} />
		))}
	</AbsoluteFill>
);

// bombo del sorteo
const Bombo: React.FC<{frame: number; size?: number; out?: number; label?: string}> = ({frame, size = 440, out = 0, label}) => {
	const R0 = size / 2;
	return (
		<div style={{position: 'relative', width: size, height: size + 120}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35), rgba(140,200,255,0.12) 60%, rgba(255,255,255,0.05))', border: '6px solid rgba(220,240,255,0.7)', overflow: 'hidden'}}>
				{new Array(14).fill(0).map((_, i) => {
					const a = frame / 9 + i * 0.9;
					const r = R0 * 0.55 * (0.4 + rand(i));
					return <div key={i} style={{position: 'absolute', left: R0 + Math.cos(a) * r - 26, top: R0 + Math.sin(a * 1.3) * r * 0.8 - 26, width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff, #d9d9d9 60%, #9a9a9a)'}} />;
				})}
			</div>
			<div style={{position: 'absolute', left: size / 2 - 70, top: size - 10, width: 140, height: 120, background: 'linear-gradient(#c9a227, #8a6a10)', borderRadius: 12}} />
			{out > 0 && (
				<div style={{position: 'absolute', left: size / 2 - 60 + out * 260, top: size - 60 - Math.sin(out * Math.PI) * 120, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff, #e6e6e6 60%, #a8a8a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: anton, fontSize: 34, color: '#0b1a33', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
					{label}
				</div>
			)}
		</div>
	);
};

const Shield: React.FC<{color: string; size: number; text: string}> = ({color, size, text}) => (
	<div style={{position: 'relative', width: size, height: size * 1.15}}>
		<svg width={size} height={size * 1.15} viewBox="0 0 100 115">
			<path d="M50 4 L94 18 L90 62 Q84 96 50 111 Q16 96 10 62 L6 18Z" fill={color} stroke="#fff" strokeWidth={5} />
			<path d="M50 20 L78 29 L75 60 Q71 84 50 95" fill="rgba(255,255,255,0.15)" />
		</svg>
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: anton, fontSize: size * 0.16, color: '#fff', lineHeight: 1.05, padding: size * 0.18, whiteSpace: 'pre-line'}}>{text}</div>
	</div>
);

const Trophy: React.FC<{size?: number; frame: number}> = ({size = 300, frame}) => (
	<svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{filter: `drop-shadow(0 0 ${20 + 10 * Math.sin(frame / 8)}px ${GOLD})`}}>
		<path d="M25 10 H75 V40 Q75 70 50 72 Q25 70 25 40Z" fill={GOLD} />
		<path d="M25 18 Q8 18 10 34 Q12 48 28 50" fill="none" stroke={GOLD} strokeWidth={6} />
		<path d="M75 18 Q92 18 90 34 Q88 48 72 50" fill="none" stroke={GOLD} strokeWidth={6} />
		<rect x={44} y={72} width={12} height={20} fill="#d9a520" />
		<rect x={30} y={92} width={40} height={10} rx={3} fill={GOLD} />
		<rect x={24} y={102} width={52} height={12} rx={3} fill="#8a5a10" />
		<path d="M38 18 Q36 40 46 56" stroke="#fff6c7" strokeWidth={4} fill="none" opacity={0.7} />
	</svg>
);

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 100}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

export const copa: VideoDef = {
	id: 'copa',
	timing,
	endAt: 62.9, // 1 s de pantalla final tras "Y sígueme"
	music: 'music/copa.mp3',
	theme: {bg1: '#050a18', bg2: '#062612', accent: GOLD, accent2: '#7fd8ff', text: '#fff'},
	label: 'FÚTBOL',
	Background: Bg,
	keywords: ['sorteo', 'copa', 'rey', 'casa', 'modesto', 'unico', 'semifinales', 'norma', 'inferior', 'categoria', 'ventaja', 'campo', 'gente', 'cesped', 'alcoyano', 'madrid', 'humilde', 'lleno', 'television', 'dinero', 'requisitos', 'iluminacion', 'seguridad', 'estadio', 'cruce'],
	replacements: [
		{match: ['dos', 'mil', 'diecinueve,'], show: '2019,'},
		{match: ['dos', 'mil', 'veintiuno,'], show: '2021,'},
	],
	scenes: [
		// 0 HOOK: bombo del sorteo + trofeo
		{
			camera: 'push',
			pops: ['sorteo'],
			booms: ['modesto'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={40}>
						<Title t="SORTEO DE COPA" frame={frame} color={GOLD} size={100} />
					</At>
					<At x={380} y={440}>
						<Bombo frame={frame} size={420} out={ease(frame, at('sorteo'), at('sorteo') + 25)} label="1" />
					</At>
					<At x={820} y={400}>
						<Trophy frame={frame} size={220} />
					</At>
					<At x={540} y={830}>
						<Chip text="🏠 ¿Por qué juega en casa el pequeño?" color={GOLD} frame={frame} at={at('sabias')} size={44} />
					</At>
				</Stage>
			),
		},
		// 1 Partido único desde 2019
		{
			camera: 'pull',
			pops: ['dos', 'unico'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Title t="EL FORMATO" frame={frame} color={GOLD} />
					</At>
					<At x={540} y={330}>
						<Stat value="DESDE 2019" color={GOLD} frame={frame} at={at('dos')} size={130} />
					</At>
					<At x={540} y={560}>
						<Stamp text="1 SOLO PARTIDO" color={GR} frame={frame} at={at('unico')} size={96} rot={-6} />
					</At>
					<At x={540} y={790}>
						<Chip text="⚽ Hasta semifinales" color="#fff" frame={frame} at={at('semifinales')} size={50} dark />
					</At>
				</Stage>
			),
		},
		// 2 La norma: local el de categoría inferior
		{
			camera: 'panR',
			pops: ['distinta', 'inferior'],
			render: ({frame, at}) => {
				const move = ease(frame, at('inferior'), at('inferior') + 18);
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="LA NORMA" frame={frame} color={GOLD} />
						</At>
						<At x={300} y={400}>
							<Shield color={B} size={300} text={'1ª\nDIVISIÓN'} />
						</At>
						<At x={540} y={400}>
							<div style={{fontFamily: anton, fontSize: 90, color: '#fff'}}>VS</div>
						</At>
						<At x={790} y={430}>
							<Shield color={R} size={210} text={'CATEGORÍA\nINFERIOR'} />
						</At>
						<At x={interpolate(move, [0, 1], [300, 790])} y={interpolate(move, [0, 1], [180, 230])}>
							<div style={{fontSize: 110, opacity: frame >= at('inferior') ? 1 : 0}}>🏠</div>
						</At>
						<At x={790} y={720}>
							<Stamp text="LOCAL" color={GR} frame={frame} at={at('inferior') + 18} size={90} rot={-8} />
						</At>
					</Stage>
				);
			},
		},
		// 3 La ventaja: su campo, su gente, su césped
		{
			camera: 'push',
			pops: ['campo', 'gente', 'cesped'],
			render: ({frame, at}) => {
				const items: [string, string, string][] = [
					['🏟️', 'Su campo', 'campo'],
					['📣', 'Su gente', 'gente'],
					['🌱', 'Su césped', 'cesped'],
				];
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="VENTAJA PARA EL PEQUEÑO" frame={frame} color={GOLD} size={84} />
						</At>
						{items.map(([e, t, k], i) => {
							const t0 = at(k);
							if (frame < t0) return null;
							const p = ease(frame, t0, t0 + 12);
							return (
								<div key={i} style={{position: 'absolute', left: 140, top: 230 + i * 190, width: 800, display: 'flex', alignItems: 'center', gap: 30, transform: `translateX(${(1 - p) * -600}px) scale(${1 + 0.04 * Math.sin(frame / 5 + i)})`, opacity: p, background: 'rgba(0,0,0,0.55)', border: `5px solid ${GR}`, borderRadius: 28, padding: '22px 30px'}}>
									<div style={{fontSize: 90}}>{e}</div>
									<div style={{fontFamily: anton, fontSize: 76, color: '#fff'}}>{t.toUpperCase()}</div>
								</div>
							);
						})}
					</Stage>
				);
			},
		},
		// 4 Funciona: Alcoyano 2-1 Real Madrid (2021)
		{
			camera: 'shake',
			pops: ['dos', 'segunda'],
			booms: ['elimino'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Stat value="2021" color={GOLD} frame={frame} at={at('dos')} size={120} />
					</At>
					<At x={540} y={380}>
						<div style={{width: 940, background: '#0a0f1e', border: `6px solid ${GOLD}`, borderRadius: 24, padding: '26px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: `scale(${pop(frame, at('alcoyano'))})`, opacity: frame >= at('alcoyano') ? 1 : 0}}>
							<div style={{textAlign: 'center'}}>
								<div style={{fontFamily: anton, fontSize: 62, color: '#fff'}}>ALCOYANO</div>
								<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 28, color: R}}>SEGUNDA B</div>
							</div>
							<div style={{fontFamily: anton, fontSize: 120, color: GOLD}}>{frame >= at('elimino') ? '2 – 1' : '– –'}</div>
							<div style={{textAlign: 'center'}}>
								<div style={{fontFamily: anton, fontSize: 62, color: '#fff'}}>R. MADRID</div>
								<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 28, color: B}}>1ª DIVISIÓN</div>
							</div>
						</div>
					</At>
					<At x={540} y={720}>
						<Stamp text="ELIMINADO" color={R} frame={frame} at={at('elimino') + 4} size={100} rot={-8} />
					</At>
				</Stage>
			),
		},
		// 5 Premio económico
		{
			camera: 'tilt',
			pops: ['lleno', 'television', 'dinero'],
			render: ({frame, at}) => {
				const coins = frame >= at('dinero');
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="UN PREMIO ENORME" frame={frame} color={GOLD} />
						</At>
						<div style={{position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40}}>
							{[['🏟️', 'LLENO', 'lleno'], ['📺', 'TV', 'television'], ['💶', 'DINERO', 'dinero']].map(([e, t, k], i) => (
								<div key={i} style={{width: 270, height: 300, borderRadius: 28, background: 'rgba(0,0,0,0.55)', border: `5px solid ${GOLD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${frame >= at(k) ? pop(frame, at(k)) : 0})`}}>
									<div style={{fontSize: 130}}>{e}</div>
									<div style={{fontFamily: anton, fontSize: 52, color: '#fff'}}>{t}</div>
								</div>
							))}
						</div>
						{coins &&
							new Array(18).fill(0).map((_, i) => (
								<div key={i} style={{position: 'absolute', left: 60 + rand(i) * 960, top: -60 + ((frame - at('dinero')) * (8 + rand(i * 3) * 6) + rand(i * 5) * 300) % 1000, fontSize: 60}}>🪙</div>
							))}
						<At x={540} y={760}>
							<Chip text="Para muchos clubes humildes, vital" color={GOLD} frame={frame} at={at('necesitan')} size={44} />
						</At>
					</Stage>
				);
			},
		},
		// 6 Si el campo no cumple → otro estadio
		{
			camera: 'panL',
			pops: ['iluminacion', 'seguridad', 'otro'],
			render: ({frame, at}) => {
				const lightsOff = frame >= at('iluminacion');
				const move = ease(frame, at('otro'), at('otro') + 20);
				return (
					<Stage>
						<At x={540} y={60}>
							<Title t="¿Y SI EL CAMPO NO CUMPLE?" frame={frame} color={GOLD} size={80} />
						</At>
						<At x={260} y={340}>
							<div style={{fontSize: 150, filter: lightsOff ? 'grayscale(1) brightness(0.5)' : 'none'}}>💡</div>
						</At>
						<At x={260} y={500}>
							<Chip text="Iluminación ✗" color={R} frame={frame} at={at('iluminacion')} size={40} />
						</At>
						<At x={820} y={340}>
							<div style={{fontSize: 150, opacity: frame >= at('seguridad') ? 0.5 : 1}}>🛡️</div>
						</At>
						<At x={820} y={500}>
							<Chip text="Seguridad ✗" color={R} frame={frame} at={at('seguridad')} size={40} />
						</At>
						<At x={interpolate(move, [0, 1], [220, 760])} y={720}>
							<div style={{fontSize: 120, opacity: frame >= at('otro') ? 1 : 0}}>🚌</div>
						</At>
						<At x={540} y={850}>
							<Chip text="🏟️ Se juega en OTRO estadio ✓" color={GR} frame={frame} at={at('cumpla')} size={46} />
						</At>
					</Stage>
				);
			},
		},
		// 7 Misma categoría: decide el sorteo
		{
			camera: 'push',
			pops: ['misma', 'primero'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={60}>
						<Title t="¿MISMA CATEGORÍA?" frame={frame} color={GOLD} />
					</At>
					<At x={420} y={460}>
						<Bombo frame={frame} size={380} out={ease(frame, at('primero'), at('primero') + 22)} label="1º" />
					</At>
					<At x={800} y={760}>
						<Stamp text="LOCAL" color={GR} frame={frame} at={at('casa')} size={84} rot={-8} />
					</At>
				</Stage>
			),
		},
		// 8 CTA (sin bucle)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={200} r={300} color={GOLD} o={0.35} />
					<At x={540} y={190}>
						<Trophy frame={frame} size={210} />
					</At>
					<At x={540} y={650}>
						<FollowCTA frame={frame} at={at('sigueme')} color={GOLD} question="¿Qué cruce tienes más ganas de ver?" />
					</At>
				</Stage>
			),
		},
	],
};
