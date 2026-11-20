import React from "react";

/** Elements the scroll engine moves directly (transform/opacity written per frame). */
export type SceneParts = {
	inner?: HTMLDivElement | null;
	wrap?: HTMLDivElement | null;
	doorL?: HTMLDivElement | null;
	doorR?: HTMLDivElement | null;
	poster?: HTMLDivElement | null;
	sticker?: HTMLDivElement | null;
	title?: HTMLDivElement | null;
	hint?: HTMLDivElement | null;
};

type Props = {
	sceneRef: React.RefObject<HTMLDivElement>;
	doorRef: React.RefObject<HTMLDivElement>;
	parts: React.MutableRefObject<SceneParts>;
	cd: { d: string; h: string; m: string };
};

export const IMG = {
	jumbotron: "/img/wemart/jumbotron.png",
	aisle: "/img/wemart/aisle-bright.png",
};

/** Sky colour along the top edge of jumbotron.png, so the art can sit low on tall screens. */
const SKY = "#c1daec";
/** Rendered width of the storefront art: full width, or wide enough to be 60vh tall. */
const ART_W = "max(100vw, 144vh)";
/** Door opening in jumbotron.png pixels (1440×600). `mid` is the line between the two panels. */
export const DOOR = { x0: 603, x1: 861, y0: 409, y1: 579, mid: 723.5 };
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(4)}%`;

/** The slice of the storefront art that a door panel covers, so the closed doors match it exactly. */
function DoorArt({ x0, x1 }: { x0: number; x1: number }) {
	const w = x1 - x0;
	const h = DOOR.y1 - DOOR.y0;
	return (
		<img
			src={IMG.jumbotron}
			alt=""
			draggable={false}
			style={{ position: "absolute", maxWidth: "none", width: pct(1440, w), height: pct(600, h), left: pct(-x0, w), top: pct(-DOOR.y0, h), userSelect: "none", pointerEvents: "none" }}
		/>
	);
}

// The storefront (jumbotron.png). Fixed behind everything; the engine in WEmartSite zooms
// `inner` so the door opening fills the screen, then slides the two door panels apart.
// The scroll engine writes transform/opacity directly on the `parts` elements; the
// inline values below are only the starting state (top of the page).
export default function Scene({ sceneRef, doorRef, parts, cd }: Props) {
	return (
  <>
  <div ref={sceneRef} style={{ position: "fixed", inset: "0", zIndex: "0", overflow: "hidden", background: SKY }}>
      <div ref={(el) => { parts.current.inner = el; }} style={{ position: "absolute", inset: "0", transform: "translateY(0px) scale(1)", willChange: "transform" }}>
        {/* Storefront illustration: fills the width, or 60vh tall on narrow screens (sides crop,
            the doors stay centered). Sky colour above it matches the art's top edge. */}
        <div ref={(el) => { parts.current.wrap = el; }} style={{ position: "absolute", bottom: "0", left: "50%", width: ART_W, marginLeft: `calc(${ART_W} / -2)`, aspectRatio: "1440 / 600" }}>
          <img src={IMG.jumbotron} alt="" draggable={false} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", userSelect: "none" }} />
          {/* Door opening, placed over the doors in the art. The aisle shows through as they slide. */}
          <div ref={doorRef} style={{ position: "absolute", left: pct(DOOR.x0, 1440), top: pct(DOOR.y0, 600), width: pct(DOOR.x1 - DOOR.x0, 1440), height: pct(DOOR.y1 - DOOR.y0, 600), containerType: "inline-size", overflow: "hidden", background: `url(${IMG.aisle}) center / cover #e9f1f6` }}>
            <div ref={(el) => { parts.current.doorL = el; }} style={{ position: "absolute", top: "0", bottom: "0", left: "0", width: pct(DOOR.mid - DOOR.x0, DOOR.x1 - DOOR.x0), willChange: "transform", transform: "translateX(0%)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2%" }}>
              <DoorArt x0={DOOR.x0} x1={DOOR.mid} />
                <div ref={(el) => { parts.current.poster = el; }} style={{ width: "94%", aspectRatio: "1.46", boxSizing: "border-box", background: "#FBF5E3", border: ".5cqw solid #4a3a30", transform: "rotate(-2deg) scale(0.5)", boxShadow: "1.2cqw 1.2cqw 7px rgba(74,58,48,.28)", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
  <div style={{ position: "absolute", left: "38%", top: "-.8cqw", width: "24%", height: "1.8cqw", background: "#EBD08A", opacity: ".9" }}></div>
  <div style={{ background: "#E9A593", display: "flex", justifyContent: "space-between", padding: ".9cqw 1.3cqw", font: "500 .8cqw 'IBM Plex Mono'", letterSpacing: ".08em", whiteSpace: "nowrap" }}><span>お知らせ · NOTICE TO ALL SHOPPERS</span><span>AISLE 01</span></div>
  <div style={{ flex: "1", padding: "1.2cqw 1.5cqw .8cqw", display: "flex", flexDirection: "column", gap: ".6cqw", position: "relative" }}>
  <span style={{ fontWeight: "900", fontSize: "1.15cqw", color: "#7ba3d6" }}>What&apos;s the “WE” in WEHack?</span>
  <span style={{ fontFamily: "'Yusei Magic'", fontWeight: "900", fontSize: "3cqw", lineHeight: "1" }}>W·E <span style={{ color: "#7ba3d6" }}>=</span> Women<br />Empowered.</span>
  <span style={{ fontSize: ".95cqw", lineHeight: "1.45", maxWidth: "78%", color: "#4a3a30" }}>WEHack is a 24-hour hackathon built for women and gender-minority students — first-timers to seasoned builders. Grab a basket, find your team, and build something you&apos;d want on the shelf.</span>
  <div style={{ borderTop: "1px dashed #4a3a30", borderBottom: "1px dashed #4a3a30", padding: ".6cqw 0", display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: ".8cqw" }}><div style={{ display: "flex", flexDirection: "column", gap: ".2cqw" }}><span style={{ font: "500 .75cqw 'IBM Plex Mono'", letterSpacing: ".08em", color: "#6b6258" }}>OPEN</span><span style={{ fontWeight: "700", fontSize: "1.05cqw", lineHeight: "1.15" }}>Apr 11–12, 2027</span></div><div style={{ display: "flex", flexDirection: "column", gap: ".2cqw" }}><span style={{ font: "500 .75cqw 'IBM Plex Mono'", letterSpacing: ".08em", color: "#6b6258" }}>ADMISSION</span><span style={{ fontWeight: "700", fontSize: "1.05cqw", lineHeight: "1.15" }}>Free for students</span></div><div style={{ display: "flex", flexDirection: "column", gap: ".2cqw" }}><span style={{ font: "500 .75cqw 'IBM Plex Mono'", letterSpacing: ".08em", color: "#6b6258" }}>STOCKED WITH</span><span style={{ fontWeight: "700", fontSize: "1.05cqw", lineHeight: "1.15" }}>Mentors, workshops, snacks</span></div></div>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontFamily: "'Yusei Magic'", fontSize: "1.1cqw" }}>— the WEmart staff</span><span style={{ width: "3.2cqw", height: "3.2cqw", borderRadius: "50%", border: ".2cqw solid #E9A593", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "1.2cqw", color: "#7ba3d6" }}>WE</span></div>
  </div></div>
              </div>
            <div ref={(el) => { parts.current.doorR = el; }} style={{ position: "absolute", top: "0", bottom: "0", right: "0", width: pct(DOOR.x1 - DOOR.mid, DOOR.x1 - DOOR.x0), willChange: "transform", transform: "translateX(0%)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2%" }}>
              <DoorArt x0={DOOR.mid} x1={DOOR.x1} />
                <div ref={(el) => { parts.current.sticker = el; }} style={{ width: "84%", aspectRatio: "1", borderRadius: "50%", background: "#E9A593", border: ".9cqw solid #4a3a30", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.4cqw", transform: "rotate(8deg) scale(0.5)", textAlign: "center", position: "relative" }}><span style={{ fontFamily: "'Yusei Magic'", fontSize: "3.4cqw", lineHeight: "1", whiteSpace: "nowrap" }}>SALE ENDS IN</span><span style={{ font: "600 4.2cqw 'IBM Plex Mono'", lineHeight: "1.1", whiteSpace: "nowrap" }}>{cd.d}d {cd.h}h {cd.m}m</span><span style={{ font: "500 2.2cqw 'IBM Plex Mono'", whiteSpace: "nowrap" }}>until doors open</span></div>
            </div>
          </div>
        </div>
      </div>
  
      <div ref={(el) => { parts.current.title = el; }} style={{ position: "absolute", left: "clamp(20px,2.6vw,48px)", top: "clamp(84px,12vh,140px)", opacity: "1", transform: "translateY(0px)", pointerEvents: "none", maxWidth: "94vw" }}>
        <h1 className="wm-hero-title">The Trip to WEmart</h1>
        <div className="wm-hero-date">April 11th – 12th</div>
      </div>
      <div ref={(el) => { parts.current.hint = el; }} style={{ position: "absolute", left: "50%", bottom: "5vh", transform: "translateX(-50%)", opacity: "1", display: "flex", alignItems: "center", gap: "10px", background: "#4a3a30", color: "#fff", padding: "10px 16px", borderRadius: "30px", font: "500 12px 'IBM Plex Mono'", letterSpacing: ".12em", pointerEvents: "none", whiteSpace: "nowrap" }}>SCROLL TO OPEN THE DOORS ↓</div>
  </div>
  </>
	);
}
