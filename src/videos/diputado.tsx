import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import timing from '../data/diputado.timing.json';
import {At, Chip, FollowCTA, Glow, Particles, Stage, Stamp, Stat} from '../engine/kit';
import {anton, montserrat} from '../engine/fonts';
import {VideoDef} from '../engine/types';
import {ease, pop, rand} from '../engine/util';

const GREEN = '#3ee07a';
const GOLD = '#ffd23f';
const RED = '#ff3b4f';
const BLUE = '#5fb0ff';
const PAPER = '#fbfaf5';

const Bg: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #12402a 0%, #071a12 70%)'}} />
		<AbsoluteFill style={{opacity: 0.07, backgroundImage: `repeating-linear-gradient(45deg, ${GREEN} 0 2px, transparent 2px 28px)`, backgroundPosition: `${frame}px 0`}} />
		<Particles frame={frame} color={GOLD} n={24} size={8} blur={2} />
	</AbsoluteFill>
);

// lluvia de billetes/monedas
const MoneyRain: React.FC<{frame: number; from: number; n?: number}> = ({frame, from, n = 18}) => (
	<>
		{frame >= from &&
			new Array(n).fill(0).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: 40 + rand(i) * 1000, top: -80 + (((frame - from) * (7 + rand(i * 3) * 6) + rand(i * 5) * 400) % 1000), fontSize: 56 + rand(i * 7) * 30, transform: `rotate(${(frame + i * 20) % 360}deg)`}}>{i % 3 ? '💶' : '🪙'}</div>
			))}
	</>
);

// tarjeta tipo nómina
const Card: React.FC<{title: string; value: string; color: string; sub?: string; w?: number; frame: number; at: number; stamp?: React.ReactNode}> = ({title, value, color, sub, w = 420, frame, at, stamp}) => {
	if (frame < at) return null;
	return (
		<div style={{position: 'relative', width: w, background: PAPER, borderRadius: 20, borderTop: `16px solid ${color}`, padding: '20px 24px', boxShadow: '0 24px 50px rgba(0,0,0,0.5)', transform: `scale(${pop(frame, at)})`}}>
			<div style={{fontFamily: montserrat, fontWeight: 900, fontSize: 30, color: '#355', letterSpacing: 1}}>{title}</div>
			<div style={{fontFamily: anton, fontSize: 96, color: '#123', lineHeight: 1.1}}>{value}</div>
			{sub && <div style={{fontFamily: montserrat, fontWeight: 700, fontSize: 26, color: '#567'}}>{sub}</div>}
			{stamp}
		</div>
	);
};

