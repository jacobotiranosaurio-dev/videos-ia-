import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {BODY, C, HEAD, stroke} from './theme';
import {Icon} from './Icon';
import {RichText} from './RichText';
import type {Scene} from './types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

const Sfx: React.FC<{name: string; at?: number; volume?: number}> = ({name, at = 0, volume = 0.8}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

const useSpring = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass: 0.6, stiffness: 180}});
};

const headStyle = (size: number): React.CSSProperties => ({
  fontFamily: HEAD,
  fontSize: size,
  lineHeight: 0.98,
  textTransform: 'uppercase',
  color: C.white,
  textAlign: 'center',
  letterSpacing: 1,
  ...stroke(Math.round(size / 9)),
  filter: `drop-shadow(0 8px 0 rgba(0,0,0,.55)) drop-shadow(0 0 30px ${C.pink}66)`,
});

const bodyStyle = (size: number): React.CSSProperties => ({
  fontFamily: BODY,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.15,
  color: C.white,
  textAlign: 'center',
  ...stroke(Math.round(size / 7)),
});

/** Zona segura vertical: evita la UI de TikTok/Reels/Shorts (arriba y abajo-derecha). */
const Safe: React.FC<{children: React.ReactNode; gap?: number; style?: React.CSSProperties}> = ({children, gap = 40, style}) => (
  <AbsoluteFill
    style={{
      padding: '300px 110px 470px 90px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Pill: React.FC<{children: React.ReactNode; color?: string; delay?: number}> = ({children, color = C.pink, delay = 0}) => {
  const s = useSpring(delay, 12);
  return (
    <div
      style={{
        fontFamily: BODY,
        fontWeight: 900,
        fontSize: 40,
        letterSpacing: 4,
        textTransform: 'uppercase',
        color: '#000',
        background: color,
        padding: '12px 30px',
        borderRadius: 999,
        scale: String(interpolate(s, [0, 1], [0.4, 1])),
        opacity: s,
        boxShadow: `0 0 40px ${color}99`,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- PUNCH (hooks)
const Punch: React.FC<{s: Extract<Scene, {type: 'punch'}>; first?: boolean}> = ({s, first}) => {
  const frame = useCurrentFrame();
  const d0 = first ? -12 : 0; // el hook ya se lee en el frame 0 (miniatura + stop del scroll)
  const size = s.size ?? 128;
  const shakeAmt = s.shake ? interpolate(frame, [0, 14], [22, 0], clamp) : 0;
  const breathe = interpolate(frame, [0, s.dur * 30], [1, 1.06]);
  return (
    <Safe gap={30} style={{translate: `${Math.sin(frame * 2.7) * shakeAmt}px ${Math.cos(frame * 3.1) * shakeAmt}px`, scale: String(breathe)}}>
      {s.tag ? (
        <Pill color={s.mood === 'alarm' ? C.red : C.yellow} delay={d0}>
          {s.tag}
        </Pill>
      ) : null}
      {s.icon ? <PunchIcon name={s.icon} delay={d0} /> : null}
      {s.lines.map((l, i) => (
        <PunchLine key={i} delay={d0 + i * (first ? 2 : 5)} size={size}>
          <RichText text={l} />
        </PunchLine>
      ))}
      {s.sub ? (
        <PunchLine delay={s.lines.length * 5 + 6} size={size}>
          <div style={{...bodyStyle(50), color: C.dim}}>
            <RichText text={s.sub} accent={C.teal} />
          </div>
        </PunchLine>
      ) : null}
    </Safe>
  );
};

const PunchIcon: React.FC<{name: Parameters<typeof Icon>[0]['name']; delay?: number}> = ({name, delay = 0}) => {
  const s = useSpring(delay, 9);
  const frame = useCurrentFrame();
  return (
    <div style={{scale: String(interpolate(s, [0, 1], [2.2, 1])), rotate: `${Math.sin(frame / 6) * 4}deg`, filter: `drop-shadow(0 0 30px ${C.yellow})`}}>
      <Icon name={name} size={190} color={C.yellow} width={2.4} />
    </div>
  );
};

const PunchLine: React.FC<{children: React.ReactNode; delay: number; size: number}> = ({children, delay, size}) => {
  const s = useSpring(delay, 11);
  return (
    <div style={{...headStyle(size), opacity: s > 0.01 ? 1 : 0, scale: String(interpolate(s, [0, 1], [1.9, 1])), filter: `blur(${interpolate(s, [0, 1], [10, 0])}px)`}}>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- WORDS (captions cinéticos)
const chunkWords = (text: string, max = 3) => {
  // respeta los *resaltados* como una sola unidad
  const tokens = text.match(/\*[^*]+\*|\S+/g) ?? [];
  const chunks: string[] = [];
  let cur: string[] = [];
  for (const t of tokens) {
    cur.push(t);
    const ends = /[.,:;!?…]$/.test(t.replace(/\*$/, ''));
    if (cur.length >= max || ends) {
      chunks.push(cur.join(' '));
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur.join(' '));
  return chunks;
};

const Words: React.FC<{s: Extract<Scene, {type: 'words'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const total = s.dur * 30;
  const chunks = chunkWords(s.text);
  const per = total / chunks.length;
  const idx = Math.min(chunks.length - 1, Math.floor(frame / per));
  const local = frame - idx * per;
  const pop = interpolate(local, [0, 5], [1.25, 1], {...clamp, easing: OUT});
  return (
    <Safe gap={50}>
      {s.label ? <Pill color={C.teal}>{s.label}</Pill> : null}
      {s.icon ? <Icon name={s.icon} size={150} color={C.teal} style={{filter: `drop-shadow(0 0 24px ${C.teal})`}} /> : null}
      <div style={{...headStyle(120), scale: String(pop), minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <RichText text={chunks[idx]} />
        </span>
      </div>
      {/* puntos de progreso dentro de la frase */}
      <div style={{display: 'flex', gap: 14}}>
        {chunks.map((_, i) => (
          <div key={i} style={{width: i === idx ? 46 : 16, height: 16, borderRadius: 8, background: i <= idx ? C.yellow : 'rgba(255,255,255,.3)'}} />
        ))}
      </div>
      {chunks.map((_, i) => (i > 0 ? <Sfx key={i} name="pop" at={i * per} volume={0.35} /> : null))}
    </Safe>
  );
};

// ---------------------------------------------------------------- STAT (contador)
const Stat: React.FC<{s: Extract<Scene, {type: 'stat'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const end = s.dur * 30 * 0.55;
  const v = interpolate(frame, [4, end], [s.from ?? 0, s.to], {...clamp, easing: Easing.out(Easing.cubic)});
  const done = frame >= end;
  const s1 = useSpring(0);
  const color = s.color ?? C.yellow;
  const ticks = Array.from({length: 7}, (_, i) => 4 + (i * (end - 4)) / 7);
  return (
    <Safe gap={24}>
      <div style={{...bodyStyle(56), opacity: s1}}>
        <RichText text={s.label} />
      </div>
      <div
        style={{
          ...headStyle(`${s.prefix ?? ''}${s.to.toFixed(s.decimals ?? 0)}${s.suffix ?? ''}`.length > 6 ? 200 : 260),
          textTransform: 'none',
          color,
          scale: String(done ? interpolate(frame - end, [0, 8], [1.18, 1], clamp) : 1),
          filter: `drop-shadow(0 10px 0 rgba(0,0,0,.6)) drop-shadow(0 0 50px ${color}aa)`,
        }}
      >
        {s.prefix}
        {v.toFixed(s.decimals ?? 0)}
        {s.suffix}
      </div>
      {s.sub ? (
        <div style={{...bodyStyle(50), opacity: interpolate(frame, [end, end + 8], [0, 1], clamp), color: C.white}}>
          <RichText text={s.sub} accent={C.teal} />
        </div>
      ) : null}
      {ticks.map((t, i) => (
        <Sfx key={i} name="tick" at={t} volume={0.5} />
      ))}
      <Sfx name="impact" at={end} volume={0.6} />
    </Safe>
  );
};

// ---------------------------------------------------------------- METER (barra de almacenamiento)
const Meter: React.FC<{s: Extract<Scene, {type: 'meter'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const used = s.segments.reduce((a, b) => a + b.value, 0);
  const over = used > s.total;
  const scaleTo = Math.max(used, s.total);
  let acc = 0;
  const step = 14;
  const overAt = s.segments.length * step + 10;
  const flash = over && frame > overAt ? (Math.floor(frame / 4) % 2 === 0 ? 1 : 0.35) : 1;
  return (
    <Safe gap={44}>
      <div style={headStyle(96)}>
        <RichText text={s.title} />
      </div>
      <div style={{width: 860}}>
        <div
          style={{
            position: 'relative',
            height: 120,
            borderRadius: 24,
            border: `6px solid ${over && frame > overAt ? C.red : C.white}`,
            background: 'rgba(0,0,0,.55)',
            overflow: 'hidden',
            display: 'flex',
            opacity: flash,
          }}
        >
          {s.segments.map((seg, i) => {
            const w = (seg.value / scaleTo) * 100;
            const grow = interpolate(frame, [i * step, i * step + 12], [0, 1], {...clamp, easing: OUT});
            acc += w;
            return <div key={i} style={{width: `${w * grow}%`, background: seg.color, borderRight: '4px solid #000'}} />;
          })}
          {over ? <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(s.total / scaleTo) * 100}%`, width: 8, background: C.red}} /> : null}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, ...bodyStyle(40)}}>
          <span>0</span>
          <span>
            {s.total} {s.unit}
          </span>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: 860}}>
        {s.segments.map((seg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              opacity: interpolate(frame, [i * step, i * step + 6], [0, 1], clamp),
              translate: `${interpolate(frame, [i * step, i * step + 10], [80, 0], {...clamp, easing: OUT})}px 0`,
            }}
          >
            <div style={{width: 44, height: 44, borderRadius: 10, background: seg.color, border: '4px solid #000'}} />
            <div style={{...bodyStyle(46), textAlign: 'left', flex: 1}}>{seg.label}</div>
            <div style={{...bodyStyle(46), color: C.yellow}}>
              {seg.value} {s.unit}
            </div>
          </div>
        ))}
      </div>
      {s.footer ? (
        <div style={{...headStyle(84), color: over ? C.red : C.green, opacity: interpolate(frame, [overAt, overAt + 6], [0, 1], clamp)}}>
          <RichText text={s.footer} />
        </div>
      ) : null}
      {s.segments.map((_, i) => (
        <Sfx key={i} name="pop" at={i * step} volume={0.45} />
      ))}
      {over ? <Sfx name="glitch" at={overAt} volume={0.6} /> : null}
    </Safe>
  );
};

// ---------------------------------------------------------------- TIP (consejo numerado)
const Tip: React.FC<{s: Extract<Scene, {type: 'tip'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const a = useSpring(0, 13);
  const b = useSpring(8, 15);
  return (
    <Safe gap={36}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, translate: `${interpolate(a, [0, 1], [-500, 0])}px 0`}}>
        <div
          style={{
            fontFamily: HEAD,
            fontSize: 190,
            color: C.yellow,
            ...stroke(18),
            lineHeight: 1,
            filter: `drop-shadow(0 0 40px ${C.orange})`,
          }}
        >
          {String(s.n).padStart(2, '0')}
        </div>
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 40,
            background: `linear-gradient(135deg, ${C.pink}, ${C.orange})`,
            display: 'grid',
            placeItems: 'center',
            border: '6px solid #000',
            rotate: `${Math.sin(frame / 10) * 5}deg`,
          }}
        >
          <Icon name={s.icon} size={110} color="#fff" width={2.6} />
        </div>
      </div>
      <div style={{...headStyle(104), opacity: a, translate: `${interpolate(a, [0, 1], [400, 0])}px 0`}}>
        <RichText text={s.title} />
      </div>
      <div
        style={{
          ...bodyStyle(50),
          opacity: b,
          translate: `0 ${interpolate(b, [0, 1], [60, 0])}px`,
          background: 'rgba(10,4,20,.72)',
          border: `4px solid ${C.teal}`,
          borderRadius: 30,
          padding: '28px 34px',
          WebkitTextStroke: '0px',
        }}
      >
        <RichText text={s.body} accent={C.teal} />
      </div>
      <Sfx name="pop" at={8} volume={0.5} />
    </Safe>
  );
};

// ---------------------------------------------------------------- VERSUS
const Versus: React.FC<{s: Extract<Scene, {type: 'versus'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const l = useSpring(0, 14);
  const r = useSpring(8, 14);
  const vAt = 26;
  const v = useSpring(vAt, 9);
  const Card: React.FC<{d: {title: string; value: string; sub?: string}; color: string; t: number; dir: number}> = ({d, color, t, dir}) => (
    <div
      style={{
        width: 400,
        padding: '40px 20px',
        borderRadius: 36,
        background: 'rgba(10,4,20,.78)',
        border: `6px solid ${color}`,
        boxShadow: `0 0 50px ${color}66`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        translate: `${interpolate(t, [0, 1], [dir * 600, 0])}px 0`,
      }}
    >
      <div style={{...bodyStyle(42), color}}>{d.title}</div>
      <div style={{...headStyle(d.value.length > 4 ? 78 : 130), color: C.white}}>{d.value}</div>
      {d.sub ? <div style={{...bodyStyle(34), color: C.dim, WebkitTextStroke: '0px'}}>{d.sub}</div> : null}
    </div>
  );
  return (
    <Safe gap={50}>
      <div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
        <Card d={s.left} color={C.teal} t={l} dir={-1} />
        <Card d={s.right} color={C.pink} t={r} dir={1} />
      </div>
      <div style={{...headStyle(90), position: 'absolute', top: 760, opacity: frame < vAt ? 1 : 0, color: C.yellow}}>VS</div>
      {s.verdict ? (
        <div style={{...headStyle(100), scale: String(interpolate(v, [0, 1], [2.4, 1])), opacity: v, rotate: '-3deg', color: C.yellow}}>
          <RichText text={s.verdict} accent={C.pink} />
        </div>
      ) : null}
      <Sfx name="whoosh" at={8} volume={0.5} />
      <Sfx name="impact" at={vAt} volume={0.7} />
    </Safe>
  );
};

// ---------------------------------------------------------------- PATH (mockup de móvil con ruta de ajustes)
const PathScene: React.FC<{s: Extract<Scene, {type: 'path'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const total = s.dur * 30;
  const chipsAt = s.chips ? total * 0.62 : total;
  const per = (chipsAt - 10) / s.steps.length;
  const active = Math.min(s.steps.length - 1, Math.floor(Math.max(0, frame - 10) / per));
  const enter = useSpring(0, 15);
  return (
    <Safe gap={34}>
      {s.title ? (
        <div style={headStyle(92)}>
          <RichText text={s.title} />
        </div>
      ) : null}
      <div
        style={{
          width: 640,
          borderRadius: 60,
          border: '10px solid #1d1d24',
          background: '#0f0f14',
          boxShadow: `0 30px 80px rgba(0,0,0,.7), 0 0 60px ${s.appColor}55`,
          padding: '34px 30px 40px',
          translate: `0 ${interpolate(enter, [0, 1], [900, 0])}px`,
          rotate: `${interpolate(enter, [0, 1], [8, -2])}deg`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{width: 160, height: 26, borderRadius: 13, background: '#000', alignSelf: 'center', marginBottom: 6}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 6}}>
          <div style={{width: 64, height: 64, borderRadius: 16, background: s.appColor, display: 'grid', placeItems: 'center', fontFamily: HEAD, fontSize: 40, color: '#000'}}>
            {s.app[0]}
          </div>
          <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 44, color: '#fff'}}>{s.app}</div>
        </div>
        {s.steps.map((st, i) => {
          const shown = frame >= 10 + i * per - 4;
          const isActive = i === active && frame < chipsAt;
          const done = i < active || frame >= chipsAt;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '22px 24px',
                borderRadius: 22,
                background: isActive ? `${s.appColor}33` : '#1a1a22',
                border: `4px solid ${isActive ? s.appColor : 'transparent'}`,
                opacity: shown ? 1 : 0.15,
                scale: String(isActive ? 1.04 : 1),
              }}
            >
              <div style={{fontFamily: HEAD, fontSize: 40, color: done ? C.green : s.appColor, width: 40}}>{done ? '✓' : i + 1}</div>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 38, color: '#fff', flex: 1, textAlign: 'left'}}>{st}</div>
              <div style={{fontFamily: BODY, fontWeight: 900, fontSize: 40, color: '#666'}}>›</div>
            </div>
          );
        })}
        {s.chips ? (
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10, minHeight: 130}}>
            {s.chips.map((c, i) => {
              const t = interpolate(frame, [chipsAt + i * 5, chipsAt + i * 5 + 6], [0, 1], clamp);
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: BODY,
                    fontWeight: 800,
                    fontSize: 32,
                    color: '#000',
                    background: C.yellow,
                    padding: '10px 20px',
                    borderRadius: 999,
                    opacity: t,
                    scale: String(interpolate(t, [0, 1], [0.5, 1])),
                  }}
                >
                  {c}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {/* dedo / tap */}
      {frame < chipsAt ? (
        <div
          style={{
            position: 'absolute',
            right: 170,
            top: 0,
            translate: `0 ${(s.title ? 780 : 640) + active * 112}px`,
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.85)',
            boxShadow: `0 0 0 ${interpolate((frame - 10) % per, [0, per], [0, 40], clamp)}px rgba(255,255,255,${interpolate((frame - 10) % per, [0, per], [0.5, 0], clamp)})`,
          }}
        />
      ) : null}
      {s.steps.map((_, i) => (
        <Sfx key={i} name="pop" at={10 + i * per} volume={0.45} />
      ))}
      {s.chips ? s.chips.map((_, i) => <Sfx key={`c${i}`} name="tick" at={chipsAt + i * 5} volume={0.5} />) : null}
    </Safe>
  );
};

// ---------------------------------------------------------------- LIST (checklist)
const List: React.FC<{s: Extract<Scene, {type: 'list'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const per = Math.min(22, (s.dur * 30 - 20) / s.items.length);
  return (
    <Safe gap={36}>
      <div style={headStyle(100)}>
        <RichText text={s.title} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 24, width: 880}}>
        {s.items.map((it, i) => {
          const at = 12 + i * per;
          const t = interpolate(frame, [at, at + 8], [0, 1], {...clamp, easing: OUT});
          const color = it.kind === 'check' ? C.green : it.kind === 'cross' ? C.red : C.yellow;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '24px 28px',
                borderRadius: 28,
                background: 'rgba(10,4,20,.78)',
                border: `5px solid ${color}`,
                opacity: t,
                translate: `${interpolate(t, [0, 1], [i % 2 ? 300 : -300, 0])}px 0`,
              }}
            >
              <div style={{width: 84, height: 84, borderRadius: 20, background: color, display: 'grid', placeItems: 'center', flexShrink: 0}}>
                <Icon name={it.kind === 'cross' ? 'cross' : it.kind === 'check' ? 'check' : 'warning'} size={58} color="#000" width={3.4} />
              </div>
              <div style={{...bodyStyle(46), textAlign: 'left', WebkitTextStroke: '0px'}}>
                <RichText text={it.text} />
              </div>
            </div>
          );
        })}
      </div>
      {s.items.map((it, i) => (
        <Sfx key={i} name={it.kind === 'cross' ? 'glitch' : 'pop'} at={12 + i * per} volume={it.kind === 'cross' ? 0.35 : 0.5} />
      ))}
    </Safe>
  );
};

// ---------------------------------------------------------------- CTA
const Cta: React.FC<{s: Extract<Scene, {type: 'cta'}>}> = ({s}) => {
  const frame = useCurrentFrame();
  const total = s.dur * 30;
  const typeStart = 18;
  const typeEnd = typeStart + Math.min(45, s.comment.length * 2.2);
  const n = Math.round(interpolate(frame, [typeStart, typeEnd], [0, s.comment.length], clamp));
  const pulse = 1 + Math.max(0, Math.sin(frame / 4)) * 0.07;
  const btn = useSpring(typeEnd + 4, 10);
  return (
    <Safe gap={40}>
      {s.lines.map((l, i) => (
        <PunchLine key={i} delay={i * 6} size={112}>
          <RichText text={l} />
        </PunchLine>
      ))}
      <div
        style={{
          width: 860,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '26px 30px',
          borderRadius: 999,
          background: 'rgba(255,255,255,.95)',
          boxShadow: `0 0 60px ${C.pink}88`,
          opacity: interpolate(frame, [typeStart - 8, typeStart], [0, 1], clamp),
        }}
      >
        <Icon name="chat" size={60} color={C.pink} width={2.6} />
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: s.comment.length > 20 ? 38 : 46, color: '#111', flex: 1, textAlign: 'left', whiteSpace: 'nowrap'}}>
          {s.comment.slice(0, n)}
          <span style={{opacity: frame % 20 < 10 ? 1 : 0, color: C.pink}}>|</span>
        </div>
      </div>
      {s.button ? (
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 900,
            fontSize: (s.button?.length ?? 0) > 14 ? 40 : 54,
            whiteSpace: 'nowrap',
            color: '#fff',
            padding: '26px 48px',
            borderRadius: 26,
            background: `linear-gradient(90deg, ${C.pink}, ${C.orange})`,
            border: '6px solid #000',
            scale: String(interpolate(btn, [0, 1], [0, 1]) * pulse),
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <Icon name="bell" size={56} color="#fff" width={2.8} />
          {s.button}
        </div>
      ) : null}
      {Array.from({length: Math.floor((typeEnd - typeStart) / 4)}, (_, i) => (
        <Sfx key={i} name="tick" at={typeStart + i * 4} volume={0.3} />
      ))}
      <Sfx name="impact" at={typeEnd + 4} volume={0.6} />
      {/* destello final que "empalma" con el inicio del video para el replay */}
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(frame, [total - 4, total], [0, 0.9], clamp)}} />
    </Safe>
  );
};

export const SceneView: React.FC<{s: Scene; first?: boolean}> = ({s, first}) => {
  switch (s.type) {
    case 'punch':
      return <Punch s={s} first={first} />;
    case 'words':
      return <Words s={s} />;
    case 'stat':
      return <Stat s={s} />;
    case 'meter':
      return <Meter s={s} />;
    case 'tip':
      return <Tip s={s} />;
    case 'versus':
      return <Versus s={s} />;
    case 'path':
      return <PathScene s={s} />;
    case 'list':
      return <List s={s} />;
    case 'cta':
      return <Cta s={s} />;
  }
};

/** Entrada de cada escena: zoom + desenfoque rápido + flash (cambio de plano). */
export const SceneShell: React.FC<{children: React.ReactNode; flash: boolean; first?: boolean}> = ({children, flash, first}) => {
  const f = useCurrentFrame();
  const frame = first ? 99 : f; // sin desenfoque de entrada en el hook
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, 7], [1.12, 1], {...clamp, easing: OUT})),
          filter: `blur(${interpolate(frame, [0, 6], [14, 0], clamp)}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
      {flash ? <AbsoluteFill style={{background: '#fff', opacity: interpolate(frame, [0, 5], [0.85, 0], clamp)}} /> : null}
    </AbsoluteFill>
  );
};

export {Sfx};
