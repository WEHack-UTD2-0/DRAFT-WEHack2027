"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Team.css";
import { delaGothicOne, ibmPlexMono, zenMaruGothic, gangOfThree } from "./fonts";

/* Design assets live in /public/img/static/images/team/ */
const ASSET = "/img/static/images/team";

/**
 * The three receipt designs. Numbers are % of the receipt's height, measured
 * from the artwork, so text lines up with the printed lines on every receipt:
 *  dbl  = bottom of the double line under the title
 *  dash = the dashed line          bar = top of the barcode
 *  top  = top of the double line (title sits above it)
 */
const RECEIPTS = {
  "01": { src: `${ASSET}/receipt-01.png`, ratio: 813 / 1313, top: 17.44, dbl: 19.19, dashTop: 76.47, dash: 76.69, bar: 84.23 },
} as const;
type ReceiptKey = keyof typeof RECEIPTS;

// Basket artwork turned upright (781×1300). The same image is drawn twice: once behind
// the receipts, and once on top with its middle cut out (see .tm-basket-front in Team.css),
// so the rim sits over the receipts and the two layers always line up.
const BASKET = `${ASSET}/basket-fullteam.png`;

interface TeamReceipt {
  name: string;
  item1: string;
  item2: string;
  receipt: ReceiptKey;
  /** Optional team photo, e.g. "/img/static/images/team/development.webp" (put the file in /public). */
  photo?: string;
}

// Seven receipts in the basket. Co-Directors + Advisor sits top centre,
// the six teams fill the rest (see SLOTS below).
const TEAMS: TeamReceipt[] = [
  { name: "Co-Directors + Advisor", item1: "Matcha latte", item2: "Strawberry milk", receipt: "01" },
  { name: "Development Team", item1: "Onigiri", item2: "Ramune", receipt: "01" },
  { name: "Logistics Team", item1: "Cup ramen", item2: "Onigiri", receipt: "01" },
  { name: "Marketing Team", item1: "Dango", item2: "Milk tea", receipt: "01" },
  { name: "Industry Team", item1: "Mochi", item2: "Coffee", receipt: "01" },
  { name: "Experience Team", item1: "Taiyaki", item2: "Juice", receipt: "01" },
  { name: "WEHack Team", item1: "Melon pan", item2: "Pocky", receipt: "01" },
];

const N = TEAMS.length;
const TILTS = [-1, -3, 2.5, -1.5, 3, -2.5, 1.5];
// Centre of each receipt inside the 572×953 basket, in the same order as TEAMS.
// Top row: 3 across (Co-Directors + Advisor in the middle); then 2 rows of 2.
const SLOTS: [number, number][] = [
  [286, 182], // Co-Directors + Advisor
  [120, 196], // Development
  [452, 200], // Logistics
  [161, 485], // Marketing
  [411, 492], // Industry
  [161, 780], // Experience
  [411, 786], // WEHack
];
const RECEIPT_SCALE = 0.64;

// If a basket image ever fails to load, hide it instead of showing a broken-image icon.
const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = "hidden";
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

const PhotoPlaceholder = () => (
  <div className="tm-photo-empty">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
    <span>team photo</span>
  </div>
);

