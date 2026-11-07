"use client";

import React, { useEffect, useRef, useState } from "react";
import "./wemart.css";
import { EVENT_START } from "./content";
import { useFrame, c, ease, smooth, setStyle, prefersReducedMotion } from "./frame";
import { buildInteriorSvg } from "./interior";
import Nav from "./Nav";
import Scene, { type SceneParts } from "./Scene";
import Hero from "./Hero";
import Officers from "./Officers";
import Sponsors from "./Sponsors";
import Magazines from "./Magazines";
import FaqNotepad from "./FaqNotepad";
import Checkout from "./Checkout";
import Teams from "./Teams";
import Exit from "./Exit";

// WEHack 2027 — "The Trip to WEmart". Built from design_handoff_wemart_site.
//
// Layers (back to front):
//   Scene  — fixed night storefront, zoomed/translated via CSS vars
//   Hero   — 300vh spacer: storefront zooms to the door, doors slide open, bunny appears
//   <main> — normal-flow sections over a fixed interior-corridor backdrop (--aisle, --big)
//   Exit   — 240vh spacer: zoom back out, doors close, "Thank you" bunny
//   Grain  — fixed paper-grain overlay
// Scroll-linked transform/opacity values are written directly on the moving elements once
// per frame (see frame.ts), never through React state.

const GRAIN_SVG =
	"<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .25 0 0 0 0 .15 0 0 0 1.1 -.42'/></filter><rect width='260' height='260' filter='url(#f)'/></svg>";

function useCountdown() {
	// null until mounted, so server and client markup match (no hydration mismatch).
	const [now, setNow] = useState<number | null>(null);
	useEffect(() => {
		setNow(Date.now());
		const iv = setInterval(() => setNow(Date.now()), 20000);
		return () => clearInterval(iv);
	}, []);
	if (now == null) return { d: "--", h: "--", m: "--" };
	const diff = Math.max(0, new Date(EVENT_START).getTime() - now);
	const pad = (v: number) => String(v).padStart(2, "0");
	return {
		d: pad(Math.floor(diff / 864e5)),
		h: pad(Math.floor((diff % 864e5) / 36e5)),
		m: pad(Math.floor((diff % 36e5) / 6e4)),
	};
}

