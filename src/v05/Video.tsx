import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Backdrop, Big, C, Camera, FONT, SceneIn, Tag, clamp, lin, makeMapper, useSec } from "../lib/core";
import { EyeMascot } from "../lib/chars";
import { Captions, Word } from "../lib/Captions";
import { Stamp } from "../lib/politics";
import { CarTop, DataChip, MP, MapBase, MapPhone, Mask, Pin, PhoneCart, Speedo, TrafficRoad, Walker, YouPuck } from "../lib/maps";
import wordsJson from "./words.json";
import timemap from "./timemap.json";

const words = wordsJson as Word[];
// v2: se eliminaron de la voz original los bloques 38,9–56,4 s (historial + DeepMind).
// Los tiempos siguen escritos en segundos de la voz original v1; sh() salta el hueco.
const base = makeMapper(timemap as [number, number][]);
const CUT_A = 38.9, CUT_B = 56.4;
const sh = (t: number) => (t < CUT_A ? t : t >= CUT_B ? t - (CUT_B - CUT_A) : CUT_A);
const m = (t: number) => base(sh(t));
const removed = (t: number) => t >= CUT_A && t < CUT_B;
const ORIG_END = 86.5;
export const V05_DURATION = Math.round(m(ORIG_END) * 30) / 30;

const KEYWORDS = [
  "Google", "Maps", "atasco", "empieza?", "bolsillo", "móvil", "todos", "ubicación", "anónimos", "velocidad", "miles", "tramo",
  "100", "verde", "10", "roja", "exactamente", "frenan", "presente", "día", "hora", "predice", "llegues", "inteligencia",
  "artificial", "DeepMind", "50%", "precisas", "loco", "2020", "99", "móviles", "carrito", "vacía", "Berlín", "consejo",
  "rojo", "alternativa", "minutos", "ahorras", "comentarios", "sígueme", "apps",
];

const S0 = {
  hook: [0, 7.7],
  phones: [7.7, 12.8],
  datos: [12.8, 20.4],
  tramos: [20.4, 24.1],
  colores: [24.1, 32.8],
  frenan: [32.8, 38.9],
  berlin: [56.4, 67.6],
  tip: [67.6, 76.3],
  cta: [76.3, ORIG_END],
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

// ---------- Carretera principal (curva en S, de abajo arriba) ----------
type P2 = [number, number];
const ROAD: [P2, P2, P2, P2][] = [
  [[560, 2000], [560, 1650], [330, 1500], [420, 1200]],
  [[420, 1200], [510, 900], [720, 850], [640, 560]],
  [[640, 560], [580, 360], [520, 300], [540, 0]],
];
const ROAD_D = `M${ROAD[0][0].join(" ")} ` + ROAD.map((s) => `C${s[1].join(" ")} ${s[2].join(" ")} ${s[3].join(" ")}`).join(" ");
const bez = (s: [P2, P2, P2, P2], u: number): P2 => {
  const v = 1 - u;
  return [0, 1].map((k) => v * v * v * s[0][k] + 3 * v * v * u * s[1][k] + 3 * v * u * u * s[2][k] + u * u * u * s[3][k]) as P2;
};
const SAMPLES = (() => {
  const pts: P2[] = [];
  ROAD.forEach((s) => {
    for (let i = 0; i < 100; i++) pts.push(bez(s, i / 100));
  });
  pts.push(ROAD[2][3]);
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, len, total: len[len.length - 1] };
})();
const at = (f: number): { p: P2; ang: number } => {
  const L = Math.max(0, Math.min(1, f)) * SAMPLES.total;
  let i = SAMPLES.len.findIndex((l) => l >= L);
  if (i < 1) i = 1;
  const a = SAMPLES.pts[i - 1], b = SAMPLES.pts[i];
  return { p: b, ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90 };
};
const JAM = 0.55; // donde empieza el atasco

