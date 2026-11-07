"use client";

import React, { useRef, useState } from "react";
import Photo from "./Photo";
import { officers } from "./content";
import { useFrame, ease, c, smooth, setStyle } from "./frame";

// AISLE 02 · Ice cream freezer. Two frosted lids start closed, slide open as the freezer
// reaches the middle of the screen, and close again as you scroll past (lid 0 → 1 → 0).
export default function Officers() {
	const freezerRef = useRef<HTMLDivElement>(null);
	const lidL = useRef<HTMLDivElement>(null);
	const lidR = useRef<HTMLDivElement>(null);
	const [lidOpen, setLidOpen] = useState(false);
	const toggleLid = () => setLidOpen((v) => !v);
	const lidLabel = lidOpen ? "Close lids" : "Slide lids open";

	// Lids follow where the freezer's middle sits on screen (as a fraction of the viewport):
	//   below 105% → closed while it scrolls into view
	//   105% → 60% → slide open   (~4 wheel clicks, glided so clicks blend together)
	//   60% → 20%  → stay open
	//   20% → -25% → slide closed again as it leaves the top
	// Works the same scrolling back up. "Slide lids open" forces them open.
	useFrame((_, dt) => {
		const f = freezerRef.current;
		if (!f) return;
		const vh = window.innerHeight;
		const r = f.getBoundingClientRect();
		const mid = (r.top + r.height / 2) / vh;
		const opening = ease(c((1.05 - mid) / 0.45));
		const closing = ease(c((0.2 - mid) / 0.45));
		const lid = smooth(f, "lid", lidOpen ? 1 : opening * (1 - closing), dt, 220);
		setStyle(lidL.current, "transform", `translateX(${(lid * -100).toFixed(2)}%)`);
		setStyle(lidR.current, "transform", `translateX(${(lid * 100).toFixed(2)}%)`);
	});

	return (
		<section id="officers" style={{ padding: "clamp(60px,8vh,90px) 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "36px" }}>
		  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
		    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#BCD5D8", color: "#4a3a30", padding: "9px 16px", borderRadius: "8px", border: "1.8px solid #4a3a30", boxShadow: "0 4px 7px rgba(74,58,48,.28)" }}><span style={{ font: "500 11px 'IBM Plex Mono'", background: "#fff", color: "#76aecc", padding: "3px 7px", borderRadius: "3px" }}>AISLE 02</span><span style={{ fontFamily: "'Yusei Magic'", fontSize: "18px" }}>ICE CREAM</span><span style={{ fontWeight: "700" }}>アイス</span></div>
		    <h2 style={{ margin: "0", fontFamily: "'Yusei Magic'", fontWeight: "400", fontSize: "clamp(34px,5vw,64px)", lineHeight: "1", letterSpacing: "-.01em" }}>Freshly frozen officers</h2>
		    <p style={{ margin: "0", fontSize: "17px", maxWidth: "46ch", lineHeight: "1.5" }}>The team keeping WEmart stocked. Slide the lids to say hi.</p>
		  </div>

		  <div ref={freezerRef} style={{ width: "min(1040px,100%)", display: "flex", flexDirection: "column", }}>
		    <div style={{ background: "#fbfbf8", border: "1.8px solid #4a3a30", borderRadius: "22px 22px 6px 6px", padding: "clamp(12px,2vw,22px)", boxShadow: "3px 7px 7px rgba(74,58,48,.32)" }}>
		      <div style={{ position: "relative", border: "1.8px solid #4a3a30", borderRadius: "12px", overflow: "hidden", background: "linear-gradient(to bottom,#DCE8E4,#BCD5D8)" }}>
		        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: "14px", padding: "18px" }}>
		          {officers.map((o, $index) => (<React.Fragment key={$index}>
		            <div style={{ background: "#fff", border: "1.8px solid #4a3a30", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
		              <div style={{ height: "150px", position: "relative" }}><Photo id={`officer-${$index}`} label={"officer photo"} /></div>
		              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", padding: "8px 10px", background: "#EBD08A", borderTop: "1.8px solid #4a3a30" }}>
		                <div style={{ display: "flex", flexDirection: "column", minWidth: "0" }}><span style={{ fontWeight: "900", fontSize: "14px" }}>{o.name}</span><span style={{ font: "400 11px 'IBM Plex Mono'" }}>{o.role}</span></div>
		                <span style={{ fontFamily: "'Yusei Magic'", fontSize: "13px", color: "#7ba3d6" }}>{o.flavor}</span>
		              </div>
		            </div>
		          </React.Fragment>))}
		        </div>
		        <div ref={lidL} style={{ position: "absolute", top: "0", bottom: "0", left: "0", width: "50.5%", willChange: "transform", transform: "translateX(0%)", background: "linear-gradient(115deg,rgba(235,247,255,.92),rgba(200,230,250,.82) 38%,rgba(255,255,255,.95) 42%,rgba(200,230,250,.82) 47%,rgba(215,238,252,.9))", backdropFilter: "blur(4px)", borderRight: "4px solid #9ab3c4", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
		          <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "10px", height: "38%", borderRadius: "6px", background: "#9ab3c4" }}></div>
		          <div style={{ width: "min(240px,80%)", background: "#EBD08A", border: "1.8px solid #4a3a30", padding: "16px", transform: "rotate(-4deg)", boxShadow: "4px 4px 7px rgba(74,58,48,.28)", display: "flex", flexDirection: "column", gap: "8px" }}>
		            <span style={{ font: "500 10px 'IBM Plex Mono'", letterSpacing: ".14em", color: "#7ba3d6" }}>FUN FACT #01</span>
		            <span style={{ fontWeight: "900", fontSize: "17px", lineHeight: "1.35" }}>Every officer here started as a first-time hacker.</span>
		          </div>
		        </div>
		        <div ref={lidR} style={{ position: "absolute", top: "0", bottom: "0", right: "0", width: "50.5%", willChange: "transform", transform: "translateX(0%)", background: "linear-gradient(115deg,rgba(235,247,255,.92),rgba(200,230,250,.82) 38%,rgba(255,255,255,.95) 42%,rgba(200,230,250,.82) 47%,rgba(215,238,252,.9))", backdropFilter: "blur(4px)", borderLeft: "4px solid #9ab3c4", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
		          <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "10px", height: "38%", borderRadius: "6px", background: "#9ab3c4" }}></div>
		          <div style={{ width: "min(240px,80%)", background: "#fff", border: "1.8px solid #4a3a30", padding: "16px", transform: "rotate(3deg)", boxShadow: "4px 4px 7px rgba(74,58,48,.28)", display: "flex", flexDirection: "column", gap: "8px" }}>
		            <span style={{ font: "500 10px 'IBM Plex Mono'", letterSpacing: ".14em", color: "#76aecc" }}>FUN FACT #02</span>
		            <span style={{ fontWeight: "900", fontSize: "17px", lineHeight: "1.35" }}>Planning meetings run on mochi ice cream. Officially.</span>
		          </div>
		        </div>
		      </div>
		    </div>
		    <div style={{ marginTop: "-3px", background: "#f3f2ee", border: "1.8px solid #4a3a30", borderRadius: "0 0 16px 16px", boxShadow: "3px 7px 7px rgba(74,58,48,.32)", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
		      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}><span style={{ background: "#E9A593", color: "#4a3a30", fontFamily: "'Yusei Magic'", fontSize: "20px", padding: "6px 14px", borderRadius: "6px", border: "1.8px solid #4a3a30" }}>アイスクリーム</span><span style={{ font: "500 12px 'IBM Plex Mono'", letterSpacing: ".1em" }}>−18°C · KEEP FROZEN</span></div>
		      <button onClick={toggleLid} style={{ font: "700 14px 'Zen Maru Gothic'", background: "#4a3a30", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "30px", cursor: "pointer" }}>{lidLabel}</button>
		    </div>
		  </div>
		</section>
	);
}
