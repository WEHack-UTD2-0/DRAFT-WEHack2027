"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Photo from "./Photo";
import { prefersReducedMotion } from "./frame";
import { magazines as magData, magazineStand as stand, NEXT_YEAR, type Lettering } from "./content";

const INK = "#4a3a30";
const YUSEI = "'Yusei Magic', sans-serif";
const MONO = "'IBM Plex Mono', monospace";

// Issue viewer palette, taken from magazine-stand.png
const LINE = "#716662"; // magazine outlines
const LETTER = "#645c5f"; // lettering
const WIRE = "#efb5d5"; // pink wire pockets
const PAPER = "#fdf8ec";
const NUNITO = "'Nunito', 'Zen Maru Gothic', sans-serif";
const HAND_RADIUS = "4px 7px 5px 8px / 7px 4px 8px 5px"; // slightly uneven, like the drawn covers

// Cover lettering, matched by eye to each magazine on the stand.
const LETTERING: Record<Lettering, React.CSSProperties> = {
	museum: { fontFamily: NUNITO, fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: ".05em", fontSize: "clamp(22px,3.6vw,38px)", lineHeight: 1.05 },
	timeless: { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(28px,4.6vw,50px)", lineHeight: 0.95 },
	enchanted: { fontFamily: "'Pinyon Script', cursive", fontWeight: 400, fontSize: "clamp(32px,5.2vw,58px)", lineHeight: 1 },
	adventure: { fontFamily: NUNITO, fontWeight: 800, fontSize: "clamp(26px,4.2vw,46px)", lineHeight: 1 },
	future: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, textTransform: "uppercase", fontSize: "clamp(30px,5vw,56px)", lineHeight: 0.95 },
	robotics: { fontFamily: NUNITO, fontWeight: 800, fontVariant: "small-caps", letterSpacing: ".12em", fontSize: "clamp(30px,5vw,54px)", lineHeight: 1 },
};

// Layered art (empty stand + separate covers) once marketing supplies it; otherwise the flat illustration.
const layered = !!stand.empty && stand.covers.length === magData.length && stand.covers.every(Boolean);
const pctStr = (v: number) => `${v}%`;

const newest = magData[0].year;
const oldest = magData[magData.length - 1].year;
const vol = (i: number) => String(magData.length - i).padStart(2, "0");
const yy = (year: string) => "'" + year.slice(2);

// Three views: front cover → inside spread → back cover.
const PAGES = ["Cover", "Inside", "Back cover"];
const LAST = PAGES.length - 1;

