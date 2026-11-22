import React from 'react';
import {Composition} from 'remotion';
import {Short} from './engine/Short';
import {VideoDef} from './engine/types';
import {FPS, totalFrames} from './engine/util';
import {planetas} from './videos/planetas';
import {prohibidos} from './videos/prohibidos';
import {envidia} from './videos/envidia';
import {roma} from './videos/roma';
import {sinhumanos} from './videos/sinhumanos';
import {miel} from './videos/miel';
import {carteles} from './videos/carteles';

const VIDEOS: VideoDef[] = [planetas, prohibidos, envidia, roma, sinhumanos, miel, carteles];

// Cada vídeo es un componente propio (las funciones no pueden ir en props serializadas)
const COMPONENTS = VIDEOS.map((v) => {
	const C: React.FC = () => <Short def={v} />;
	return {v, C};
});

export const RemotionRoot: React.FC = () => (
	<>
		{COMPONENTS.map(({v, C}) => (
			<Composition key={v.id} id={v.id} component={C} durationInFrames={totalFrames(v.timing)} fps={FPS} width={1080} height={1920} />
		))}
	</>
);