const Title: React.FC<{t: string; frame: number; color?: string; size?: number}> = ({t, frame, color = '#fff', size = 100}) => (
	<div style={{fontFamily: anton, fontSize: size, color, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'pre-line', transform: `scale(${pop(frame, 3)})`, textShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>
);

export const diputado: VideoDef = {
	id: 'diputado',
	timing,
	endAt: 58.72, // 1 s de pantalla final tras "Y sígueme"
	music: 'music/diputado.mp3',
	theme: {bg1: '#071a12', bg2: '#071a12', accent: GOLD, accent2: BLUE, text: '#fff'},
	label: 'POLÍTICA',
	Background: Bg,
	keywords: ['diputado', 'cobrar', 'impuestos', 'sueldo', 'base', 'brutos', 'gastos', 'madrid', 'exenta', 'irpf', 'total', 'viajes', 'tren', 'avion', 'taxi', 'cargo', 'portavoz', 'comision', 'complemento', 'publicas', 'congreso', 'mucho', 'poco'],
	replacements: [
		{match: ['cinco', 'mil', 'quinientos', 'euros'], show: '5.500 €'},
		{match: ['cinco', 'mil', 'euros'], show: '5.000 €'},
		{match: ['tres', 'mil', 'trescientos', 'sesenta', 'y', 'siete', 'euros'], show: '3.367 €'},
		{match: ['dos', 'mil', 'ciento', 'sesenta', 'euros'], show: '2.160 €'},
		{match: ['tres', 'mil', 'euros'], show: '3.000 €'},
		{match: ['mil', 'treinta'], show: '1.030 €'},
		{match: ['trescientos', 'cincuenta'], show: '350'},
	],
	scenes: [
		// 0 HOOK: contador hasta +5.000 € y lluvia de dinero
		{
			camera: 'push',
			pops: ['cinco'],
			booms: ['impuestos'],
			render: ({frame, at}) => {
				const v = Math.round(interpolate(frame, [0, at('cinco') + 10], [0, 5000], {extrapolateRight: 'clamp'}));
				return (
					<Stage>
						<MoneyRain frame={frame} from={at('cinco')} />
						<Glow x={540} y={380} r={420} color={GREEN} o={0.35} />
						<At x={540} y={80}>
							<div style={{whiteSpace: 'nowrap'}}><Title t="SUELDO DE UN DIPUTADO" frame={frame} color={GOLD} size={72} /></div>
						</At>
						<At x={540} y={400}>
							<div style={{fontFamily: anton, fontSize: 190, color: '#fff', whiteSpace: 'nowrap', textShadow: `0 0 50px ${GREEN}, 0 10px 0 #000`}}>
								+{v.toLocaleString('es-ES').replace(/,/g, '.').replace(/^(\d)(\d{3})$/, '$1.$2')} €
							</div>
						</At>
						<At x={540} y={590}>
							<Chip text="al mes" color={GREEN} frame={frame} at={at('mes')} size={52} />
						</At>
						<At x={540} y={800}>
							<Stamp text="PARTE SIN IMPUESTOS" color={RED} frame={frame} at={at('impuestos')} size={80} rot={-6} />
						</At>
					</Stage>
				);
			},
		},
		// 1 Sueldo base 3.367 €
		{
			camera: 'pull',
			pops: ['tres', 'igual'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={70}>
						<Title t="SUELDO BASE" frame={frame} color={GOLD} />
					</At>
					<At x={540} y={400}>
						<Card title="ASIGNACIÓN CONSTITUCIONAL" value="3.367 €" color={GREEN} sub="brutos al mes" w={640} frame={frame} at={at('tres')} />
					</At>
					<At x={540} y={760}>
						<Chip text="🟰 Igual para los 350" color={BLUE} frame={frame} at={at('igual')} size={50} />
					</At>
				</Stage>
			),
		},
		// 2 Indemnización: fuera de Madrid vs Madrid
		{
			camera: 'panR',
			pops: ['dos', 'mil'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={70}>
						<Title t="+ PARA GASTOS" frame={frame} color={GOLD} />
					</At>
					<At x={290} y={430}>
						<Card title="FUERA DE MADRID" value="2.160 €" color={GOLD} sub="al mes" w={440} frame={frame} at={at('dos')} />
					</At>
					<At x={790} y={430}>
						<Card title="MADRID" value="1.030 €" color={BLUE} sub="al mes" w={400} frame={frame} at={at('mil', 1)} />
					</At>
					<At x={540} y={760}>
						<Chip text="📍 Según por dónde los eligieron" color={GREEN} frame={frame} at={at('dos') + 10} size={40} dark />
					</At>
				</Stage>
			),
		},
		// 3 Exenta de IRPF
		{
			camera: 'shake',
			booms: ['exenta'],
			pops: ['impuestos'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={380}>
						<Card title="INDEMNIZACIÓN POR GASTOS" value="2.160 €" color={GOLD} w={640} frame={frame} at={0} />
					</At>
					<At x={540} y={380}>
						<Stamp text="SIN IRPF" color={RED} frame={frame} at={at('exenta')} size={120} rot={-12} />
					</At>
					<At x={540} y={760}>
						<Chip text="🧾 No paga impuestos" color={RED} frame={frame} at={at('impuestos')} size={50} />
					</At>
				</Stage>
			),
		},
		// 4 Total ≈ 5.500 €
		{
			camera: 'push',
			pops: ['cinco'],
			render: ({frame, at}) => {
				const k = ease(frame, 0, 20);
				return (
					<Stage>
						<At x={540} y={70}>
							<Title t="EN TOTAL" frame={frame} color={GOLD} />
						</At>
						<At x={540} y={330}>
							<div style={{fontFamily: anton, fontSize: 92, color: '#fff', opacity: k, whiteSpace: 'nowrap'}}>
								3.367 € <span style={{color: GREEN}}>+</span> 2.160 €
							</div>
						</At>
						<At x={540} y={460}>
							<div style={{width: 760 * k, height: 8, background: '#fff', borderRadius: 4}} />
						</At>
						<At x={540} y={650}>
							<Stat value="≈ 5.500 €" label="al mes · fuera de Madrid" color={GREEN} frame={frame} at={at('cinco')} size={170} count={false} />
						</At>
					</Stage>
				);
			},
		},
		// 5 Viajes y tarjeta de taxi
		{
			camera: 'panL',
			pops: ['tren', 'taxi', 'solo'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={70}>
						<Title t="ADEMÁS…" frame={frame} color={GOLD} />
					</At>
					<div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 50}}>
						{[['🚆', 'tren'], ['✈️', 'avion'], ['🚕', 'taxi']].map(([e, k], i) => (
							<div key={i} style={{fontSize: 170, transform: `scale(${frame >= at(k) ? pop(frame, at(k)) : 0}) translateY(${Math.sin(frame / 6 + i) * 8}px)`}}>{e}</div>
						))}
					</div>
					<At x={540} y={560}>
						<Chip text="🎫 Viajes pagados por el Congreso" color={BLUE} frame={frame} at={at('tren')} size={44} />
					</At>
					<At x={540} y={690}>
						<Chip text="🚕 Taxi: hasta 3.000 € al año" color={GOLD} frame={frame} at={at('taxi')} size={48} />
					</At>
					<At x={540} y={830}>
						<Chip text="Solo se pagan los viajes reales" color="#fff" frame={frame} at={at('solo')} size={38} dark />
					</At>
				</Stage>
			),
		},
		// 6 Complemento por cargo
		{
			camera: 'tilt',
			pops: ['portavoz', 'presidente', 'complemento'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={70}>
						<Title t="¿Y SI TIENEN CARGO?" frame={frame} color={GOLD} size={92} />
					</At>
					<At x={300} y={360}>
						<div style={{textAlign: 'center', transform: `scale(${frame >= at('portavoz') ? pop(frame, at('portavoz')) : 0})`}}>
							<div style={{fontSize: 160}}>🎤</div>
							<div style={{fontFamily: anton, fontSize: 52, color: '#fff'}}>PORTAVOZ</div>
						</div>
					</At>
					<At x={780} y={360}>
						<div style={{textAlign: 'center', transform: `scale(${frame >= at('presidente') ? pop(frame, at('presidente')) : 0})`}}>
							<div style={{fontSize: 160}}>🏛️</div>
							<div style={{fontFamily: anton, fontSize: 44, color: '#fff'}}>PRESIDENTE DE COMISIÓN</div>
						</div>
					</At>
					<At x={540} y={720}>
						<Stamp text="+ COMPLEMENTO" color={GREEN} frame={frame} at={at('complemento')} size={96} rot={-6} />
					</At>
				</Stage>
			),
		},
		// 7 Ojo al dato: cifras públicas
		{
			camera: 'push',
			pops: ['publicas', 'consultarlas'],
			render: ({frame, at}) => (
				<Stage>
					<At x={540} y={50}>
						<Chip text="👁 OJO AL DATO" color={GOLD} frame={frame} at={0} size={52} />
					</At>
					<At x={540} y={420}>
						<div style={{width: 820, borderRadius: 22, overflow: 'hidden', background: PAPER, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', transform: `scale(${frame >= at('consultarlas') ? pop(frame, at('consultarlas')) : 0.001})`}}>
							<div style={{background: '#d9dde6', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12}}>
								{[RED, GOLD, GREEN].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: '50%', background: c}} />)}
								<div style={{marginLeft: 12, flex: 1, background: '#fff', borderRadius: 10, padding: '6px 14px', fontFamily: montserrat, fontWeight: 700, fontSize: 28, color: '#345'}}>🔒 congreso.es</div>
							</div>
							<div style={{padding: '24px 30px'}}>
								<div style={{fontFamily: anton, fontSize: 48, color: '#123', marginBottom: 14}}>Régimen económico</div>
								{['Asignación constitucional', 'Indemnización por gastos', 'Complementos'].map((t, i) => (
									<div key={i} style={{display: 'flex', justifyContent: 'space-between', fontFamily: montserrat, fontWeight: 700, fontSize: 30, color: '#345', padding: '10px 0', borderBottom: '2px solid #e3e6ee'}}>
										<span>{t}</span>
										<span style={{color: GREEN}}>✓</span>
									</div>
								))}
							</div>
						</div>
					</At>
					<At x={540} y={800}>
						<Stamp text="DATOS PÚBLICOS" color={GREEN} frame={frame} at={at('publicas')} size={84} rot={-6} />
					</At>
				</Stage>
			),
		},
		// 8 CTA (sin bucle)
		{
			camera: 'pull',
			render: ({frame, at}) => (
				<Stage>
					<Glow x={540} y={200} r={300} color={GREEN} o={0.3} />
					<At x={540} y={190}>
						<div style={{fontSize: 170, transform: `rotate(${Math.sin(frame / 10) * 6}deg)`}}>💶</div>
					</At>
					<At x={540} y={650}>
						<FollowCTA frame={frame} at={at('sigueme')} color={GOLD} question="¿Te parece mucho o poco?" />
					</At>
				</Stage>
			),
		},
	],
};
