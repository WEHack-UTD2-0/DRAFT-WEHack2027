"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import "./Jumbotron.css";

const clamp01 = (val: number) => Math.min(1, Math.max(0, val));
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

interface WEMartScrollExperienceProps {
  children: React.ReactNode;
}

// Pixel-exact INNER doorway opening inside the blue vertical jambs of wemart-hero.png:
// Left inner jamb = 41.9% | Right inner jamb = 59.3% (width = 17.4%)
// Top inner header = 69.8% | Bottom threshold = 96.4% (height = 26.6%)
// Center vertical seam sits at 50.60% of the image = 50.0% of DOOR_WIDTH (41.9 + 17.4 * 0.50 = 50.60%).
const DOOR_TOP = 69.4;
const DOOR_LEFT = 42.25;
const DOOR_WIDTH = 17.05;
const DOOR_HEIGHT = 26.95;
// Exact split on the 50.45% vertical seam: (50.45 - 42.25) / 17.05 * 100 = 48.094%
const DOOR_SPLIT_PCT = 47.094;
const DOOR_CENTER_X = DOOR_LEFT + (DOOR_WIDTH * DOOR_SPLIT_PCT) / 100; // 50.45%

// Fixed reference coordinate canvases for both posters (locked aspect ratio matching the door glass panes)
const POSTER_BASE_W = 340;
const POSTER_BASE_H = 440;

// Default natural aspect ratio fallback for wemart-hero.png (auto-updated on image load)
const DEFAULT_HERO_ASPECT = 16 / 10;

