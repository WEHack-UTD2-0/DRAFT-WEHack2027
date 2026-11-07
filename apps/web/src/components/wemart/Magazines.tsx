"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Photo from "./Photo";
import { magazines as magData, NEXT_YEAR } from "./content";

const INK = "#4a3a30";
const PAPER = "#FBF5E3";
const YUSEI = "'Yusei Magic', sans-serif";
const ZEN = "'Zen Maru Gothic', sans-serif";
const MONO = "'IBM Plex Mono', monospace";

const tilts = [1.5, -1, 2, -1.5, 1, -2];

const newest = magData[0].year;
const oldest = magData[magData.length - 1].year;
const vol = (i: number) => String(magData.length - i).padStart(2, "0");
const yy = (year: string) => "'" + year.slice(2);

export default function Magazines() {
	const [mag, setMag] = useState<number | null>(null);
	const [page, setPage] = useState(0);
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const flip = (d: number) => setPage((p) => Math.max(0, Math.min(3, p + d)));
	const open = (i: number) => {
		setMag(i);
		setPage(0);
	};
	const close = () => setMag(null);

	// Keyboard: Esc closes, arrows flip pages (only while the viewer is open).
	useEffect(() => {
		if (mag == null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
			if (e.key === "ArrowRight") flip(1);
			if (e.key === "ArrowLeft") flip(-1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [mag]);

	const cur = magData[mag ?? 0];
	const curVol = vol(mag ?? 0);
	const P = page;
	// Leaf i is flipped once page > i. Unflipped leaves stack in order; flipped ones the other way.
	const leaf = (i: number) => ({ transform: `rotateY(${P > i ? -180 : 0}deg)`, zIndex: P > i ? i + 1 : 3 - i });
	const bookShift = P === 0 ? "-25%" : P === 3 ? "25%" : "0%";
	const pageLabel = ["Cover", "Pages 1–2", "Pages 3–4", "Back cover"][P];
	const pill: React.CSSProperties = { font: `700 14px ${ZEN}`, color: INK, border: `1.8px solid ${INK}`, borderRadius: 30, padding: "10px 18px", cursor: "pointer" };

	const viewer = (
		<div
			role="dialog"
			aria-modal="true"
			aria-label={`WEHack ${cur.year} magazine`}
			style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(59,53,82,.78)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, padding: 20, animation: "wm-in .3s ease-out", color: INK, fontFamily: ZEN, lineHeight: "normal" }}
		>
			{/* Clicking the backdrop closes the viewer */}
			<div onClick={close} style={{ position: "absolute", inset: 0 }} />

			<div style={{ position: "relative", width: "min(860px,92vw)", aspectRatio: "2/1.4", perspective: 2200 }}>
				<div style={{ position: "absolute", inset: 0, transform: `translateX(${bookShift})`, transition: "transform .9s cubic-bezier(.6,.1,.25,1)", transformStyle: "preserve-3d" }}>
					{/* Base pages fade out when empty, so a single page looks centered */}
					<div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", background: "#f3efe4", border: `2px solid ${INK}`, opacity: P === 0 ? 0 : 1, transition: "opacity .4s" }} />
					<div style={{ position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", background: "#f3efe4", border: `2px solid ${INK}`, opacity: P === 3 ? 0 : 1, transition: "opacity .4s" }} />

					{/* Leaf 0: cover / editor's letter */}
					<div className="mag-leaf" style={leaf(0)}>
						<div className="mag-face" style={{ background: cur.bg }}>
							<div style={{ padding: "16px 18px 6px", fontFamily: YUSEI, fontSize: "clamp(24px,4.4vw,44px)", lineHeight: 0.92, textTransform: "uppercase" }}>{cur.title}</div>
							<div style={{ display: "flex", justifyContent: "space-between", padding: "0 18px 10px", font: `500 11px ${MONO}` }}>
								<span>VOL. {curVol}</span>
								<span>WEHACK {cur.year}</span>
							</div>
							<div style={{ flex: 1, margin: "0 18px", border: `2.5px solid ${INK}` }}>
								<Photo id={`mag-${cur.year}-cover`} label={`cover photo · WEHack ${cur.year}`} />
							</div>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "10px 18px 16px", gap: 10 }}>
								<span style={{ fontWeight: 900, fontSize: 14, maxWidth: "60%" }}>{cur.line}</span>
								<span style={{ fontFamily: YUSEI, fontSize: "clamp(34px,5vw,56px)", lineHeight: 0.8 }}>{yy(cur.year)}</span>
							</div>
						</div>
						<div className="mag-face back" style={{ background: PAPER, padding: "clamp(16px,3vw,32px)", gap: 14 }}>
							<span style={{ font: `500 10px ${MONO}`, letterSpacing: ".16em", color: "#7ba3d6" }}>EDITOR&apos;S LETTER · {cur.year}</span>
							<span style={{ fontFamily: YUSEI, fontSize: "clamp(20px,3vw,32px)", lineHeight: 1.05 }}>{cur.headline}</span>
							<p style={{ margin: 0, fontFamily: "inherit", fontSize: "clamp(12px,1.4vw,15px)", lineHeight: 1.6 }}>
								Add a short recap of WEHack {cur.year} here: the theme, the vibe, the moment everyone still talks about.
							</p>
							<span style={{ marginTop: "auto", fontFamily: ZEN, fontSize: 20 }}>— WEHack {cur.year} team</span>
						</div>
					</div>

					{/* Leaf 1: photo special / winners */}
					<div className="mag-leaf" style={leaf(1)}>
						<div className="mag-face" style={{ background: PAPER, padding: "clamp(14px,2.4vw,26px)", gap: 10 }}>
							<span style={{ font: `500 10px ${MONO}`, letterSpacing: ".16em" }}>PHOTO SPECIAL</span>
							<div style={{ flex: 1, border: `2px solid ${INK}` }}>
								<Photo id={`mag-${cur.year}-p1`} label="highlight photo" />
							</div>
							<span style={{ fontWeight: 900, fontSize: "clamp(12px,1.5vw,16px)" }}>Opening ceremony, {cur.year}</span>
						</div>
						<div className="mag-face back" style={{ background: cur.bg, padding: "clamp(16px,3vw,32px)", gap: 12 }}>
							<span style={{ font: `500 10px ${MONO}`, letterSpacing: ".16em" }}>THE WINNERS</span>
							<span style={{ fontFamily: YUSEI, fontSize: "clamp(22px,3.4vw,38px)", lineHeight: 1 }}>Top of the shelf</span>
							<div style={{ display: "flex", flexDirection: "column", gap: 8, fontWeight: 700, fontSize: "clamp(12px,1.4vw,15px)" }}>
								{["1st", "2nd", "3rd"].map((place) => (
									<div key={place} style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px dashed currentColor", paddingBottom: 6 }}>
										<span>{place}</span>
										<span>Project name</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Leaf 2: behind the scenes / back cover */}
					<div className="mag-leaf" style={leaf(2)}>
						<div className="mag-face" style={{ background: PAPER, padding: "clamp(14px,2.4vw,26px)", gap: 10 }}>
							<span style={{ font: `500 10px ${MONO}`, letterSpacing: ".16em" }}>BEHIND THE SCENES</span>
							<div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
								<div style={{ border: `2px solid ${INK}` }}>
									<Photo id={`mag-${cur.year}-p2`} label="photo" />
								</div>
								<div style={{ border: `2px solid ${INK}` }}>
									<Photo id={`mag-${cur.year}-p3`} label="photo" />
								</div>
							</div>
							<span style={{ fontWeight: 900, fontSize: "clamp(12px,1.5vw,16px)" }}>3 a.m. at WEHack {cur.year}</span>
						</div>
						<div className="mag-face back" style={{ background: cur.bg, alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", padding: 20 }}>
							<span style={{ fontFamily: YUSEI, fontSize: "clamp(26px,4vw,46px)", lineHeight: 1 }}>
								See you
								<br />
								in {NEXT_YEAR}
							</span>
							<span style={{ font: `500 11px ${MONO}`, letterSpacing: ".14em" }}>NEXT ISSUE · THE TRIP TO WEMART</span>
						</div>
					</div>
				</div>
			</div>

			{/* Controls */}
			<div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, color: "#fff", font: `500 12px ${MONO}` }}>
				<button type="button" onClick={() => flip(-1)} style={{ ...pill, background: PAPER, opacity: P === 0 ? 0.4 : 1 }}>
					← Prev
				</button>
				<span style={{ minWidth: 96, textAlign: "center" }}>{pageLabel}</span>
				<button type="button" onClick={() => flip(1)} style={{ ...pill, background: "#EBD08A", opacity: P === 3 ? 0.4 : 1 }}>
					Next →
				</button>
				<button type="button" onClick={close} style={{ ...pill, background: INK, color: "#fff", border: "2px solid #fff", marginLeft: 10 }}>
					Close ✕
				</button>
			</div>
		</div>
	);

	return (
		<section id="archive" style={{ padding: "clamp(40px,6vh,72px) 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 40, color: INK }}>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 12, background: "#BCD5D8", padding: "9px 16px", borderRadius: 8, border: `1.8px solid ${INK}`, boxShadow: "0 4px 7px rgba(74,58,48,.28)" }}>
					<span style={{ font: `500 11px ${MONO}`, background: "#fff", color: "#76aecc", padding: "3px 7px", borderRadius: 3 }}>AISLE 04</span>
					<span style={{ fontFamily: YUSEI, fontSize: 18 }}>MAGAZINES</span>
					<span style={{ fontWeight: 700 }}>雑誌</span>
				</div>
				<h2 style={{ margin: 0, fontFamily: YUSEI, fontWeight: 400, fontSize: "clamp(34px,5vw,64px)", lineHeight: 1 }}>
					Back issues, {newest}–{oldest}
				</h2>
				<p style={{ margin: 0, fontSize: 17, maxWidth: "46ch", lineHeight: 1.5 }}>
					Every WEHack theme so far, newest on top. Pick one off the rack and flip through.
				</p>
			</div>

			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", filter: "drop-shadow(6px 8px 0 rgba(59,53,82,.25))" }}>
				{/* Hanging sign */}
				<div style={{ width: 230, background: PAPER, border: `1.8px solid ${INK}`, padding: 12, textAlign: "center", display: "flex", flexDirection: "column", gap: 4, position: "relative", zIndex: 2 }}>
					<span style={{ fontFamily: YUSEI, fontSize: 20 }}>BACK ISSUES</span>
					<span style={{ font: `500 11px ${MONO}`, letterSpacing: ".12em" }}>
						{newest} — {oldest} · 雑誌
					</span>
				</div>
				<div style={{ width: 10, height: 30, background: "linear-gradient(90deg,#92b4e0,#F1D9C6,#92b4e0)", borderLeft: `2px solid ${INK}`, borderRight: `2px solid ${INK}` }} />

				{/* Rack: two-column grid of covers */}
				<div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(2,clamp(130px,15vw,165px))", columnGap: "clamp(30px,5vw,56px)", rowGap: 26, padding: "4px 14px 0" }}>
					<div style={{ position: "absolute", left: "50%", top: -4, bottom: -70, width: 10, transform: "translateX(-50%)", background: "linear-gradient(90deg,#92b4e0,#F1D9C6,#92b4e0)", borderLeft: `2px solid ${INK}`, borderRight: `2px solid ${INK}` }} />
					{magData.map((m, i) => (
						<div key={m.year} style={{ position: "relative", paddingTop: 4 }}>
							<button
								type="button"
								className="mag-cover"
								onClick={() => open(i)}
								aria-label={`Open WEHack ${m.year}: ${m.title}`}
								style={{ "--tilt": `${tilts[i % tilts.length]}deg`, width: "100%", aspectRatio: "3/4.2", padding: 0, border: `1.8px solid ${INK}`, background: m.bg, color: INK, cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" } as React.CSSProperties}
							>
								<div style={{ padding: "8px 8px 4px", fontFamily: YUSEI, fontSize: 13, lineHeight: 1, textTransform: "uppercase", overflowWrap: "anywhere", flex: "none", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
									{m.title}
								</div>
								<div style={{ margin: "0 8px", flex: "1 1 0", minHeight: 0, border: `2px solid ${INK}` }}>
									<Photo id={`mag-${m.year}-cover`} label="cover photo" />
								</div>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "6px 8px 8px" }}>
									<span style={{ font: `500 10px ${MONO}`, letterSpacing: ".08em" }}>VOL. {vol(i)}</span>
									<span style={{ fontFamily: YUSEI, fontSize: 24, lineHeight: 0.8 }}>{yy(m.year)}</span>
								</div>
							</button>
							{/* Blue wire band in front of each cover (decoration) */}
							<div style={{ position: "absolute", left: -10, right: -10, bottom: -8, height: "46%", border: "3px solid #92b4e0", borderRadius: "2px 2px 8px 8px", background: "linear-gradient(transparent calc(50% - 1.5px),#92b4e0 calc(50% - 1.5px) calc(50% + 1.5px),transparent calc(50% + 1.5px))", pointerEvents: "none", zIndex: 2 }} />
						</div>
					))}
				</div>

				{/* Stand base */}
				<div style={{ height: 70 }} />
				<div style={{ width: "min(320px,80vw)", height: 64, background: "linear-gradient(90deg,#92b4e0,#F1D9C6 45%,#E5A98A)", clipPath: "polygon(44% 0,56% 0,100% 100%,0 100%)" }} />
				<div style={{ width: "min(320px,80vw)", height: 16, background: "#8aacd9", border: `1.8px solid ${INK}`, borderRadius: "50%", marginTop: -8 }} />
			</div>

			{/* Viewer goes straight into <body> so position:fixed covers the screen
			    (the page's .App wrapper has a transform, which would otherwise trap it). */}
			{mounted && mag != null && createPortal(viewer, document.body)}
		</section>
	);
}
