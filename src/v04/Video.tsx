import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Backdrop, Big, C, Camera, FONT, SceneIn, Tag, clamp, lin, makeMapper, useSec } from "../lib/core";
import { EyeMascot } from "../lib/chars";
import { Captions, Word } from "../lib/Captions";
import { Hemicycle, P, Stamp } from "../lib/politics";
import wordsJson from "./words.json";
import timemap from "./timemap.json";

const words = wordsJson as Word[];
// La voz es: intro nueva (0–5,15 s) + voz original desde 8,30 s. Los tiempos del gancho están en segundos de la intro;
// el resto, en segundos de la voz original v1. sh() los une y makeMapper aplica el recorte de silencios.
const base = makeMapper(timemap as [number, number][]);
const INTRO = 5.15, CUT = 8.3;
const sh = (t: number) => (t < CUT ? t : t - CUT + INTRO);
const m = (t: number) => base(sh(t));
const ORIG_END = 75.3;
export const V04_DURATION = Math.round(m(ORIG_END) * 30) / 30;

const KEYWORDS = [
  "reparten", "escaños?", "12%", "escaño", "D'Hondt", "40 segundos", "350", "52", "provincia", "Ceuta", "Melilla", "separado", "filtro", "3%", "fuera",
  "truco", "4", "1", "2", "3", "altos", "escaños", "42%", "mitad", "0", "premia", "grandes", "pequeña", "votos", "consejo",
  "clave", "pesa", "sí", "no", "sígueme", "datos",
];

// Partidos ficticios con colores neutros
const PARTIES = [
  { id: "A", c: "#FF8A3D", v: 42000 },
  { id: "B", c: "#1FB5A8", v: 30000 },
  { id: "C", c: "#FFD23F", v: 16000 },
  { id: "D", c: "#FF6FB5", v: 12000 },
];

const S0 = {
  hook: [0, 8.3],
  spain: [8.3, 19.6],
  filtro: [19.6, 26.2],
  truco: [26.2, 40.9],
  result: [40.9, 52.6],
  premia: [52.6, 60.7],
  tip: [60.7, 67.5],
  cta: [67.5, ORIG_END],
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
const fmt = (v: number) => Math.round(v).toLocaleString("de-DE");

const Seat: React.FC<{ color: string; size?: number; label?: string }> = ({ color, size = 120, label }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <path d="M18 88 L18 40 Q18 14 50 14 Q82 14 82 40 L82 88Z" fill={color} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <rect x={8} y={60} width={84} height={22} rx={8} fill={color} stroke={C.ink} strokeWidth={7} />
    {label && <text x={50} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.ink}>{label}</text>}
  </svg>
);

const Ballot: React.FC<{ size?: number; color?: string; label?: string }> = ({ size = 160, color = "#fff", label }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible" }}>
    <rect x={8} y={8} width={84} height={104} rx={8} fill={color} stroke={C.ink} strokeWidth={6} />
    <path d="M22 34 H78 M22 52 H78 M22 70 H60" stroke="rgba(27,16,51,0.35)" strokeWidth={6} strokeLinecap="round" />
    {label && <text x={50} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill={C.ink}>{label}</text>}
  </svg>
);

