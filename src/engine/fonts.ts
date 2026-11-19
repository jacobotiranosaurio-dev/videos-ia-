import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fuentes de Google descargadas en public/fonts (render sin conexión)
loadFont({family: 'Montserrat', url: staticFile('fonts/Montserrat.woff2'), weight: '100 900'});
loadFont({family: 'Anton', url: staticFile('fonts/Anton.woff2'), weight: '400'});
loadFont({family: 'Cinzel', url: staticFile('fonts/Cinzel.woff2'), weight: '400 900'});

export const montserrat = 'Montserrat, sans-serif';
export const anton = 'Anton, Impact, sans-serif';
export const cinzel = 'Cinzel, serif';
