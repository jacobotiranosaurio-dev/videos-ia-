import type {ShortScript} from '../engine/types';

// VIDEO 1 — "Tu consola NO tiene sitio para GTA VI" (~40 s)
export const v1: ShortScript = {
  id: 'V1-Consola-Sin-Espacio',
  badge: 'GTA VI · Día 1',
  scenes: [
    {type: 'punch', dur: 2.6, mood: 'alarm', shake: true, tag: 'Alerta día 1', lines: ['Tu consola', '*NO* tiene sitio', 'para GTA VI'], sfx: ['impact']},
    {type: 'stat', dur: 3.2, label: 'Rockstar pide hasta', to: 212, suffix: ' GB', sub: 'solo para la *pre-carga*'},
    {
      type: 'meter',
      dur: 3.6,
      mood: 'alarm',
      title: 'Xbox *Series S*',
      total: 364,
      unit: 'GB',
      segments: [
        {label: 'Tus juegos', value: 180, color: '#19e3d1'},
        {label: 'GTA VI (hasta)', value: 212, color: '#ff2e88'},
      ],
      footer: 'No cabe',
    },
    {type: 'words', dur: 4, text: 'Y el error de todos: *borrar a lo loco* a medianoche… y que el *parche* no baje.'},
    {type: 'tip', dur: 4.4, n: 1, icon: 'hdd', title: 'Regla *212 + 50*', body: 'No liberes 212 GB: libera *260*. El parche de día 1 y las actualizaciones necesitan margen.'},
    {
      type: 'tip',
      dur: 5,
      n: 2,
      icon: 'usb',
      title: '*Mueve*, no borres',
      body: 'PS5 y Xbox Series te dejan *guardar juegos en un disco USB*. Copiarlos de vuelta es mucho más rápido que volver a descargarlos.',
    },
    {
      type: 'tip',
      dur: 4.8,
      n: 3,
      icon: 'trash',
      title: 'Cirugía en *Call of Duty*',
      body: 'No lo borres entero: entra en *Gestionar contenido del juego* y quita solo los modos que no juegas.',
    },
    {type: 'tip', dur: 4.4, n: 4, icon: 'film', title: 'Tus *clips* pesan', body: 'Revisa la galería: los clips en 4K que nunca volviste a ver pueden sumar *decenas de GB*.'},
    {
      type: 'versus',
      dur: 3.6,
      left: {title: 'PS5 original', value: '667', sub: 'GB útiles'},
      right: {title: 'Series S', value: '364', sub: 'GB útiles'},
      verdict: 'Revisa la *tuya* hoy',
    },
    {type: 'cta', dur: 4.6, sfx: ['riser'], lines: ['Comenta tu *consola*', 'y tus *GB libres*'], comment: 'PS5 Slim - me quedan 140 GB', button: 'SÍGUEME: te digo qué borrar'},
  ],
};
