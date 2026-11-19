import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Video} from '@remotion/media';
import {C, type Mood} from './theme';

const SKY: Record<Mood, [string, string, string]> = {
  sunset: ['#12052a', '#5a0f5e', '#ff5a6e'],
  alarm: ['#160208', '#5c0613', '#ff3b3b'],
  night: ['#020b16', '#07304a', '#19a3c9'],
};

const Palm: React.FC<{x: number; h: number; flip?: boolean; sway: number}> = ({x, h, flip, sway}) => (
  <svg
    viewBox="0 0 200 400"
    style={{position: 'absolute', left: x, bottom: 470, height: h, scale: flip ? '-1 1' : undefined, rotate: `${sway}deg`, transformOrigin: '50% 100%'}}
  >
    <path d="M104 400 C 100 300, 92 200, 100 120" stroke="#06020c" strokeWidth="14" fill="none" />
    <g fill="#06020c">
      <path d="M100 120 C 60 90, 20 100, 0 130 C 40 110, 70 115, 100 125Z" />
      <path d="M100 120 C 140 90, 180 100, 200 135 C 160 112, 130 115, 100 125Z" />
      <path d="M100 118 C 80 70, 40 50, 10 60 C 50 70, 75 90, 98 122Z" />
      <path d="M100 118 C 120 70, 160 50, 192 62 C 150 72, 125 90, 102 122Z" />
      <path d="M100 118 C 100 80, 110 50, 130 30 C 118 60, 110 90, 103 120Z" />
    </g>
  </svg>
);

/** Fondo animado estilo "Vice City sunset": cielo, sol rayado, palmeras y rejilla en perspectiva. */
export const Background: React.FC<{mood: Mood; gameplay: string | null}> = ({mood, gameplay}) => {
  const frame = useCurrentFrame();
  const [top, mid, bottom] = SKY[mood];
  const gridShift = (frame * 6) % 120;
  const sway = Math.sin(frame / 25) * 2;

  if (gameplay) {
    return (
      <AbsoluteFill style={{backgroundColor: C.bg}}>
        <Video src={staticFile(gameplay)} muted loop style={{width: '100%', height: '100%', objectFit: 'cover', scale: 1.06}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,4,20,.55), rgba(10,4,20,.35) 40%, rgba(10,4,20,.75))'}} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${mid} 45%, ${bottom} 72%, ${C.bg} 72.2%)`}}>
      {/* Sol */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 330,
          top: 760 + Math.sin(frame / 60) * 10,
          width: 660,
          height: 660,
          borderRadius: '50%',
          background: mood === 'night' ? 'linear-gradient(#bff8ff, #19e3d1 60%, #0b6f9c)' : `linear-gradient(${C.yellow}, ${C.orange} 50%, ${C.pink})`,
          maskImage: 'repeating-linear-gradient(180deg, #000 0 34px, transparent 34px 46px)',
          WebkitMaskImage: 'linear-gradient(#000 45%, transparent 45%), repeating-linear-gradient(180deg, #000 0 30px, transparent 30px 44px)',
          opacity: 0.9,
          filter: 'blur(.5px)',
        }}
      />
      {/* Brillo del horizonte */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, height: 140, background: `radial-gradient(ellipse at center, ${bottom}aa, transparent 70%)`}} />
      <Palm x={-40} h={720} sway={sway} />
      <Palm x={760} h={620} flip sway={-sway} />
      <Palm x={860} h={430} flip sway={sway * 0.7} />
      {/* Rejilla en perspectiva */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1382, height: 540, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: -1200,
            right: -1200,
            top: 0,
            transformOrigin: '50% 0%',
            transform: 'perspective(500px) rotateX(70deg)',
            backgroundImage: `linear-gradient(${mood === 'night' ? C.teal : C.pink}cc 3px, transparent 3px), linear-gradient(90deg, ${mood === 'night' ? C.teal : C.pink}cc 3px, transparent 3px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: `0 ${gridShift}px`,
            height: 1400,
          }}
        />
      </div>
      {/* Oscurecer para legibilidad */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,2,12,.55), rgba(5,2,12,.15) 35%, rgba(5,2,12,.25) 60%, rgba(5,2,12,.7))'}} />
    </AbsoluteFill>
  );
};

/** Grano, scanlines y viñeta: le da textura "VHS" y hace que el texto respire. */
export const Texture: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)',
          backgroundPosition: `0 ${(frame * 2) % 5}px`,
          opacity: 0.55,
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.65) 100%)'}} />
    </AbsoluteFill>
  );
};

/** Barra de progreso superior: retención (el usuario ve que "ya casi termina"). */
export const ProgressBar: React.FC<{total: number}> = ({total}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 12, background: 'rgba(255,255,255,.12)'}}>
      <div
        style={{
          height: '100%',
          width: `${interpolate(frame, [0, total], [0, 100], {extrapolateRight: 'clamp'})}%`,
          background: `linear-gradient(90deg, ${C.pink}, ${C.orange}, ${C.yellow})`,
          boxShadow: `0 0 20px ${C.pink}`,
        }}
      />
    </div>
  );
};
