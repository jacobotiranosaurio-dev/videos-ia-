import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Backdrop, Big, C, Camera, FONT, SceneIn, Tag, clamp, lin, makeMapper, useSec } from "../lib/core";
import { EyeMascot } from "../lib/chars";
import { Captions, Word } from "../lib/Captions";
import { Bill, Browser, Calculator, Deputy, ExitDoor, Hemicycle, MoneyRain, P, Payslip, Scale, Stamp } from "../lib/politics";
import wordsJson from "./words.json";
import timemap from "./timemap.json";

const words = wordsJson as Word[];
const m = makeMapper(timemap as [number, number][]);
const ORIG_END = 81.5;
export const V03_DURATION = Math.round(m(ORIG_END) * 30) / 30;

const KEYWORDS = [
  "diputado", "crees", "impuestos", "sueldo", "base", "mismo", "3.367€", "brutos", "14", "pagas", "principio", "gastos", "Madrid",
  "1.032€", "provincia", "2.163€", "libre", "cuenta", "5.500€", "4", "salario", "mínimo", "cargo", "comisión", "1.700€",
  "portavoz", "3.200€", "dejan", "año", "24", "meses", "ingresos", "350", "público", "Congreso", "compruébalo", "mucho", "poco",
  "comentarios", "sígueme", "datos",
];

const S0 = {
  hook: [0, 6.0],
  base: [6.0, 16.3],
  start: [16.3, 18.6],
  gastos: [18.6, 32.2],
  cuenta: [32.2, 41.1],
  cargos: [41.1, 52.3],
  dejan: [52.3, 62.6],
  publico: [62.6, 70.9],
  cta: [70.9, ORIG_END],
} as const;
type K = keyof typeof S0;
const S = Object.fromEntries(Object.entries(S0).map(([k, [x, y]]) => [k, [m(x), m(y)]])) as Record<K, [number, number]>;
const OVER = 0.25;
const Scene: React.FC<{ k: K; children: React.ReactNode }> = ({ k, children }) => {
  const { fps } = useVideoConfig();
  const [a, b] = S[k];
  return (
    <Sequence name={k} from={Math.round(a * fps)} durationInFrames={Math.round((b - a + OVER) * fps)}>
      {children}
    </Sequence>
  );
};
const useA = (k: K) => (x: number) => m(x) - S[k][0];
const pop = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  return t < at ? 0 : 1 - Math.exp(-x * 9) * Math.cos(x * 18);
};
const eur = (v: number) => Math.round(v).toLocaleString("de-DE") + "€";
const count = (t: number, at: number, to: number, dur = 0.7) => eur(interpolate(t, [at, at + dur], [0, to], clamp));

