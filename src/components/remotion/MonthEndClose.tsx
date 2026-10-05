import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

/* A frame-accurate animation of one month-end close for a demo trucking
   company. Rendered live in the page by @remotion/player, so it inherits the
   site's fonts and colors. All figures are illustrative demo data. */

export const CLOSE_FPS = 30;
export const CLOSE_DURATION = 300; // 10s loop
export const CLOSE_WIDTH = 640;
export const CLOSE_HEIGHT = 560;

const INK = "#10261F";
const MUTED = "#5B6B63";
const RULE = "#D9D3C5";
const PAPER = "#FBF9F4";
const GREEN = "#1F6B4F";

const ROWS = [
  { label: "Fuel", amount: 48210 },
  { label: "Driver pay", amount: 61875 },
  { label: "Maintenance & tires", amount: 14390 },
  { label: "Insurance", amount: 9120 },
  { label: "Tolls & permits", amount: 3460 },
];
const TOTAL = ROWS.reduce((s, r) => s + r.amount, 0);
const MILES = 74_600;
const CPM = TOTAL / MILES;

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function MonthEndClose() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade the whole sheet out at the end so the loop restarts cleanly.
  const sheetOpacity = interpolate(frame, [0, 12, CLOSE_DURATION - 18, CLOSE_DURATION], [0, 1, 1, 0]);

  const headerIn = spring({ frame, fps, config: { damping: 200 } });

  // Rows enter one by one starting at frame 18, 14 frames apart.
  const rowStart = (i: number) => 18 + i * 14;
  const rowsDone = rowStart(ROWS.length - 1) + 30;

  const totalShown = ROWS.reduce((sum, r, i) => {
    const t = interpolate(frame, [rowStart(i), rowStart(i) + 28], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return sum + r.amount * t;
  }, 0);

  // Cost-per-mile bar draws after the rows settle.
  const barT = interpolate(frame, [rowsDone, rowsDone + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Stamp lands last.
  const stampFrame = rowsDone + 56;
  const stamp = spring({ frame: frame - stampFrame, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ background: "transparent", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
      <div
        style={{
          width: 580,
          height: 500,
          background: PAPER,
          border: `1px solid ${RULE}`,
          boxShadow: "0 30px 60px -30px rgba(16,38,31,0.35)",
          padding: "34px 38px",
          position: "relative",
          opacity: sheetOpacity,
          color: INK,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: `2px solid ${INK}`,
            paddingBottom: 12,
            opacity: headerIn,
            transform: `translateY(${(1 - headerIn) * 10}px)`,
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, color: MUTED }}>MONTH-END CLOSE · OCTOBER</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginTop: 4 }}>Ridgeline Freight</div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: MUTED }}>DEMO DATA</div>
        </div>

        {/* Ledger rows */}
        <div style={{ marginTop: 10 }}>
          {ROWS.map((r, i) => {
            const t = spring({ frame: frame - rowStart(i), fps, config: { damping: 200 } });
            const shown = interpolate(frame, [rowStart(i), rowStart(i) + 28], [0, r.amount], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "11px 0",
                  borderBottom: `1px solid ${RULE}`,
                  opacity: t,
                  transform: `translateX(${(1 - t) * -16}px)`,
                  fontSize: 16,
                }}
              >
                <span>{r.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{money(shown)}</span>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontWeight: 600, fontSize: 17 }}>
            <span>Operating cost</span>
            <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{money(totalShown)}</span>
          </div>
        </div>

        {/* Cost per mile */}
        <div style={{ marginTop: 26, opacity: interpolate(barT, [0, 0.15], [0, 1]) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: MUTED, marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", letterSpacing: 1 }}>COST PER MILE · {MILES.toLocaleString("en-US")} MI</span>
            <span style={{ fontFamily: "var(--font-mono)", color: INK, fontSize: 18 }}>${(CPM * barT).toFixed(2)}</span>
          </div>
          <div style={{ height: 10, background: "#ECE7DB" }}>
            <div style={{ height: "100%", width: `${barT * 78}%`, background: GREEN }} />
          </div>
        </div>

        {/* Reconciled stamp */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 62,
            transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [1.6, 1])})`,
            opacity: interpolate(stamp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
            border: `2.5px solid ${GREEN}`,
            color: GREEN,
            padding: "6px 14px",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            letterSpacing: 3,
            fontSize: 15,
          }}
        >
          RECONCILED
        </div>
      </div>
    </AbsoluteFill>
  );
}
