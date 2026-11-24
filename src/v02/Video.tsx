import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Big, C, Camera, FONT, SceneIn, Tag, clamp, lin, makeMapper, usePop, useSec } from "../lib/core";
import { EyeMascot } from "../lib/chars";
import { Captions, Word } from "../lib/Captions";
import {
  ArmyTruck, Barrier, Bars, ClueIcon, Cop, Cuffs, Heli, N, NeonCity, PeninsulaMap, Phone, SportsCar, StarsHUD, SwatVan, Tank, Tomb, Trophy,
} from "../lib/gta";
import wordsJson from "./words.json";
import timemap from "./timemap.json";

const words = wordsJson as Word[];
// Los tiempos se escriben en segundos de la voz ORIGINAL; m() los pasa a la voz recortada.
const m = makeMapper(timemap as [number, number][]);
const ORIG_END = 77.4;
export const V02_DURATION = Math.round(m(ORIG_END) * 30) / 30;

const KEYWORDS = [
  "6", "estrellas", "GTA", "nunca", "poli", "SWAT", "barreras", "helicópteros", "5", "ejército", "sexta", "regala", "truco",
  "tanque", "militar", "Mile", "Zero", "aguantar", "10", "15", "minutos", "escapando", "Leonida", "caliente", "escondite",
  "rastreador", "van", "finales", "detienen", "matan", "consejo", "iconos", "rojos", "delata", "ropa", "coche", "cámbialos",
  "fácil", "récord", "condena", "amigo", "comentarios", "sígueme", "dato",
];

