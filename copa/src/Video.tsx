import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, interpolateColors, random, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {C, CX, CY, H, W} from './theme';
import {SCENES} from './scenes';
import {SceneCtx, TOTAL_FRAMES, wordFrame, words} from './timing';
import {Subtitles} from './Subtitles';

const FADE = 4;
const sceneFrom = (i: number) => (i === 0 ? 0 : wordFrame(SCENES[i].anchor) - 4);
const TIMELINE = SCENES.map((s, i) => {
  const from = sceneFrom(i);
  const to = i + 1 < SCENES.length ? sceneFrom(i + 1) : TOTAL_FRAMES;
  return {...s, from, dur: to - from};
});

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = [800, 900].map(
      (wt) => new FontFace('Montserrat', `url(${staticFile(`montserrat-latin-${wt}-normal.woff2`)}) format('woff2')`, {weight: String(wt)}),
    );
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => {
        loaded.forEach((f) => document.fonts.add(f));
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  let k = TIMELINE.findIndex((s) => frame >= s.from && frame < s.from + s.dur);
  if (k < 0) k = TIMELINE.length - 1;
  const cur = TIMELINE[k];
  const prev = TIMELINE[Math.max(0, k - 1)];
  const p = interpolate(frame - cur.from, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const top = interpolateColors(p, [0, 1], [prev.bg[0], cur.bg[0]]);
  const bot = interpolateColors(p, [0, 1], [prev.bg[1], cur.bg[1]]);
  // panal de abeja de fondo
  const hexes = [];
  const r = 70;
  for (let row = -1; row < 17; row++)
    for (let col = -1; col < 9; col++) {
      const x = col * r * 1.75 + (row % 2) * r * 0.875;
      const y = row * r * 1.52;
      hexes.push(
        <path key={`${row}-${col}`} transform={`translate(${x} ${y})`}
          d={`M 0 ${-r} L ${r * 0.87} ${-r / 2} L ${r * 0.87} ${r / 2} L 0 ${r} L ${-r * 0.87} ${r / 2} L ${-r * 0.87} ${-r / 2} Z`}
          fill="none" stroke={C.white} strokeWidth={4} />,
      );
    }
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bot} 100%)`}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <g opacity={0.06} transform={`translate(${(frame * 0.4) % (r * 1.75)} ${(-frame * 0.6) % (r * 3.04)})`}>{hexes}</g>
        <radialGradient id="vig" cx="0.45" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.35} />
        </radialGradient>
        <rect width={W} height={H} fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Partículas doradas (bokeh) que suben en todo el vídeo. */
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {new Array(26).fill(0).map((_, i) => {
          const speed = 0.8 + random(`ps${i}`) * 1.8;
          const x = random(`px${i}`) * W + Math.sin(frame * 0.02 + i) * 30;
          const y = (((random(`py${i}`) * (H + 200) - frame * speed) % (H + 200)) + H + 200) % (H + 200) - 100;
          const rr = 5 + random(`pr${i}`) * 14;
          return <circle key={i} cx={x} cy={y} r={rr} fill={i % 3 ? C.honeyLight : C.white} opacity={0.12 + random(`po${i}`) * 0.2} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const SceneWrap: React.FC<{dur: number; shake?: number; children: React.ReactNode}> = ({dur, shake, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14, stiffness: 140}});
  const fadeIn = interpolate(frame, [0, FADE], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [dur, dur + FADE], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const zoom = interpolate(frame, [0, dur], [1, 1.07]) * interpolate(enter, [0, 1], [0.88, 1]);
  let sx = 0;
  let sy = 0;
  if (shake !== undefined && frame >= shake && frame < shake + 14) {
    const a = (1 - (frame - shake) / 14) * 22;
    sx = (random(`sx${frame}`) - 0.5) * a * 2;
    sy = (random(`sy${frame}`) - 0.5) * a * 2;
  }
  return (
    <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g transform={`translate(${sx} ${sy}) translate(${CX} ${CY}) scale(${zoom}) translate(${-CX} ${-CY + (1 - enter) * 60})`}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{safeGuides?: boolean}> = ({safeGuides = false}) => {
  useFonts();
  const pops = words.map((w, i) => ({w, i})).filter(({w}) => w.key);
  return (
    <AbsoluteFill style={{backgroundColor: C.plum}}>
      <Background />
      <Particles />
      {TIMELINE.map((s, i) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur + FADE} name={s.id}>
          <SceneCtx.Provider value={{from: s.from}}>
            <SceneWrap dur={s.dur} shake={s.shakeAt !== undefined ? wordFrame(s.shakeAt) - s.from : undefined}>
              <s.C />
            </SceneWrap>
          </SceneCtx.Provider>
        </Sequence>
      ))}
      <Subtitles />
      {safeGuides ? (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 230, background: 'rgba(255,0,0,0.25)'}} />
          <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 384, background: 'rgba(255,0,0,0.25)'}} />
          <div style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: 162, background: 'rgba(255,0,0,0.25)'}} />
        </AbsoluteFill>
      ) : null}
      {/* Audio */}
      <Audio src={staticFile('voice.wav')} />
      <Audio src={staticFile('music.wav')} />
      {TIMELINE.slice(1).map((s) => (
        <Sequence key={'wh' + s.id} from={Math.max(0, s.from - 5)} durationInFrames={18}>
          <Audio src={staticFile('whoosh.wav')} volume={0.55} />
        </Sequence>
      ))}
      {pops.map(({w, i}) => (
        <Sequence key={'pop' + i} from={Math.round(w.start * 30)} durationInFrames={6}>
          <Audio src={staticFile('pop.wav')} volume={0.45} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
