import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {TOTAL_FRAMES, FPS} from './timing';

export const Root: React.FC = () => (
  <>
    <Composition id="Copa" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{safeGuides: false}} />
  </>
);
