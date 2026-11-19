import type {ShortScript} from '../engine/types';

// VIDEO 4 — "GTA VI sin Online es lo mejor que te pudo pasar" (~38 s)
export const v4: ShortScript = {
  id: 'V4-Sin-Online-Es-Mejor',
  badge: 'GTA VI · Debate',
  scenes: [
    {type: 'punch', dur: 3, shake: true, tag: 'Opinión polémica', lines: ['GTA VI *sin Online*', 'es lo *mejor*', 'que te pudo pasar'], sfx: ['impact']},
    {type: 'words', dur: 3.6, text: 'Hoy salió *solo el modo historia*. GTA Online se espera para *2027*.'},
    {type: 'punch', dur: 2, mood: 'night', lines: ['Recuerda lo que', 'pasó con *GTA V*']},
    {
      type: 'list',
      dur: 4.8,
      mood: 'night',
      title: 'GTA V (2013)',
      items: [
        {text: 'Online llegó *2 semanas* después', kind: 'dot'},
        {text: 'Rockstar se volcó en *Online*', kind: 'dot'},
        {text: 'DLC de historia: *nunca llegó*', kind: 'cross'},
      ],
    },
    {type: 'words', dur: 3.2, text: 'Esta vez tienes algo que en 2013 no existió: *una ventana*.'},
    {type: 'tip', dur: 4.6, n: 1, icon: 'clock', title: 'Termina la historia *antes de 2027*', body: 'Cuando llegue Online, tus amigos, los creadores y el algoritmo *solo hablarán de Online*.'},
    {type: 'tip', dur: 4.6, n: 2, icon: 'eyeOff', title: '*Cero* guías del 100%', body: 'Hasta los créditos, nada de mapas de coleccionables. Descubrir Leonida *a ciegas* solo pasa una vez.'},
    {
      type: 'tip',
      dur: 4.8,
      n: 3,
      icon: 'film',
      title: 'Graba tu *primera vez*',
      body: 'Tu primera llegada a *Vice City* no se repite. PS5 y Xbox guardan los últimos minutos de juego *con un botón*.',
    },
    {type: 'versus', dur: 3.4, left: {title: 'Equipo', value: 'HISTORIA'}, right: {title: 'Equipo', value: 'ONLINE'}, verdict: '¿Cuál eres?'},
    {type: 'cta', dur: 4.4, sfx: ['riser'], lines: ['Comenta *HISTORIA*', 'u *ONLINE*', 'Solo una palabra'], comment: 'HISTORIA', button: 'SÍGUEME: parte 2'},
  ],
};
