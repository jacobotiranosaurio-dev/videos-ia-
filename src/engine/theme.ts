import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fuentes locales en /public/fonts (render 100% offline).
export const HEAD = 'Anton';
export const BODY = 'Montserrat';
loadFont({family: HEAD, url: staticFile('fonts/anton-latin.woff2'), weight: '400'});
loadFont({family: BODY, url: staticFile('fonts/montserrat-latin.woff2'), weight: '100 900'});

export const C = {
  bg: '#0b0614',
  ink: '#140a24',
  pink: '#ff2e88',
  orange: '#ff8a3d',
  teal: '#19e3d1',
  yellow: '#ffe14d',
  red: '#ff3b3b',
  green: '#3dff8a',
  white: '#ffffff',
  dim: 'rgba(255,255,255,0.72)',
};

export type Mood = 'sunset' | 'alarm' | 'night';

/** Contorno grueso legible en móvil sobre cualquier fondo. */
export const stroke = (px = 10, color = '#000') => ({
  WebkitTextStroke: `${px}px ${color}`,
  paintOrder: 'stroke fill' as const,
});

export const FPS = 30;
