import React from 'react';
import {C} from './theme';

/** Convierte "texto *resaltado*" en spans con color de acento. */
export const RichText: React.FC<{text: string; accent?: string}> = ({text, accent = C.yellow}) => {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <span key={i} style={{color: accent}}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
};

export const plain = (t: string) => t.replace(/\*/g, '');
