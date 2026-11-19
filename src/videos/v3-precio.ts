import type {ShortScript} from '../engine/types';

// VIDEO 3 — "GTA VI a $80 es MÁS BARATO que GTA V" (~36 s)
export const v3: ShortScript = {
  id: 'V3-Mas-Barato-Que-GTA-V',
  badge: 'GTA VI · El precio',
  scenes: [
    {type: 'punch', dur: 2.8, shake: true, tag: 'Opinión impopular', lines: ['GTA VI a *$80*', 'es *más barato*', 'que GTA V'], sfx: ['impact']},
    {type: 'words', dur: 2.8, text: 'Y te lo demuestro con *matemáticas*, no con opiniones.'},
    {type: 'stat', dur: 3, label: 'GTA V costaba en 2013', prefix: '$', to: 59.99, decimals: 2, sub: 'y casi nadie se quejó'},
    {type: 'stat', dur: 3.4, color: '#3dff8a', label: 'Con la inflación, hoy son unos', prefix: '$', to: 85, sub: 'aprox., inflación de *EE.UU.*'},
    {
      type: 'versus',
      dur: 3.8,
      left: {title: 'GTA V (2013)', value: '$85', sub: 'en dinero de hoy'},
      right: {title: 'GTA VI (2026)', value: '$80', sub: 'edición estándar'},
      verdict: '*Más barato.*',
    },
    {type: 'words', dur: 3.4, text: 'Pero el número que importa no es ese. Es el *precio por hora*.'},
    {type: 'stat', dur: 3.8, label: '50 horas de juego =', prefix: '$', to: 1.6, decimals: 2, suffix: '/h', sub: 'Ir al cine: *~$5.50 la hora*'},
    {type: 'words', dur: 3, mood: 'alarm', text: 'Donde sí te pueden *sacar dinero* es en la edición de *$100*.'},
    {
      type: 'list',
      dur: 5.2,
      mood: 'alarm',
      title: 'Antes de pagar *$20 más*',
      items: [
        {text: 'Lee *qué incluye*, línea por línea', kind: 'dot'},
        {text: '¿Es para *Online*? Se espera en *2027*', kind: 'cross'},
        {text: 'Si dudas: *estándar*. Siempre.', kind: 'check'},
      ],
    },
    {type: 'cta', dur: 4.4, sfx: ['riser'], lines: ['¿Caro o barato?', 'Comenta tu *precio justo*'], comment: 'Yo pagaría $...', button: 'SÍGUEME'},
  ],
};
