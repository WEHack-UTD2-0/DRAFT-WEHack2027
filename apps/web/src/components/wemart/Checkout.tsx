"use client";

import React, { useRef } from "react";
import { useFrame, prefersReducedMotion, setStyle } from "./frame";

/** Conveyor speed in px/s (the prototype's tweakable `beltSpeed`, 0–200). */
const BELT_SPEED = 70;

// REGISTER 06 · Checkout. Recap-video monitor + register on the left; a conveyor belt
// carrying 8 CSS-drawn products on the right. The scanner laser lights up as items pass.
export default function Checkout() {
	const beltRef = useRef<HTMLDivElement>(null);
	const laserRef = useRef<HTMLDivElement>(null);

	useFrame((t) => {
		const b = beltRef.current;
		if (!b) return;
		const br = b.getBoundingClientRect();
		if (br.bottom < 0 || br.top > window.innerHeight) return; // off-screen: skip work
		const speed = prefersReducedMotion() ? 0 : BELT_SPEED / 1000;
		const W = b.clientWidth;
		const items = b.querySelectorAll<HTMLElement>("[data-food]");
		const n = items.length;
		const span = Math.max(W + 140, n * 130);
		const off = t * speed;
		let scanned = false;
		items.forEach((el, i) => {
			const x = W - ((off + (i * span) / n) % span);
			setStyle(el, "transform", `translateX(${x.toFixed(1)}px)`);
			if (x < 40 && x > -60) scanned = true;
		});
		setStyle(b, "background-position", `${(-(off % 40)).toFixed(1)}px 0`);
		setStyle(laserRef.current, "opacity", scanned ? "1" : "0.3");
	});

	return (
		<section id="checkout" style={{ padding: "clamp(40px,6vh,72px) 20px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
		  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
		    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#BCD5D8", color: "#4a3a30", padding: "9px 16px", borderRadius: "8px", border: "1.8px solid #4a3a30", boxShadow: "0 4px 7px rgba(74,58,48,.28)" }}><span style={{ font: "500 11px 'IBM Plex Mono'", background: "#fff", color: "#76aecc", padding: "3px 7px", borderRadius: "3px" }}>REGISTER 06</span><span style={{ fontFamily: "'Yusei Magic'", fontSize: "18px" }}>CHECKOUT</span><span style={{ fontWeight: "700" }}>お会計</span></div>
		    <h2 style={{ margin: "0", fontFamily: "'Yusei Magic'", fontWeight: "400", fontSize: "clamp(34px,5vw,64px)", lineHeight: "1" }}>Ring it up</h2>
		  </div>
		  <div style={{ width: "min(1240px,100%)", display: "flex", alignItems: "flex-end", gap: "0", flexWrap: "wrap" }}>
		    <div style={{ flex: "1 1 440px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: "2" }}>
		      <div style={{ background: "#fff", border: "1.8px solid #4a3a30", padding: "6px 14px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "-2px", borderRadius: "6px 6px 0 0" }}><span style={{ display: "flex", flexDirection: "column", gap: "2px", width: "26px" }}><span style={{ height: "5px", background: "#BCD5D8" }}></span><span style={{ height: "5px", background: "#EBD08A" }}></span><span style={{ height: "5px", background: "#E9A593" }}></span></span><span style={{ fontWeight: "900", fontSize: "18px" }}>お会計 · Recap</span></div>
		      <div style={{ width: "100%", background: "#4a3a30", borderRadius: "14px", padding: "14px", boxShadow: "6px 8px 7px rgba(74,58,48,.28)" }}>
		        <div style={{ aspectRatio: "16/9", borderRadius: "6px", overflow: "hidden", position: "relative", background: "repeating-linear-gradient(135deg,#3d3d3d 0 10px,#363636 10px 20px)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", color: "#fff" }}>
		          <span style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#E9A593", display: "grid", placeItems: "center", fontSize: "22px", paddingLeft: "4px", color: "#4a3a30" }}>▶</span>
		          <span style={{ font: "500 11px 'IBM Plex Mono'", letterSpacing: ".12em", opacity: ".9" }}>VIDEO · WEHACK RECAP REEL</span>
		        </div>
		      </div>
		      <div style={{ width: "24%", height: "22px", background: "#4a4a4a" }}></div>
		      <div style={{ width: "86%", background: "#4a4a4a", borderRadius: "8px 8px 0 0", padding: "14px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
		        <div style={{ width: "30%", height: "56px", background: "#5e5e5e", borderRadius: "5px", position: "relative" }}><div style={{ position: "absolute", left: "16%", right: "16%", top: "-34px", height: "40px", background: "#fff", border: "1px solid #ccc", font: "400 8px 'IBM Plex Mono'", padding: "5px", lineHeight: "1.4", color: "#4a3a30" }}>WEmart<br />TOTAL ¢0</div></div>
		        <div style={{ width: "22%", height: "66px", background: "#5e5e5e", borderRadius: "5px", padding: "6px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "3px" }}><span style={{ background: "#7a7a7a", borderRadius: "2px" }}></span><span style={{ background: "#7a7a7a", borderRadius: "2px" }}></span><span style={{ background: "#7a7a7a", borderRadius: "2px" }}></span><span style={{ background: "#7a7a7a", borderRadius: "2px" }}></span><span style={{ background: "#7a7a7a", borderRadius: "2px" }}></span><span style={{ background: "#7a7a7a", borderRadius: "2px" }}></span></div>
		        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}><div style={{ width: "30px", height: "46px", background: "#5e5e5e", borderRadius: "6px 6px 3px 3px", position: "relative" }}><div ref={laserRef} style={{ position: "absolute", top: "8px", left: "50%", width: "120px", height: "2px", background: "#85ade1", boxShadow: "0 0 8px #85ade1", opacity: "0.3", transformOrigin: "left", transform: "rotate(-8deg)" }}></div></div><div style={{ width: "44px", height: "10px", background: "#5e5e5e", borderRadius: "3px" }}></div></div>
		      </div>
		    </div>
		    <div style={{ flex: "2 1 560px", display: "flex", flexDirection: "column" }}>
		      <div ref={beltRef} style={{ position: "relative", height: "150px", margin: "0 -2px", background: "#5e5e5e", backgroundImage: "repeating-linear-gradient(90deg,transparent 0 38px,rgba(255,255,255,.07) 38px 40px)", backgroundPosition: "0px 0", borderTop: "10px solid #c9cbd0", borderBottom: "10px solid #9ea1a6", overflow: "hidden" }}>
		        <div data-food="1" style={{ position: "absolute", left: "0", bottom: "22px", width: "72px", height: "64px" }}>
		          <div style={{ position: "absolute", inset: "0", background: "#fff", clipPath: "polygon(50% 0,100% 100%,0 100%)" }}></div>
		          <div style={{ position: "absolute", left: "30%", right: "30%", bottom: "0", height: "42%", background: "#4a3a30" }}></div>
		        </div>
		        <div data-food="2" style={{ position: "absolute", left: "0", bottom: "22px", width: "66px", height: "84px", display: "flex", flexDirection: "column", alignItems: "center" }}>
		          <div style={{ width: "100%", height: "10px", background: "#EBD08A", border: "2px solid #4a3a30", borderRadius: "3px" }}></div>
		          <div style={{ width: "100%", flex: "1", background: "#fff", clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ background: "#E9A593", color: "#4a3a30", fontWeight: "900", fontSize: "11px", width: "100%", textAlign: "center", padding: "3px 0" }}>ラーメン</span></div>
		        </div>
		        <div data-food="3" style={{ position: "absolute", left: "0", bottom: "22px", width: "48px", height: "90px", display: "flex", flexDirection: "column" }}>
		          <div style={{ height: "18px", background: "#e9edf4", clipPath: "polygon(50% 0,100% 100%,0 100%)" }}></div>
		          <div style={{ flex: "1", background: "#f4f7fb", borderTop: "6px solid #BCD5D8", display: "flex", alignItems: "center", justifyContent: "center", font: "500 9px 'IBM Plex Mono'", color: "#76aecc" }}>MILK</div>
		        </div>
		        <div data-food="4" style={{ position: "absolute", left: "0", bottom: "30px", width: "104px", height: "30px" }}>
		          <div style={{ position: "absolute", left: "0", right: "0", top: "50%", height: "4px", background: "#d9b98a", transform: "translateY(-50%)" }}></div>
		          <div style={{ position: "absolute", left: "8px", top: "0", width: "28px", height: "28px", borderRadius: "50%", background: "oklch(0.82 0.1 0)" }}></div>
		          <div style={{ position: "absolute", left: "36px", top: "0", width: "28px", height: "28px", borderRadius: "50%", background: "#fbf7ee" }}></div>
		          <div style={{ position: "absolute", left: "64px", top: "0", width: "28px", height: "28px", borderRadius: "50%", background: "oklch(0.75 0.12 140)" }}></div>
		        </div>
		        <div data-food="5" style={{ position: "absolute", left: "0", bottom: "22px", width: "34px", height: "96px", background: "linear-gradient(90deg,oklch(0.85 0.08 210),oklch(0.93 0.05 210),oklch(0.82 0.08 210))", borderRadius: "12px 12px 8px 8px", display: "flex", justifyContent: "center", paddingTop: "14px" }}><span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#e9fbff", border: "1px solid rgba(0,0,0,.2)" }}></span></div>
		        <div data-food="6" style={{ position: "absolute", left: "0", bottom: "22px", width: "74px", height: "54px", borderRadius: "50% 50% 40% 40%", background: "oklch(0.86 0.12 105)", backgroundImage: "repeating-linear-gradient(45deg,transparent 0 10px,rgba(120,100,30,.25) 10px 12px),repeating-linear-gradient(-45deg,transparent 0 10px,rgba(120,100,30,.25) 10px 12px)" }}></div>
		        <div data-food="7" style={{ left: "0", bottom: "22px", width: "40px", height: "78px", background: "#F1D9C6", borderRadius: "4px", position: "absolute" }}>
		          <div style={{ position: "absolute", left: "24px", top: "-16px", width: "4px", height: "20px", background: "#fff", transform: "rotate(12deg)" }}></div>
		          <div style={{ position: "absolute", left: "4px", right: "4px", top: "26px", height: "24px", background: "#fff", borderRadius: "50%" }}></div>
		        </div>
		        <div data-food="8" style={{ position: "absolute", left: "0", bottom: "22px", width: "86px", height: "40px", background: "#E9A593", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Yusei Magic'", color: "#4a3a30", fontSize: "14px" }}>STIX</div>
		      </div>
		      <div style={{ height: "60px", background: "linear-gradient(oklch(0.88 0.05 70),oklch(0.83 0.05 65))", borderTop: "1.8px solid #4a3a30" }}></div>
		    </div>
		  </div>
		</section>
	);
}
