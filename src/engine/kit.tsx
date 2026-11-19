import React from 'react';
import {AbsoluteFill} from 'remotion';
import {anton, montserrat} from './fonts';
import {ease, pop, rand} from './util';

// Escenario central (zona visual segura: entre la cabecera y los subtítulos)
export const Stage: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({children, top = 300, height = 860}) => (
	<div style={{position: 'absolute', left: 0, width: 1080, top, height}}>{children}</div>
);

export const At: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', ...style}}>{children}</div>
);

// ---------- Fondos ----------
export const Stars: React.FC<{frame: number; n?: number; color?: string; speed?: number}> = ({frame, n = 140, color = '#fff', speed = 1}) => (
	<AbsoluteFill>
		{new Array(n).fill(0).map((_, i) => {
			const depth = 0.3 + rand(i * 3) * 1.7;
			const x = (rand(i) * 1300 - frame * 0.6 * depth * speed + 13000) % 1300 - 110;
			const y = rand(i * 7) * 1920;
			const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / (10 + rand(i * 5) * 30) + i));
			const s = depth * 2.2;
			return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: color, opacity: tw, boxShadow: `0 0 ${s * 3}px ${color}`}} />;
		})}
	</AbsoluteFill>
);

export const Particles: React.FC<{frame: number; n?: number; color: string; size?: number; dir?: 1 | -1; blur?: number}> = ({frame, n = 40, color, size = 10, dir = -1, blur = 2}) => (
	<AbsoluteFill>
		{new Array(n).fill(0).map((_, i) => {
			const sp = 0.6 + rand(i * 9) * 1.6;
			const y = ((rand(i * 2) * 2100 + dir * frame * sp * 2.2) % 2100 + 2100) % 2100 - 90;
			const x = rand(i * 4) * 1080 + Math.sin(frame / 30 + i) * 30;
			const s = size * (0.4 + rand(i * 11));
			return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: color, opacity: 0.25 + rand(i) * 0.5, filter: `blur(${blur}px)`}} />;
		})}
	</AbsoluteFill>
);

export const Glow: React.FC<{x: number; y: number; r: number; color: string; o?: number}> = ({x, y, r, color, o = 0.6}) => (
	<div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity: o}} />
);

// ---------- Planeta 3D sencillo ----------
export const Planet: React.FC<{
	size: number;
	c: [string, string, string];
	frame: number;
	bands?: string[];
	rings?: string;
	craters?: boolean;
	spot?: string;
	clouds?: boolean;
	continents?: boolean;
	glow?: string;
	id: string;
}> = ({size, c, frame, bands, rings, craters, spot, clouds, continents, glow, id}) => {
	const R = size / 2;
	const shift = (frame * 1.2) % size;
	return (
		<svg width={size * 1.9} height={size * 1.9} viewBox={`${-R * 1.9} ${-R * 1.9} ${size * 1.9} ${size * 1.9}`} style={{overflow: 'visible'}}>
			<defs>
				<radialGradient id={`g${id}`} cx="35%" cy="32%" r="75%">
					<stop offset="0%" stopColor={c[0]} />
					<stop offset="55%" stopColor={c[1]} />
					<stop offset="100%" stopColor={c[2]} />
				</radialGradient>
				<radialGradient id={`sh${id}`} cx="30%" cy="28%" r="85%">
					<stop offset="50%" stopColor="#000" stopOpacity={0} />
					<stop offset="100%" stopColor="#000" stopOpacity={0.75} />
				</radialGradient>
				<radialGradient id={`gl${id}`}>
					<stop offset="60%" stopColor={glow ?? c[1]} stopOpacity={0.55} />
					<stop offset="100%" stopColor={glow ?? c[1]} stopOpacity={0} />
				</radialGradient>
				<clipPath id={`cl${id}`}>
					<circle r={R} />
				</clipPath>
			</defs>
			<circle r={R * 1.35} fill={`url(#gl${id})`} />
			{rings && <ellipse rx={R * 1.85} ry={R * 0.42} fill="none" stroke={rings} strokeWidth={R * 0.22} opacity={0.75} transform="rotate(-14)" />}
			<circle r={R} fill={`url(#g${id})`} />
			<g clipPath={`url(#cl${id})`}>
				{bands?.map((b, i) => {
					const y = -R + (i + 0.5) * ((2 * R) / bands.length);
					return (
						<g key={i}>
							<path d={`M ${-R * 3 + shift * (i % 2 ? 1 : -1) * 0.5} ${y} q ${R / 2} ${R * 0.05} ${R} 0 t ${R} 0 t ${R} 0 t ${R} 0 t ${R} 0 t ${R} 0`} stroke={b} strokeWidth={(2 * R) / bands.length * 0.7} fill="none" opacity={0.7} />
						</g>
					);
				})}
				{spot && <ellipse cx={((R * 0.4 + shift) % (R * 3)) - R * 1.2} cy={R * 0.3} rx={R * 0.28} ry={R * 0.15} fill={spot} />}
				{craters &&
					new Array(14).fill(0).map((_, i) => (
						<circle key={i} cx={((rand(i) * size * 2 + shift) % (size * 2)) - size} cy={(rand(i * 3) - 0.5) * size * 0.95} r={R * (0.05 + rand(i * 5) * 0.12)} fill="#000" opacity={0.22} />
					))}
				{continents &&
					[0, 1, 2, 3].map((i) => (
						<path key={i} transform={`translate(${((i * size * 0.6 + shift) % (size * 2.4)) - size * 1.2}, ${(rand(i) - 0.5) * R})`} d={`M0 0 c ${R * 0.2} ${-R * 0.3} ${R * 0.5} ${-R * 0.2} ${R * 0.45} ${R * 0.1} s ${-R * 0.1} ${R * 0.45} ${-R * 0.3} ${R * 0.35} s ${-R * 0.25} ${-R * 0.25} ${-R * 0.15} ${-R * 0.45}z`} fill="#3fae5a" />
					))}
				{clouds &&
					new Array(6).fill(0).map((_, i) => (
						<ellipse key={i} cx={((rand(i * 2) * size * 2 + shift * 1.6) % (size * 2)) - size} cy={(rand(i * 8) - 0.5) * size * 0.9} rx={R * 0.35} ry={R * 0.06} fill="#fff" opacity={0.55} />
					))}
				<circle r={R} fill={`url(#sh${id})`} />
			</g>
			{rings && <path d={`M ${-R * 1.85} 0 A ${R * 1.85} ${R * 0.42} 0 0 0 ${R * 1.85} 0`} fill="none" stroke={rings} strokeWidth={R * 0.22} opacity={0.85} transform="rotate(-14)" />}
		</svg>
	);
};

