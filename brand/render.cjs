// Renderiza el logo, la foto de perfil y el banner de YouTube a PNG con Chromium.
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(dir, '../public/fonts', f)).toString('base64');
const svg = fs.readFileSync(path.join(dir, 'logo.svg'), 'utf8');
const css = `@font-face{font-family:Anton;src:url(${font('anton-latin.woff2')})}
@font-face{font-family:Montserrat;src:url(${font('montserrat-latin.woff2')});font-weight:100 900}
*{margin:0;box-sizing:border-box} body{background:#0b0614}`;
const word = (size) => `<div style="font-family:Anton;font-size:${size}px;line-height:.9;letter-spacing:2px;color:#fff;text-transform:uppercase">OJO AL <span style="background:linear-gradient(90deg,#ff2e88,#ff8a3d,#ffe14d);-webkit-background-clip:text;color:transparent">DATO</span></div>`;

const pages = {
  'avatar-800.png': [800, 800, `<div style="width:800px;height:800px;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#2a0c3e,#0b0614 70%)">
      <div style="width:760px;height:760px">${svg.replace('<rect class="bg" width="512" height="512" fill="#0b0614"/>', '').replace('width="512" height="512"', 'width="760" height="760"')}</div></div>`],
  'logo-horizontal.png': [1600, 500, `<div style="width:1600px;height:500px;display:flex;align-items:center;gap:50px;padding:0 90px">
      <div style="width:360px;height:360px;flex:none">${svg.replace('width="512" height="512"', 'width="360" height="360"')}</div>
      <div>${word(190)}<div style="font-family:Montserrat;font-weight:800;font-size:46px;color:#19e3d1;margin-top:22px">Datos que no sabías que necesitabas.</div></div></div>`],
  'banner-youtube-2560x1440.png': [2560, 1440, `<div style="position:relative;width:2560px;height:1440px;overflow:hidden;background:linear-gradient(180deg,#12052a,#3a0a4a 55%,#0b0614)">
      <div style="position:absolute;inset:0;background-image:linear-gradient(#ff2e8833 2px,transparent 2px),linear-gradient(90deg,#ff2e8833 2px,transparent 2px);background-size:90px 90px;transform:perspective(600px) rotateX(60deg);transform-origin:50% 100%;top:700px"></div>
      <div style="position:absolute;left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;justify-content:center;gap:56px">
        <div style="width:330px;height:330px;flex:none">${svg.replace('<rect class="bg" width="512" height="512" fill="#0b0614"/>', '').replace('width="512" height="512"', 'width="330" height="330"')}</div>
        <div>${word(176)}<div style="font-family:Montserrat;font-weight:800;font-size:50px;color:#fff;margin-top:20px">Datos que no sabías <span style="color:#19e3d1">que necesitabas.</span></div>
        <div style="font-family:Montserrat;font-weight:600;font-size:34px;color:#ffffffb0;margin-top:14px">Nuevos videos cada semana · Shorts de menos de 45 s</div></div>
      </div></div>`],
};

(async () => {
  const browser = await chromium.launch();
  for (const [name, [w, h, body]] of Object.entries(pages)) {
    const page = await browser.newPage({viewport: {width: w, height: h}});
    await page.setContent(`<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: path.join(dir, name)});
    console.log('✓', name);
  }
  await browser.close();
})();