const S0 = {
  hook: [0, 5.1],
  esc: [5.1, 14.4],
  army: [14.4, 17.2],
  tank: [17.2, 24.7],
  timer: [24.7, 33.0],
  sixth: [33.0, 35.6],
  map: [35.6, 43.7],
  ends: [43.7, 51.0],
  tip: [51.0, 62.6],
  verdict: [62.6, 66.6],
  cta: [66.6, ORIG_END],
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
/** a(x): tiempo original absoluto -> tiempo relativo dentro de la escena k */
const useA = (k: K) => (x: number) => m(x) - S[k][0];
const pop = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  return t < at ? 0 : 1 - Math.exp(-x * 9) * Math.cos(x * 18);
};
const HUD_Y = 650;
const Hud: React.FC<React.ComponentProps<typeof StarsHUD> & { y?: number; scale?: number }> = ({ y = HUD_Y, scale = 1, ...p }) => (
  <div style={{ position: "absolute", left: 0, width: 1080, top: y, transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
    <StarsHUD {...p} />
  </div>
);
const CarOnRoad: React.FC<{ y?: number; size?: number }> = ({ y = 1180, size = 560 }) => {
  const t = useSec();
  return (
    <div style={{ position: "absolute", left: 540 + Math.sin(t * 1.6) * 90, top: y, transform: `translate(-50%,-50%) rotate(${Math.cos(t * 1.6) * 3}deg)` }}>
      <SportsCar size={size} />
    </div>
  );
};

// ================= 1. HOOK =================
const Hook: React.FC = () => {
  const a = useA("hook");
  const t = useSec();
  const count = t < a(1.0) ? 0 : Math.min(6, Math.floor((t - a(1.0)) / 0.1) + 1);
  const locked = t >= a(3.9);
  return (
    <AbsoluteFill>
      <NeonCity sirens speed={1.6} />
      <Camera dur={4} zoom={[1.08, 1.16]} punchAt={[a(1.0), a(3.9)]}>
        <CarOnRoad />
        <Hud count={count} locked={locked} changedAt={a(1.0)} scale={locked ? 1.05 : 1} />
        {locked && <Tag at={a(4.3)} x={540} y={900} bg={N.red} color="#fff" size={64} rotate={-4}>PARA SIEMPRE</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 2. ESCALADA =================
const Escalate: React.FC = () => {
  const a = useA("esc");
  const t = useSec();
  const count = t < a(6.8) ? 0 : t < a(11.2) ? 3 : 4;
  const changed = t < a(11.2) ? a(6.8) : a(11.2);
  const fall = lin(t, a(6.5), a(6.9));
  return (
    <AbsoluteFill>
      <NeonCity sirens={t > a(6.8)} speed={1.3} />
      <Camera dur={9} zoom={[1, 1.1]} punchAt={[a(6.8), a(11.2), a(13.0)]}>
        <Hud count={count} changedAt={changed} />
        {t < a(9.2) && (
          <div style={{ position: "absolute", left: 540, top: 1350, transform: `translate(-50%,-100%) scale(${pop(t, a(5.6))})` }}>
            <Cop size={260} fallen={fall} />
          </div>
        )}
        {t >= a(9.2) && <CarOnRoad y={1300} size={480} />}
        {t >= a(11.2) && (
          <div style={{ position: "absolute", left: 250, top: 980, transform: `translate(-50%,-50%) scale(${pop(t, a(11.2))}) rotate(-4deg)` }}>
            <SwatVan size={330} />
          </div>
        )}
        {t >= a(12.1) && (
          <div style={{ position: "absolute", left: 800, top: 1020, transform: `translate(-50%,-50%) scale(${pop(t, a(12.1))}) rotate(5deg)` }}>
            <Barrier size={330} />
          </div>
        )}
        {t >= a(13.0) && (
          <div style={{ position: "absolute", left: 540 + Math.sin(t * 1.3) * 120, top: 760, transform: `translate(-50%,-20%) scale(${pop(t, a(13.0)) * 0.9})` }}>
            <Heli size={330} />
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 3. EJÉRCITO =================
const Army: React.FC = () => {
  const a = useA("army");
  const t = useSec();
  return (
    <AbsoluteFill>
      <NeonCity sirens speed={1.6} tint="rgba(60,90,20,0.25)" />
      <Camera dur={3} zoom={[1.05, 1.15]} punchAt={[a(14.6), a(16.2)]}>
        <Hud count={5} changedAt={a(14.6)} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 220 + i * 320, top: 1100 + (i % 2) * 90, transform: `translate(-50%,-50%) scale(${pop(t, a(16.0) + i * 0.12) * 0.7})` }}>
            <ArmyTruck size={400} />
          </div>
        ))}
        {t > a(16.2) && <Tag at={a(16.2)} x={540} y={880} bg="#5E7D38" color="#fff" size={70} rotate={-3}>EJÉRCITO</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 4. EL TANQUE =================
const TankScene: React.FC = () => {
  const a = useA("tank");
  const t = useSec();
  const roll = lin(t, a(21.9), a(22.6));
  return (
    <AbsoluteFill>
      <NeonCity speed={0.6} tint="rgba(20,10,40,0.35)" />
      <Camera dur={7.5} zoom={[1, 1.1]} punchAt={[a(19.6), a(22.3)]}>
        <Hud count={5} lit6="ghost" />
        {t < a(21.9) && (
          <div style={{ position: "absolute", left: 540, top: 1060, transform: `translate(-50%,-50%) scale(${pop(t, a(17.6))})` }}>
            <Big size={260} color={N.red} stroke={18}>?</Big>
          </div>
        )}
        {t > a(19.6) && t < a(21.9) && <Tag at={a(19.6)} x={540} y={1330} bg={N.gold} size={70} rotate={3}>EL TRUCO</Tag>}
        {t >= a(21.9) && (
          <div style={{ position: "absolute", left: interpolate(roll, [0, 1], [-400, 540]), top: 1150, transform: "translate(-50%,-50%)" }}>
            <Tank size={620} />
          </div>
        )}
        {t > a(23.6) && (
          <div style={{ position: "absolute", left: 540, top: 880, transform: `translate(-50%,-50%) scale(${pop(t, a(23.6))}) rotate(-2deg)`, textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", background: "#5E7D38", border: `6px solid ${C.ink}`, borderRadius: 16, padding: "6px 22px", display: "inline-block" }}>📍 BASE MILITAR</div>
            <Big size={110} color={N.gold} stroke={12}>MILE ZERO</Big>
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 5. CRONÓMETRO =================
const Timer: React.FC = () => {
  const a = useA("timer");
  const t = useSec();
  // minutos de persecución simulados: 0 -> 10 (5★) -> 25 (aviso)
  const mins = interpolate(t, [a(24.9), a(26.6), a(29.4), a(31.1)], [0, 10, 18, 25], clamp);
  const mm = Math.floor(mins);
  const ss = Math.floor((mins - mm) * 60);
  const banner = t > a(31.1);
  return (
    <AbsoluteFill>
      <NeonCity sirens speed={1.8} />
      <Camera dur={8} zoom={[1, 1.12]} punchAt={[a(26.3), a(29.1), a(31.9)]}>
        <Hud count={5} lit6="ghost" />
        <div style={{ position: "absolute", left: 540, top: 930, transform: `translate(-50%,-50%) scale(${pop(t, 0.1)}) rotate(-2deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: N.gold, background: "rgba(10,4,30,0.85)", border: `8px solid ${N.cyan}`, borderRadius: 32, padding: "6px 40px", boxShadow: `0 0 40px ${N.cyan}`, fontVariantNumeric: "tabular-nums", letterSpacing: 4 }}>
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </div>
        </div>
        {t > a(26.3) && t < a(28.7) && <Tag at={a(26.3)} x={540} y={1100} bg={N.gold} size={60} rotate={3}>~10 MIN = ★★★★★</Tag>}
        {t > a(29.1) && t < a(31.1) && <Tag at={a(29.1)} x={540} y={1100} bg={N.magenta} color="#fff" size={60} rotate={-3}>+10–15 MIN MÁS</Tag>}
        {!banner && <CarOnRoad y={1330} size={420} />}
        {banner && (
          <div style={{ position: "absolute", left: 540, top: 1200, transform: `translate(-50%,-50%) translateX(${(1 - pop(t, a(31.1))) * 600}px)` }}>
            <div style={{ width: 820, background: "rgba(10,4,30,0.92)", borderLeft: `14px solid ${N.gold}`, borderRadius: 20, padding: "28px 36px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
              Sigue escapando para llegar a <span style={{ color: N.gold }}>★6</span>
            </div>
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 6. LA SEXTA =================
const Sixth: React.FC = () => {
  const a = useA("sixth");
  const t = useSec();
  const got = t >= a(34.3);
  const flash = got && t < a(34.3) + 0.12;
  return (
    <AbsoluteFill>
      <NeonCity sirens={got} speed={2} tint={got ? "rgba(255,40,60,0.18)" : undefined} />
      <Camera dur={2.6} zoom={[1.0, 1.07]} punchAt={[a(34.3)]}>
        <Hud count={got ? 6 : 5} lit6={got ? "none" : "ghost"} changedAt={a(34.3)} y={900} scale={got ? 1.12 : 1.04} />
        {got && (
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M0 -200 L0 -700" stroke={N.gold} strokeWidth={14} strokeLinecap="round" opacity={0.6} transform={`translate(540 965) rotate(${i * 22.5 + t * 30})`} />
            ))}
          </svg>
        )}
        {got && <Tag at={a(34.6)} x={540} y={1200} bg={N.gold} size={80} rotate={-4}>★ 6 ★</Tag>}
      </Camera>
      {flash && <AbsoluteFill style={{ background: "#fff", opacity: 0.9 }} />}
    </AbsoluteFill>
  );
};

// ================= 7. MAPA =================
const MapScene: React.FC = () => {
  const a = useA("map");
  const t = useSec();
  const heat = lin(t, a(37.5), a(38.8));
  const hides = [[250, 950], [560, 1160], [780, 1350]];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #2A0F55, ${N.sky1})` }}>
      <Camera dur={8} zoom={[1, 1.1]} punchAt={[a(37.8), a(40.8)]}>
        <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${pop(t, 0.05) * 0.95})` }}>
          <PeninsulaMap heat={heat} size={760} />
        </div>
        {t > a(38.0) && t < a(40.6) && <Tag at={a(38.0)} x={540} y={640} bg={N.red} color="#fff" size={54} rotate={-3}>TODO ES ZONA CALIENTE</Tag>}
        {t > a(39.2) &&
          t < a(40.6) &&
          hides.map(([x, y], i) => (
            <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${pop(t, a(39.4) + i * 0.12)})` }}>
              <Big size={130} color={N.red} stroke={12}>✕</Big>
            </div>
          ))}
        {t > a(40.6) && (
          <div style={{ position: "absolute", left: 640, top: 1330, transform: `translate(-50%,-50%) scale(${pop(t, a(40.6)) * 0.55})` }}>
            <Tank size={520} tracker />
          </div>
        )}
        {t > a(41.4) && <Tag at={a(41.4)} x={540} y={640} bg={N.gold} size={60} rotate={3}>📡 RASTREADOR</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 8. DOS FINALES =================
const Ends: React.FC = () => {
  const a = useA("ends");
  const t = useSec();
  const split = t >= a(47.3);
  return (
    <AbsoluteFill>
      {!split ? (
        <>
          <NeonCity sirens speed={2} />
          <Camera dur={4} zoom={[1, 1.1]} punchAt={[a(46.4)]}>
            <Hud count={6} locked={t > a(45.6)} />
            <CarOnRoad y={1250} size={520} />
            {t > a(46.1) && <Tag at={a(46.1)} x={540} y={900} bg={N.red} color="#fff" size={60} rotate={-3}>NO SE VAN</Tag>}
          </Camera>
        </>
      ) : (
        <AbsoluteFill style={{ background: N.sky1 }}>
          <Camera dur={4} zoom={[1, 1.06]} punchAt={[a(49.1), a(50.5)]}>
            <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%,-50%) scale(${pop(t, a(47.5))})` }}>
              <Big size={80} color={N.gold} stroke={10}>SOLO 2 FINALES</Big>
            </div>
            {[0, 1].map((i) => {
              const on = t > a(i ? 50.3 : 48.9);
              return (
                <div key={i} style={{ position: "absolute", left: i ? 545 : 35, top: 760, width: 500, height: 700, borderRadius: 40, border: `8px solid ${on ? (i ? N.red : N.cyan) : "#3A2A60"}`, background: on ? `radial-gradient(circle at 50% 30%, ${i ? "#5A0F1F" : "#0F2A5A"}, #0B0420)` : "#120830", boxShadow: on ? `0 0 50px ${i ? N.red : N.cyan}` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ transform: `scale(${pop(t, a(i ? 50.4 : 49.0))})` }}>{i ? <Tomb size={260} /> : <Cuffs size={330} />}</div>
                  <div style={{ marginTop: 30, opacity: on ? 1 : 0 }}>
                    <Big size={64} color={i ? N.red : N.cyan} stroke={9}>{i ? "MUERTO" : "DETENIDO"}</Big>
                  </div>
                </div>
              );
            })}
          </Camera>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ================= 9. CONSEJO: ICONOS ROJOS =================
const Tip: React.FC = () => {
  const a = useA("tip");
  const t = useSec();
  const kinds = ["shirt", "car", "face", "cam"] as const;
  const okAt = { shirt: a(57.8), car: a(58.5), face: 999, cam: 999 } as Record<string, number>;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #3A0A63, ${N.sky1})` }}>
      <Camera dur={11} zoom={[1, 1.08]} punchAt={[a(51.5), a(55.1), a(59.4)]}>
        <div style={{ position: "absolute", left: 540, top: 650, transform: `translate(-50%,-50%) scale(${pop(t, a(51.4))}) rotate(-3deg)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 66, color: C.ink, background: N.gold, border: `8px solid ${C.ink}`, borderRadius: 999, padding: "8px 44px", boxShadow: `0 10px 0 ${C.ink}` }}>💡 CONSEJO</div>
        </div>
        {t < a(54.2) && (
          <div style={{ position: "absolute", left: 540, top: 1050, transform: `translate(-50%,-50%) scale(${pop(t, a(52.9)) * 0.9})` }}>
            <StarsHUD count={5} lit6="ghost" size={130} />
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Big size={66} color="#fff" stroke={9}>ANTES DE LA 6ª</Big>
            </div>
          </div>
        )}
        {t >= a(54.2) && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: 900, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40 }}>
            {kinds.map((k, i) => {
              const ok = t > okAt[k];
              const wob = ok ? 0 : Math.sin(t * 10 + i) * 4;
              return (
                <div key={k} style={{ transform: `scale(${pop(t, a(54.7) + i * 0.15) * (ok ? 1 + 0.15 * Math.exp(-(t - okAt[k]) * 4) : 1)}) rotate(${wob}deg)`, textAlign: "center" }}>
                  <ClueIcon kind={k} ok={ok} size={200} />
                  <div style={{ marginTop: 6 }}>
                    <Big size={40} color={ok ? C.mint : "#fff"} stroke={7}>{{ shirt: "ROPA", car: "COCHE", face: "CARA", cam: "CÁMARAS" }[k]}</Big>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {t > a(55.8) && t < a(59.4) && <Tag at={a(55.8)} x={540} y={1500 - 40} bg={N.red} color="#fff" size={54} rotate={2}>ESTO TE DELATA</Tag>}
        {t > a(59.4) && <Tag at={a(59.4)} x={540} y={1500 - 40} bg={C.mint} size={58} rotate={-2}>CÁMBIALOS ✓</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 10. RÉCORD → CONDENA =================
const Verdict: React.FC = () => {
  const a = useA("verdict");
  const t = useSec();
  const drop = lin(t, a(65.6), a(65.9));
  const bounce = drop >= 1 ? Math.sin((t - a(65.9)) * 25) * 12 * Math.exp(-(t - a(65.9)) * 5) : 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${drop > 0 ? "#3A0A1A" : "#4A2A0A"}, ${N.sky1})` }}>
      <Camera dur={4} zoom={[1, 1.1]} punchAt={[a(64.9), a(65.9)]}>
        <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${pop(t, a(63.0))})` }}>
          <Trophy size={420} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 690, width: 1080 }}>
          <StarsHUD count={6} size={100} />
        </div>
        {t > a(64.9) && t < a(65.6) && <Tag at={a(64.9)} x={540} y={1400} bg={N.gold} size={64}>¿RÉCORD?</Tag>}
        {drop > 0 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${bounce}px)` }}>
            <Bars drop={drop} />
          </div>
        )}
        {t > a(66.0) && <Tag at={a(66.0)} x={540} y={1400} bg={N.red} color="#fff" size={80} rotate={-4}>CONDENA</Tag>}
      </Camera>
    </AbsoluteFill>
  );
};

// ================= 11. CTA =================
const CTA: React.FC = () => {
  const a = useA("cta");
  const t = useSec();
  const phase = t < a(70.5) ? 0 : t < a(74.2) ? 1 : 2;
  const pressed = t > a(75.3);
  return (
    <AbsoluteFill>
      <NeonCity speed={0.8} tint="rgba(10,4,30,0.45)" />
      <Camera dur={11} zoom={[1, 1.1]} punchAt={[a(66.8), a(71.0), a(74.3)]}>
        {phase === 0 && (
          <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${pop(t, a(66.8)) * 0.85}) rotate(${Math.sin(t * 2) * 3}deg)` }}>
            <Phone size={380}>
              <div style={{ padding: "80px 24px 0", fontFamily: FONT }}>
                <div style={{ background: "#2A1A55", color: "#fff", fontWeight: 800, fontSize: 30, padding: "14px 18px", borderRadius: 20, marginBottom: 16, opacity: pop(t, a(67.3)) }}>tú: mira esto 👀</div>
                <div style={{ background: N.magenta, color: "#fff", fontWeight: 900, fontSize: 30, padding: "14px 18px", borderRadius: 20, marginLeft: 50, opacity: pop(t, a(68.4)) }}>esta noche voy a por la 6ª ⭐</div>
                <div style={{ marginTop: 30, display: "flex", justifyContent: "center", transform: `scale(${pop(t, a(68.8))})` }}>
                  <div style={{ background: N.gold, color: C.ink, fontWeight: 900, fontSize: 34, padding: "12px 26px", borderRadius: 999, border: `5px solid ${C.ink}` }}>➤ ENVIAR</div>
                </div>
              </div>
            </Phone>
          </div>
        )}
        {phase === 1 && (
          <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${pop(t, a(70.5))}) rotate(-2deg)` }}>
            <div style={{ width: 820, background: "#fff", border: `9px solid ${C.ink}`, borderRadius: 40, boxShadow: `0 16px 0 ${C.ink}`, padding: "34px 30px", fontFamily: FONT, textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 58, color: C.ink, lineHeight: 1.1 }}>
                ¿CUÁNTOS <span style={{ color: N.magenta }}>MINUTOS</span> AGUANTARÍAS?
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: 26 }}>
                {["⏱ 1", "⏱ 10", "⏱ 30+"].map((o, i) => (
                  <div key={o} style={{ fontWeight: 900, fontSize: 50, color: "#fff", background: [N.cyan, N.purple, N.red][i], border: `7px solid ${C.ink}`, borderRadius: 22, padding: "10px 20px", transform: `scale(${pop(t, a(72.4) + i * 0.2)})` }}>{o}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {phase === 2 && (
          <>
            <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${pop(t, a(74.2))})` }}>
              <EyeMascot size={360} />
            </div>
            <div style={{ position: "absolute", left: 540, top: 1250, transform: `translate(-50%,-50%) scale(${pop(t, a(74.5))}) rotate(-3deg)` }}>
              <Big size={110} color={C.yellow} stroke={13}>OJO AL DATO</Big>
            </div>
            <div style={{ position: "absolute", left: 540, top: 1420, transform: `translate(-50%,-50%) scale(${pop(t, a(74.8))})` }}>
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
  [0, "siren", 0.35], [1.0, "rise", 0.3], [3.9, "boom", 0.55],
  [5.1, "whoosh", 0.4], [6.6, "pop", 0.4], [6.8, "ding", 0.35], [9.2, "siren", 0.25], [11.2, "pop", 0.45], [12.1, "pop", 0.45], [13.0, "whoosh", 0.4],
  [14.4, "whoosh", 0.4], [14.6, "ding", 0.35], [16.2, "boom", 0.5],
  [17.2, "whoosh", 0.4], [19.6, "pop", 0.45], [21.9, "boom", 0.45], [23.6, "pop", 0.45],
  [24.7, "whoosh", 0.4], [26.3, "ding", 0.4], [29.1, "ding", 0.4], [31.1, "rise", 0.35],
  [33.0, "whoosh", 0.4], [34.3, "boom", 0.65], [34.35, "ding", 0.45],
  [35.6, "whoosh", 0.4], [37.8, "rise", 0.35], [39.4, "pop", 0.4], [40.6, "tick", 0.5], [41.4, "pop", 0.4],
  [43.7, "whoosh", 0.4], [45.6, "boom", 0.45], [47.3, "whoosh", 0.4], [49.0, "pop", 0.45], [50.4, "boom", 0.45],
  [51.0, "whoosh", 0.4], [51.4, "pop", 0.45], [54.7, "pop", 0.35], [55.8, "pop", 0.4], [57.8, "ding", 0.35], [58.5, "ding", 0.35], [59.4, "pop", 0.4],
  [62.6, "whoosh", 0.4], [64.9, "ding", 0.4], [65.6, "boom", 0.7],
  [66.6, "whoosh", 0.4], [68.8, "pop", 0.4], [70.5, "pop", 0.45], [74.2, "whoosh", 0.4], [75.3, "ding", 0.5],
];

export const Video02: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: N.sky1 }}>
      <Scene k="hook"><SceneIn type="zoom"><Hook /></SceneIn></Scene>
      <Scene k="esc"><SceneIn type="up"><Escalate /></SceneIn></Scene>
      <Scene k="army"><SceneIn type="left"><Army /></SceneIn></Scene>
      <Scene k="tank"><SceneIn type="zoom"><TankScene /></SceneIn></Scene>
      <Scene k="timer"><SceneIn type="up"><Timer /></SceneIn></Scene>
      <Scene k="sixth"><SceneIn type="spin"><Sixth /></SceneIn></Scene>
      <Scene k="map"><SceneIn type="zoom"><MapScene /></SceneIn></Scene>
      <Scene k="ends"><SceneIn type="left"><Ends /></SceneIn></Scene>
      <Scene k="tip"><SceneIn type="up"><Tip /></SceneIn></Scene>
      <Scene k="verdict"><SceneIn type="zoom"><Verdict /></SceneIn></Scene>
      <Scene k="cta"><SceneIn type="spin"><CTA /></SceneIn></Scene>

      <Captions words={words} keywords={KEYWORDS} top={300} />

      <Audio src={staticFile("v02/voz.mp3")} />
      <Audio src={staticFile("v02/musica.mp3")} volume={(f) => interpolate(f / fps, [0, 0.8, m(75.6), m(76.2), V02_DURATION], [0, 0.12, 0.12, 0.28, 0], clamp)} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.round(m(at) * fps)} durationInFrames={Math.round(1.3 * fps)} name={`sfx-${name}`}>
          <Audio src={staticFile(`v02/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
