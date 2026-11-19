import type {ShortScript} from '../engine/types';

// VIDEO 5 — "Si ves 'GTA VI para PC' hoy, es un VIRUS" (~36 s)
export const v5: ShortScript = {
  id: 'V5-GTA-VI-PC-Es-Virus',
  badge: 'GTA VI · Escudo',
  scenes: [
    {type: 'punch', dur: 3, mood: 'alarm', shake: true, icon: 'virus', tag: 'Ojo', lines: ['Si ves', '"GTA VI para *PC*"', 'hoy… es un *virus*'], size: 116, sfx: ['glitch']},
    {type: 'words', dur: 3.8, text: 'Salió *solo en PS5 y Xbox Series*. La versión de PC *no tiene fecha*.'},
    {type: 'words', dur: 3.2, mood: 'alarm', text: 'Y los estafadores lo saben. Esta semana es su *temporada alta*.'},
    {
      type: 'list',
      dur: 5.4,
      mood: 'alarm',
      title: '3 trampas de *día 1*',
      items: [
        {text: '*Descargar* GTA VI para PC o móvil', kind: 'cross'},
        {text: '*Dinero infinito* o generadores para Online', kind: 'cross'},
        {text: '*Sorteos*: "entra con tu cuenta PSN/Xbox"', kind: 'cross'},
      ],
    },
    {type: 'tip', dur: 4.4, n: 1, icon: 'globe', title: 'Online *no existe* todavía', body: 'Se espera para 2027. Cualquier "truco de dinero Online" hoy es *mentira por definición*.'},
    {
      type: 'tip',
      dur: 4.6,
      n: 2,
      icon: 'lock',
      title: 'Activa la *verificación en 2 pasos*',
      body: 'PSN y Xbox la tienen en la seguridad de tu cuenta. *2 minutos* y nadie entra con tu contraseña.',
    },
    {
      type: 'tip',
      dur: 4.8,
      n: 3,
      icon: 'shield',
      title: 'Solo *fuentes oficiales*',
      body: 'Rockstar, cuentas verificadas y la tienda de tu consola. ¿Te piden *descargar algo fuera de la tienda*? Huye.',
    },
    {type: 'punch', dur: 2.6, mood: 'alarm', lines: ['Un clic', 'y pierdes *tu cuenta*', 'con GTA VI dentro'], sfx: ['impact']},
    {type: 'cta', dur: 4.6, sfx: ['riser'], lines: ['*Etiqueta* al amigo', 'que caería en esto'], comment: '@tuamigo mira esto YA', button: 'SÍGUEME = escudo GTA VI'},
  ],
};