// ================= 1. HOOK =================
const Hook: React.FC = () => {
  const a = useA("hook");
  const t = useSec();
  const spinning = t < a(4.3);
  const digits = spinning ? String(1000 + Math.floor(Math.abs(Math.sin(t * 37)) * 8999)) : "????";
  return (
    <AbsoluteFill>
      <Backdrop from="#E0263F" to="#3A0612" seed={7} />
      <MoneyRain n={12} speed={1.2} />
      <Camera dur={5} zoom={[1.06, 1.14]} punchAt={[0, a(2.1), a(4.6)]}>
        {/* contador tipo tragaperras */}
        <div style={{ position: "absolute", left: 540, top: 700, transform: `translate(-50%,-50%) rotate(-2deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: P.gold, background: P.navy, border: `9px solid ${C.ink}`, borderRadius: 34, padding: "4px 36px", boxShadow: `0 14px 0 ${C.ink}`, fontVariantNumeric: "tabular-nums", letterSpacing: 6 }}>
            {digits}€
          </div>
        </div>
        <div style={{ position: "absolute", left: 540, top: 1160, transform: "translate(-50%,-50%)" }}>
          <Deputy size={430} mood={t > a(3.5) ? "wink" : "smug"} armUp={lin(t, a(2.1), a(2.5))} />
        </div>
        {t > a(4.5) && (
          <div style={{ position: "absolute", left: 540, top: 1000, transform: "translate(-50%,-50%)" }}>
            <Stamp text="SIN IMPUESTOS" color={P.green} k={lin(t, a(4.5), a(4.75))} rotate={-10} size={80} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 2. SUELDO BASE =================
const Base: React.FC = () => {
  const a = useA("base");
  const t = useSec();
  const fill = Math.round(interpolate(t, [a(8.7), a(9.9)], [0, 350], clamp));
  const slip = t >= a(10.1);
  return (
    <AbsoluteFill>
      <Backdrop from="#2B3A8C" to="#0C1230" seed={9} />
      <Camera dur={10} zoom={[1, 1.08]} punchAt={[a(10.2), a(14.7)]}>
        <div style={{ position: "absolute", left: 540, top: slip ? 820 : 960, transform: `translate(-50%,-50%) scale(${slip ? 0.72 : 1})`, transition: "none" }}>
          <Hemicycle size={860} filled={fill} />
          <div style={{ textAlign: "center", marginTop: -10, opacity: t > a(8.7) ? 1 : 0 }}>
            <Big size={60} color="#fff" stroke={9}>TODOS IGUAL</Big>
          </div>
        </div>
        {t < a(8.7) && (
          <div style={{ position: "absolute", left: 540, top: 1000, transform: `translate(-50%,-50%) scale(${pop(t, a(6.4))}) rotate(-3deg)` }}>
            <Big size={120} color={P.gold} stroke={14}>SUELDO BASE</Big>
          </div>
        )}
        {slip && (
          <div style={{ position: "absolute", left: 540, top: 1260, transform: `translate(-50%,-50%) scale(${pop(t, a(10.1))}) rotate(-1.5deg)` }}>
            <Payslip w={840} rows={[{ l: "Asignación", v: count(t, a(10.2), 3367, 1.2), on: true, hl: P.red }]} />
          </div>
        )}
        {t > a(14.6) && <Tag at={a(14.6)} x={800} y={1080} bg={P.gold} size={64} rotate={6}>×14 PAGAS</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 3. SOLO EL PRINCIPIO =================
const Start: React.FC = () => {
  const a = useA("start");
  const t = useSec();
  const h = lin(t, a(16.4), a(18.2));
  return (
    <AbsoluteFill>
      <Backdrop from="#1FA36B" to="#063A26" seed={11} />
      <Camera dur={2.5} zoom={[1.05, 1.15]} punchAt={[a(17.4)]}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 540 - 130 + Math.sin(i * 2.1) * 14, top: 1420 - i * 46 * Math.min(1, h * 12 / (i + 1)), opacity: h * 12 > i ? 1 : 0, transform: `rotate(${Math.sin(i) * 4}deg)` }}>
            <Bill w={260} value="100" />
          </div>
        ))}
        <Tag at={a(17.1)} x={540} y={760} bg={P.gold} size={70} rotate={-3}>SOLO EL PRINCIPIO…</Tag>
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 4. AYUDA PARA GASTOS =================
const CityCard: React.FC<{ title: string; value: string; on: boolean; hl: boolean; color: string; skyline: number }> = ({ title, value, on, hl, color, skyline }) => {
  const t = useSec();
  return (
    <div style={{ width: 440, background: "#fff", border: `9px solid ${C.ink}`, borderRadius: 34, boxShadow: hl ? `0 16px 0 ${C.ink}, 0 0 60px ${P.gold}` : `0 16px 0 ${C.ink}`, overflow: "hidden", fontFamily: FONT, textAlign: "center", transform: `scale(${hl ? 1.06 + Math.sin(t * 6) * 0.015 : 1})` }}>
      <svg width={440} height={170} viewBox="0 0 440 170" style={{ display: "block", background: color }}>
        {Array.from({ length: skyline }, (_, i) => (
          <rect key={i} x={20 + i * (400 / skyline)} y={170 - 50 - ((i * 37) % 90)} width={400 / skyline - 10} height={50 + ((i * 37) % 90)} fill="rgba(255,255,255,0.35)" stroke={C.ink} strokeWidth={4} />
        ))}
      </svg>
      <div style={{ fontWeight: 900, fontSize: 44, color: C.ink, paddingTop: 14 }}>{title}</div>
      <div style={{ fontWeight: 900, fontSize: 82, color: on ? P.red : "#ccc", padding: "4px 0 20px" }}>{on ? value : "···"}</div>
    </div>
  );
};

const Gastos: React.FC = () => {
  const a = useA("gastos");
  const t = useSec();
  return (
    <AbsoluteFill>
      <Backdrop from="#FF8A3D" to="#6A1E0C" seed={13} />
      <Camera dur={12} zoom={[1, 1.08]} punchAt={[a(23.1), a(26.9), a(30.8)]}>
        <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${pop(t, a(19.0))}) rotate(-2deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: C.ink, background: P.gold, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>+ AYUDA PARA GASTOS</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 790, display: "flex", justifyContent: "center", gap: 40 }}>
          <div style={{ transform: `scale(${pop(t, a(22.0))}) rotate(-3deg)` }}>
            <CityCard title="MADRID" value="1.032€" on={t > a(23.1)} hl={false} color="#4C6FFF" skyline={7} />
          </div>
          <div style={{ transform: `scale(${pop(t, a(25.0))}) rotate(3deg)` }}>
            <CityCard title="PROVINCIAS" value="2.163€" on={t > a(26.9)} hl={t > a(29.1)} color={C.mint} skyline={4} />
          </div>
        </div>
        {t > a(30.7) && (
          <div style={{ position: "absolute", left: 540, top: 1420, transform: "translate(-50%,-50%)" }}>
            <Stamp text="0% IMPUESTOS" color={P.green} k={lin(t, a(30.7), a(30.95))} rotate={-8} size={80} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 5. HAZ LA CUENTA =================
const Cuenta: React.FC = () => {
  const a = useA("cuenta");
  const t = useSec();
  const bars = t >= a(38.6);
  const disp = t < a(33.6) ? "0" : t < a(34.6) ? "3367+" : t < a(35.7) ? "3367+2163" : "5530";
  return (
    <AbsoluteFill>
      <Backdrop from="#7B2FF7" to="#1B0A3A" seed={17} />
      <Camera dur={9} zoom={[1, 1.1]} punchAt={[a(35.8), a(39.0)]}>
        {!bars && (
          <>
            <div style={{ position: "absolute", left: 540, top: 1040, transform: `translate(-50%,-50%) scale(${pop(t, a(32.3)) * 0.95}) rotate(${Math.sin(t * 2) * 2}deg)` }}>
              <Calculator display={disp} w={480} />
            </div>
            {t > a(35.8) && <Tag at={a(35.8)} x={540} y={660} bg={P.gold} size={76} rotate={-4}>≈ 5.500€ / MES</Tag>}
          </>
        )}
        {bars && (
          <div style={{ position: "absolute", left: 140, top: 640, width: 800, height: 820, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Big size={60} color="#fff" stroke={8}>1.221€</Big>
              <div style={{ width: 200, height: 1221 * 0.11 * lin(t, a(38.7), a(39.2)), background: "#9AA3C7", border: `8px solid ${C.ink}`, borderRadius: "20px 20px 0 0" }} />
              <div style={{ marginTop: 12 }}><Big size={40} color="#fff" stroke={7}>SALARIO MÍNIMO</Big></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Big size={60} color={P.gold} stroke={8}>5.530€</Big>
              <div style={{ width: 200, display: "flex", flexDirection: "column-reverse", gap: 6 }}>
                {[0, 1, 2, 3, 4].map((i) => {
                  const k = lin(t, a(39.0) + i * 0.18, a(39.0) + i * 0.18 + 0.2);
                  const hh = i < 4 ? 1221 * 0.11 : (5530 - 4 * 1221) * 0.11;
                  return <div key={i} style={{ height: hh * k, background: i < 4 ? P.red : P.gold, border: k > 0 ? `8px solid ${C.ink}` : "none", borderRadius: 14 }} />;
                })}
              </div>
              <div style={{ marginTop: 12 }}><Big size={40} color="#fff" stroke={7}>DIPUTADO</Big></div>
            </div>
          </div>
        )}
        {bars && t > a(39.4) && <Tag at={a(39.4)} x={330} y={820} bg={P.gold} size={90} rotate={-8}>×4,5</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 6. CARGOS =================
const Cargos: React.FC = () => {
  const a = useA("cargos");
  const t = useSec();
  return (
    <AbsoluteFill>
      <Backdrop from="#C8102E" to="#2A0410" seed={19} />
      <Camera dur={11} zoom={[1, 1.1]} punchAt={[a(42.5), a(45.9), a(50.2)]}>
        <div style={{ position: "absolute", left: 300, top: 1150, transform: `translate(-50%,-50%) scale(${pop(t, a(41.2)) * 0.85})` }}>
          <Deputy size={420} mood={t > a(48.2) ? "wink" : "smile"} armUp={lin(t, a(42.5), a(42.9))} />
        </div>
        {t > a(42.5) && <Tag at={a(42.5)} x={540} y={650} bg={P.gold} size={64} rotate={-3}>CON CARGO… MÁS</Tag>}
        {[
          { at: a(43.5), vAt: a(45.9), l: "PRESIDIR COMISIÓN", v: 1712, y: 870 },
          { at: a(48.2), vAt: a(50.2), l: "PORTAVOZ DE GRUPO", v: 3197, y: 1140 },
        ].map((r) =>
          t > r.at ? (
            <div key={r.l} style={{ position: "absolute", left: 735, top: r.y, transform: `translate(-50%,-50%) scale(${pop(t, r.at)}) rotate(2deg)` }}>
              <div style={{ width: 520, background: "#fff", border: `8px solid ${C.ink}`, borderRadius: 28, boxShadow: `0 12px 0 ${C.ink}`, padding: "18px 24px", fontFamily: FONT, textAlign: "center" }}>
                <div style={{ fontWeight: 900, fontSize: 38, color: C.ink }}>{r.l}</div>
                <div style={{ fontWeight: 900, fontSize: 84, color: t > r.vAt ? P.green : "#ccc" }}>{t > r.vAt ? "+" + count(t, r.vAt, r.v, 0.6) : "···"}</div>
                <div style={{ fontWeight: 800, fontSize: 28, color: "#777" }}>al mes</div>
              </div>
            </div>
          ) : null,
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 7. CUANDO LO DEJAN =================
const Dejan: React.FC = () => {
  const a = useA("dejan");
  const t = useSec();
  const months = Math.round(interpolate(t, [a(55.0), a(56.5), a(57.7), a(58.3)], [0, 4, 12, 24], clamp));
  return (
    <AbsoluteFill>
      <Backdrop from="#2BB673" to="#073D24" seed={23} />
      <Camera dur={10} zoom={[1, 1.08]} punchAt={[a(53.1), a(57.7), a(59.4)]}>
        <div style={{ position: "absolute", left: 540, top: 700, transform: `translate(-50%,-50%) scale(${pop(t, a(52.6)) * 0.62})` }}>
          <ExitDoor open={lin(t, a(53.0), a(53.6))} size={300} />
        </div>
        {t > a(54.8) && (
          <div style={{ position: "absolute", left: 540, top: 1160, transform: `translate(-50%,-50%) scale(${pop(t, a(54.8))})` }}>
            <div style={{ width: 840, background: "#fff", border: `9px solid ${C.ink}`, borderRadius: 34, boxShadow: `0 16px 0 ${C.ink}`, padding: "20px 24px", fontFamily: FONT }}>
              <div style={{ textAlign: "center", fontWeight: 900, fontSize: 44, color: C.ink, marginBottom: 12 }}>1 AÑO DE ESCAÑO = 1 MES DE SUELDO</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} style={{ height: 70, borderRadius: 12, border: `5px solid ${C.ink}`, background: i < months ? P.gold : "#EEE", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 28, color: C.ink, transform: `scale(${i < months ? 1 : 0.9})` }}>
                    {i < months ? "€" : ""}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <span style={{ fontWeight: 900, fontSize: 60, color: P.red }}>{months}</span>
                <span style={{ fontWeight: 900, fontSize: 40, color: C.ink }}> / 24 MESES MÁX.</span>
              </div>
            </div>
          </div>
        )}
        {t > a(59.4) && (
          <div style={{ position: "absolute", left: 540, top: 1440, transform: "translate(-50%,-50%)" }}>
            <Stamp text="SOLO SIN OTROS INGRESOS" color={P.red} k={lin(t, a(60.4), a(60.65))} rotate={-4} size={52} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 8. 350 Y DATOS PÚBLICOS =================
const Publico: React.FC = () => {
  const a = useA("publico");
  const t = useSec();
  const fill = Math.round(interpolate(t, [a(62.8), a(64.4)], [0, 350], clamp));
  const web = t >= a(65.6);
  return (
    <AbsoluteFill>
      <Backdrop from="#2B3A8C" to="#0C1230" seed={29} />
      <Camera dur={8} zoom={[1, 1.1]} punchAt={[a(63.1), a(66.6), a(69.5)]}>
        {!web && (
          <div style={{ position: "absolute", left: 540, top: 1000, transform: "translate(-50%,-50%)" }}>
            <Hemicycle size={900} filled={fill} />
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <Big size={150} color={P.gold} stroke={15}>{fill}</Big>
              <Big size={54} color="#fff" stroke={8}>DIPUTADOS</Big>
            </div>
          </div>
        )}
        {web && (
          <div style={{ position: "absolute", left: 540, top: 1060, transform: `translate(-50%,-50%) scale(${pop(t, a(65.6))}) rotate(-1.5deg)` }}>
            <Browser url="congreso.es" w={860}>
              <div style={{ fontWeight: 900, fontSize: 44, color: C.ink, marginBottom: 14 }}>Régimen económico de los diputados</div>
              {[
                ["Asignación constitucional", "3.366,99 €"],
                ["Indemnización (otras provincias)", "2.162,85 €"],
                ["Indemnización (Madrid)", "1.032,38 €"],
              ].map(([l, v], i) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 800, color: "#333", padding: "12px 0", borderBottom: "3px solid #eee", opacity: lin(t, a(66.6) + i * 0.25, a(66.9) + i * 0.25) }}>
                  <span>{l}</span>
                  <span style={{ color: P.red, fontWeight: 900 }}>{v}</span>
                </div>
              ))}
            </Browser>
            {t > a(69.5) && (
              <div style={{ position: "absolute", right: 40, bottom: -150, transform: `scale(${pop(t, a(69.5))}) rotate(${Math.sin(t * 5) * 8}deg)` }}>
                <svg width={200} height={200} viewBox="0 0 200 200">
                  <circle cx={80} cy={80} r={56} fill="rgba(76,201,240,0.35)" stroke={C.ink} strokeWidth={14} />
                  <path d="M122 122 L180 180" stroke={C.ink} strokeWidth={26} strokeLinecap="round" />
                  <path d="M122 122 L180 180" stroke={P.gold} strokeWidth={12} strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        )}
        {t > a(69.5) && <Tag at={a(69.5)} x={540} y={660} bg={C.mint} size={60} rotate={-3}>COMPRUÉBALO TÚ ✓</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 9. CTA =================
const CTA: React.FC = () => {
  const a = useA("cta");
  const t = useSec();
  const follow = t >= a(77.1);
  const pressed = t > a(78.4);
  return (
    <AbsoluteFill>
      <Backdrop from="#E0263F" to="#3A0612" seed={7} />
      <MoneyRain n={8} speed={0.7} opacity={0.35} />
      <Camera dur={10} zoom={[1, 1.1]} punchAt={[a(72.8), a(73.3), a(77.2)]}>
        {!follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 1060, transform: `translate(-50%,-50%) scale(${pop(t, a(71.3)) * 1.25})` }}>
              <Scale size={560} />
            </div>
            {t > a(75.7) && (
              <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, a(75.9))}) rotate(${Math.sin(t * 6) * 4}deg)` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, background: P.gold, border: `8px solid ${C.ink}`, borderRadius: 30, padding: "14px 34px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>💬 TE LEO EN COMENTARIOS</div>
              </div>
            )}
          </>
        )}
        {follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${pop(t, a(77.1))})` }}>
              <EyeMascot size={360} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 1250, transform: `translate(-50%,-50%) scale(${pop(t, a(77.4))}) rotate(-3deg)` }}>
              <Big size={110} color={C.yellow} stroke={13}>OJO AL DATO</Big>
            </div>
            <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, a(77.7))})` }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", background: pressed ? "#3A3A3A" : "#FF0033", border: `8px solid ${C.ink}`, borderRadius: 999, padding: "14px 56px", boxShadow: `0 10px 0 ${C.ink}` }}>
                {pressed ? "✓ SUSCRITO" : "SUSCRIBIRME"}
              </div>
            </div>
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= SFX (tiempos de voz original) =================
const SFX: [number, string, number][] = [
  [0, "coins", 0.45], [0.1, "rise", 0.3], [2.1, "pop", 0.45], [4.5, "boom", 0.55],
  [6.0, "whoosh", 0.4], [8.7, "rise", 0.3], [10.2, "cash", 0.5], [14.6, "pop", 0.45],
  [16.3, "whoosh", 0.4], [16.5, "coins", 0.4], [17.1, "pop", 0.4],
  [18.6, "whoosh", 0.4], [19.0, "pop", 0.4], [23.1, "cash", 0.4], [26.9, "cash", 0.45], [30.7, "boom", 0.5],
  [32.2, "whoosh", 0.4], [33.6, "tick", 0.5], [34.6, "tick", 0.5], [35.7, "cash", 0.5], [38.7, "rise", 0.3], [39.4, "ding", 0.45],
  [41.1, "whoosh", 0.4], [42.5, "pop", 0.4], [45.9, "coins", 0.45], [50.2, "coins", 0.5],
  [52.3, "whoosh", 0.4], [53.0, "pop", 0.35], [57.7, "ding", 0.4], [60.4, "boom", 0.45],
  [62.6, "whoosh", 0.4], [64.4, "ding", 0.4], [65.6, "pop", 0.4], [69.5, "ding", 0.4],
  [70.9, "whoosh", 0.4], [75.9, "pop", 0.4], [77.1, "whoosh", 0.4], [78.4, "ding", 0.5],
];