// ---------- Dato destacado ----------
export const Stat: React.FC<{
	value: string;
	label?: string;
	color: string;
	frame: number;
	at: number;
	size?: number;
	count?: boolean;
	rotate?: number;
}> = ({value, label, color, frame, at, size = 190, count = true, rotate = -3}) => {
	const p = pop(frame, at, 30, 9);
	if (frame < at) return null;
	const m = value.match(/^(.*?)(\d[\d.]*)(.*)$/);
	let shown = value;
	if (count && m) {
		const target = parseFloat(m[2].replace(/\./g, ''));
		const k = ease(frame, at, at + 18);
		const v = Math.round(target * k);
		const txt = m[2].includes('.') ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(v);
		shown = m[1] + txt + m[3];
	}
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${p}) rotate(${rotate}deg)`}}>
			<div style={{fontFamily: anton, fontSize: size, lineHeight: 1, color: '#fff', WebkitTextStroke: `10px ${color}`, paintOrder: 'stroke fill', textShadow: `0 0 40px ${color}, 0 12px 0 rgba(0,0,0,0.6)`, whiteSpace: 'nowrap'}}>{shown}</div>
			{label && (
				<div style={{marginTop: 10, background: color, color: '#000', fontFamily: montserrat, fontWeight: 900, fontSize: 40, padding: '6px 22px', borderRadius: 12, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{label}</div>
			)}
		</div>
	);
};

export const Chip: React.FC<{text: string; color: string; frame: number; at?: number; size?: number; dark?: boolean}> = ({text, color, frame, at = 0, size = 46, dark}) => {
	const p = pop(frame, at, 30, 12);
	if (frame < at) return null;
	return (
		<div style={{transform: `scale(${p})`, background: dark ? 'rgba(0,0,0,0.6)' : color, color: dark ? color : '#000', border: `4px solid ${color}`, fontFamily: montserrat, fontWeight: 900, fontSize: size, padding: '8px 26px', borderRadius: 16, textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
			{text}
		</div>
	);
};

export const Stamp: React.FC<{text: string; color: string; frame: number; at: number; size?: number; rot?: number}> = ({text, color, frame, at, size = 92, rot = -12}) => {
	if (frame < at) return null;
	const k = ease(frame, at, at + 7);
	return (
		<div style={{transform: `scale(${2.6 - 1.6 * k}) rotate(${rot}deg)`, opacity: k, border: `10px solid ${color}`, color, fontFamily: anton, fontSize: size, padding: '4px 30px', borderRadius: 18, letterSpacing: 4, whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.35)'}}>
			{text}
		</div>
	);
};

// número de ranking grande ("1", "2", "3")
export const Rank: React.FC<{n: string; color: string; frame: number}> = ({n, color, frame}) => {
	const p = pop(frame, 0, 30, 10);
	return (
		<div style={{fontFamily: anton, fontSize: 300, color: 'transparent', WebkitTextStroke: `8px ${color}`, opacity: 0.9, transform: `scale(${p}) rotate(-8deg)`, lineHeight: 1}}>{n}</div>
	);
};

// botón final de seguir (CTA)
export const FollowCTA: React.FC<{frame: number; at: number; color: string; question: string}> = ({frame, at, color, question}) => {
	const p = pop(frame, 0, 30, 10);
	const p2 = pop(frame, at, 30, 8);
	const pulse = 1 + 0.05 * Math.sin(frame / 4);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
			<div style={{transform: `scale(${p})`, fontFamily: montserrat, fontWeight: 900, fontSize: 64, color: '#fff', textAlign: 'center', maxWidth: 900, textTransform: 'uppercase', background: 'rgba(0,0,0,0.5)', border: `5px solid ${color}`, borderRadius: 30, padding: '24px 34px'}}>
				💬 {question}
			</div>
			{frame >= at && (
				<div style={{transform: `scale(${p2 * pulse})`, background: '#ff0033', color: '#fff', fontFamily: montserrat, fontWeight: 900, fontSize: 58, padding: '18px 50px', borderRadius: 60, boxShadow: '0 0 50px #ff003399'}}>
					🔔 SUSCRÍBETE
				</div>
			)}
		</div>
	);
};
