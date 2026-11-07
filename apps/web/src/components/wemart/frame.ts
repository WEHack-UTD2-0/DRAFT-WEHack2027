"use client";

import { useEffect, useRef } from "react";

// One shared requestAnimationFrame loop for the whole WEmart page.
//
// Performance rules (these are what keep fast scrolling smooth):
//  1. Each frame runs in two phases. Section callbacks only READ layout
//     (getBoundingClientRect etc.) and QUEUE style writes; all queued writes are
//     applied together at the end. Interleaving reads and writes forces the browser
//     to recalculate styles several times per frame.
//  2. Write `transform` / `opacity` directly on the element that moves (setStyle),
//     not CSS variables on big parents: a variable change re-styles every descendant.
//  3. Nothing scroll-driven goes through React state (no re-renders on scroll).

type FrameFn = (t: number, dt: number) => void;
const subscribers = new Set<FrameFn>();
let raf = 0;
let lastT = 0;

// Queued writes: element → (css property → value)
const queue = new Map<HTMLElement, Map<string, string>>();
// Last value written per element/property, to skip redundant writes
const written = new WeakMap<HTMLElement, Map<string, string>>();

function flush() {
	queue.forEach((props, el) => {
		let w = written.get(el);
		if (!w) written.set(el, (w = new Map()));
		props.forEach((value, prop) => {
			if (w!.get(prop) === value) return;
			w!.set(prop, value);
			el.style.setProperty(prop, value);
		});
	});
	queue.clear();
}

function loop(t: number) {
	// dt in ms, capped so returning to a background tab doesn't cause a jump
	const dt = lastT ? Math.min(100, t - lastT) : 16.7;
	lastT = t;
	subscribers.forEach((fn) => fn(t, dt)); // phase 1: read + queue
	flush(); // phase 2: write
	raf = subscribers.size ? requestAnimationFrame(loop) : 0;
	if (!raf) lastT = 0;
}

export function useFrame(fn: FrameFn) {
	const ref = useRef(fn);
	ref.current = fn;
	useEffect(() => {
		const sub: FrameFn = (t, dt) => ref.current(t, dt);
		subscribers.add(sub);
		if (!raf) raf = requestAnimationFrame(loop);
		return () => {
			subscribers.delete(sub);
			if (!subscribers.size && raf) {
				cancelAnimationFrame(raf);
				raf = 0;
				lastT = 0;
			}
		};
	}, []);
}

/** clamp to [0,1] */
export const c = (v: number) => Math.min(1, Math.max(0, v));
/** ease-in-out quad */
export const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

/** Queue a style write (any CSS property, e.g. "transform", "opacity", "--x"). Applied at end of frame. */
export function setStyle(el: HTMLElement | null | undefined, prop: string, value: string) {
	if (!el) return;
	let m = queue.get(el);
	if (!m) queue.set(el, (m = new Map()));
	m.set(prop, value);
}

/** Queue a numeric CSS custom property write. */
export function setVar(el: HTMLElement | null | undefined, name: string, value: number, digits = 3) {
	setStyle(el, name, value.toFixed(digits));
}

// Current smoothed values, keyed by any object + name.
const current = new WeakMap<object, Map<string, number>>();

/**
 * Glide a 0–1 value toward `target` instead of jumping to it, and return it.
 * Scroll wheels move in ~100px steps; easing each step over ~`tau` ms makes
 * scroll-linked motion continuous. Large gaps (fast flings, jumping via the nav)
 * close proportionally faster, so nothing trails behind the scroll position.
 * The first call snaps (no animation on page load).
 */
export function smooth(key: object, name: string, target: number, dt: number, tau = 140) {
	let m = current.get(key);
	if (!m) current.set(key, (m = new Map()));
	const prev = m.get(name);
	let v = target;
	if (prev !== undefined && !prefersReducedMotion()) {
		const gap = Math.abs(target - prev);
		v = prev + (target - prev) * (1 - Math.exp((-dt * (1 + 6 * gap)) / tau));
		if (Math.abs(target - v) < 0.0004) v = target;
	}
	m.set(name, v);
	return v;
}

export const prefersReducedMotion = () =>
	typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
