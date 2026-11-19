import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(20);

// En este entorno usamos el Chromium preinstalado; en tu PC Remotion descarga el suyo automáticamente.
const localShell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}
