import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./core";

export type Word = { t: string; s: number; e: number };

const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}%]/gu, "");

/** Agrupa palabras en bloques cortos (máx 3 palabras / 18 caracteres), cortando en pausas y puntuación */
export const groupWords = (words: Word[]) => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const len = cur.map((x) => x.t).join(" ").length;
    const punct = /[.,:;?!…]$/.test(w.t);
    const pause = next ? next.s - w.e > 0.3 : true;
    const nextLen = next ? len + 1 + next.t.length : 0;
    if (!next || punct || pause || cur.length >= 3 || nextLen > 18) {
      groups.push(cur);
      cur = [];
    }
  });
  return groups;
};

/**
 * Subtítulos grandes, sincronizados palabra a palabra.
 * Zona segura Shorts: centrados en y≈top, ancho 900px (lejos de botones laterales e inferiores).
 */
export const Captions: React.FC<{ words: Word[]; keywords: string[]; top?: number; offset?: number }> = ({
  words,
  keywords,
  top = 300,
  offset = 0,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps + offset;
  const groups = React.useMemo(() => groupWords(words), [words]);
  const kw = React.useMemo(() => new Set(keywords.map(clean)), [keywords]);

  const gi = groups.findIndex((g, i) => {
    const end = groups[i + 1] ? groups[i + 1][0].s : g[g.length - 1].e + 1.2;
    return t >= g[0].s - 0.05 && t < end;
  });
  if (gi < 0) return null;
  const g = groups[gi];
  const start = g[0].s - 0.05;
  const k = spring({ frame: f - start * fps, fps, config: { damping: 11, stiffness: 220 } });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top,
          left: 90,
          width: 900,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px 22px",
          transform: `scale(${0.75 + 0.25 * k}) translateY(${(1 - k) * 30}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        {g.map((w, i) => {
          const active = t >= w.s - 0.03;
          const isKw = kw.has(clean(w.t));
          const wk = spring({ frame: f - (w.s - 0.03) * fps, fps, config: { damping: 10, stiffness: 300 } });
          const color = isKw && active ? (/\d/.test(w.t) ? C.yellow : C.yellow) : C.white;
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: isKw ? 96 : 86,
                textTransform: "uppercase",
                color,
                opacity: active ? 1 : 0.55,
                WebkitTextStroke: `14px ${C.ink}`,
                paintOrder: "stroke fill",
                textShadow: `0 7px 0 ${C.ink}, 0 0 30px rgba(0,0,0,0.35)`,
                display: "inline-block",
                transform: `scale(${active ? 1 + (isKw ? 0.12 : 0.05) * Math.max(0, 1 - Math.abs(wk - 1) * 0 - (t - w.s) * 2.5) : 0.95}) rotate(${isKw && active ? -2 : 0}deg)`,
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              {w.t.replace(/[,.:;]$/, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