// ================= Cronómetro real (cumple la promesa del título) =================
const Stopwatch: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = useSec();
  const t0 = m(4.97), t1 = m(51.7);
  if (t < t0) return null;
  const el = Math.min(t, t1) - t0;
  const done = t >= t1;
  const k = pop(t, t0);
  const s = Math.floor(el);
  return (
    <div style={{ position: "absolute", left: 540, top: 225, transform: `translate(-50%,-50%) scale(${k * (done ? 1 + 0.15 * Math.exp(-(t - t1) * 4) : 1)})` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: done ? C.ink : "#fff", background: done ? C.mint : "rgba(27,16,51,0.85)", border: `5px solid ${C.ink}`, borderRadius: 999, padding: "6px 26px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
        {done ? `✓ EXPLICADO EN ${s} s` : `⏱ 0:${String(s).padStart(2, "0")} / 0:40`}
      </div>
    </div>
  );
};

// ================= 1. HOOK =================
// Tiempos en segundos de la intro: "¿Cómo se reparten los escaños?" 0–1,7 · "Te explico la ley D'Hondt" 2,0–3,4 · "en 40 segundos" 3,7–5,0
const Hook: React.FC = () => {
  const a = useA("hook");
  const t = useSec();
  const title = t >= a(2.0);
  const n = Math.round(interpolate(t, [0, a(1.9)], [40, 350], clamp));
  const layers = [
    { c: PARTIES[3].c, f: 1 },
    { c: PARTIES[2].c, f: 0.88 },
    { c: PARTIES[1].c, f: 0.72 },
    { c: PARTIES[0].c, f: 0.42 },
  ];
  return (
    <AbsoluteFill>
      <Backdrop from="#2E5BFF" to="#0A1240" seed={4} />
      <Camera dur={5} zoom={[1.06, 1.16]} punchAt={[0, a(1.1), a(2.8), a(3.7)]}>
        {!title && (
          <>
            {/* papeletas que vuelan hacia el hemiciclo y se convierten en escaños */}
            <div style={{ position: "absolute", left: 540, top: 1000, transform: "translate(-50%,-50%)" }}>
              <div style={{ position: "relative", width: 900, height: 495 }}>
                <div style={{ position: "absolute", inset: 0 }}><Hemicycle size={900} filled={0} /></div>
                {layers.map((l, i) => (
                  <div key={i} style={{ position: "absolute", inset: 0 }}>
                    <Hemicycle size={900} filled={Math.round(n * l.f)} color={l.c} emptyColor="transparent" />
                  </div>
                ))}
              </div>
            </div>
            {Array.from({ length: 10 }, (_, i) => {
              const p = ((t * 1.3 + i / 10) % 1);
              const x0 = 100 + ((i * 263) % 880);
              const x = interpolate(p, [0, 1], [x0, 540 + Math.cos(i * 1.7) * 300]);
              const y = interpolate(p, [0, 1], [1800, 900]) - Math.sin(p * Math.PI) * 200;
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${p * 360 * (i % 2 ? 1 : -1)}deg) scale(${1 - p * 0.6})`, opacity: 1 - p * p }}>
                  <Ballot size={90} color={PARTIES[i % 4].c} />
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 540, top: 1180, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 5) * 10}deg) scale(${1 + Math.sin(t * 8) * 0.06})` }}>
              <Big size={260} color={C.yellow} stroke={18}>?</Big>
            </div>
          </>
        )}
        {title && (
          <div style={{ position: "absolute", left: 540, top: 980, transform: `translate(-50%,-50%) scale(${pop(t, a(2.05))}) rotate(-3deg)`, textAlign: "center" }}>
            <Big size={110} color="#fff" stroke={13}>LA LEY</Big>
            <Big size={158} color={C.yellow} stroke={16}>D'HONDT</Big>
            <div style={{ marginTop: 20, display: "inline-block", transform: `scale(${pop(t, a(3.7))})` }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.ink, background: C.mint, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}` }}>⏱ EN 40 SEGUNDOS</div>
            </div>
          </div>
        )}
        {title && t > a(4.3) && <Tag at={a(4.3)} x={540} y={1400} bg={PARTIES[3].c} size={50} rotate={3}>¿POR QUÉ UN 12% SACA 0?</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 2. ESPAÑA: 350 / 52 =================
const Spain: React.FC = () => {
  const a = useA("spain");
  const t = useSec();
  const n = Math.round(interpolate(t, [a(11.9), a(13.6)], [0, 50], clamp));
  const extra = t > a(16.1) ? (t > a(16.7) ? 2 : 1) : 0;
  const spread = lin(t, a(18.0), a(18.9));
  const seats = Math.round(interpolate(t, [a(9.4), a(10.6)], [0, 350], clamp));
  return (
    <AbsoluteFill>
      <Backdrop from="#B3122E" to="#33040E" seed={6} />
      <Camera dur={11} zoom={[1, 1.08]} punchAt={[a(9.6), a(11.9), a(18.8)]}>
        {t < a(11.7) ? (
          <div style={{ position: "absolute", left: 540, top: 1000, transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <Hemicycle size={900} filled={seats} color={C.yellow} />
            <Big size={170} color={C.yellow} stroke={16}>{seats}</Big>
            <Big size={60} color="#fff" stroke={9}>ESCAÑOS</Big>
          </div>
        ) : (
          <>
            <div style={{ position: "absolute", left: 90, top: 620, width: 900, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 + spread * 14 }}>
              {Array.from({ length: 52 }, (_, i) => {
                const on = i < 50 ? i < n : i - 50 < extra;
                const special = i >= 50;
                return (
                  <div key={i} style={{ width: 80, height: 80, borderRadius: 16, border: `6px solid ${C.ink}`, background: on ? (special ? C.mint : C.yellow) : "rgba(255,255,255,0.1)", transform: `scale(${on ? 1 : 0.85}) rotate(${spread * Math.sin(i * 7) * 10}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 19, color: C.ink }}>
                    {special && on ? (i === 50 ? "CEUTA" : "MEL.") : ""}
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 540, top: 1500 - 30, transform: `translate(-50%,-50%) scale(${pop(t, a(11.9))})` }}>
              <Big size={80} color="#fff" stroke={10}>{n + extra} CIRCUNSCRIPCIONES</Big>
            </div>
            {t > a(18.0) && <Tag at={a(18.0)} x={540} y={600} bg={C.mint} size={58} rotate={-3}>CADA UNA, POR SEPARADO</Tag>}
          </>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 3. FILTRO DEL 3% =================
const Filtro: React.FC = () => {
  const a = useA("filtro");
  const t = useSec();
  const bars = [
    { l: "A", v: 42, c: PARTIES[0].c },
    { l: "B", v: 30, c: PARTIES[1].c },
    { l: "C", v: 16, c: PARTIES[2].c },
    { l: "D", v: 12, c: PARTIES[3].c },
    { l: "E", v: 2, c: "#9AA3C7" },
  ];
  const kick = lin(t, a(25.1), a(25.7));
  const H = 9; // px por %
  return (
    <AbsoluteFill>
      <Backdrop from="#1FA36B" to="#063A26" seed={8} />
      <Camera dur={7} zoom={[1, 1.08]} punchAt={[a(22.8), a(25.1)]}>
        <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${pop(t, a(20.0))}) rotate(-2deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>PASO 1: EL FILTRO</div>
        </div>
        <div style={{ position: "absolute", left: 110, top: 760, width: 860, height: 620, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
          {bars.map((b, i) => {
            const k = lin(t, a(20.6) + i * 0.12, a(21.0) + i * 0.12);
            const out = b.l === "E" ? kick : 0;
            return (
              <div key={b.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 150, transform: `translate(${out * 500}px, ${-out * 300}px) rotate(${out * 120}deg)`, opacity: 1 - out }}>
                <Big size={46} color="#fff" stroke={7}>{b.v}%</Big>
                <div style={{ width: 120, height: Math.max(10, b.v * H * k), background: b.c, border: `7px solid ${C.ink}`, borderRadius: "18px 18px 0 0" }} />
                <Big size={56} color="#fff" stroke={8}>{b.l}</Big>
              </div>
            );
          })}
        </div>
        {/* línea del 3% */}
        {t > a(22.7) && (
          <div style={{ position: "absolute", left: 90, top: 760 + 620 - 3 * H - 72, width: 900, height: 0, borderTop: `8px dashed ${C.coral}`, opacity: lin(t, a(22.7), a(23.0)) }}>
            <div style={{ position: "absolute", left: 450, top: -560 + 72, transform: "translateX(-50%) rotate(3deg)", fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff", background: C.coral, border: `6px solid ${C.ink}`, borderRadius: 16, padding: "4px 22px", whiteSpace: "nowrap" }}>LÍNEA ROJA = 3%</div>
          </div>
        )}
        {t > a(25.1) && (
          <div style={{ position: "absolute", left: 760, top: 1440, transform: "translate(-50%,-50%)" }}>
            <Stamp text="FUERA" color={C.coral} k={lin(t, a(25.1), a(25.35))} rotate={-10} size={84} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 4. EL TRUCO: TABLA D'HONDT =================
const ranks: Record<string, number> = { "0-0": 1, "1-0": 2, "0-1": 3, "2-0": 4 };
const Truco: React.FC = () => {
  const a = useA("truco");
  const t = useSec();
  const colAt = [a(33.6), a(34.5), a(35.4)];
  const pickAt = [a(37.4), a(37.9), a(38.4), a(38.9)];
  const showTable = t > a(31.0);
  return (
    <AbsoluteFill>
      <Backdrop from="#7B2FF7" to="#1B0A3A" seed={10} />
      <Camera dur={14} zoom={[1, 1.06]} punchAt={[a(29.5), a(33.6), a(34.5), a(35.4), a(37.1)]}>
        <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%,-50%) scale(${pop(t, a(27.0))}) rotate(-2deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 36px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>
            PASO 2: {t > a(29.5) ? "4" : "?"} ESCAÑOS EN JUEGO
          </div>
        </div>
        {/* 4 escaños en juego */}
        <div style={{ position: "absolute", left: 0, width: 1080, top: 720, display: "flex", justifyContent: "center", gap: 18 }}>
          {[0, 1, 2, 3].map((i) => {
            const won = t > pickAt[i];
            const owner = [0, 1, 0, 2][i];
            return (
              <div key={i} style={{ transform: `scale(${pop(t, a(29.6) + i * 0.1) * (won ? 1 + 0.2 * Math.exp(-(t - pickAt[i]) * 5) : 1)})` }}>
                <Seat color={won ? PARTIES[owner].c : "rgba(255,255,255,0.18)"} size={110} label={won ? PARTIES[owner].id : ""} />
              </div>
            );
          })}
        </div>
        {showTable && (
          <div style={{ position: "absolute", left: 540, top: 1180, transform: `translate(-50%,-50%) scale(${pop(t, a(31.0))})` }}>
            <div style={{ background: "#fff", border: `9px solid ${C.ink}`, borderRadius: 32, boxShadow: `0 16px 0 ${C.ink}`, padding: "16px 18px", fontFamily: FONT }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px repeat(3, 210px)", gap: 8, alignItems: "center" }}>
                <div />
                {["÷1", "÷2", "÷3"].map((h, j) => (
                  <div key={h} style={{ textAlign: "center", fontWeight: 900, fontSize: 48, color: C.violet, opacity: t > colAt[j] - 0.1 ? 1 : 0.2 }}>{h}</div>
                ))}
                {PARTIES.map((p, i) => (
                  <React.Fragment key={p.id}>
                    <div style={{ background: p.c, border: `5px solid ${C.ink}`, borderRadius: 16, textAlign: "center", fontWeight: 900, fontSize: 50, color: C.ink, padding: "6px 0" }}>{p.id}</div>
                    {[0, 1, 2].map((j) => {
                      const on = t > colAt[j];
                      const r = ranks[`${i}-${j}`];
                      const picked = r && t > pickAt[r - 1];
                      const shown = on ? p.v / (j + 1) : 0;
                      const v = on ? interpolate(t, [colAt[j], colAt[j] + 0.4], [p.v, shown], clamp) : p.v;
                      return (
                        <div key={j} style={{ textAlign: "center", fontWeight: 900, fontSize: 44, color: picked ? C.ink : on ? "#333" : "#bbb", background: picked ? C.yellow : "transparent", border: picked ? `5px solid ${C.ink}` : "5px solid transparent", borderRadius: 14, padding: "8px 0", transform: `scale(${picked ? 1 + 0.15 * Math.exp(-(t - pickAt[r - 1]) * 5) : 1})`, fontVariantNumeric: "tabular-nums" }}>
                          {j === 0 || on ? fmt(j === 0 ? p.v : v) : "—"}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ textAlign: "center", fontWeight: 800, fontSize: 30, color: "#777", marginTop: 8 }}>votos · 100.000 en total</div>
            </div>
          </div>
        )}
        {t > a(37.1) && <Tag at={a(37.1)} x={540} y={1580 - 60} bg={C.yellow} size={50} rotate={2}>LOS 4 MÁS ALTOS = ESCAÑO</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 5. RESULTADO =================
const Result: React.FC = () => {
  const a = useA("result");
  const t = useSec();
  const rows = [
    { p: PARTIES[0], votes: 42, seats: 50, at: a(43.6), sAt: a(46.4) },
    { p: PARTIES[1], votes: 30, seats: 25, at: a(41.2), sAt: a(41.4) },
    { p: PARTIES[2], votes: 16, seats: 25, at: a(41.3), sAt: a(41.5) },
    { p: PARTIES[3], votes: 12, seats: 0, at: a(50.2), sAt: a(51.7) },
  ];
  return (
    <AbsoluteFill>
      <Backdrop from="#2E5BFF" to="#0A1240" seed={12} />
      <Camera dur={11} zoom={[1, 1.08]} punchAt={[a(46.4), a(51.7)]}>
        <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%,-50%) scale(${pop(t, a(41.0))}) rotate(-2deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}` }}>RESULTADO</div>
        </div>
        <div style={{ position: "absolute", left: 90, top: 740, width: 900, fontFamily: FONT }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr", gap: 14, alignItems: "center" }}>
            <div />
            <Big size={40} color="#fff" stroke={7}>VOTOS</Big>
            <Big size={40} color={C.yellow} stroke={7}>ESCAÑOS</Big>
            {rows.map((r) => {
              const hl = r.p.id === "A" ? t > a(43.6) : r.p.id === "D" ? t > a(48.6) : false;
              const vk = lin(t, a(41.2), a(41.8));
              const sk = t > r.sAt ? lin(t, r.sAt, r.sAt + 0.4) : 0;
              return (
                <React.Fragment key={r.p.id}>
                  <div style={{ background: r.p.c, border: `6px solid ${C.ink}`, borderRadius: 18, textAlign: "center", fontWeight: 900, fontSize: 60, color: C.ink, transform: `scale(${hl ? 1.1 : 1})` }}>{r.p.id}</div>
                  <div style={{ height: 80, background: "rgba(255,255,255,0.12)", borderRadius: 16, position: "relative", overflow: "hidden", border: `5px solid ${C.ink}` }}>
                    <div style={{ width: `${r.votes * 2 * vk}%`, height: "100%", background: r.p.c }} />
                    <div style={{ position: "absolute", left: 14, top: 8, fontWeight: 900, fontSize: 46, color: "#fff", WebkitTextStroke: `6px ${C.ink}`, paintOrder: "stroke fill" }}>{r.votes}%</div>
                  </div>
                  <div style={{ height: 80, background: "rgba(255,255,255,0.12)", borderRadius: 16, position: "relative", overflow: "hidden", border: `5px solid ${hl ? C.yellow : C.ink}` }}>
                    <div style={{ width: `${r.seats * 2 * sk}%`, height: "100%", background: r.p.c }} />
                    <div style={{ position: "absolute", left: 14, top: 8, fontWeight: 900, fontSize: 46, color: r.seats === 0 && t > r.sAt ? C.coral : "#fff", WebkitTextStroke: `6px ${C.ink}`, paintOrder: "stroke fill", opacity: t > r.sAt ? 1 : 0 }}>{r.seats}%</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {t > a(46.4) && t < a(48.6) && <Tag at={a(46.4)} x={540} y={1420} bg={PARTIES[0].c} size={60} rotate={-3}>42% VOTOS → LA MITAD</Tag>}
        {t > a(51.7) && (
          <div style={{ position: "absolute", left: 540, top: 1440, transform: "translate(-50%,-50%)" }}>
            <Stamp text="12% → 0 ESCAÑOS" color={C.coral} k={lin(t, a(51.7), a(51.95))} rotate={-6} size={70} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 6. PREMIA A LOS GRANDES =================
const Premia: React.FC = () => {
  const a = useA("premia");
  const t = useSec();
  const second = t > a(56.0);
  return (
    <AbsoluteFill>
      <Backdrop from="#FF8A3D" to="#6A1E0C" seed={14} />
      <Camera dur={8} zoom={[1, 1.08]} punchAt={[a(53.9), a(56.8)]}>
        {!second && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1300, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 60 }}>
            <div style={{ transform: `scale(${pop(t, a(53.0)) * (1 + Math.sin(t * 3) * 0.03)})`, transformOrigin: "50% 100%" }}>
              <Seat color={PARTIES[0].c} size={380} label="A" />
            </div>
            <div style={{ transform: `scale(${pop(t, a(53.3))})`, transformOrigin: "50% 100%" }}>
              <Seat color={PARTIES[3].c} size={130} label="D" />
            </div>
          </div>
        )}
        {!second && t > a(53.9) && <Tag at={a(53.9)} x={540} y={720} bg={C.yellow} size={64} rotate={-3}>PREMIA A LOS GRANDES</Tag>}
        {second && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: 680, display: "flex", justifyContent: "center", gap: 40 }}>
            {[
              { l: "PROVINCIA GRANDE", seats: 30, need: 0.18, c: C.mint },
              { l: "PROVINCIA PEQUEÑA", seats: 3, need: 0.85, c: C.coral },
            ].map((p, i) => (
              <div key={p.l} style={{ width: 440, background: "#fff", border: `9px solid ${C.ink}`, borderRadius: 32, boxShadow: `0 14px 0 ${C.ink}`, padding: 22, fontFamily: FONT, textAlign: "center", transform: `scale(${pop(t, a(56.2) + i * 0.3)})` }}>
                <div style={{ fontWeight: 900, fontSize: 36, color: C.ink }}>{p.l}</div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, margin: "14px 0", minHeight: 170 }}>
                  {Array.from({ length: p.seats }, (_, k) => (
                    <div key={k} style={{ width: i ? 60 : 28, height: i ? 60 : 28, borderRadius: 8, background: C.yellow, border: `4px solid ${C.ink}` }} />
                  ))}
                </div>
                <div style={{ fontWeight: 800, fontSize: 30, color: "#555" }}>votos para entrar</div>
                <div style={{ height: 300, width: 90, margin: "10px auto 0", border: `7px solid ${C.ink}`, borderRadius: 45, background: "#eee", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${p.need * 100 * lin(t, a(58.3), a(59.2))}%`, background: p.c }} />
                </div>
                <div style={{ fontWeight: 900, fontSize: 46, color: p.c, marginTop: 8, WebkitTextStroke: `2px ${C.ink}` }}>{i ? "MUCHOS" : "POCOS"}</div>
              </div>
            ))}
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 7. CONSEJO =================
const Tip: React.FC = () => {
  const a = useA("tip");
  const t = useSec();
  const scan = Math.sin(t * 2.2);
  return (
    <AbsoluteFill>
      <Backdrop from="#1FA36B" to="#063A26" seed={16} />
      <Camera dur={7} zoom={[1, 1.08]} punchAt={[a(60.9), a(65.5)]}>
        <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${pop(t, a(60.9))}) rotate(-3deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 66, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 44px", boxShadow: `0 10px 0 ${C.ink}` }}>💡 CONSEJO</div>
        </div>
        <div style={{ position: "absolute", left: 90, top: 760, width: 900, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          {Array.from({ length: 30 }, (_, i) => {
            const me = i === 17;
            return (
              <div key={i} style={{ width: 120, height: 90, borderRadius: 16, border: `6px solid ${C.ink}`, background: me ? C.yellow : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.ink, transform: `scale(${me && t > a(63.8) ? 1.25 : 1})`, zIndex: me ? 2 : 1 }}>
                {me ? (t > a(64.9) ? "¿N?" : "TÚ") : ""}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 540 + scan * 260, top: 960, transform: `translate(-50%,-50%) scale(${pop(t, a(62.1))})` }}>
          <svg width={220} height={220} viewBox="0 0 200 200">
            <circle cx={80} cy={80} r={56} fill="rgba(255,255,255,0.25)" stroke={C.ink} strokeWidth={14} />
            <path d="M122 122 L180 180" stroke={C.ink} strokeWidth={26} strokeLinecap="round" />
            <path d="M122 122 L180 180" stroke={P.gold} strokeWidth={12} strokeLinecap="round" />
          </svg>
        </div>
        {t > a(65.4) && <Tag at={a(65.4)} x={540} y={1440} bg="#fff" size={42} rotate={2}>+ ESCAÑOS = + PROPORCIONAL</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 8. CTA =================
const CTA: React.FC = () => {
  const a = useA("cta");
  const t = useSec();
  const follow = t >= a(71.8);
  const pressed = t > a(73.2);
  return (
    <AbsoluteFill>
      <Backdrop from="#2E5BFF" to="#0A1240" seed={4} />
      <Camera dur={8} zoom={[1, 1.1]} punchAt={[a(70.5), a(70.8), a(71.8)]}>
        {!follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) scale(${pop(t, a(67.7))}) rotate(-2deg)` }}>
              <Big size={96} color="#fff" stroke={12}>¿LO SABÍAS?</Big>
            </div>
            <div style={{ position: "absolute", left: 0, width: 1080, top: 1060, display: "flex", justifyContent: "center", gap: 60 }}>
              {[["SÍ", C.mint, a(70.5)], ["NO", C.coral, a(70.8)]].map(([l, c, at]) => (
                <div key={l as string} style={{ transform: `scale(${pop(t, (at as number) - 0.3) * (t > (at as number) ? 1 + 0.12 * Math.exp(-(t - (at as number)) * 5) : 1)}) rotate(${Math.sin(t * 4) * 3}deg)` }}>
                  <div style={{ width: 300, height: 220, background: c as string, border: `9px solid ${C.ink}`, borderRadius: 36, boxShadow: `0 14px 0 ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.ink }}>{l as string}</div>
                </div>
              ))}
            </div>
            {t > a(70.0) && (
              <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, a(70.0))})` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 30, padding: "12px 34px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>💬 COMÉNTALO</div>
              </div>
            )}
          </>
        )}
        {follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${pop(t, a(71.8))})` }}>
              <EyeMascot size={360} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 1250, transform: `translate(-50%,-50%) scale(${pop(t, a(72.1))}) rotate(-3deg)` }}>
              <Big size={110} color={C.yellow} stroke={13}>OJO AL DATO</Big>
            </div>
            <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, a(72.4))})` }}>
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

const SFX: [number, string, number][] = [
  [0, "whoosh", 0.4], [0.1, "rise", 0.3], [1.1, "pop", 0.4], [2.05, "whoosh", 0.4], [2.8, "boom", 0.55], [3.7, "ding", 0.45], [4.3, "pop", 0.4],
  [8.5, "whoosh", 0.4], [9.4, "rise", 0.3], [10.6, "ding", 0.4], [11.9, "tick", 0.5], [16.1, "pop", 0.4], [16.7, "pop", 0.4], [18.0, "whoosh", 0.35],
  [19.6, "whoosh", 0.4], [20.0, "pop", 0.4], [22.7, "tick", 0.5], [25.1, "boom", 0.55],
  [26.2, "whoosh", 0.4], [27.0, "pop", 0.4], [29.6, "pop", 0.4], [31.0, "whoosh", 0.35], [33.6, "tick", 0.5], [34.5, "tick", 0.5], [35.4, "tick", 0.5],
  [37.4, "ding", 0.35], [37.9, "ding", 0.35], [38.4, "ding", 0.35], [38.9, "ding", 0.4],
  [40.9, "whoosh", 0.4], [46.4, "cash", 0.4], [51.7, "boom", 0.6], [51.75, "ding", 0.4],
  [52.6, "whoosh", 0.4], [53.9, "pop", 0.4], [56.2, "whoosh", 0.35], [58.3, "rise", 0.3],
  [60.7, "whoosh", 0.4], [60.9, "pop", 0.4], [63.8, "ding", 0.4], [65.4, "pop", 0.4],
  [67.5, "whoosh", 0.4], [70.5, "pop", 0.45], [70.8, "pop", 0.45], [71.8, "whoosh", 0.4], [73.2, "ding", 0.5],
];

export const Video04: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene k="hook"><Hook /></Scene>
      <Scene k="spain"><SceneIn type="up"><Spain /></SceneIn></Scene>
      <Scene k="filtro"><SceneIn type="left"><Filtro /></SceneIn></Scene>
      <Scene k="truco"><SceneIn type="spin"><Truco /></SceneIn></Scene>
      <Scene k="result"><SceneIn type="up"><Result /></SceneIn></Scene>
      <Scene k="premia"><SceneIn type="left"><Premia /></SceneIn></Scene>
      <Scene k="tip"><SceneIn type="zoom"><Tip /></SceneIn></Scene>
      <Scene k="cta"><SceneIn type="spin"><CTA /></SceneIn></Scene>

      <Stopwatch />
      <Captions words={words} keywords={KEYWORDS} top={300} />

      <Audio src={staticFile("v04/voz.mp3")} />
      <Audio src={staticFile("v04/musica.mp3")} volume={(f) => interpolate(f / fps, [0, 0.8, m(73.0), m(73.8), V04_DURATION], [0, 0.12, 0.12, 0.28, 0], clamp)} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.round(m(at) * fps)} durationInFrames={Math.round(1.3 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`v04/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
