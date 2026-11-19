import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Background, ProgressBar, Texture} from './Background';
import {SceneShell, SceneView, Sfx} from './scenes';
import {BODY, C, FPS} from './theme';
import type {ShortProps, ShortScript} from './types';
import voDurations from '../videos/vo-durations.json';

const VO_LEAD = 0.1; // la voz entra justo después del whoosh
const VO_TAIL = 0.2; // respiro antes del siguiente corte

const voOf = (id: string): number[] => (voDurations as Record<string, number[]>)[id] ?? [];

/** Alarga cada escena lo necesario para que su voz en off quepa completa. */
export const withVoiceTiming = (script: ShortScript): ShortScript => {
  const vo = voOf(script.id);
  return {...script, scenes: script.scenes.map((s, i) => ({...s, dur: Math.max(s.dur, vo[i] ? vo[i] + VO_LEAD + VO_TAIL : 0)}))};
};

export const totalFrames = (script: ShortScript) => script.scenes.reduce((a, s) => a + Math.round(s.dur * FPS), 0);

const Badge: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: 210,
        left: 90,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: BODY,
        fontWeight: 900,
        fontSize: 34,
        letterSpacing: 3,
        color: '#fff',
        background: 'rgba(0,0,0,.55)',
        border: `3px solid ${C.pink}`,
        padding: '10px 22px',
        borderRadius: 14,
        textTransform: 'uppercase',
      }}
    >
      <div style={{width: 18, height: 18, borderRadius: 9, background: C.red, opacity: frame % 30 < 18 ? 1 : 0.25}} />
      {text}
    </div>
  );
};

export const ShortVideo: React.FC<ShortProps & {script: ShortScript}> = ({script, music, gameplay, voice}) => {
  const vo = voOf(script.id);
  const {durationInFrames} = useVideoConfig();
  let from = 0;
  const items = script.scenes.map((s, i) => {
    const d = Math.round(s.dur * FPS);
    const start = from;
    from += d;
    const sfx = s.sfx ?? (i === 0 ? ['impact'] : ['whoosh']);
    return (
      <Sequence key={i} from={start} durationInFrames={d} name={`${i + 1}. ${s.type}`}>
        <Background mood={s.mood ?? 'sunset'} gameplay={gameplay} />
        <SceneShell flash={i > 0 && (sfx.includes('impact') || sfx.includes('glitch'))} first={i === 0}>
          <SceneView s={s} first={i === 0} />
        </SceneShell>
        {sfx.filter((x) => x !== 'none').map((x) => (
          <Sfx key={x} name={x} volume={(x === 'whoosh' ? 0.55 : 0.8) * (voice ? 0.6 : 1)} />
        ))}
        {voice && vo[i] ? (
          <Sequence from={Math.round(VO_LEAD * FPS)} layout="none" name="Voz">
            <Audio src={staticFile(`vo/${script.id}/${i}.wav`)} volume={1} />
          </Sequence>
        ) : null}
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {items}
      <Texture />
      <Badge text={script.badge} />
      <ProgressBar total={durationInFrames} />
      {music ? (
        <Audio
          src={staticFile('sfx/beat.wav')}
          loop
          volume={(f) => interpolate(f, [0, 10, durationInFrames - 20, durationInFrames], [0, voice ? 0.13 : 0.32, voice ? 0.13 : 0.32, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        />
      ) : null}
    </AbsoluteFill>
  );
};
