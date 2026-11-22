import {Easing, interpolate, spring} from 'remotion';
import {Timing} from './types';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]/g, '');

export const sceneStarts = (t: Timing, fps = FPS): number[] => {
	const n = t.scenes.length;
	const starts: number[] = [];
	for (let i = 0; i < n; i++) {
		if (i === 0) {
			starts.push(0);
			continue;
		}
		const w = t.words.find((x) => x.scene === i);
		starts.push(Math.max(starts[i - 1] + 10, Math.round((w ? w.start : 0) * fps) - 5));
	}
	return starts;
};

export const videoFrames = (def: {timing: Timing; endAt?: number}, fps = FPS) =>
	def.endAt ? Math.round(def.endAt * fps) : totalFrames(def.timing, fps);

export const totalFrames = (t: Timing, fps = FPS) => {
	const last = t.words[t.words.length - 1];
	return Math.ceil((last.end + 0.25) * fps);
};

export const wordFrame = (t: Timing, scene: number, prefix: string, nth = 0, fps = FPS) => {
	const p = norm(prefix);
	const ws = t.words.filter((w) => w.scene === scene && norm(w.text).startsWith(p));
	const w = ws[Math.min(nth, ws.length - 1)];
	if (!w) return null;
	return Math.round(w.start * fps);
};

// animación "pop" con muelle a partir de un frame
export const pop = (frame: number, at: number, fps = FPS, damping = 11) =>
	spring({frame: frame - at, fps, config: {damping, stiffness: 160, mass: 0.7}});

export const ease = (frame: number, a: number, b: number, from = 0, to = 1) =>
	interpolate(frame, [a, b], [from, to], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.22, 1, 0.36, 1),
	});

// pseudo-aleatorio determinista
export const rand = (seed: number) => {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};
