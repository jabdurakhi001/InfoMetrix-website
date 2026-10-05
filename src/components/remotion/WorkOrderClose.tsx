import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

/* A frame-accurate animation of one heavy-duty repair order being priced,
   checked, and synced to the books. Rendered live by @remotion/player.
   All figures are illustrative demo data. */

export const WO_FPS = 30;
export const WO_DURATION = 330; // 11s loop
export const WO_WIDTH = 640;
export const WO_HEIGHT = 600;

const INK = "#10261F";
const MUTED = "#5B6B63";
const RULE = "#D9D3C5";
const PAPER = "#FBF9F4";
const GREEN = "#1F6B4F";
const RED = "#9A3B2E";

const LABOR_RATE = 165;
const TECH_COST = 42; // loaded cost per clocked hour

type Line =
  | { kind: "labor"; label: string; hours: number }
  | { kind: "part"; label: string; sell: number; cost: number };

const LINES: Line[] = [
  { kind: "labor", label: "PM service, A-level", hours: 2.5 },
  { kind: "labor", label: "Brake job, drive axles", hours: 4.0 },
  { kind: "part", label: "Brake shoe kits ×2", sell: 412, cost: 286 },
  { kind: "part", label: "Brake drums ×2", sell: 596, cost: 418 },
  { kind: "part", label: "Oil, fuel & air filters", sell: 176, cost: 118 },
];

const BILLED_HOURS = LINES.reduce((s, l) => (l.kind === "labor" ? s + l.hours : s), 0); // 6.5
const CLOCKED_HOURS = 7.2;
const LABOR = BILLED_HOURS * LABOR_RATE;
const PARTS_SELL = LINES.reduce((s, l) => (l.kind === "part" ? s + l.sell : s), 0);
const PARTS_COST = LINES.reduce((s, l) => (l.kind === "part" ? s + l.cost : s), 0);
const INVOICE = LABOR + PARTS_SELL;
const PARTS_MARGIN = (PARTS_SELL - PARTS_COST) / PARTS_SELL;
const EFFICIENCY = BILLED_HOURS / CLOCKED_HOURS;
const GROSS_PROFIT = INVOICE - PARTS_COST - CLOCKED_HOURS * TECH_COST;

const money = (n: number, cents = false) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });

const lineAmount = (l: Line) => (l.kind === "labor" ? l.hours * LABOR_RATE : l.sell);

export function WorkOrderClose() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sheetOpacity = interpolate(frame, [0, 12, WO_DURATION - 18, WO_DURATION], [0, 1, 1, 0]);
  const head = spring({ frame, fps, config: { damping: 200 } });

  const rowStart = (i: number) => 16 + i * 13;
  const rowsDone = rowStart(LINES.length - 1) + 26;

  const ease = (from: number, len: number) =>
    interpolate(frame, [from, from + len], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  const totalT = ease(rowsDone, 24);
  const kpiStart = rowsDone + 30;
  const kpi = [0, 1, 2].map((i) => ease(kpiStart + i * 12, 26));
  const stamp = spring({ frame: frame - (kpiStart + 70), fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });

  const kpis = [
    { label: "Parts margin", value: `${(PARTS_MARGIN * 100 * kpi[0]).toFixed(1)}%`, bar: PARTS_MARGIN, color: GREEN },
    { label: "Tech efficiency", value: `${Math.round(EFFICIENCY * 100 * kpi[1])}%`, bar: EFFICIENCY, color: EFFICIENCY < 1 ? RED : GREEN },
    { label: "Job gross profit", value: money(GROSS_PROFIT * kpi[2]), bar: GROSS_PROFIT / INVOICE, color: GREEN },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
      <div
        style={{
          width: 580,
          height: 548,
          background: PAPER,
          border: `1px solid ${RULE}`,
          boxShadow: "0 30px 60px -30px rgba(16,38,31,0.35)",
          padding: "30px 36px",
          position: "relative",
          opacity: sheetOpacity,
          color: INK,
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 10, opacity: head, transform: `translateY(${(1 - head) * 10}px)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, color: MUTED }}>
            <span>REPAIR ORDER · WO-1184</span>
            <span>DEMO DATA</span>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 25, marginTop: 4 }}>
            Unit 14
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 1.5, color: MUTED, marginLeft: 12 }}>2019 CASCADIA</span>
          </div>
        </div>

        {/* Lines */}
        <div style={{ marginTop: 4 }}>
          {LINES.map((l, i) => {
            const t = spring({ frame: frame - rowStart(i), fps, config: { damping: 200 } });
            const amt = lineAmount(l) * ease(rowStart(i), 24);
            return (
              <div
                key={l.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "54px 1fr auto",
                  alignItems: "baseline",
                  padding: "9px 0",
                  borderBottom: `1px solid ${RULE}`,
                  opacity: t,
                  transform: `translateX(${(1 - t) * -14}px)`,
                  fontSize: 15,
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5, color: MUTED }}>
                  {l.kind === "labor" ? "LABOR" : "PARTS"}
                </span>
                <span>
                  {l.label}
                  {l.kind === "labor" && <span style={{ color: MUTED, fontSize: 13 }}>{`  ${l.hours.toFixed(1)} h`}</span>}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{money(amt, true)}</span>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontWeight: 600, fontSize: 16, opacity: totalT }}>
            <span>Invoice total</span>
            <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{money(INVOICE * totalT, true)}</span>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {kpis.map((k, i) => (
            <div key={k.label} style={{ opacity: interpolate(kpi[i], [0, 0.2], [0, 1]) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ fontFamily: "var(--font-mono)", letterSpacing: 1.2, color: MUTED }}>{k.label.toUpperCase()}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: INK }}>{k.value}</span>
              </div>
              <div style={{ height: 6, background: "#ECE7DB" }}>
                <div style={{ height: "100%", width: `${Math.min(1, k.bar) * 100 * kpi[i]}%`, background: k.color }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: MUTED, opacity: kpi[1] }}>
            {`Billed ${BILLED_HOURS.toFixed(1)} h of ${CLOCKED_HOURS.toFixed(1)} h clocked — 0.7 h not recovered`}
          </div>
        </div>

        {/* Stamp */}
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 58,
            transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [1.6, 1])})`,
            opacity: interpolate(stamp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
            border: `2.5px solid ${GREEN}`,
            color: GREEN,
            background: "rgba(251,249,244,0.92)",
            padding: "5px 12px",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            letterSpacing: 2.5,
            fontSize: 13,
            lineHeight: 1.25,
            textAlign: "center",
          }}
        >
          CLOSED &amp; SYNCED
          <div style={{ fontSize: 9, letterSpacing: 2, fontWeight: 500 }}>TO QUICKBOOKS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
