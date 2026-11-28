"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Team.css"; // shared look: heading, chip, basket, receipt
import "./TeamComingSoon.css";
import { delaGothicOne, ibmPlexMono, zenMaruGothic, gangOfThree } from "./fonts";

/* ------------------------------------------------------------------
 * "Meet the staff!" — COMING SOON placeholder
 * Same heading + basket as the real Team section, but the basket holds a
 * COMING SOON receipt and the four WEHack mascots until team photos are ready.
 * To switch back later: in app/page.tsx use <Team /> instead of <TeamComingSoon />.
 * ------------------------------------------------------------------ */

const ASSET = "/img/static/images/team";
const BASKET = `${ASSET}/basket-fullteam.png`;
const RECEIPT = { src: `${ASSET}/receipt-01.png`, ratio: 813 / 1313, top: 17.44, dbl: 19.19, dashTop: 76.47, dash: 76.69, bar: 84.23 };

interface Mascot {
  src: string;
  alt: string;
  says: string;
  /** centre inside the 572×953 basket, width in basket px, tilt in degrees */
  x: number;
  y: number;
  w: number;
  tilt: number;
}

const MASCOTS: Mascot[] = [
  { src: `${ASSET}/mascots/mascot-locked-in.png`, alt: "WEHack mascot locked in on a laptop", says: "locked in on the team page…", x: 160, y: 186, w: 262, tilt: -4 },
  { src: `${ASSET}/mascots/mascot-cool.png`, alt: "WEHack mascot in sunglasses", says: "too cool to be camera shy", x: 418, y: 196, w: 248, tilt: 5 },
  { src: `${ASSET}/mascots/mascot-drawing.png`, alt: "WEHack mascot drawing", says: "sketching everyone's portraits!", x: 170, y: 800, w: 292, tilt: 3 },
  { src: `${ASSET}/mascots/mascot-low-energy.png`, alt: "Sleepy WEHack mascot holding an energy drink", says: "photoshoot? after my nap…", x: 414, y: 780, w: 250, tilt: -3 },
];

// Drop order: the receipt lands first, then each mascot hops in.
const N = 1 + MASCOTS.length;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = "hidden";
};

const dropStyle = (i: number, x: number, y: number, z: number): React.CSSProperties => ({
  left: x,
  top: y,
  zIndex: z,
  transform: `translate(-50%, calc(-50% + (1 - var(--t${i}, 0)) * -130vh))`,
});

/** The COMING SOON receipt, drawn on the receipt artwork. */
const SoonReceipt = () => {
  const vars = {
    "--ratio": RECEIPT.ratio,
    "--title-b": `${100 - RECEIPT.top}%`,
    "--body-t": `${RECEIPT.dbl + 1.5}%`,
    "--body-b": `${100 - RECEIPT.dashTop + 1.5}%`,
    "--team-t": `${RECEIPT.dash}%`,
    "--team-h": `${RECEIPT.bar - RECEIPT.dash}%`,
  } as React.CSSProperties;

  return (
    <div className="tm-receipt" style={vars}>
      <img className="tm-receipt-art" src={RECEIPT.src} alt="" draggable={false} />
      <div className="tm-r-title tcs-r-title">COMING SOON!</div>
      <div className="tm-r-body">
        <div className="tm-row">
          <span>04/17 – 04/18</span>
          <span>2027</span>
        </div>
        <div className="tm-photo tcs-photo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          <span className="tcs-photo-label">team photos</span>
          <span className="tcs-photo-sub">
            restocking<span className="tcs-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>
          </span>
          <span className="tcs-stamp">SOON</span>
        </div>
        <div className="tm-row">
          <span>01 Team photos</span>
          <span className="tm-stars">SOON</span>
        </div>
        <div className="tm-row">
          <span>02 Staff intros</span>
          <span className="tm-stars">SOON</span>
        </div>
      </div>
      <div className="tm-r-team">
        <span>STATUS</span>
        <span>Restocking</span>
      </div>
    </div>
  );
};

const TeamComingSoon: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // Mascots take turns "talking"; hovering or focusing one makes it talk instead.
  const [talking, setTalking] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  // Scroll-driven drop-in + basket size (same behaviour as the real Team section).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const bs =
        vw < 768
          ? Math.max(0.3, Math.min((vw - 24) / 600, (vh * 0.92 - 320) / 960))
          : Math.max(0.4, Math.min(1.1, (vw / 2 - 30) / 630, (vh - 40) / 960));
      el.style.setProperty("--bs", bs.toFixed(3));
      const r = el.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh) / 0.88);
      for (let i = 0; i < N; i++) {
        const t = ease(clamp01((p - 0.04 - i * 0.12) / 0.16));
        el.style.setProperty("--t" + i, t.toFixed(3));
      }
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

  useEffect(() => {
    const id = window.setInterval(() => setTalking((t) => (t + 1) % MASCOTS.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  const speaker = hovered ?? talking;

  return (
    <section
      id="teams"
      ref={sectionRef}
      className={`tm-section tcs-section ${delaGothicOne.variable} ${ibmPlexMono.variable} ${zenMaruGothic.variable} ${gangOfThree.variable}`}
    >
      <div className="tm-sticky">
        {/* Left column: heading, chip, coming-soon note */}
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
          <div className="tcs-soon">
            <span className="tcs-pill">
              <span className="tcs-pill-dot" aria-hidden="true" />
              COMING SOON
            </span>
            <p className="tcs-note">
              Our staff is getting camera-ready! Team photos are being restocked. Until then, our mascots are minding the aisle.
            </p>
          </div>
        </div>

        {/* Right: basket with the COMING SOON receipt and the mascots */}
        <div className="tm-basket">
          <img className="tm-basket-img" src={BASKET} alt="" draggable={false} onError={hideOnError} />

          <div className="tm-card-pos" style={dropStyle(0, 286, 478, 2)}>
            <div className="tcs-receipt">
              <SoonReceipt />
            </div>
          </div>

          {MASCOTS.map((m, k) => (
            <div key={m.src} className="tcs-mascot-pos" style={{ ...dropStyle(k + 1, m.x, m.y, speaker === k ? 40 : 5 + k), width: m.w }}>
              <div
                className={`tcs-mascot ${speaker === k ? "is-talking" : ""}`}
                style={{ ["--tilt" as string]: `${m.tilt}deg`, ["--delay" as string]: `${-k * 0.8}s` }}
                tabIndex={0}
                role="img"
                aria-label={`${m.alt}: "${m.says}"`}
                onMouseEnter={() => setHovered(k)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(k)}
                onBlur={() => setHovered(null)}
                onClick={() => setHovered(k)}
              >
                <span className="tcs-bubble" aria-hidden="true">
                  {m.says}
                </span>
                <img src={m.src} alt="" draggable={false} onError={hideOnError} />
              </div>
            </div>
          ))}

          {/* Same basket image again, middle cut out, so the rim sits over everything */}
          <img className="tm-basket-img tm-basket-front" src={BASKET} alt="" draggable={false} onError={hideOnError} />
        </div>
      </div>
    </section>
  );
};

export default TeamComingSoon;