const RoadMap: React.FC<{ jam?: number; reveal?: number; cars?: number; carSpeed?: number; ping?: boolean; children?: React.ReactNode }> = ({ jam = JAM, reveal = 1, cars = 0, carSpeed = 1, ping = false, children }) => {
  const t = useSec();
  return (
    <MapBase>
      <TrafficRoad d={ROAD_D} segs={[[0, jam, MP.green], [jam, Math.min(1, jam + 0.06), MP.orange], [Math.min(1, jam + 0.06), 1, MP.red]]} reveal={reveal} />
      {Array.from({ length: cars }, (_, i) => {
        // antes del atasco van rápido; después, casi parados y apelotonados
        const base = (i / cars + t * 0.05 * carSpeed) % 1;
        const f = base < jam ? base : jam + (base - jam) * 0.35;
        const { p, ang } = at(f);
        const slow = f >= jam - 0.01;
        return (
          <div key={i} style={{ position: "absolute", left: p[0], top: p[1], transform: `translate(-50%,-50%) rotate(${ang}deg)` }}>
            <CarTop size={34} color={["#5B8CFF", "#FFB020", "#9B5BFF", "#20C3A0", "#FF6B8A"][i % 5]} brake={slow} ping={ping} phase={i * 0.37} />
          </div>
        );
      })}
      {children}
    </MapBase>
  );
};

// ================= 1. HOOK =================
const Hook: React.FC = () => {
  const a = useA("hook");
  const t = useSec();
  const you = at(0.18 + t * 0.012);
  const jamP = at(JAM).p;
  const pinK = pop(t, a(4.0));
  const phone = t > a(6.6);
  return (
    <AbsoluteFill>
      <Camera dur={7} zoom={[1.12, 1.2]} punchAt={[0, a(4.0), a(6.8)]}>
        <RoadMap cars={14} carSpeed={1.2}>
          <div style={{ position: "absolute", left: you.p[0], top: you.p[1], transform: `translate(-50%,-50%)` }}>
            <YouPuck size={70} angle={you.ang} />
          </div>
          {/* anillo pulsante en el punto exacto donde empieza el atasco */}
          {[0, 1].map((i) => {
            const p = ((t * 1.2 + i / 2) % 1);
            return <div key={i} style={{ position: "absolute", left: jamP[0], top: jamP[1], width: 80 + p * 220, height: 80 + p * 220, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `8px solid ${MP.red}`, opacity: 1 - p }} />;
          })}
          {t > a(4.0) && (
            <div style={{ position: "absolute", left: jamP[0], top: jamP[1], transform: `translate(-50%,-100%) translateY(${(1 - pinK) * -300}px)` }}>
              <Pin size={130} label="?" />
            </div>
          )}
        </RoadMap>
        {!phone && t < a(4.0) && (
          <div style={{ position: "absolute", left: 800, top: 1250, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 5) * 8}deg)` }}>
            <Big size={200} color={C.yellow} stroke={16}>?</Big>
          </div>
        )}
      </Camera>
      {phone && (
        <AbsoluteFill style={{ background: "rgba(20,30,60,0.55)" }}>
          <div style={{ position: "absolute", left: 540, top: 1100, transform: `translate(-50%,-50%) translateY(${(1 - pop(t, a(6.6))) * 700}px) rotate(-6deg)` }}>
            <MapPhone size={330}>
              <div style={{ position: "absolute", left: "50%", top: "45%", transform: "translate(-50%,-50%)" }}><YouPuck size={60} /></div>
            </MapPhone>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ================= 2. TODOS LOS MÓVILES =================
const Phones: React.FC = () => {
  const a = useA("phones");
  const t = useSec();
  const zoom = interpolate(t, [a(9.0), a(10.2)], [2.4, 1], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${at(0.3).p[0]}px ${at(0.3).p[1]}px` }}>
        <RoadMap cars={22} ping carSpeed={1} />
      </div>
      {t < a(9.2) && (
        <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${pop(t, a(7.8))})` }}>
          <MapPhone size={300}>
            <div style={{ position: "absolute", left: "50%", top: "45%", transform: "translate(-50%,-50%)" }}><YouPuck size={55} /></div>
          </MapPhone>
        </div>
      )}
      {t > a(9.6) && <Tag at={a(9.6)} x={540} y={680} bg="#fff" size={58} rotate={-3}>📱 CADA COCHE = 1 MÓVIL</Tag>}
    </AbsoluteFill>
  );
};

// ================= 3. DATOS ANÓNIMOS =================
const Datos: React.FC = () => {
  const a = useA("datos");
  const t = useSec();
  const on = t > a(13.6);
  const speed = Math.round(87 + Math.sin(t * 3) * 4);
  return (
    <AbsoluteFill>
      <Backdrop from="#2F6BFF" to="#0B1A4A" seed={21} />
      <Camera dur={8} zoom={[1, 1.08]} punchAt={[a(13.6), a(16.3), a(17.7), a(18.9)]}>
        <div style={{ position: "absolute", left: 300, top: 1080, transform: `translate(-50%,-50%) scale(${pop(t, a(12.9)) * 0.85}) rotate(-4deg)` }}>
          <MapPhone size={330} pings={on}>
            <div style={{ position: "absolute", left: 30, right: 30, top: 120, background: "#fff", border: `5px solid ${C.ink}`, borderRadius: 24, padding: "18px 16px", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.ink, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              UBICACIÓN
              <div style={{ width: 90, height: 50, borderRadius: 25, background: on ? MP.green : "#ccc", border: `4px solid ${C.ink}`, position: "relative" }}>
                <div style={{ position: "absolute", top: 3, left: on ? 42 : 4, width: 36, height: 36, borderRadius: 18, background: "#fff", border: `4px solid ${C.ink}` }} />
              </div>
            </div>
          </MapPhone>
        </div>
        {t > a(16.3) && (
          <div style={{ position: "absolute", left: 790, top: 760, transform: `translate(-50%,-50%) scale(${pop(t, a(16.3))}) rotate(5deg)`, textAlign: "center" }}>
            <Mask size={240} />
            <div><Big size={54} color="#fff" stroke={8}>ANÓNIMO</Big></div>
          </div>
        )}
        {t > a(17.7) && (
          <div style={{ position: "absolute", left: 760, top: 1060, transform: `translate(-50%,-50%) scale(${pop(t, a(17.7)) * 0.8})` }}>
            <DataChip icon="📍" text="POSICIÓN" />
          </div>
        )}
        {t > a(18.9) && (
          <div style={{ position: "absolute", left: 760, top: 1220, transform: `translate(-50%,-50%) scale(${pop(t, a(18.9)) * 0.8})` }}>
            <DataChip icon="⚡" text={`${speed} KM/H`} color={C.yellow} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 4. TRAMO A TRAMO =================
const Tramos: React.FC = () => {
  const a = useA("tramos");
  const t = useSec();
  const n = Math.round(interpolate(t, [a(21.5), a(22.4)], [0, 4000], clamp));
  return (
    <AbsoluteFill>
      <Camera dur={4} zoom={[1.05, 1.12]} punchAt={[a(22.9)]}>
        <RoadMap cars={30} ping carSpeed={0.9}>
          {t > a(22.9) &&
            [0.12, 0.3, 0.48, 0.66, 0.84].map((f, i) => {
              const { p } = at(f);
              return (
                <div key={i} style={{ position: "absolute", left: p[0] + 90, top: p[1], transform: `translate(-50%,-50%) scale(${pop(t, a(22.9) + i * 0.1)})` }}>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: C.ink, borderRadius: 14, padding: "4px 14px", border: "4px solid #fff" }}>TRAMO {i + 1}</div>
                </div>
              );
            })}
        </RoadMap>
      </Camera>
      <div style={{ position: "absolute", left: 540, top: 660, transform: `translate(-50%,-50%) scale(${pop(t, a(21.5))}) rotate(-3deg)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 40px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>+{n.toLocaleString("de-DE")} COCHES</div>
      </div>
    </AbsoluteFill>
  );
};

