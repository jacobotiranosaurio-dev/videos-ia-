import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, CX} from './theme';
import {words, Word} from './timing';

type Chunk = {words: (Word & {i: number})[]; start: number; end: number};

/** Agrupa palabras en bloques de 2–4 palabras sin cruzar pausas de frase. */
const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: (Word & {i: number})[] = [];
  const flush = () => {
    if (cur.length) chunks.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    const newPhrase = prev && (prev.sentence !== w.sentence || prev.phrase !== w.phrase || w.start - prev.end > 0.08);
    const chars = cur.reduce((a, x) => a + x.text.length + 1, 0) + w.text.length;
    const maxWords = chars <= 14 ? 4 : 3;
    if (newPhrase || cur.length >= maxWords || chars > 18) flush();
    cur.push({...w, i});
  });
  flush();
  // evita bloques de una sola palabra corta uniéndolos al anterior si es de la misma frase
  for (let k = chunks.length - 1; k > 0; k--) {
    const c = chunks[k];
    const p = chunks[k - 1];
    const same = p.words[0].sentence === c.words[0].sentence && p.words[0].phrase === c.words[0].phrase;
    if (c.words.length === 1 && c.words[0].text.length <= 4 && same && p.words.length < 4) {
      p.words.push(...c.words);
      p.end = c.end;
      chunks.splice(k, 1);
    }
  }
  return chunks;
};

const CHUNKS = buildChunks();

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const idx = CHUNKS.findIndex((c, k) => {
    const next = CHUNKS[k + 1];
    const end = next ? Math.min(next.start - 0.05, c.end + 0.45) : c.end + 1.2;
    return t >= c.start - 0.08 && t < end;
  });
  if (idx < 0) return null;
  const chunk = CHUNKS[idx];
  const appear = spring({frame: frame - Math.round((chunk.start - 0.08) * fps), fps, config: {damping: 12, stiffness: 220}});

  return (
    <div
      style={{
        position: 'absolute',
        top: 250,
        left: CX - 430,
        width: 860,
        height: 230,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        gap: '8px 40px',
        transform: `scale(${interpolate(appear, [0, 1], [0.8, 1])})`,
        opacity: appear,
      }}
    >
      {chunk.words.map((w) => {
        const active = t >= w.start - 0.03 && t < w.end + 0.05;
        const said = t >= w.start - 0.03;
        const pop = spring({frame: frame - Math.round(w.start * fps), fps, config: {damping: 10, stiffness: 260}});
        const lift = active ? interpolate(pop, [0, 1], [10, -6]) : 0;
        const isKeyActive = w.key && said;
        return (
          <span
            key={w.i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 84,
              lineHeight: 1.12,
              textTransform: 'uppercase',
              letterSpacing: -1,
              display: 'inline-block',
              padding: isKeyActive ? '0 16px' : '0 2px',
              borderRadius: 18,
              transform: `translateY(${lift}px) rotate(${isKeyActive ? -2 : 0}deg)`,
              background: isKeyActive ? C.honey : 'transparent',
              boxShadow: isKeyActive ? `0 8px 0 ${C.ink}, 0 0 0 6px ${C.ink}` : 'none',
              color: isKeyActive ? C.ink : said ? C.white : 'rgba(255,255,255,0.5)',
              WebkitTextStroke: isKeyActive ? '0px' : `12px ${said ? C.ink : 'rgba(42,21,48,0.45)'}`,
              paintOrder: 'stroke fill',
              textShadow: isKeyActive ? 'none' : `0 6px 0 ${said ? 'rgba(42,21,48,0.9)' : 'rgba(42,21,48,0.3)'}`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