/** One receipt drawn on the receipt artwork. `big` is the zoomed-in version. */
const Receipt: React.FC<{ team: TeamReceipt; big?: boolean }> = ({ team, big }) => {
  const r = RECEIPTS[team.receipt];
  const vars = {
    "--ratio": r.ratio,
    "--title-b": `${100 - r.top}%`,
    "--body-t": `${r.dbl + 1.5}%`,
    "--body-b": `${100 - r.dashTop + 1.5}%`,
    "--team-t": `${r.dash}%`,
    "--team-h": `${r.bar - r.dash}%`,
  } as React.CSSProperties;

  return (
    <div className={big ? "tm-receipt tm-receipt--big" : "tm-receipt"} style={vars}>
      <img className="tm-receipt-art" src={r.src} alt="" draggable={false} />
      <div className="tm-r-title">{team.name}&apos;s PICK!</div>
      <div className="tm-r-body">
        <div className="tm-row">
          <span>04/17 – 04/18</span>
          <span>2027</span>
        </div>
        <div className="tm-photo">
          {team.photo ? <img src={team.photo} alt={team.name} /> : <PhotoPlaceholder />}
        </div>
        <div className="tm-row">
          <span>01 {team.item1}</span>
          <span className="tm-stars">★★★★★</span>
        </div>
        <div className="tm-row">
          <span>02 {team.item2}</span>
          <span className="tm-stars">★★★★☆</span>
        </div>
      </div>
      <div className="tm-r-team">
        <span>TEAM</span>
        <span>{team.name}</span>
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [front, setFront] = useState(0);
  // true while a receipt is zoomed in (after Prev / Next or clicking a receipt)
  const [zoomed, setZoomed] = useState(false);
  const zoomedRef = useRef(false);
  zoomedRef.current = zoomed;

  // Scroll-driven "drop into the basket" animation.
  // Each receipt gets a CSS variable --tN going 0 → 1; the card's translateY reads it.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // Basket scale (designed at 572×953): as big as the screen allows.
      const bs =
        vw < 768
          ? Math.max(0.3, Math.min((vw - 24) / 600, (vh * 0.92 - 250) / 960))
          : Math.max(0.4, Math.min(1.1, (vw / 2 - 30) / 630, (vh - 40) / 960));
      el.style.setProperty("--bs", bs.toFixed(3));
      const r = el.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh) / 0.88);
      for (let i = 0; i < N; i++) {
        // Last receipt drops first, first receipt drops last.
        const t = ease(clamp01((p - 0.04 - (N - 1 - i) * 0.11) / 0.14));
        el.style.setProperty("--t" + i, t.toFixed(3));
      }
      // Close the zoomed receipt once the section is scrolled out of view.
      if (zoomedRef.current && (r.bottom < vh * 0.5 || r.top > vh * 0.5)) setZoomed(false);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // capture:true catches scrolling of ANY element (the site scrolls inside .App, not window).
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const next = useCallback(() => {
    setFront((f) => (zoomedRef.current ? (f + 1) % N : f));
    setZoomed(true);
  }, []);
  const prev = useCallback(() => {
    setFront((f) => (zoomedRef.current ? (f + N - 1) % N : f));
    setZoomed(true);
  }, []);
  const open = useCallback((i: number) => {
    setFront(i);
    setZoomed(true);
  }, []);
  const close = useCallback(() => setZoomed(false), []);

  // Keyboard: ← / → to browse, Esc to close while zoomed.
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, next, prev, close]);

  const cards = useMemo(
    () =>
      TEAMS.map((t, i) => ({
        ...t,
        i,
        x: SLOTS[i][0],
        y: SLOTS[i][1],
        z: i === 0 ? 10 : 1 + i, // Co-Directors receipt overlaps its neighbours, not the other way round
        fan: `rotate(${TILTS[i]}deg) scale(${RECEIPT_SCALE})`,
      })),
    [front]
  );

  return (
    <section
      id="teams"
      ref={sectionRef}
      className={`tm-section ${zoomed ? "is-zoomed" : ""} ${delaGothicOne.variable} ${ibmPlexMono.variable} ${zenMaruGothic.variable} ${gangOfThree.variable}`}
    >
      <div className="tm-sticky">
        {/* Left column: heading, chip, pager */}
        <div className="tm-copy">
          <h2 className="tm-title">
            Meet the
            <br />
            staff!
          </h2>
          <div className="tm-chip">
            <span className="tm-chip-tag">BASKET</span>
            <span className="tm-chip-label">THE TEAMS</span>
          </div>
          <div className="tm-pager">
            <button type="button" className="tm-btn" onClick={prev}>
              ← Prev
            </button>
            <span className="tm-count">
              {front + 1} / {N}
            </span>
            <button type="button" className="tm-btn tm-btn-next" onClick={next}>
              Next →
            </button>
          </div>
        </div>

        {/* Right: shopping basket with the receipts */}
        <div className="tm-basket">
          <img className="tm-basket-img" src={BASKET} alt="" draggable={false} onError={hideOnError} />
          {cards.map((c) => (
            <div
              key={c.name}
              className="tm-card-pos"
              style={{
                left: c.x,
                top: c.y,
                zIndex: c.z,
                transform: `translate(-50%, calc(-50% + (1 - var(--t${c.i}, 0)) * -130vh))`,
              }}
            >
              <div
                className="tm-card"
                style={{ transform: c.fan }}
                onClick={() => open(c.i)}
                role="button"
                tabIndex={0}
                aria-label={`View ${c.name} receipt`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(c.i);
                  }
                }}
              >
                <Receipt team={c} />
              </div>
            </div>
          ))}
          {/* Same basket image again, middle cut out, so the rim sits over the receipts */}
          <img className="tm-basket-img tm-basket-front" src={BASKET} alt="" draggable={false} onError={hideOnError} />
        </div>

        {/* Zoomed-in receipt: appears when browsing with Prev / Next */}
        {zoomed && (
          <>
            <div className="tm-backdrop" onClick={close} aria-hidden="true" />
            <div className="tm-zoom" role="dialog" aria-label={`${TEAMS[front].name} receipt`}>
              {/* key makes the zoom-in animation replay on every Prev / Next */}
              <div key={front} className="tm-zoom-card" style={{ ["--tilt" as string]: `${TILTS[front]}deg` }}>
                <Receipt team={TEAMS[front]} big />
              </div>
              <button type="button" className="tm-zoom-close" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Team;
