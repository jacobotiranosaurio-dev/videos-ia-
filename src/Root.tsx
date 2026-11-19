import React from 'react';
import {Composition, Folder} from 'remotion';
import {ShortVideo, totalFrames} from './engine/ShortVideo';
import type {ShortProps, ShortScript} from './engine/types';
import {v1} from './videos/v1-consola';
import {v2} from './videos/v2-spoilers';
import {v3} from './videos/v3-precio';
import {v4} from './videos/v4-online';
import {v5} from './videos/v5-estafas';

const make = (script: ShortScript) => {
  const C: React.FC<ShortProps> = (p) => <ShortVideo {...p} script={script} />;
  return C;
};
const V1 = make(v1);
const V2 = make(v2);
const V3 = make(v3);
const V4 = make(v4);
const V5 = make(v5);

export const RemotionRoot: React.FC = () => (
  <Folder name="GTA-VI-Shorts">
    <Composition id="V1-Consola-Sin-Espacio" component={V1} durationInFrames={totalFrames(v1)} fps={30} width={1080} height={1920} defaultProps={{music: true, gameplay: null}} />
    <Composition id="V2-Cero-Spoilers" component={V2} durationInFrames={totalFrames(v2)} fps={30} width={1080} height={1920} defaultProps={{music: true, gameplay: null}} />
    <Composition id="V3-Mas-Barato-Que-GTA-V" component={V3} durationInFrames={totalFrames(v3)} fps={30} width={1080} height={1920} defaultProps={{music: true, gameplay: null}} />
    <Composition id="V4-Sin-Online-Es-Mejor" component={V4} durationInFrames={totalFrames(v4)} fps={30} width={1080} height={1920} defaultProps={{music: true, gameplay: null}} />
    <Composition id="V5-GTA-VI-PC-Es-Virus" component={V5} durationInFrames={totalFrames(v5)} fps={30} width={1080} height={1920} defaultProps={{music: true, gameplay: null}} />
  </Folder>
);
