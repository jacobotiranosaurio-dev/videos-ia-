import type {ShortScript} from '../engine/types';

// VIDEO 2 — "El último video de GTA VI que deberías ver" (~38 s)
export const v2: ShortScript = {
  id: 'V2-Cero-Spoilers',
  badge: 'GTA VI · Cero spoilers',
  scenes: [
    {type: 'punch', dur: 3, mood: 'alarm', shake: true, size: 112, tag: 'No sigas bajando', lines: ['Este es el', '*último* video de GTA VI', 'que deberías ver'], sfx: ['glitch']},
    {type: 'words', dur: 4, mood: 'alarm', text: 'GTA VI salió *hoy*. En 48 horas el algoritmo te va a enseñar *el final*.'},
    {type: 'punch', dur: 2, icon: 'eyeOff', lines: ['A menos que', 'hagas *esto*'], sfx: ['impact']},
    {
      type: 'path',
      dur: 6.5,
      title: '*TikTok*',
      app: 'TikTok',
      appColor: '#25F4EE',
      steps: ['Perfil y menú', 'Ajustes y privacidad', 'Preferencias de contenido', 'Filtrar palabras clave'],
      chips: ['GTA final', 'GTA ending', 'Jason', 'Lucia', 'Leonida'],
    },
    {
      type: 'path',
      dur: 5.5,
      title: '*X / Twitter*',
      app: 'X',
      appColor: '#ffffff',
      steps: ['Configuración', 'Privacidad y seguridad', 'Silenciar y bloquear', 'Palabras silenciadas'],
      chips: ['GTA 6', 'GTAVI', 'spoiler'],
    },
    {type: 'tip', dur: 4.5, n: 3, icon: 'cross', title: 'YouTube *no filtra* palabras', body: 'Hazlo a mano: en cada video sospechoso, tres puntos → *No recomendar el canal*.'},
    {type: 'tip', dur: 4.5, n: 4, icon: 'bell', title: 'El peligro real: *WhatsApp*', body: 'Ese amigo que lo pasa en un día. Silencia el grupo *1 semana*. Sí, existe esa opción.'},
    {
      type: 'list',
      dur: 3.8,
      title: 'Tu *escudo*',
      items: [
        {text: 'TikTok filtrado', kind: 'check'},
        {text: 'X silenciado', kind: 'check'},
        {text: 'Grupos en silencio', kind: 'check'},
        {text: 'Leer comentarios de *otros* videos de GTA', kind: 'cross'},
      ],
    },
    {type: 'cta', dur: 4.6, sfx: ['riser'], lines: ['Esta cuenta es', '*zona cero spoilers*'], comment: 'ESCUDO activado', button: 'SÍGUEME'},
  ],
};