export default function Magazines() {
	const [mag, setMag] = useState<number | null>(null);
	const [page, setPage] = useState(0);
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const dialogRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const originRef = useRef<HTMLElement | null>(null); // the magazine on the stand that was opened
	const closingRef = useRef(false);
	const pageRef = useRef(0);
	pageRef.current = page;

	const flip = (d: number) => setPage((p) => Math.max(0, Math.min(LAST, p + d)));
	const open = (i: number, el: HTMLElement) => {
		originRef.current = el;
		closingRef.current = false;
		setMag(i);
		setPage(0);
	};

	// Transform that shrinks the visible card (cover/back cover = half the book, otherwise the
	// whole spread) onto the magazine on the stand.
	const toOrigin = () => {
		const st = stageRef.current;
		const from = originRef.current?.getBoundingClientRect();
		if (!st || !from || !from.width) return null;
		const to = st.getBoundingClientRect();
		const p = pageRef.current;
		const visibleW = p === 0 || p === LAST ? to.width / 2 : to.width;
		const s = from.width / visibleW;
		const dx = from.left + from.width / 2 - (to.left + to.width / 2);
		const dy = from.top + from.height / 2 - (to.top + to.height / 2);
		return `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
	};

	// Grow out of the clicked magazine.
	useLayoutEffect(() => {
		if (mag == null || prefersReducedMotion()) return;
		const t = toOrigin();
		if (t) stageRef.current?.animate([{ transform: t, opacity: 0.4 }, { transform: "none", opacity: 1 }], { duration: 460, easing: "cubic-bezier(.2,.8,.25,1)" });
		dialogRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mag != null]);

	// Shrink back into the magazine, then unmount.
	const close = () => {
		if (closingRef.current) return;
		const t = prefersReducedMotion() ? null : toOrigin();
		if (!t || !stageRef.current || !dialogRef.current) return setMag(null);
		closingRef.current = true;
		const anim = stageRef.current.animate([{ transform: "none", opacity: 1 }, { transform: t, opacity: 0.3 }], { duration: 340, easing: "cubic-bezier(.5,0,.75,.3)", fill: "forwards" });
		dialogRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 340, delay: 60, easing: "ease-in", fill: "forwards" });
		anim.onfinish = () => setMag(null);
	};

	const isOpen = mag != null;

	// While the viewer is open: Esc closes, arrows flip pages, Tab stays inside the dialog,
	// the page behind doesn't scroll, and focus returns to the magazine that opened it.
	useEffect(() => {
		if (!isOpen) return;
		closeRef.current?.focus({ preventScroll: true });
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
			else if (e.key === "ArrowRight") flip(1);
			else if (e.key === "ArrowLeft") flip(-1);
			else if (e.key === "Tab" && dialogRef.current) {
				const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
				if (!items.length) return;
				const first = items[0];
				const last = items[items.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				} else if (!dialogRef.current.contains(document.activeElement)) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		window.addEventListener("keydown", onKey);
		const html = document.documentElement;
		const prevOverflow = html.style.overflow;
		html.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			html.style.overflow = prevOverflow;
			originRef.current?.focus({ preventScroll: true });
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	const cur = magData[mag ?? 0];
	const curVol = vol(mag ?? 0);
	const P = page;
	// Leaf i is flipped once page > i. Unflipped leaves stack in order; flipped ones the other way.
	const leaf = (i: number) => ({ transform: `rotateY(${P > i ? -180 : 0}deg)`, zIndex: P > i ? i + 1 : 2 - i });
	const bookShift = P === 0 ? "-25%" : P === LAST ? "25%" : "0%";
	const title = LETTERING[cur.lettering];
	const label: React.CSSProperties = { fontFamily: NUNITO, fontWeight: 800, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: LETTER };
	const panel: React.CSSProperties = { border: `2.5px solid ${LINE}`, borderRadius: HAND_RADIUS, overflow: "hidden" };
	const face = (bg: string): React.CSSProperties => ({ background: bg, border: `3px solid ${LINE}`, borderRadius: HAND_RADIUS, color: LETTER, boxShadow: `7px 8px 0 ${LINE}40` });

	const viewer = (
		<div
			ref={dialogRef}
			className="wm-viewer"
			role="dialog"
			aria-modal="true"
			aria-label={`WEHack ${cur.year}: ${cur.title}`}
			style={{ position: "fixed", inset: 0, zIndex: 300, background: "linear-gradient(160deg,rgba(253,248,236,.95) 0%,rgba(250,234,238,.95) 55%,rgba(246,220,233,.96) 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, padding: 20, color: LETTER, fontFamily: NUNITO, lineHeight: "normal" }}
		>
			{/* Clicking the backdrop closes the viewer */}
			<div onClick={close} style={{ position: "absolute", inset: 0 }} />

			<div ref={stageRef} style={{ position: "relative", width: "min(860px,92vw,calc((100vh - 150px) * 2 / 1.4))", aspectRatio: "2/1.4", perspective: 2200, willChange: "transform" }}>
				<div style={{ position: "absolute", inset: 0, transform: `translateX(${bookShift})`, transition: "transform .9s cubic-bezier(.6,.1,.25,1)", transformStyle: "preserve-3d" }}>
					{/* Base pages fade out when empty, so a single page looks centered */}
					<div style={{ ...face(PAPER), position: "absolute", left: 0, top: 0, width: "50%", height: "100%", boxShadow: `7px 8px 0 ${LINE}40`, opacity: P === 0 ? 0 : 1, transition: "opacity .4s" }} />
					<div style={{ ...face(PAPER), position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", boxShadow: `7px 8px 0 ${LINE}40`, opacity: P === LAST ? 0 : 1, transition: "opacity .4s" }} />

					{/* Leaf 0: front cover / inside left (editor's letter) */}
					<div className="mag-leaf" style={leaf(0)}>
						<div className="mag-face cover" style={{ ...face(cur.bg), padding: "clamp(16px,2.6vw,28px)", gap: 14 }}>
							<div style={{ ...title, margin: 0 }}>{cur.title}</div>
							<div style={{ ...panel, flex: 1, background: "rgba(255,255,255,.55)" }}>
								<Photo plain id={`mag-${cur.year}-cover`} label={`Cover art, WEHack ${cur.year}`} />
							</div>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 10 }}>
								<span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
									<span style={label}>Vol. {curVol} · WEHack {cur.year}</span>
									<span style={{ fontWeight: 700, fontSize: 15 }}>{cur.line}</span>
								</span>
								<span style={{ ...title, fontSize: "clamp(30px,4.4vw,50px)", lineHeight: 0.8, textTransform: "none", fontVariant: "normal" }}>{yy(cur.year)}</span>
							</div>
						</div>
						<div className="mag-face back" style={{ ...face(PAPER), padding: "clamp(16px,3vw,32px)", gap: 14 }}>
							<span style={label}>Editor&apos;s letter · {cur.year}</span>
							<span style={{ ...title, fontSize: "clamp(24px,3.4vw,38px)" }}>{cur.headline}</span>
							<p style={{ margin: 0, fontFamily: "inherit", fontSize: "clamp(13px,1.4vw,16px)", lineHeight: 1.6, color: INK }}>{cur.blurb}</p>
							<span style={{ marginTop: "auto", fontWeight: 700, fontSize: 17 }}>— WEHack {cur.year} team</span>
						</div>
					</div>

					{/* Leaf 1: inside right (photo) / back cover */}
					<div className="mag-leaf" style={leaf(1)}>
						<div className="mag-face" style={{ ...face(PAPER), padding: "clamp(14px,2.4vw,26px)", gap: 10 }}>
							<span style={label}>Photo special</span>
							<div style={{ ...panel, flex: 1, background: cur.bg }}>
								<Photo plain id={`mag-${cur.year}-p1`} label="Highlight photo" />
							</div>
							<span style={{ fontWeight: 800, fontSize: "clamp(13px,1.5vw,16px)" }}>WEHack {cur.year}</span>
						</div>
						<div className="mag-face back cover" style={{ ...face(cur.bg), alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center", padding: 20 }}>
							<span style={{ ...title, fontSize: "clamp(28px,4.2vw,48px)" }}>
								See you
								<br />
								in {NEXT_YEAR}
							</span>
							<span style={label}>Next issue · The Trip to WEmart</span>
						</div>
					</div>
				</div>
			</div>

			{/* Controls: pink wire pills, like the stand's pockets */}
			<div style={{ position: "relative", display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
				<button type="button" className="wm-wire" onClick={() => flip(-1)} disabled={P === 0} aria-label="Previous page">
					← Prev
				</button>
				<span style={{ display: "flex", gap: 8, alignItems: "center", padding: "0 4px" }} aria-hidden>
					{PAGES.map((_, i) => (
						<span key={i} style={{ width: 11, height: 11, borderRadius: "50%", border: `2px solid ${WIRE}`, background: i === P ? WIRE : "#fff", transition: "background .25s" }} />
					))}
				</span>
				<span className="sr-only" aria-live="polite">
					{PAGES[P]}, page {P + 1} of {PAGES.length}
				</span>
				<button type="button" className="wm-wire" onClick={() => flip(1)} disabled={P === LAST} aria-label="Next page">
					Next →
				</button>
				<button ref={closeRef} type="button" className="wm-wire" onClick={close} aria-label="Close magazine" style={{ marginLeft: 8 }}>
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

			{/* Magazine stand illustration with a clickable area over each magazine (row by row,
			    newest first, matching content.ts). Hovering or focusing one lifts and tilts it. */}
			<div className="mag-stand" style={{ position: "relative", width: "clamp(260px,32vw,420px)", aspectRatio: "1000 / 1500" }}>
				<img src={layered ? stand.empty : stand.flat} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", userSelect: "none" }} />
				{magData.map((m, i) => {
					const [l, t, w, h] = stand.spots[i];
					const art: React.CSSProperties = layered
						? { backgroundImage: `url(${stand.covers[i]})`, backgroundSize: "100% 100%" }
						: {
								// Cut-out of the flat illustration that sits exactly over this magazine
								backgroundImage: `url(${stand.flat})`,
								backgroundSize: `${(100 / w) * 100}% ${(100 / h) * 100}%`,
								backgroundPosition: `${(l / (100 - w)) * 100}% ${(t / (100 - h)) * 100}%`,
							};
					return (
						<button
							key={m.year}
							type="button"
							className={`mag-spot${layered ? "" : " flat"}`}
							onClick={(e) => open(i, e.currentTarget)}
							aria-label={`Open WEHack ${m.year}: ${m.title}`}
							style={{ "--tilt": i % 2 ? "3deg" : "-3deg", left: pctStr(l), top: pctStr(t), width: pctStr(w), height: pctStr(h) } as React.CSSProperties}
						>
							<span className="mag-lift" style={art} />
						</button>
					);
				})}
			</div>

			{/* Viewer goes straight into <body> so position:fixed covers the screen
			    (the page's .App wrapper has a transform, which would otherwise trap it). */}
			{mounted && mag != null && createPortal(viewer, document.body)}
		</section>
	);
}
