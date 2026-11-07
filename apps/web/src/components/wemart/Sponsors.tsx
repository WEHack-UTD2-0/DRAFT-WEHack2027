"use client";

import React, { useState } from "react";
import { sponsorTiers } from "./content";

const CAPS = ["#E9A593", "#EBD08A", "#BCD5D8", "#BCD5D8", "#EBD08A"];

// AISLE 03 · Capsule toys. Each sponsor is a gacha machine: turning the knob spins it
// 360° and drops a capsule into the slot.
export default function Sponsors() {
	const [spins, setSpins] = useState<Record<number, number>>({});
	let k = 0;
	const tiers = sponsorTiers.map((t) => ({
		...t,
		items: t.names.map((name) => {
			const id = k++;
			const n = spins[id] || 0;
			return {
				name,
				rot: n * 360,
				got: n > 0,
				cap: CAPS[(id + n) % CAPS.length],
				msg: n > 0 ? `you got: ${name}!` : "turn me ↻",
				spin: () => setSpins((s) => ({ ...s, [id]: (s[id] || 0) + 1 })),
			};
		}),
	}));

	return (
		<section id="sponsors" style={{ padding: "clamp(40px,6vh,72px) 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
		  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
		    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#BCD5D8", color: "#4a3a30", padding: "9px 16px", borderRadius: "8px", border: "1.8px solid #4a3a30", boxShadow: "0 4px 7px rgba(74,58,48,.28)" }}><span style={{ font: "500 11px 'IBM Plex Mono'", background: "#fff", color: "#76aecc", padding: "3px 7px", borderRadius: "3px" }}>AISLE 03</span><span style={{ fontFamily: "'Yusei Magic'", fontSize: "18px" }}>CAPSULE TOYS</span><span style={{ fontWeight: "700" }}>ガチャ</span></div>
		    <h2 style={{ margin: "0", fontFamily: "'Yusei Magic'", fontWeight: "400", fontSize: "clamp(34px,5vw,64px)", lineHeight: "1" }}>Our sponsors</h2>
		    <p style={{ margin: "0", fontSize: "17px", maxWidth: "46ch", lineHeight: "1.5" }}>Turn a knob. Every capsule is a company making WEHack possible.</p>
		  </div>

		  <div style={{ width: "min(1200px,100%)", display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
		    <div style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: "34px", alignItems: "center" }}>
		      {tiers.map((tier) => (<React.Fragment key={tier.label}>
		        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%" }}>
		          <div style={{ font: "500 12px 'IBM Plex Mono'", letterSpacing: ".2em", background: "#FBF5E3", border: "2px solid #4a3a30", padding: "4px 12px", borderRadius: "20px" }}>{tier.label} TIER</div>
		          <div style={{ display: "flex", flexWrap: "wrap", gap: "22px", justifyContent: "center" }}>
		            {tier.items.map((m) => (<React.Fragment key={m.name}>
		              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
		                <div style={{ width: `${tier.w}px`, display: "flex", flexDirection: "column", filter: "drop-shadow(3px 7px 7px rgba(74,58,48,.32))" }}>
		                  <div style={{ background: `${tier.color}`, border: "1.8px solid #4a3a30", borderRadius: "14px 14px 4px 4px", padding: "10px" }}>
		                    <div style={{ position: "relative", height: `${tier.dome}px`, border: "1.8px solid #4a3a30", borderRadius: "8px", background: "linear-gradient(135deg,#EAF1EC,#BCD5D8)", overflow: "hidden" }}>
		                      <div style={{ position: "absolute", left: "8%", bottom: "4%", width: "30%", aspectRatio: "1", borderRadius: "50%", border: "2px solid #4a3a30", background: "linear-gradient(#E9A593 50%,#fff 50%)" }}></div>
		                      <div style={{ position: "absolute", left: "34%", bottom: "2%", width: "30%", aspectRatio: "1", borderRadius: "50%", border: "2px solid #4a3a30", background: "linear-gradient(#EBD08A 50%,#fff 50%)", transform: "rotate(30deg)" }}></div>
		                      <div style={{ position: "absolute", right: "6%", bottom: "6%", width: "30%", aspectRatio: "1", borderRadius: "50%", border: "2px solid #4a3a30", background: "linear-gradient(#BCD5D8 50%,#fff 50%)", transform: "rotate(-20deg)" }}></div>
		                      <div style={{ position: "absolute", left: "20%", bottom: "28%", width: "30%", aspectRatio: "1", borderRadius: "50%", border: "2px solid #4a3a30", background: "linear-gradient(#EBD08A 50%,#fff 50%)", transform: "rotate(60deg)" }}></div>
		                      <div style={{ position: "absolute", right: "20%", bottom: "30%", width: "30%", aspectRatio: "1", borderRadius: "50%", border: "2px solid #4a3a30", background: "linear-gradient(#BCD5D8 50%,#fff 50%)", transform: "rotate(-50deg)" }}></div>
		                      <div style={{ position: "absolute", top: "6px", left: "10px", width: "22%", height: "60%", background: "linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,0))", borderRadius: "6px", transform: "skewX(-10deg)" }}></div>
		                    </div>
		                    <div style={{ marginTop: "8px", background: "#fff", border: "1.8px solid #4a3a30", borderRadius: "6px", padding: "10px 6px", textAlign: "center", fontFamily: "'Yusei Magic'", fontSize: `${tier.fs}px`, lineHeight: "1.1" }}>{m.name}</div>
		                  </div>
		                  <div style={{ marginTop: "-3px", background: "#f4f1e8", border: "1.8px solid #4a3a30", borderRadius: "4px 4px 12px 12px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
		                    <button className="wm-knob" onClick={m.spin} aria-label={`Turn the ${m.name} knob`} style={{ width: "62px", height: "62px", flex: "none", borderRadius: "50%", border: "1.8px solid #4a3a30", background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", padding: "0", transform: `rotate(${m.rot}deg)`, transition: "transform 1s cubic-bezier(.4,1.5,.4,1)" }}><span style={{ width: "44px", height: "13px", background: `${tier.color}`, border: "1.8px solid #4a3a30", borderRadius: "7px" }}></span></button>
		                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
		                      <span style={{ font: "500 11px 'IBM Plex Mono'", border: "2px solid #4a3a30", borderRadius: "4px", padding: "2px 6px", background: "#fff" }}>75¢</span>
		                      <div style={{ width: "44px", height: "36px", background: "#4a3a30", borderRadius: "7px", display: "grid", placeItems: "center" }}>
		                        {m.got && (<>
		                          <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: "2px solid #fff", background: `linear-gradient(${m.cap} 50%,#fff 50%)`, animation: "wm-pop .6s ease-out" }}></div>
		                        </>)}
		                      </div>
		                    </div>
		                  </div>
		                </div>
		                <span style={{ font: "500 11px 'IBM Plex Mono'", letterSpacing: ".06em", minHeight: "14px" }}>{m.msg}</span>
		              </div>
		            </React.Fragment>))}
		          </div>
		        </div>
		      </React.Fragment>))}
		    </div>

		  </div>
		</section>
	);
}
