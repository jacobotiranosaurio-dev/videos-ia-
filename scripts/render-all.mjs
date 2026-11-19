// Renderiza los 5 shorts a /out (MP4 1080x1920, H.264, 30 fps).
// Uso: npm run render:all            -> con beat de fondo
//      npm run render:all -- --sin-musica -> sin beat (para poner un audio en tendencia desde la app)
import {execSync} from 'node:child_process';

const ids = ['V1-Consola-Sin-Espacio', 'V2-Cero-Spoilers', 'V3-Mas-Barato-Que-GTA-V', 'V4-Sin-Online-Es-Mejor', 'V5-GTA-VI-PC-Es-Virus'];
const noMusic = process.argv.includes('--sin-musica');
const props = JSON.stringify({music: !noMusic, gameplay: null});

ids.forEach((id, i) => {
  const out = `out/${String(i + 1).padStart(2, '0')}-${id}${noMusic ? '-sin-musica' : ''}.mp4`;
  console.log(`\n▶ ${out}`);
  execSync(`npx remotion render ${id} ${out} --props='${props}'`, {stdio: 'inherit'});
});