export const Video03: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene k="hook"><SceneIn type="zoom"><Hook /></SceneIn></Scene>
      <Scene k="base"><SceneIn type="up"><Base /></SceneIn></Scene>
      <Scene k="start"><SceneIn type="zoom"><Start /></SceneIn></Scene>
      <Scene k="gastos"><SceneIn type="left"><Gastos /></SceneIn></Scene>
      <Scene k="cuenta"><SceneIn type="spin"><Cuenta /></SceneIn></Scene>
      <Scene k="cargos"><SceneIn type="up"><Cargos /></SceneIn></Scene>
      <Scene k="dejan"><SceneIn type="left"><Dejan /></SceneIn></Scene>
      <Scene k="publico"><SceneIn type="zoom"><Publico /></SceneIn></Scene>
      <Scene k="cta"><SceneIn type="spin"><CTA /></SceneIn></Scene>

      <Captions words={words} keywords={KEYWORDS} top={300} />

      <Audio src={staticFile("v03/voz.mp3")} />
      <Audio src={staticFile("v03/musica.mp3")} volume={(f) => interpolate(f / fps, [0, 0.8, m(79.3), m(80.0), V03_DURATION], [0, 0.12, 0.12, 0.28, 0], clamp)} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.round(m(at) * fps)} durationInFrames={Math.round(1.3 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`v03/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
