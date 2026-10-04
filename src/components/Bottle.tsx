import { useId } from "react";
import type { BottleShape } from "@/lib/types";

function mix(hex: string, target: string, amount: number) {
  const h = (s: string) => s.replace("#", "").padEnd(6, "0");
  const a = h(hex), b = h(target);
  const c = [0, 2, 4].map((i) => {
    const x = parseInt(a.slice(i, i + 2), 16), y = parseInt(b.slice(i, i + 2), 16);
    return Math.round(x + (y - x) * amount).toString(16).padStart(2, "0");
  });
  return `#${c.join("")}`;
}

type Shape = { body: React.ReactNode; top: number; bottom: number; cap: (fill: string) => React.ReactNode; neck: React.ReactNode; label: { x: number; y: number; w: number; h: number } };

const shapes: Record<BottleShape, Shape> = {
  classic: {
    top: 96, bottom: 302,
    body: <rect x="38" y="96" width="124" height="206" rx="22" />,
    neck: <rect x="84" y="78" width="32" height="22" rx="3" />,
    cap: (f) => (<><rect x="72" y="16" width="56" height="64" rx="7" fill={f} /><rect x="72" y="70" width="56" height="8" fill="#000" opacity=".18" /></>),
    label: { x: 62, y: 178, w: 76, h: 44 },
  },
  round: {
    top: 120, bottom: 304,
    body: <circle cx="100" cy="212" r="92" />,
    neck: <rect x="86" y="98" width="28" height="26" rx="3" />,
    cap: (f) => (<><rect x="78" y="26" width="44" height="74" rx="5" fill={f} /><ellipse cx="100" cy="26" rx="22" ry="6" fill="#fff" opacity=".25" /></>),
    label: { x: 64, y: 196, w: 72, h: 40 },
  },
  tall: {
    top: 86, bottom: 306,
    body: <rect x="56" y="86" width="88" height="220" rx="12" />,
    neck: <rect x="88" y="68" width="24" height="22" rx="3" />,
    cap: (f) => (<><circle cx="100" cy="40" r="30" fill={f} /><circle cx="90" cy="30" r="9" fill="#fff" opacity=".3" /></>),
    label: { x: 70, y: 186, w: 60, h: 48 },
  },
  facet: {
    top: 96, bottom: 304,
    body: <polygon points="62,96 138,96 170,130 170,270 138,304 62,304 30,270 30,130" />,
    neck: <rect x="84" y="78" width="32" height="22" rx="3" />,
    cap: (f) => (<><polygon points="80,14 120,14 136,32 136,64 120,82 80,82 64,64 64,32" fill={f} /><polygon points="80,14 120,14 136,32 64,32" fill="#fff" opacity=".22" /></>),
    label: { x: 60, y: 182, w: 80, h: 44 },
  },
};

export default function Bottle({
  color = "#4a2516",
  shape = "classic",
  level = 0.82,
  label = "ÉLAN",
  className,
  title,
}: {
  color?: string;
  shape?: BottleShape;
  level?: number;
  label?: string;
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const s = shapes[shape] ?? shapes.classic;
  const liquidTop = s.bottom - (s.bottom - s.top) * level;
  return (
    <svg viewBox="0 0 200 330" className={className} role="img" aria-label={title ?? "Perfume bottle"}>
      <defs>
        <clipPath id={`c${id}`}>{s.body}</clipPath>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={mix(color, "#ffffff", 0.35)} />
          <stop offset=".55" stopColor={color} />
          <stop offset="1" stopColor={mix(color, "#000000", 0.45)} />
        </linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6e3b4" />
          <stop offset=".45" stopColor="#c8a46a" />
          <stop offset=".7" stopColor="#8a6a36" />
          <stop offset="1" stopColor="#d9bd84" />
        </linearGradient>
        <linearGradient id={`h${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`s${id}`}>
          <stop offset="0" stopColor="#000" stopOpacity=".45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="316" rx="80" ry="10" fill={`url(#s${id})`} />
      <g fill="#e9dccb" opacity=".55">{s.neck}</g>
      {s.cap(`url(#g${id})`)}
      <g clipPath={`url(#c${id})`}>
        <rect x="0" y="0" width="200" height="330" fill="#fff" opacity=".1" />
        <rect x="0" y={liquidTop} width="200" height="330" fill={`url(#l${id})`} />
        <ellipse cx="100" cy={liquidTop} rx="120" ry="5" fill="#fff" opacity=".22" />
        <rect x="44" y="0" width="22" height="330" fill={`url(#h${id})`} opacity=".7" />
        <rect x="140" y="0" width="6" height="330" fill="#fff" opacity=".18" />
      </g>
      <g fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5">{s.body}</g>
      <rect x={s.label.x} y={s.label.y} width={s.label.w} height={s.label.h} fill="#f5efe6" opacity=".92" rx="2" />
      <rect x={s.label.x + 3} y={s.label.y + 3} width={s.label.w - 6} height={s.label.h - 6} fill="none" stroke="#c8a46a" strokeWidth=".8" rx="1" />
      <text x="100" y={s.label.y + s.label.h / 2 + 5} textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" letterSpacing="3" fill="#1a1714">
        {label}
      </text>
    </svg>
  );
}
