import React from 'react';
import {Composition} from 'remotion';
import {Short} from './engine/Short';
import {VideoDef} from './engine/types';
import {FPS, videoFrames} from './engine/util';
import {planetas} from './videos/planetas';
import {prohibidos} from './videos/prohibidos';
import {envidia} from './videos/envidia';
import {roma} from './videos/roma';
import {sinhumanos} from './videos/sinhumanos';
import {miel} from './videos/miel';
import {carteles} from './videos/carteles';
import {votoobligatorio} from './videos/votoobligatorio';
import {blanconulo} from './videos/blanconulo';
import {copa} from './videos/copa';
import {gta6} from './videos/gta6';
import {congresosenado} from './videos/congresosenado';

const VIDEOS: VideoDef[] = [planetas, prohibidos, envidia, roma, sinhumanos, miel, carteles, votoobligatorio, blanconulo, copa, gta6, congresosenado];

// Cada vídeo es un componente propio (las funciones no pueden ir en props serializadas)
const COMPONENTS = VIDEOS.map((v) => {
	const C: React.FC = () => <Short def={v} />;
	return {v, C};
});

export const RemotionRoot: React.FC = () => (
	<>
		{COMPONENTS.map(({v, C}) => (
			<Composition key={v.id} id={v.id} component={C} durationInFrames={videoFrames(v)} fps={FPS} width={1080} height={1920} />
		))}
	</>
);