export default function WEMartScrollExperience({
  children,
}: WEMartScrollExperienceProps) {
  const entryRunwayRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const exitRunwayRef = useRef<HTMLElement>(null);

  // Track natural aspect ratio of wemart-hero.png so cover-rect math is 100% pixel-exact
  const heroAspectRef = useRef<number>(DEFAULT_HERO_ASPECT);

  // Persistent fixed stage (lifts smoothly upward once exit runway finishes so footer stays below)
  const stageRef = useRef<HTMLDivElement>(null);

  // Fixed background layers
  const exteriorRef = useRef<HTMLDivElement>(null);
  const exteriorNightOverlayRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Double-door container & real cropped illustrated door leaves
  const doorsContainerRef = useRef<HTMLDivElement>(null);
  const leftDoorLeafRef = useRef<HTMLDivElement>(null);
  const rightDoorLeafRef = useRef<HTMLDivElement>(null);
  const doorOpenInteriorRef = useRef<HTMLDivElement>(null);
  const doorOpenInteriorImgRef = useRef<HTMLImageElement>(null);
  const doorOpenDarkTintRef = useRef<HTMLDivElement>(null);

  // Native 1:1 unscaled poster overlay layer
  const sharpPostersOverlayRef = useRef<HTMLDivElement>(null);
  const sharpLeftPosterRef = useRef<HTMLDivElement>(null);
  const sharpRightPosterRef = useRef<HTMLDivElement>(null);
  const leftPosterInnerRef = useRef<HTMLDivElement>(null);
  const rightPosterInnerRef = useRef<HTMLDivElement>(null);

  // Interior store lighting layers
  const storeLightRef = useRef<HTMLDivElement>(null);
  const storeDimRef = useRef<HTMLDivElement>(null);
  const storeDarkRef = useRef<HTMLDivElement>(null);
  const darkTintRef = useRef<HTMLDivElement>(null);

  // Yellow translucent content backdrop & transitions
  const yellowVeilRef = useRef<HTMLDivElement>(null);
  const whiteFlashRef = useRef<HTMLDivElement>(null);
  const thankYouRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    // Preload wemart-hero.png to lock its exact natural aspect ratio
    const probeImg = new window.Image();
    probeImg.src = "/img/static/images/wemart-hero.png";
    probeImg.onload = () => {
      if (probeImg.naturalWidth > 0 && probeImg.naturalHeight > 0) {
        heroAspectRef.current = probeImg.naturalWidth / probeImg.naturalHeight;
        updateFrame();
      }
    };

    const updateFrame = () => {
      ticking = false;
      if (
        !entryRunwayRef.current ||
        !contentWrapperRef.current ||
        !exitRunwayRef.current
      )
        return;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const imgAspect = heroAspectRef.current;

      // Compute exact rendered cover-fit rectangle of wemart-hero.png inside vw x vh.
      let imgW: number;
      let imgH: number;
      let imgLeft: number;
      let imgTop: number;

      if (vw / vh > imgAspect) {
        imgW = vw;
        imgH = vw / imgAspect;
        imgLeft = 0;
        imgTop = (vh - imgH) / 2;
      } else {
        imgH = vh;
        imgW = vh * imgAspect;
        imgTop = 0;
        imgLeft = (vw - imgW) / 2;
      }

      // On narrow/portrait mobile viewports, shift horizontal focus toward DOOR_CENTER_X (50.60%)
      if (vw < vh) {
        const doorCenterPx = imgLeft + (imgW * DOOR_CENTER_X) / 100;
        const desiredCenterPx = vw * 0.5;
        const maxShift = Math.max(0, (imgW - vw) / 2);
        const shift = Math.max(
          -maxShift,
          Math.min(maxShift, desiredCenterPx - doorCenterPx),
        );
        imgLeft += shift;
      }

      // 1. Entry runway progress (0 -> 1)
      const entryRect = entryRunwayRef.current.getBoundingClientRect();
      const entryScrollable = Math.max(1, entryRect.height - vh);
      const pEntry = clamp01(-entryRect.top / entryScrollable);

      // 2. Content section visibility progress
      const contentRect = contentWrapperRef.current.getBoundingClientRect();
      const contentStartT = clamp01((vh - contentRect.top) / (vh * 0.55));
      const contentEndT = clamp01(contentRect.bottom / (vh * 0.55));
      const yellowVeilOpacity = contentStartT * contentEndT;

      // 3. Exit runway progress (0 -> 1)
      const exitRect = exitRunwayRef.current.getBoundingClientRect();
      const exitScrollable = Math.max(1, exitRect.height - vh);
      const pExit = clamp01(-exitRect.top / exitScrollable);

      // Distance scrolled past the end of the exit runway into the footer:
      const footerScrollPx = Math.max(0, vh - exitRect.bottom);
      if (stageRef.current) {
        stageRef.current.style.transform = `translate3d(0, -${footerScrollPx}px, 0)`;
      }

      // --- DEFAULT STATE VALUES ---
      let exteriorOpacity = 0;
      let exteriorScale = 1;
      let exteriorOriginY = 92;
      let exteriorNightOpacity = 0;
      let heroOpacity = 0;
      let heroTranslateY = 0;

      let showDoorAssembly = false;
      let doorLeafOpacity = 0;
      let doorSlidePercent = 0;
      let doorwayInteriorOpacity = 0;
      let useDarkDoorwayInterior = false;

      let storeLightOpacity = 0;
      let storeDimOpacity = 0;
      let storeDarkOpacity = 0;
      let darkTintOpacity = 0;
      let interiorScale = 1;

      let flashOpacity = 0;
      let thankYouOpacity = 0;

      // === BRANCH A: EXIT SEQUENCE ACTIVE (User reached bottom of page) ===
      if (pExit > 0) {
        useDarkDoorwayInterior = true;

        if (pExit < 0.16) {
          storeLightOpacity = 1;
        } else if (pExit < 0.34) {
          const f = (pExit - 0.16) / 0.18;
          if (f < 0.18) {
            storeLightOpacity = 1;
            storeDimOpacity = 0.7;
          } else if (f < 0.34) {
            storeLightOpacity = 1;
            storeDimOpacity = 0;
          } else if (f < 0.52) {
            storeLightOpacity = 0.4;
            storeDimOpacity = 1;
            storeDarkOpacity = 0.5;
          } else if (f < 0.68) {
            storeLightOpacity = 0.9;
            storeDimOpacity = 0.3;
          } else if (f < 0.84) {
            storeDimOpacity = 0.6;
            storeDarkOpacity = 1;
          } else {
            storeDarkOpacity = 1;
          }
        } else if (pExit < 0.48) {
          storeDarkOpacity = 1;
          const fadeToBlack = easeInOut(clamp01((pExit - 0.34) / 0.07));
          darkTintOpacity = fadeToBlack * 0.78;

          const textIn = clamp01((pExit - 0.36) / 0.04);
          const textOut = 1 - clamp01((pExit - 0.44) / 0.04);
          thankYouOpacity = textIn * textOut;
        } else if (pExit < 0.54) {
          const flashT = (pExit - 0.48) / 0.06;
          if (flashT < 0.5) {
            flashOpacity = easeInOut(flashT * 2);
            storeDarkOpacity = 1;
            darkTintOpacity = 0.78;
          } else {
            flashOpacity = 1 - easeInOut((flashT - 0.5) * 2);
            exteriorOpacity = 1;
            exteriorScale = 2.65;
            exteriorOriginY = 86.5;
            exteriorNightOpacity = 0.35;
            showDoorAssembly = true;
            doorLeafOpacity = 1;
            doorSlidePercent = 100;
            doorwayInteriorOpacity = 1;
          }
        } else {
          storeDarkOpacity = 0;
          darkTintOpacity = 0;
          exteriorOpacity = 1;

          const mainZoomOutT = easeInOut(clamp01((pExit - 0.54) / 0.24));
          const finalSettleT = easeInOut(clamp01((pExit - 0.78) / 0.14));
          exteriorScale = Math.max(
            1,
            2.65 - mainZoomOutT * 1.57 - finalSettleT * 0.08,
          );
          exteriorOriginY = 86.5 + mainZoomOutT * 5.5;

          const doorCloseT = easeInOut(clamp01((pExit - 0.74) / 0.16));
          showDoorAssembly = true;
          doorLeafOpacity = 1;
          doorSlidePercent = (1 - doorCloseT) * 100;
          doorwayInteriorOpacity = doorCloseT < 0.998 ? 1 : 0;

          exteriorNightOpacity = 0.35 + mainZoomOutT * 0.25 + doorCloseT * 0.1;
        }
      } else {
        // === BRANCH B: ENTRY RUNWAY + CONTENT SECTIONS ===
        useDarkDoorwayInterior = false;

        const approachT = easeInOut(clamp01(pEntry / 0.25));
        const doorOpenT = easeInOut(clamp01((pEntry - 0.45) / 0.25));

        exteriorScale = 1 + approachT * 2.65 + doorOpenT * 0.85;
        exteriorOriginY = 92 + approachT * 3;
        heroOpacity = clamp01(1 - pEntry / 0.2);
        heroTranslateY = -pEntry * 70;

        showDoorAssembly = pEntry < 0.72;
        const posterFadeOut = 1 - clamp01((pEntry - 0.58) / 0.1);
        doorLeafOpacity = posterFadeOut;
        doorSlidePercent = doorOpenT * 100;
        doorwayInteriorOpacity = doorOpenT > 0.005 ? 1 : 0;

        if (pEntry >= 0.58 && pEntry <= 0.68) {
          flashOpacity = easeInOut((pEntry - 0.58) / 0.1);
        } else if (pEntry > 0.68 && pEntry <= 0.8) {
          flashOpacity = 1 - easeInOut((pEntry - 0.68) / 0.12);
        }

        const insideT = clamp01((pEntry - 0.66) / 0.04);
        exteriorOpacity = 1 - insideT;
        storeLightOpacity = insideT;

        const settleT = easeInOut(clamp01((pEntry - 0.68) / 0.16));
        interiorScale = 1.04 - settleT * 0.04;
      }

      // --- APPLY EXACT ARTWORK-LOCKED GEOMETRY TO EXTERIOR STAGE ---
      if (exteriorRef.current) {
        exteriorRef.current.style.left = `${imgLeft}px`;
        exteriorRef.current.style.top = `${imgTop}px`;
        exteriorRef.current.style.width = `${imgW}px`;
        exteriorRef.current.style.height = `${imgH}px`;
        exteriorRef.current.style.backgroundSize = "100% 100%";
        exteriorRef.current.style.opacity = String(exteriorOpacity);
        exteriorRef.current.style.transformOrigin = `${DOOR_CENTER_X}% ${exteriorOriginY}%`;
        exteriorRef.current.style.transform = `scale(${exteriorScale})`;
      }

      if (exteriorNightOverlayRef.current) {
        exteriorNightOverlayRef.current.style.opacity =
          String(exteriorNightOpacity);
      }

      if (heroTextRef.current) {
        heroTextRef.current.style.opacity = String(heroOpacity);
        heroTextRef.current.style.transform = `translateY(${heroTranslateY}px)`;
      }

      if (doorsContainerRef.current) {
        doorsContainerRef.current.style.display = showDoorAssembly
          ? "block"
          : "none";
      }
      if (doorOpenInteriorRef.current) {
        doorOpenInteriorRef.current.style.opacity = String(
          doorwayInteriorOpacity,
        );
      }
      if (doorOpenInteriorImgRef.current) {
        const targetSrc = useDarkDoorwayInterior
          ? "/img/static/images/storedark.png"
          : "/img/static/images/storelight.png";
        if (!doorOpenInteriorImgRef.current.src.endsWith(targetSrc)) {
          doorOpenInteriorImgRef.current.src = targetSrc;
        }
      }
      if (doorOpenDarkTintRef.current) {
        doorOpenDarkTintRef.current.style.opacity = useDarkDoorwayInterior
          ? "0.78"
          : "0";
      }

      if (leftDoorLeafRef.current) {
        leftDoorLeafRef.current.style.opacity = String(doorLeafOpacity);
        leftDoorLeafRef.current.style.transform = `translate3d(-${doorSlidePercent}%, 0, 0)`;
      }
      if (rightDoorLeafRef.current) {
        rightDoorLeafRef.current.style.opacity = String(doorLeafOpacity);
        rightDoorLeafRef.current.style.transform = `translate3d(${doorSlidePercent}%, 0, 0)`;
      }

      // --- UPDATE NATIVE 1:1 UNSCALED POSTER OVERLAY (LOCKED TO RENDERED ARTWORK RECTANGLE) ---
      if (sharpPostersOverlayRef.current) {
        const isVisible =
          showDoorAssembly && exteriorOpacity > 0.01 && doorLeafOpacity > 0.01;
        sharpPostersOverlayRef.current.style.display = isVisible
          ? "block"
          : "none";

        if (isVisible) {
          const doorXInImg =
            (DOOR_CENTER_X + (DOOR_LEFT - DOOR_CENTER_X) * exteriorScale) /
            100;
          const doorYInImg =
            (exteriorOriginY + (DOOR_TOP - exteriorOriginY) * exteriorScale) /
            100;
          const doorWInImg = (DOOR_WIDTH * exteriorScale) / 100;
          const doorHInImg = (DOOR_HEIGHT * exteriorScale) / 100;

          const projLeftPx = imgLeft + doorXInImg * imgW;
          const projTopPx = imgTop + doorYInImg * imgH;
          const projWidthPx = doorWInImg * imgW;
          const projHeightPx = doorHInImg * imgH;

          sharpPostersOverlayRef.current.style.left = `${projLeftPx}px`;
          sharpPostersOverlayRef.current.style.top = `${projTopPx}px`;
          sharpPostersOverlayRef.current.style.width = `${projWidthPx}px`;
          sharpPostersOverlayRef.current.style.height = `${projHeightPx}px`;
          sharpPostersOverlayRef.current.style.opacity = String(
            exteriorOpacity * doorLeafOpacity,
          );

          // Uniform isotropic scale locked strictly to the rendered yellow glass pane dimensions
          const leftLeafPxW = (projWidthPx * DOOR_SPLIT_PCT) / 100;
          const rightLeafPxW = (projWidthPx * (100 - DOOR_SPLIT_PCT)) / 100;
          const leafPxH = projHeightPx;

          if (leftPosterInnerRef.current) {
            const targetW = leftLeafPxW * 0.64;
            const targetH = leafPxH * 0.56;
            const uniformScale = Math.min(
              targetW / POSTER_BASE_W,
              targetH / POSTER_BASE_H,
            );
            leftPosterInnerRef.current.style.transform = `translate(-50%, -50%) scale(${uniformScale})`;
          }

          if (rightPosterInnerRef.current) {
            const targetW = rightLeafPxW * 0.64;
            const targetH = leafPxH * 0.56;
            const uniformScale = Math.min(
              targetW / POSTER_BASE_W,
              targetH / POSTER_BASE_H,
            );
            rightPosterInnerRef.current.style.transform = `translate(-50%, -50%) scale(${uniformScale})`;
          }
        }
      }

      if (sharpLeftPosterRef.current) {
        sharpLeftPosterRef.current.style.transform = `translate3d(-${doorSlidePercent}%, 0, 0)`;
      }
      if (sharpRightPosterRef.current) {
        sharpRightPosterRef.current.style.transform = `translate3d(${doorSlidePercent}%, 0, 0)`;
      }

      if (storeLightRef.current) {
        storeLightRef.current.style.opacity = String(storeLightOpacity);
        storeLightRef.current.style.transform = `scale(${interiorScale})`;
      }
      if (storeDimRef.current) {
        storeDimRef.current.style.opacity = String(storeDimOpacity);
      }
      if (storeDarkRef.current) {
        storeDarkRef.current.style.opacity = String(storeDarkOpacity);
      }
      if (darkTintRef.current) {
        darkTintRef.current.style.opacity = String(darkTintOpacity);
      }

      if (yellowVeilRef.current) {
        yellowVeilRef.current.style.opacity = String(
          pExit > 0
            ? yellowVeilOpacity * (1 - clamp01(pExit / 0.14))
            : yellowVeilOpacity,
        );
      }

      if (whiteFlashRef.current) {
        whiteFlashRef.current.style.opacity = String(flashOpacity);
      }

      if (thankYouRef.current) {
        thankYouRef.current.style.opacity = String(thankYouOpacity);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    updateFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Exact pixel-matched slice ratios split dead-on the 50.60% middle dark-blue line
  const leftSplitPct = DOOR_SPLIT_PCT;
  const rightSplitPct = 100 - DOOR_SPLIT_PCT;
  const leftLeafW = (DOOR_WIDTH * leftSplitPct) / 100;
  const rightLeafW = (DOOR_WIDTH * rightSplitPct) / 100;
  const invLeftWidthPct = (100 / leftLeafW) * 100;
  const invRightWidthPct = (100 / rightLeafW) * 100;
  const invHeightPct = (100 / DOOR_HEIGHT) * 100;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.cdnfonts.com/css/gang-of-three"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=IBM+Plex+Mono:wght@400;500;600;700&family=Zen+Maru+Gothic:wght@500;700&display=swap"
      />

      {/* PERSISTENT FIXED VIEWPORT STAGE (z-index: 0, lifts upward when footer scrolls in) */}
      <div
        ref={stageRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
          backgroundColor: "#00072D",
          willChange: "transform",
        }}
      >
        {/* 1A. Bright Store Interior (storelight.png) */}
        <div
          ref={storeLightRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            transform: "scale(1.04)",
            zIndex: 1,
          }}
        >
          <img
            src="/img/static/images/storelight.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* 1B. Dimmed Store Interior (storedim.png) for light flicker */}
        <div
          ref={storeDimRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 2,
          }}
        >
          <img
            src="/img/static/images/storedim.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* 1C. Dark Store Interior (storedark.png) */}
        <div
          ref={storeDarkRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 3,
          }}
        >
          <img
            src="/img/static/images/storedark.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* 1D. Deep Night Tint over storedark.png before farewell message */}
        <div
          ref={darkTintRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#00072D",
            opacity: 0,
            zIndex: 4,
          }}
        />

        {/* 2. Translucent Cream/Yellow Veil over Store Aisle for Content Sections */}
        <div
          ref={yellowVeilRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 5,
            background:
              "linear-gradient(90deg, rgba(244, 239, 224, 0.50) 0%, rgba(244, 239, 224, 0.88) 22%, rgba(244, 239, 224, 0.92) 50%, rgba(244, 239, 224, 0.88) 78%, rgba(244, 239, 224, 0.50) 100%)",
          }}
        />

        {/* 3. Exterior Storefront Layer (wemart-hero.png) — sized to exact cover-fit image box */}
        <div
          ref={exteriorRef}
          className="jumbotron-bg-layer"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            backgroundSize: "100% 100%",
            opacity: 1,
            transform: "scale(1)",
            transformOrigin: `${DOOR_CENTER_X}% 92%`,
            zIndex: 6,
          }}
        >
          {/* EXACT INNER DOORWAY OPENING (clipped strictly inside the inner blue vertical jambs):
              Left inner jamb = 41.9% | Middle dark-blue seam = 50.60% | Right inner jamb = 59.3% */}
          <div
            ref={doorsContainerRef}
            style={{
              position: "absolute",
              top: `${DOOR_TOP}%`,
              left: `${DOOR_LEFT}%`,
              width: `${DOOR_WIDTH}%`,
              height: `${DOOR_HEIGHT}%`,
              overflow: "hidden",
            }}
          >
            {/* Store Interior Preview — strictly clipped to inner doorway opening */}
            <div
              ref={doorOpenInteriorRef}
              style={{
                position: "absolute",
                inset: "0%",
                opacity: 0,
                zIndex: 1,
                overflow: "hidden",
              }}
            >
              <img
                ref={doorOpenInteriorImgRef}
                src="/img/static/images/storelight.png"
                alt=""
                className="h-full w-full object-cover object-center"
              />
              <div
                ref={doorOpenDarkTintRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#00072D",
                  opacity: 0,
                }}
              />
            </div>

            {/* LEFT SYMMETRICAL ILLUSTRATED DOOR LEAF */}
            <div
              ref={leftDoorLeafRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
                width: `${leftSplitPct}%`,
                height: "100%",
                overflow: "hidden",
                willChange: "transform",
                transform: "translate3d(0%, 0, 0)",
              }}
            >
              <div
                className="jumbotron-bg-layer"
                style={{
                  position: "absolute",
                  top: `${(-DOOR_TOP / DOOR_HEIGHT) * 100}%`,
                  left: `${(-DOOR_LEFT / leftLeafW) * 100}%`,
                  width: `${invLeftWidthPct}%`,
                  height: `${invHeightPct}%`,
                  backgroundSize: "100% 100%",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* RIGHT SYMMETRICAL ILLUSTRATED DOOR LEAF */}
            <div
              ref={rightDoorLeafRef}
              style={{
                position: "absolute",
                top: 0,
                left: `${leftSplitPct}%`,
                zIndex: 2,
                width: `${rightSplitPct}%`,
                height: "100%",
                overflow: "hidden",
                willChange: "transform",
                transform: "translate3d(0%, 0, 0)",
              }}
            >
              <div
                className="jumbotron-bg-layer"
                style={{
                  position: "absolute",
                  top: `${(-DOOR_TOP / DOOR_HEIGHT) * 100}%`,
                  left: `${(-(DOOR_LEFT + leftLeafW) / rightLeafW) * 100}%`,
                  width: `${invRightWidthPct}%`,
                  height: `${invHeightPct}%`,
                  backgroundSize: "100% 100%",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* 3A. NATIVE 1:1 UNSCALED POSTER LAYER (z-index: 6):
            Both posters locked to fixed 340x440 canvases and dead-centered inside each yellow glass pane */}
        <div
          ref={sharpPostersOverlayRef}
          style={{
            position: "absolute",
            top: `${DOOR_TOP}%`,
            left: `${DOOR_LEFT}%`,
            width: `${DOOR_WIDTH}%`,
            height: `${DOOR_HEIGHT}%`,
            zIndex: 6,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* Left Poster Carrier */}
          <div
            ref={sharpLeftPosterRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${leftSplitPct}%`,
              height: "100%",
              willChange: "transform",
              transform: "translate3d(0%, 0, 0)",
            }}
          >
            <div
              ref={leftPosterInnerRef}
              style={{
                position: "absolute",
                top: "49.5%",
                left: "47.0%",
                width: `${POSTER_BASE_W}px`,
                height: `${POSTER_BASE_H}px`,
                transformOrigin: "center center",
                transform: "translate(-50%, -50%) scale(1)",
                borderRadius: "2px",
                overflow: "hidden",
                WebkitFontSmoothing: "antialiased",
              }}
            >
              <img
                src="/img/static/images/About%20WEHack-01.png"
                alt="Dallas' Largest Inclusive Hackathon"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                  padding: "36px 26px 32px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "14px",
                }}
              >
                <h3
                  style={{
                    fontFamily:
                      "'Dela Gothic One', 'Zen Maru Gothic', sans-serif",
                    color: "#00072D",
                    fontSize: "21px",
                    lineHeight: 1.15,
                    letterSpacing: "0.02em",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    textShadow: "1.5px 1.5px 0px #EFB5D5",
                  }}
                >
                  Dallas&apos; Largest
                  <br />
                  Inclusive Hackathon
                </h3>

                <p
                  style={{
                    fontFamily: "'Zen Maru Gothic', sans-serif",
                    fontWeight: 700,
                    color: "#538FDD",
                    fontSize: "14px",
                    lineHeight: 1.24,
                  }}
                >
                  The purpose of WEHack is to create an inclusive and
                  encouraging environment for women, nonbinary genders, and all
                  underrepresented groups in technology so that they can gain
                  the skills and confidence to excel in future hackathons and
                  the tech world.
                </p>

                <p
                  style={{
                    fontFamily: "'Zen Maru Gothic', sans-serif",
                    fontWeight: 700,
                    color: "#538FDD",
                    fontSize: "14px",
                    lineHeight: 1.24,
                    paddingRight: "44px",
                  }}
                >
                  We aim to encourage more underrepresented individuals to
                  harness their skills by creating software or hardware projects
                  of their own. Whether it&apos;s networking with sponsors and
                  hackers, gaining development and workshop experience, or
                  competing against other teams for challenges and prizes,
                  WEHack offers participants an opportunity to end the weekend
                  with unique takeaways.
                </p>
              </div>
            </div>
          </div>

          {/* Right Poster Carrier (dead-centered inside right yellow glass pane) */}
          <div
            ref={sharpRightPosterRef}
            style={{
              position: "absolute",
              top: 0,
              left: `${leftSplitPct}%`,
              width: `${rightSplitPct}%`,
              height: "100%",
              willChange: "transform",
              transform: "translate3d(0%, 0, 0)",
            }}
          >
            <div
              ref={rightPosterInnerRef}
              style={{
                position: "absolute",
                top: "49.5%",
                left: "51.5%",
                width: `${POSTER_BASE_W}px`,
                height: `${POSTER_BASE_H}px`,
                transformOrigin: "center center",
                transform: "translate(-50%, -50%) scale(1)",
                borderRadius: "2px",
                border: "2px solid #00072D",
                backgroundColor: "rgba(255, 253, 247, 0.96)",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                WebkitFontSmoothing: "antialiased",
              }}
            >
              <span
                style={{
                  fontFamily: "'Zen Maru Gothic', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#E88D9C",
                }}
              >
                Store Hours
              </span>
              <p
                style={{
                  marginTop: "10px",
                  fontFamily: "'Zen Maru Gothic', sans-serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: 1.25,
                  color: "#00072D",
                }}
              >
                Poster 2 Content
              </p>
            </div>
          </div>
        </div>

        {/* 3B. Deep Midnight Navy Nighttime Tint over Jumbotron on Exit */}
        <div
          ref={exteriorNightOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 7,
            background:
              "radial-gradient(circle at 50% 65%, rgba(0, 7, 45, 0.52) 0%, rgba(0, 5, 32, 0.82) 100%)",
          }}
        />

        {/* 4. Hero Title Overlay (Original Large Left-Aligned Text Moved Down Below Navbar) */}
        <div
          ref={heroTextRef}
          className="jumboText-container jumbotron-text-overlay absolute inset-0"
          style={{
            opacity: 1,
            transform: "translateY(0px)",
            zIndex: 8,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div className="mt-24 flex flex-col items-start text-left sm:mt-28 md:ml-[1.5rem] md:mt-[7.5rem]">
            <h1
              className="my-2 text-5xl tracking-wider sm:text-7xl md:text-8xl lg:text-9xl"
              style={{
                fontFamily: "'Gang of Three', fantasy, cursive",
                color: "#00072D",
                textShadow: `
                  -2px -2px 0 #FFFFFF,
                  2px -2px 0 #FFFFFF,
                  -2px  2px 0 #FFFFFF,
                  2px  2px 0 #FFFFFF,
                  0px -2px 0 #FFFFFF,
                  0px  2px 0 #FFFFFF,
                  -2px  0px 0 #FFFFFF,
                  2px  0px 0 #FFFFFF,
                  0 0 18px rgba(255, 255, 255, 0.75)
                `,
              }}
            >
              A Trip to WEMart
            </h1>

            <h2
              className="mt-2 text-xl tracking-wider sm:text-2xl md:text-3xl lg:text-4xl"
              style={{
                fontFamily: "'Gang of Three', fantasy, cursive",
                color: "#538FDD",
                fontWeight: 500,
                textShadow: `
                  -1px -1px 0 #FFFFFF,
                  1px -1px 0 #FFFFFF,
                  -1px  1px 0 #FFFFFF,
                  1px  1px 0 #FFFFFF,
                  0px -1px 0 #FFFFFF,
                  0px  1px 0 #FFFFFF,
                  -1px  0px 0 #FFFFFF,
                  1px  0px 0 #FFFFFF,
                  0 0 18px rgba(255, 255, 255, 0.75)
                `,
              }}
            >
              April 17-18
            </h2>
          </div>
        </div>

        {/* 5. Closing Farewell Text ("Thank you for visiting WEMart, come back soon!") */}
        <div
          ref={thankYouRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 9,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1.5rem",
            textAlign: "center",
          }}
        >
          <p
            className="text-3xl sm:text-5xl md:text-6xl"
            style={{
              fontFamily: "'Dela Gothic One', 'Zen Maru Gothic', sans-serif",
              color: "#C5D9EB",
              textShadow: "3px 3px 0px #538FDD, 0 0 24px rgba(0, 7, 45, 0.9)",
              lineHeight: 1.25,
            }}
          >
            Thank you for visiting WEMart,
            <br />
            <span style={{ color: "#EFB5D5" }}>come back soon!</span>
          </p>
        </div>

        {/* 6. White Flash Overlay */}
        <div
          ref={whiteFlashRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            opacity: 0,
            zIndex: 10,
          }}
        />
      </div>

      {/* FOREGROUND SCROLLING FLOW (z-index: 10) */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* ENTRY RUNWAY: Zoom in -> poster pause -> white flash -> 1.5s storelight hold */}
        <section
          ref={entryRunwayRef}
          id="home"
          style={{ height: "420vh", width: "100%", pointerEvents: "none" }}
        />

        {/* MAIN CONTENT SECTIONS */}
        <div ref={contentWrapperRef} className="relative w-full">
          {children}
        </div>

        {/* EXIT RUNWAY: Yellow veil clears -> store flickers -> dark + Thank you text -> white flash -> zoom out with dark store -> doors close -> full nighttime Jumbotron */}
        <section
          ref={exitRunwayRef}
          id="goodbye"
          style={{ height: "440vh", width: "100%", pointerEvents: "none" }}
        />

        {/* 7. CLOSING FOOTER IN NORMAL FLOW BELOW THE ZOOM-OUT (Stays completely below the Jumbotron) */}
        <footer className="relative z-20 w-full border-t-2 border-[#538FDD]/70 bg-[#00072D] px-4 py-8 text-[#C5D9EB] sm:px-6 sm:py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
            {/* Left: Centered WEMart 27' Logo (2x Bigger) Above Made with <3 by WEHack */}
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Link
                href="#home"
                className="flex items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                <img
                  src="/img/static/images/WEMart%2027'%20logo.png"
                  alt="WEMart 2027 Logo"
                  className="h-28 w-auto object-contain drop-shadow-[0_0_14px_rgba(197,217,235,0.5)] sm:h-32"
                />
              </Link>
              <p
                className="text-xs font-medium tracking-wide text-[#EDD0E0] sm:text-sm"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Made with <span className="text-[#EFB5D5]">&lt;3</span> by{" "}
                <span className="font-bold text-[#E4DFAA]">WEHack</span>
              </p>
            </div>

            {/* Center: Quick Navigation Links */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold sm:gap-x-6 sm:text-sm"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
            >
              <a
                href="#about-wehack"
                className="text-[#C5D9EB] transition-colors hover:text-[#EFB5D5]"
              >
                About
              </a>
              <a
                href="#Sponsor"
                className="text-[#C5D9EB] transition-colors hover:text-[#EFB5D5]"
              >
                Sponsors
              </a>
              <a
                href="#FAQ"
                className="text-[#C5D9EB] transition-colors hover:text-[#EFB5D5]"
              >
                FAQ
              </a>
              <a
                href="http://hackp.ac/coc"
                target="_blank"
                rel="noreferrer"
                className="text-[#C5D9EB] transition-colors hover:text-[#EFB5D5]"
              >
                MLH Code of Conduct
              </a>
              <a
                href="mailto:wehackutd@gmail.com"
                className="text-[#E4DFAA] transition-colors hover:text-[#EFB5D5]"
              >
                Contact Us
              </a>
            </div>

            {/* Right: Socials */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider sm:gap-4"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              <a
                href="https://www.instagram.com/wehackutd/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#538FDD] bg-[#060F38] px-3 py-2 text-[#C5D9EB] transition-all hover:border-[#EFB5D5] hover:bg-[#EFB5D5] hover:text-[#00072D]"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/wehackutd/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#538FDD] bg-[#060F38] px-3 py-2 text-[#C5D9EB] transition-all hover:border-[#EFB5D5] hover:bg-[#EFB5D5] hover:text-[#00072D]"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}