// ================= 5. VERDE / ROJO =================
const Colores: React.FC = () => {
  const a = useA("colores");
  const t = useSec();
  const v2 = interpolate(t, [a(28.7), a(30.6)], [100, 10], clamp);
  const red = t > a(31.5);
  return (
    <AbsoluteFill>
      <Backdrop from="#16C3B0" to="#053B4A" seed={31} />
      <Camera dur={9} zoom={[1, 1.08]} punchAt={[a(25.6), a(26.7), a(30.5), a(31.8)]}>
        {[
          { l: "TRAMO 1", v: interpolate(t, [a(24.4), a(25.8)], [0, 100], clamp), col: t > a(26.6) ? MP.green : "#ccc", at: a(24.3) },
          { l: "TRAMO 2", v: t > a(27.7) ? v2 : 0, col: red ? MP.red : t > a(27.7) ? MP.orange : "#ccc", at: a(27.7) },
        ].map((s, i) => (
          <div key={s.l} style={{ position: "absolute", left: 540, top: 820 + i * 420, transform: `translate(-50%,-50%) scale(${pop(t, s.at)})` }}>
            <div style={{ width: 880, background: "#fff", border: `8px solid ${C.ink}`, borderRadius: 34, boxShadow: `0 14px 0 ${C.ink}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 24, fontFamily: FONT }}>
              <Speedo v={s.v} size={240} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 44, color: C.ink }}>{s.l}</div>
                <div style={{ height: 50, borderRadius: 25, background: s.col, border: `6px solid ${C.ink}`, marginTop: 14 }} />
                <div style={{ fontWeight: 900, fontSize: 40, color: s.col === "#ccc" ? "#999" : s.col, marginTop: 10 }}>{s.col === MP.green ? "LÍNEA VERDE" : s.col === MP.red ? "LÍNEA ROJA" : "…"}</div>
              </div>
            </div>
          </div>
        ))}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 6. DONDE LOS MÓVILES FRENAN =================
const Frenan: React.FC = () => {
  const a = useA("frenan");
  const t = useSec();
  const jamP = at(JAM).p;
  const z = interpolate(t, [0, a(35.0)], [1.1, 1.9], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${jamP[0]}px ${jamP[1]}px` }}>
        <RoadMap cars={34} ping carSpeed={1}>
          {t > a(35.2) && (
            <div style={{ position: "absolute", left: jamP[0], top: jamP[1], transform: `translate(-50%,-100%) translateY(${(1 - pop(t, a(35.2))) * -300}px) scale(0.6)` }}>
              <Pin size={130} />
            </div>
          )}
        </RoadMap>
      </div>
      {t > a(35.4) && <Tag at={a(35.4)} x={540} y={680} bg={MP.red} color="#fff" size={62} rotate={-3}>📍 AQUÍ EMPIEZA</Tag>}
      {t > a(37.6) && <Tag at={a(37.6)} x={540} y={1420} bg={C.yellow} size={56} rotate={2}>DONDE LOS MÓVILES FRENAN</Tag>}
    </AbsoluteFill>
  );
};

// ================= 9. BERLÍN: 99 MÓVILES =================
const Berlin: React.FC = () => {
  const a = useA("berlin");
  const t = useSec();
  const mapView = t > a(64.3);
  const walk = interpolate(t, [a(59.6), a(64.3)], [-300, 700], clamp);
  const n = Math.round(interpolate(t, [a(60.4), a(61.1)], [0, 99], clamp));
  return (
    <AbsoluteFill>
      {!mapView ? (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #9ED3F5 0%, #DDF1FF 55%, #B8C2CC 55.2%, #8E98A3 100%)" }}>
          {/* edificios */}
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i} transform={`translate(${i * 140 - 20 - ((t * 20) % 140)} 0)`}>
                <rect x={0} y={560 + (i % 3) * 60} width={130} height={500 - (i % 3) * 60} fill={["#F2D7B6", "#E6B8A2", "#CFD8E3"][i % 3]} stroke={C.ink} strokeWidth={6} />
                {Array.from({ length: 6 }, (_, k) => (
                  <rect key={k} x={20 + (k % 2) * 55} y={600 + (i % 3) * 60 + Math.floor(k / 2) * 110} width={36} height={60} fill="#7FB8E6" stroke={C.ink} strokeWidth={4} />
                ))}
              </g>
            ))}
            <rect x={0} y={1180} width={1080} height={10} fill="#fff" opacity={0.6} />
            {Array.from({ length: 6 }, (_, i) => (
              <rect key={i} x={i * 220 - ((t * 80) % 220)} y={1300} width={120} height={14} fill="#fff" />
            ))}
          </svg>
          {t < a(59.6) && (
            <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%,-50%) scale(${pop(t, a(56.8))}) rotate(-3deg)`, textAlign: "center" }}>
              <Big size={88} color={C.coral} stroke={11}>EL DATO MÁS LOCO</Big>
            </div>
          )}
          {t > a(58.4) && (
            <div style={{ position: "absolute", left: 230, top: 900, transform: `translate(-50%,-50%) scale(${pop(t, a(58.4)) * 0.6}) rotate(-5deg)` }}>
              <div style={{ width: 300, background: "#fff", border: `8px solid ${C.ink}`, borderRadius: 26, overflow: "hidden", textAlign: "center", fontFamily: FONT, boxShadow: `0 12px 0 ${C.ink}` }}>
                <div style={{ background: C.coral, color: "#fff", fontWeight: 900, fontSize: 40, padding: "8px 0" }}>BERLÍN</div>
                <div style={{ fontWeight: 900, fontSize: 96, color: C.ink }}>2020</div>
              </div>
            </div>
          )}
          {t > a(59.6) && (
            <div style={{ position: "absolute", left: walk, top: 1260, transform: "translate(-50%,-100%)", display: "flex", alignItems: "flex-end" }}>
              <PhoneCart size={420} />
              <div style={{ marginLeft: -20 }}><Walker size={200} /></div>
            </div>
          )}
          {t > a(60.4) && (
            <div style={{ position: "absolute", left: 800, top: 760, transform: `translate(-50%,-50%) scale(${pop(t, a(60.4))}) rotate(4deg)`, textAlign: "center" }}>
              <Big size={150} color={C.yellow} stroke={15}>{n}</Big>
              <Big size={54} color="#fff" stroke={8}>MÓVILES</Big>
            </div>
          )}
          {t > a(62.8) && <Tag at={a(62.8)} x={540} y={1460} bg="#fff" size={54} rotate={-2}>CALLE VACÍA 🚫🚗</Tag>}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          <Camera dur={3} zoom={[1.1, 1.2]} punchAt={[a(66.4)]}>
            <MapBase>
              <TrafficRoad d="M-50 1100 C300 1080 700 1140 1130 1100" segs={[[0, 1, t > a(65.3) ? MP.dark : MP.green]]} width={70} />
              <div style={{ position: "absolute", left: interpolate(t, [a(64.3), a(67.6)], [200, 760], clamp), top: 1100, transform: "translate(-50%,-50%)" }}>
                <div style={{ width: 60, height: 60, borderRadius: 30, background: MP.you, border: `6px solid #fff`, boxShadow: `0 0 0 6px ${MP.you}55` }} />
              </div>
            </MapBase>
          </Camera>
          {t > a(66.4) && (
            <div style={{ position: "absolute", left: 540, top: 1350, transform: "translate(-50%,-50%)" }}>
              <Stamp text="ATASCO FALSO" color={MP.red} k={lin(t, a(66.4), a(66.65))} rotate={-8} size={84} />
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ================= 10. CONSEJO =================
const ALT_D = "M560 2000 C560 1700 900 1500 900 1100 C900 700 700 500 540 0";
const Tip: React.FC = () => {
  const a = useA("tip");
  const t = useSec();
  const alt = t > a(71.0);
  return (
    <AbsoluteFill>
      <Camera dur={9} zoom={[1, 1.06]} punchAt={[a(68.1), a(71.4), a(75.3)]}>
        <MapBase>
          <TrafficRoad d={ROAD_D} segs={[[0, 0.3, MP.green], [0.3, 1, t > a(69.8) ? MP.red : MP.green]]} />
          {alt && <TrafficRoad d={ALT_D} segs={[[0, 1, MP.you]]} width={40} reveal={lin(t, a(71.0), a(72.2))} />}
          <div style={{ position: "absolute", left: at(0.12).p[0], top: at(0.12).p[1], transform: "translate(-50%,-50%)" }}>
            <YouPuck size={70} angle={at(0.12).ang} />
          </div>
        </MapBase>
      </Camera>
      <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${pop(t, a(67.9))}) rotate(-3deg)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 66, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 44px", boxShadow: `0 10px 0 ${C.ink}` }}>💡 CONSEJO</div>
      </div>
      {alt && <Tag at={a(71.6)} x={810} y={980} bg={MP.you} color="#fff" size={46} rotate={4}>RUTA ALTERNATIVA</Tag>}
      {t > a(74.3) && <Tag at={a(74.3)} x={680} y={1150} bg={MP.green} color="#fff" size={46} rotate={-3}>⏱ AHORRAS MINUTOS</Tag>}
    </AbsoluteFill>
  );
};

// ================= 11. CTA =================
const CTA: React.FC = () => {
  const a = useA("cta");
  const t = useSec();
  const follow = t >= a(80.9);
  const pressed = t > a(82.3);
  return (
    <AbsoluteFill>
      <Backdrop from="#2F6BFF" to="#0B1A4A" seed={61} />
      <Camera dur={10} zoom={[1, 1.1]} punchAt={[a(79.6), a(80.9)]}>
        {!follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 1000, transform: `translate(-50%,-50%) scale(${pop(t, a(76.5))})` }}>
              <Pin size={260} color={MP.red} label="?" />
            </div>
            {t > a(79.0) && (
              <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, a(79.0))}) rotate(${Math.sin(t * 6) * 4}deg)` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 30, padding: "12px 34px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>💬 CUÉNTAMELO</div>
              </div>
            )}
          </>
        )}
        {follow && (
          <>
            <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${pop(t, a(80.9))})` }}>
              <EyeMascot size={360} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 1250, transform: `translate(-50%,-50%) scale(${pop(t, a(81.2))}) rotate(-3deg)` }}>
              <Big size={110} color={C.yellow} stroke={13}>OJO AL DATO</Big>
            </div>
            <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, a(81.5))})` }}>
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
  [0, "brake", 0.35], [0.1, "rise", 0.25], [4.0, "pop", 0.5], [4.3, "ping", 0.45], [6.6, "whoosh", 0.4],
  [7.7, "whoosh", 0.4], [8.3, "ping", 0.4], [9.6, "pop", 0.4], [10.3, "ping", 0.3],
  [12.8, "whoosh", 0.4], [13.6, "tick", 0.5], [16.3, "pop", 0.45], [17.7, "ping", 0.4], [18.9, "ping", 0.4],
  [20.4, "whoosh", 0.4], [21.5, "rise", 0.3], [22.9, "tick", 0.45],
  [24.1, "whoosh", 0.4], [26.6, "ding", 0.4], [28.7, "brake", 0.45], [31.5, "boom", 0.5],
  [32.8, "whoosh", 0.4], [35.2, "pop", 0.5], [35.4, "ding", 0.35], [37.6, "brake", 0.4],
  [39.0, "whoosh", 0.4], [41.1, "pop", 0.4], [43.8, "tick", 0.5], [45.4, "rise", 0.3], [46.6, "pop", 0.4],
  [48.3, "whoosh", 0.4], [50.7, "pop", 0.4], [54.3, "ding", 0.5],
  [56.6, "whoosh", 0.4], [56.8, "boom", 0.4], [58.4, "pop", 0.4], [60.4, "rise", 0.3], [62.8, "pop", 0.4], [64.3, "whoosh", 0.4], [66.4, "boom", 0.6],
  [67.6, "whoosh", 0.4], [67.9, "pop", 0.4], [69.8, "brake", 0.35], [71.6, "ding", 0.4], [74.3, "ding", 0.45],
  [76.3, "whoosh", 0.4], [79.0, "pop", 0.4], [80.9, "whoosh", 0.4], [82.3, "ding", 0.5],
];

export const Video05: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene k="hook"><Hook /></Scene>
      <Scene k="phones"><SceneIn type="zoom"><Phones /></SceneIn></Scene>
      <Scene k="datos"><SceneIn type="up"><Datos /></SceneIn></Scene>
      <Scene k="tramos"><SceneIn type="left"><Tramos /></SceneIn></Scene>
      <Scene k="colores"><SceneIn type="spin"><Colores /></SceneIn></Scene>
      <Scene k="frenan"><SceneIn type="zoom"><Frenan /></SceneIn></Scene>
      <Scene k="berlin"><SceneIn type="zoom"><Berlin /></SceneIn></Scene>
      <Scene k="tip"><SceneIn type="up"><Tip /></SceneIn></Scene>
      <Scene k="cta"><SceneIn type="spin"><CTA /></SceneIn></Scene>

      <Captions words={words} keywords={KEYWORDS} top={300} />

      <Audio src={staticFile("v05/voz.mp3")} />
      <Audio src={staticFile("v05/musica.mp3")} volume={(f) => interpolate(f / fps, [0, 0.8, m(84.5), m(85.2), V05_DURATION], [0, 0.12, 0.12, 0.28, 0], clamp)} />
      {SFX.filter(([t0]) => !removed(t0)).map(([t0, name, vol], i) => (
        <Sequence key={i} from={Math.round(m(t0) * fps)} durationInFrames={Math.round(1.3 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`v05/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
