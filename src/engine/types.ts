import React from 'react';

export type Word = {text: string; start: number; end: number; scene: number};
export type Timing = {duration: number; words: Word[]; scenes: string[]};

export type Theme = {
	bg1: string;
	bg2: string;
	accent: string; // palabra activa / datos clave
	accent2: string; // segundo color de resaltado
	text: string;
	titleFont?: string;
};

export type SceneCtx = {
	frame: number; // frame local de la escena
	dur: number; // duración de la escena en frames
	fps: number;
	at: (prefix: string, nth?: number) => number; // frame local en que se dice la palabra
	index: number;
};

export type SceneDef = {
	render: (ctx: SceneCtx) => React.ReactNode;
	pops?: string[]; // palabras donde suena un "pop" (datos clave)
	booms?: string[]; // palabras donde suena un impacto
	camera?: 'push' | 'pull' | 'panL' | 'panR' | 'tilt' | 'shake';
};

export type VideoDef = {
	id: string;
	timing: Timing;
	music: string;
	musicVolume?: number;
	theme: Theme;
	label: string; // etiqueta superior
	Background: React.FC<{frame: number}>;
	scenes: SceneDef[];
	keywords: string[]; // palabras resaltadas en subtítulos (minúsculas, sin acentos)
	replacements?: {match: string[]; show: string}[]; // "cuatrocientos treinta" -> "430"
};
