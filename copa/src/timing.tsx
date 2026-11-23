import React, {createContext, useContext} from 'react';
import data from '../public/words.json';

export const FPS = 30;
export type Word = {text: string; key: boolean; start: number; end: number; sentence: number; phrase: number};
export const words = data.words as Word[];
export const VOICE_DURATION = data.duration;
export const TOTAL_FRAMES = Math.ceil((VOICE_DURATION + 2.2) * FPS);
export const wordFrame = (i: number) => Math.round(words[i].start * FPS);

export const SceneCtx = createContext({from: 0});
/** Frame (relativo a la escena) en el que empieza la palabra i. */
export const useW = () => {
  const {from} = useContext(SceneCtx);
  return (i: number, offset = 0) => wordFrame(i) - from + offset;
};
