import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {montserrat} from './fonts';
import {Theme, Timing} from './types';
import {norm, pop} from './util';

type Tok = {text: string; start: number; end: number; scene: number; key: boolean};

const buildTokens = (
	t: Timing,
	keywords: string[],
	replacements: {match: string[]; show: string}[] = [],
): Tok[] => {
	const out: Tok[] = [];
	const ws = t.words;
	const kw = new Set(keywords.map(norm));
	for (let i = 0; i < ws.length; i++) {
		let done = false;
		for (const r of replacements) {
			const m = r.match.map(norm);
			if (m.every((x, k) => ws[i + k] && norm(ws[i + k].text) === x)) {
				const last = ws[i + m.length - 1];
				const trail = last.text.match(/[.,:?!…]+$/)?.[0] ?? '';
				out.push({text: r.show.endsWith(trail) ? r.show : r.show + trail, start: ws[i].start, end: last.end, scene: ws[i].scene, key: true});
				i += m.length - 1;
				done = true;
				break;
			}
		}
		if (done) continue;
		const w = ws[i];
		out.push({...w, key: kw.has(norm(w.text)) || /\d/.test(w.text)});
	}
	return out;
};

type Chunk = {toks: Tok[]; start: number; end: number};

const chunkify = (toks: Tok[]): Chunk[] => {
	const chunks: Chunk[] = [];
	let cur: Tok[] = [];
	const flush = () => {
		if (cur.length) chunks.push({toks: cur, start: cur[0].start, end: cur[cur.length - 1].end});
		cur = [];
	};
	for (let i = 0; i < toks.length; i++) {
		const tk = toks[i];
		const prev = cur[cur.length - 1];
		const len = cur.reduce((a, b) => a + b.text.length + 1, 0);
		if (prev && (prev.scene !== tk.scene || tk.start - prev.end > 0.35 || len + tk.text.length > 16 || cur.length >= 3)) flush();
		cur.push(tk);
		if (/[.?!:…]$/.test(tk.text)) flush();
	}
	flush();
	// cada chunk dura hasta que empieza el siguiente (máx +0.6 s)
	for (let i = 0; i < chunks.length; i++) {
		const next = chunks[i + 1];
		chunks[i].end = next ? Math.min(next.start, chunks[i].end + 0.6) : chunks[i].end + 0.4;
	}
	return chunks;
};

export const Captions: React.FC<{
	timing: Timing;
	theme: Theme;
	keywords: string[];
	replacements?: {match: string[]; show: string}[];
}> = ({timing, theme, keywords, replacements}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const chunks = React.useMemo(() => chunkify(buildTokens(timing, keywords, replacements)), [timing, keywords, replacements]);
	const chunk = chunks.find((c) => t >= c.start - 0.05 && t < c.end);
	if (!chunk) return null;
	const cf = Math.round(chunk.start * fps);
	const enter = pop(frame, cf - 2, fps, 12);
	// palabras largas: reducir tamaño para que nunca se salgan de la zona segura
	const maxLen = Math.max(...chunk.toks.map((x) => x.text.length));
	const fontSize = Math.min(88, Math.floor(820 / (maxLen * 0.8)));
	return (
		// Zona segura: lejos de la barra inferior (título/canal) y de los botones de la derecha
		<AbsoluteFill style={{top: 1260, height: 290, left: 60, width: 860, alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: '0 4px',
					transform: `scale(${0.75 + 0.25 * enter}) translateY(${(1 - enter) * 30}px)`,
					fontFamily: montserrat,
					fontWeight: 900,
					fontSize,
					lineHeight: 1.12,
					textTransform: 'uppercase',
					textAlign: 'center',
				}}
			>
				{chunk.toks.map((tk, i) => {
					const said = t >= tk.start - 0.02;
					const active = said && t < tk.end + 0.05;
					const wf = Math.round(tk.start * fps);
					const p = pop(frame, wf, fps, 9);
					const color = tk.key ? theme.accent : active ? theme.accent2 : '#ffffff';
					return (
						<span
							key={i}
							style={{
								position: 'relative',
								color,
								opacity: said ? 1 : 0.55,
								transform: `scale(${active ? 1 + 0.06 * p : 1}) rotate(${tk.key && said ? -2 : 0}deg)`,
								display: 'inline-block',
								padding: '0 22px',
								WebkitTextStroke: '14px #000',
								paintOrder: 'stroke fill',
								textShadow: tk.key && said ? `0 0 28px ${theme.accent}aa, 0 8px 0 #000` : '0 8px 0 #000',
							}}
						>
							{tk.text}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
