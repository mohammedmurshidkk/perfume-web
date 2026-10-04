import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function ogImage({ eyebrow, title, subtitle, color = "#4a2516" }: { eyebrow: string; title: string; subtitle: string; color?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: `radial-gradient(circle at 78% 60%, ${color} 0%, #0e0c0a 55%)`, color: "#f5efe6", padding: 80, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "62%" }}>
          <div style={{ fontSize: 26, letterSpacing: 10, color: "#c8a46a" }}>MAISON ÉLAN</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, letterSpacing: 6, color: "#c8a46a", textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: 92, lineHeight: 1, marginTop: 16 }}>{title}</div>
            <div style={{ fontSize: 30, marginTop: 24, color: "#cfc6ba" }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 90, height: 80, background: "linear-gradient(90deg,#f6e3b4,#c8a46a,#8a6a36)", borderRadius: 10 }} />
            <div style={{ width: 40, height: 22, background: "rgba(233,220,203,.5)" }} />
            <div style={{ width: 230, height: 280, borderRadius: 30, border: "2px solid rgba(255,255,255,.5)", background: `linear-gradient(160deg, rgba(255,255,255,.25), ${color})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#f5efe6", color: "#1a1714", padding: "14px 26px", fontSize: 24, letterSpacing: 6 }}>ÉLAN</div>
            </div>
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
