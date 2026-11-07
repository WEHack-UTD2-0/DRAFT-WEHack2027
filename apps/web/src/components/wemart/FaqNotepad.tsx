"use client";

import React, { useRef, useState } from "react";
import { faqs as faqData } from "./content";
import { useFrame, c } from "./frame";

const zenMaru = { style: { fontFamily: "'Zen Maru Gothic', sans-serif" } };
const yusei = { style: { fontFamily: "'Yusei Magic', sans-serif" } };
const plexMono = { style: { fontFamily: "'IBM Plex Mono', monospace" } };

const INK = "#4a3a30";
const PAPER = "#FBF5E3";
const ring: React.CSSProperties = { width: 10, height: 10, borderRadius: "50%", background: "#fff", border: `2px solid ${INK}` };

// AISLE 05 · Shopping list. Boxes tick themselves one by one as the list scrolls into
// view (and untick on the way back up); clicking a question toggles its answer.
export default function FaqNotepad() {
	const [open, setOpen] = useState<Record<number, boolean>>({});
	const [checked, setChecked] = useState(0);
	const listRef = useRef<HTMLDivElement>(null);
	const total = faqData.length;

	useFrame(() => {
		const el = listRef.current;
		if (!el) return;
		const vh = window.innerHeight;
		const r = el.getBoundingClientRect();
		const n = Math.round(c((vh * 0.85 - r.top) / Math.max(1, r.height)) * total);
		if (n !== checked) setChecked(n);
	});

	const toggle = (i: number) => setOpen((s) => ({ ...s, [i]: !s[i] }));

	return (
		<section
			id="faq"
			style={{ padding: "clamp(40px,6vh,72px) 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, color: INK }}
		>
			{/* Aisle sign */}
			<div style={{ display: "flex", alignItems: "center", gap: 12, background: "#BCD5D8", padding: "9px 16px", borderRadius: 8, border: `1.8px solid ${INK}`, boxShadow: "0 4px 7px rgba(74,58,48,.28)" }}>
				<span style={{ ...plexMono.style, fontWeight: 500, fontSize: 11, background: "#fff", color: "#76aecc", padding: "3px 7px", borderRadius: 3 }}>AISLE 05</span>
				<span style={{ ...yusei.style, fontSize: 18 }}>SHOPPING LIST</span>
				<span style={{ fontWeight: 700 }}>お買い物リスト</span>
			</div>

			{/* Notepad, tilted slightly */}
			<div style={{ width: "min(620px,100%)", display: "flex", flexDirection: "column", transform: "rotate(-1deg)" }}>
				{/* Binding strip with metal rings (decoration only) */}
				<div style={{ height: 26, background: "#BCD5D8", border: `1.8px solid ${INK}`, borderRadius: "6px 6px 0 0", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
					<span style={ring} />
					<span style={ring} />
					<span style={ring} />
				</div>

				{/* Ruled paper: 40px line spacing matches the 40px question rows */}
				<div
					style={{
						background: PAPER,
						border: `1.8px solid ${INK}`,
						borderTop: "none",
						boxShadow: "8px 10px 7px rgba(74,58,48,.28)",
						padding: "22px 26px 30px",
						backgroundImage: "linear-gradient(transparent 39px,oklch(0.85 0.05 240) 39px 40px)",
						backgroundSize: "100% 40px",
						backgroundPosition: "0 12px",
					}}
				>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
						<span style={{ ...zenMaru.style, fontWeight: 700, fontSize: 34, lineHeight: 1 }}>shopping list (FAQ)</span>
						<span style={{ ...plexMono.style, fontWeight: 500, fontSize: 10, letterSpacing: ".12em" }}>
							{checked}/{total} CHECKED
						</span>
					</div>

					<div ref={listRef} style={{ display: "flex", flexDirection: "column" }}>
						{faqData.map(([q, a], i) => {
							const isChecked = i < checked;
							return (
								<div key={i} style={{ display: "flex", flexDirection: "column" }}>
									<button
										type="button"
										onClick={() => toggle(i)}
										aria-expanded={!!open[i]}
										style={{ ...zenMaru.style, display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", padding: 0, minHeight: 40, cursor: "pointer", textAlign: "left", fontSize: 23, color: INK }}
									>
										<span
											style={{ width: 22, height: 22, flex: "none", border: `1.8px solid ${INK}`, borderRadius: 4, display: "grid", placeItems: "center", background: isChecked ? "oklch(0.93 0.05 355)" : PAPER, transition: "background .3s" }}
										>
											{isChecked && (
												<span style={{ ...zenMaru.style, fontWeight: 900, fontSize: 18, lineHeight: 1, color: "#7ba3d6", animation: "wm-pop .45s ease-out" }}>✓</span>
											)}
										</span>
										<span>{q}</span>
									</button>
									{open[i] && (
										<p style={{ margin: "0 0 12px 34px", fontSize: 15, lineHeight: 1.6, background: "oklch(0.97 0.04 95)", border: `2px solid ${INK}`, padding: "10px 12px", borderRadius: 4, animation: "wm-in .25s ease-out" }}>
											{a}
										</p>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