export default function WEmartSite() {
	const sceneRef = useRef<HTMLDivElement>(null);
	const doorRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLElement>(null);
	const parts = useRef<SceneParts>({});
	const backdropRef = useRef<HTMLDivElement>(null);
	const scrimRef = useRef<HTMLDivElement>(null);
	const heroBunnyRef = useRef<HTMLDivElement>(null);
	const exitFadeRef = useRef<HTMLDivElement>(null);
	const exitBunnyRef = useRef<HTMLDivElement>(null);
	const engineKey = useRef({}).current;
	const outroRef = useRef<HTMLElement>(null);
	const interiorRef = useRef<HTMLDivElement>(null);
	const cd = useCountdown();

	// Interior corridor SVG is generated client-side (it's large and starts invisible).
	useEffect(() => {
		if (interiorRef.current) interiorRef.current.innerHTML = buildInteriorSvg();
	}, []);

	// Scroll engine: storefront zoom, doors, aisle fade, bunnies.
	// Each frame: read the hero/exit positions, compute targets, glide toward them
	// (smooth), then queue transform/opacity writes on exactly the elements that move.
	//
	// Hero (300vh → 200vh of scroll), p = 0…1:
	//   0   – .42  zoom into the door, title + hint fade out early
	//   .42 – .62  doors slide open (original timing, short glide)
	//   .56 – .80  aisle fades in
	//   .60 – .86  "Welcome" bunny fades in and rises
	//   .86 – 1    hold on the bunny, then the officers section scrolls up
	// Exit (240vh → 140vh of scroll):
	//   entering   aisle fades out, "Thank you" bunny fades in and rises
	//   .22 – .44  bunny fades out
	//   .32 – .74  storefront zooms back out
	//   .70 – .92  doors close (same scroll distance as opening, short glide), then a hold
	useFrame((_, dt) => {
		// ---- read ----
		const vh = window.innerHeight;
		const dr = doorRef.current;
		const fill = dr && dr.offsetWidth ? Math.min((window.innerWidth * 0.94) / dr.offsetWidth, (vh - 120) / dr.offsetHeight) : 5;
		const D = prefersReducedMotion() ? 0 : Math.max(0, fill - 1);
		const hr = heroRef.current?.getBoundingClientRect();
		const or = outroRef.current?.getBoundingClientRect();

		// ---- compute targets ----
		let v: { zp: number; title: number; hint: number; door: number } | null = null;
		let aisle = 1;
		let big = 0;
		let oimg = 0;
		let mas = 0;
		if (or && or.top < vh) {
			const p = c(-or.top / Math.max(1, or.height - vh));
			const zo = ease(c((p - 0.32) / 0.42));
			v = { zp: 1 - zo, title: 0, hint: 0, door: 1 - ease(c((p - 0.7) / 0.22)) };
			aisle = 1 - ease(c((vh - or.top) / vh));
			big = ease(c(1 - or.top / vh));
			oimg = ease(c((vh - or.top) / (vh * 0.8))) * (1 - ease(c((p - 0.22) / 0.22)));
		} else if (hr) {
			const p = c(-hr.top / Math.max(1, hr.height - vh));
			v = { zp: ease(c(p / 0.42)), title: c(1 - p / 0.1), hint: c(1 - p / 0.04), door: ease(c((p - 0.42) / 0.2)) };
			if (hr.bottom > 0) {
				aisle = ease(c((p - 0.56) / 0.24));
				big = c(hr.bottom / vh);
			}
			mas = ease(c((p - 0.6) / 0.26));
		}

		// ---- glide + queue writes ----
		const k = engineKey;
		aisle = smooth(k, "aisle", aisle, dt);
		big = smooth(k, "big", big, dt);
		mas = smooth(k, "mas", mas, dt, 180);
		oimg = smooth(k, "oimg", oimg, dt, 180);
		setStyle(backdropRef.current, "opacity", aisle.toFixed(4));
		setStyle(scrimRef.current, "opacity", (1 - big).toFixed(4));
		setStyle(heroBunnyRef.current, "opacity", mas.toFixed(4));
		setStyle(heroBunnyRef.current, "transform", `translateX(-50%) translateY(${((1 - mas) * 36).toFixed(2)}px) scale(${(0.9 + mas * 0.1).toFixed(4)})`);
		setStyle(exitFadeRef.current, "opacity", oimg.toFixed(4));
		setStyle(exitBunnyRef.current, "transform", `translateY(${((1 - oimg) * 36).toFixed(2)}px) scale(${(0.9 + oimg * 0.1).toFixed(4)})`);

		if (v) {
			const P = parts.current;
			const zp = smooth(k, "zp", v.zp, dt);
			const zoom = 1 + D * zp; // zoom always tracks zp, so glide zp only
			const title = smooth(k, "title", v.title, dt);
			const hint = smooth(k, "hint", v.hint, dt);
			const door = smooth(k, "door", v.door, dt, 70); // short glide: each wheel click slides (~0.2s) instead of snapping
			setStyle(P.inner, "transform", `translateY(${(zp * (55 - 0.275 * vh)).toFixed(2)}px) scale(${zoom.toFixed(4)})`);
			setStyle(P.poster, "transform", `rotate(-2deg) scale(${(0.5 + zp * 0.5).toFixed(4)})`);
			setStyle(P.sticker, "transform", `rotate(8deg) scale(${(0.5 + zp * 0.5).toFixed(4)})`);
			setStyle(P.title, "opacity", title.toFixed(4));
			setStyle(P.title, "transform", `translateY(${((1 - title) * -40).toFixed(2)}px)`);
			setStyle(P.hint, "opacity", hint.toFixed(4));
			setStyle(P.doorL, "transform", `translateX(${(door * -100).toFixed(3)}%)`);
			setStyle(P.doorR, "transform", `translateX(${(door * 100).toFixed(3)}%)`);
		}
	});

	return (
		<div className="wemart">
			{/* Paper grain overlay */}
			<div
				aria-hidden
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 200,
					pointerEvents: "none",
					opacity: 0.55,
					backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`,
				}}
			/>
			<Nav />
			<Scene sceneRef={sceneRef} doorRef={doorRef} parts={parts} cd={cd} />
			<Hero heroRef={heroRef} bunnyRef={heroBunnyRef} />

			<main style={{ position: "relative", zIndex: 2 }}>
				{/* Fixed interior-corridor backdrop (fades in with the aisle); cream scrim fades out */}
				<div ref={backdropRef} aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", opacity: 0, background: "#F2EAD0", willChange: "opacity", transform: "translateZ(0)", contain: "strict" }}>
					<div ref={interiorRef} style={{ position: "absolute", inset: 0, contain: "strict" }} />
					<div
						ref={scrimRef}
						style={{
							position: "absolute",
							inset: 0,
							opacity: 1,
							willChange: "opacity",
							background: "linear-gradient(90deg,rgba(246,239,217,.5) 0,rgba(246,239,217,.95) 14%,rgba(246,239,217,.95) 86%,rgba(246,239,217,.5) 100%)",
						}}
					/>
				</div>

				<Officers />
				<Sponsors />
				<Magazines />
				<FaqNotepad />
				<Checkout />
				<Teams />
			</main>

			<Exit outroRef={outroRef} fadeRef={exitFadeRef} bunnyRef={exitBunnyRef} />
		</div>
	);
}
