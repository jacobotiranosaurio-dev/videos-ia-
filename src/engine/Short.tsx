import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Captions} from './Captions';
import {montserrat} from './fonts';
import {VideoDef} from './types';
import {ease, pop, sceneStarts, totalFrames, wordFrame} from './util';

const Camera: React.FC<{mode: string; frame: number; dur: number; children: React.ReactNode}> = ({mode, frame, dur, children}) => {
	const p = frame / Math.max(1, dur);
	// entrada: zoom + desenfoque rápido (corte dinámico)
	const inP = ease(frame, 0, 9);
	let s = 1.18 - 0.18 * inP;
	let x = 0;
	let y = 0;
	let r = 0;
	switch (mode) {
		case 'push':
			s *= 1 + 0.1 * p;
			break;
		case 'pull':
			s *= 1.1 - 0.1 * p;
			break;
		case 'panL':
			s *= 1.06;
			x = 40 - 80 * p;
			break;
		case 'panR':
			s *= 1.06;
			x = -40 + 80 * p;
			break;
		case 'tilt':
			s *= 1.05 + 0.04 * p;
			r = -2 + 4 * p;
			y = 20 - 40 * p;
			break;
		case 'shake':
			s *= 1.04 + 0.05 * p;
			x = Math.sin(frame * 1.7) * 6;
			y = Math.cos(frame * 2.3) * 6;
			break;
	}
	const blur = (1 - inP) * 14;
	return (
		<AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: interpolate(frame, [0, 4], [0.2, 1], {extrapolateRight: 'clamp'})}}>
			{children}
		</AbsoluteFill>
	);
};

const Brand: React.FC<{label: string; accent: string; frame: number}> = ({label, accent, frame}) => {
	const blink = Math.abs(Math.sin(frame / 22)) < 0.06 ? 0.15 : 1;
	return (
		<div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.45)', border: `3px solid ${accent}`, borderRadius: 50, padding: '10px 26px', fontFamily: montserrat, fontWeight: 900, fontSize: 30, color: '#fff', letterSpacing: 2}}>
				<svg width={50} height={30} viewBox="0 0 50 30">
					<path d="M2 15 Q25 -8 48 15 Q25 38 2 15Z" fill="#fff" />
					<circle cx={25} cy={15} r={9 * blink} fill={accent} />
					<circle cx={25} cy={15} r={4 * blink} fill="#000" />
				</svg>
				<span>OJO AL DATO</span>
				<span style={{color: accent}}>· {label}</span>
			</div>
		</div>
	);
};

export const Short: React.FC<{def: VideoDef}> = ({def}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {timing, theme} = def;
	const starts = sceneStarts(timing, fps);
	const total = totalFrames(timing, fps);
	const ends = starts.map((s, i) => (i < starts.length - 1 ? starts[i + 1] : total));
	const cams = ['push', 'panL', 'pull', 'tilt', 'panR', 'push', 'shake', 'pull'] as const;

	const sfx: {src: string; at: number; vol: number}[] = [];
	starts.forEach((s, i) => {
		if (i > 0) sfx.push({src: 'sfx/whoosh.mp3', at: Math.max(0, s - 6), vol: 0.35});
		const sc = def.scenes[i];
		sc?.pops?.forEach((w) => {
			const f = wordFrame(timing, i, w, 0, fps);
			if (f !== null) sfx.push({src: 'sfx/pop.mp3', at: f, vol: 0.5});
		});
		sc?.booms?.forEach((w) => {
			const f = wordFrame(timing, i, w, 0, fps);
			if (f !== null) sfx.push({src: 'sfx/boom.mp3', at: Math.max(0, f - 2), vol: 0.45});
		});
	});

	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${theme.bg1}, ${theme.bg2})`, overflow: 'hidden'}}>
			<def.Background frame={frame} />
			{def.scenes.map((sc, i) => {
				const from = starts[i];
				const dur = ends[i] - from;
				return (
					<Sequence key={i} from={from} durationInFrames={dur} layout="none">
						<SceneWrap i={i} dur={dur} cam={sc.camera ?? cams[i % cams.length]} def={def} from={from} />
					</Sequence>
				);
			})}
			{/* flash en cada corte */}
			{starts.slice(1).map((s, i) => {
				const o = interpolate(frame, [s - 1, s + 1, s + 6], [0, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return o > 0 ? <AbsoluteFill key={i} style={{background: '#fff', opacity: o}} /> : null;
			})}
			{/* viñeta para legibilidad */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.45) 72%, rgba(0,0,0,0.2) 100%)'}} />
			<Brand label={def.label} accent={theme.accent} frame={frame} />
			<Captions timing={timing} theme={theme} keywords={def.keywords} replacements={def.replacements} />
			<Audio src={staticFile(`audio/${def.id}.mp3`)} />
			<Audio src={staticFile(def.music)} volume={(f) => (def.musicVolume ?? 0.13) * Math.min(1, (total - f) / 8)} />
			{sfx.map((s, i) => (
				<Sequence key={i} from={s.at} layout="none">
					<Audio src={staticFile(s.src)} volume={s.vol} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

const SceneWrap: React.FC<{i: number; dur: number; cam: string; def: VideoDef; from: number}> = ({i, dur, cam, def, from}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const at = (prefix: string, nth = 0) => {
		const f = wordFrame(def.timing, i, prefix, nth, fps);
		return f === null ? 6 : f - from;
	};
	return (
		<Camera mode={cam} frame={frame} dur={dur}>
			{def.scenes[i].render({frame, dur, fps, at, index: i})}
		</Camera>
	);
};

export {pop};
