import type {Mood} from './theme';
import type {IconName} from './Icon';

/** Texto con *palabras resaltadas* entre asteriscos. */
export type Rich = string;
export type Sfx = 'whoosh' | 'impact' | 'pop' | 'glitch' | 'riser' | 'none';

type Base = {
  /** duración en segundos */
  dur: number;
  sfx?: Sfx[];
  mood?: Mood;
};

export type Scene =
  | (Base & {type: 'punch'; lines: Rich[]; tag?: string; icon?: IconName; shake?: boolean; size?: number; sub?: Rich})
  | (Base & {type: 'words'; text: Rich; label?: string; icon?: IconName})
  | (Base & {
      type: 'stat';
      from?: number;
      to: number;
      prefix?: string;
      suffix?: string;
      decimals?: number;
      label: Rich;
      sub?: Rich;
      color?: string;
    })
  | (Base & {
      type: 'meter';
      title: Rich;
      total: number;
      unit: string;
      segments: {label: string; value: number; color: string}[];
      footer?: Rich;
    })
  | (Base & {type: 'tip'; n: number; title: Rich; body: Rich; icon: IconName})
  | (Base & {
      type: 'versus';
      left: {title: string; value: string; sub?: string};
      right: {title: string; value: string; sub?: string};
      verdict?: Rich;
    })
  | (Base & {type: 'path'; app: string; appColor: string; steps: string[]; chips?: string[]; title?: Rich})
  | (Base & {type: 'list'; title: Rich; items: {text: Rich; kind: 'check' | 'cross' | 'dot'}[]})
  | (Base & {type: 'cta'; lines: Rich[]; comment: string; button?: string});

export type ShortScript = {
  id: string;
  badge: string;
  scenes: Scene[];
};

export type ShortProps = {
  /** Voz en off generada con Piper (public/vo). */
  voice: boolean;
  /** Beat sintético de fondo. Desactívalo si vas a usar un audio en tendencia de la app. */
  music: boolean;
  /** Ruta en /public a un clip de gameplay propio para usar como fondo (opcional). */
  gameplay: string | null;
};
