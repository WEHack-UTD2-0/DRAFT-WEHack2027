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

// Mathematically verified inner doorway bounds in wemart-hero.png:
// Left inner jamb = 38.2% | Right inner jamb = 64.0% (width = 25.8%)
// Top of light-blue door frame = 67.6% | Bottom threshold = 98.4% (height = 30.8%)
// Exact center of the vertical dark-blue line between the two doors sits at 50.45% of the image,
// which is 47.48% of DOOR_WIDTH (38.2 + 25.8 * 0.4748 = 50.45%).
const DOOR_TOP = 67.6;
const DOOR_LEFT = 38.2;
const DOOR_WIDTH = 25.8;
const DOOR_HEIGHT = 30.8;
const DOOR_SPLIT_PCT = 47.48;
const DOOR_CENTER_X = DOOR_LEFT + (DOOR_WIDTH * DOOR_SPLIT_PCT) / 100; // 50.45%

// Fixed reference coordinate canvas for the left poster so line wraps & text positions are 100% locked
const POSTER_BASE_W = 340;
const POSTER_BASE_H = 440;

export default function WEMartScrollExperience({
  children,
}: WEMartScrollExperienceProps) {
  const entryRunwayRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const exitRunwayRef = useRef<HTMLElement>(null);

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
  const leftPosterCardRef = useRef<HTMLDivElement>(null);
  const leftPosterInnerRef = useRef<HTMLDivElement>(null);

  // Interior store lighting layers
  const storeLightRef = useRef<HTMLDivElement>(null);
  const storeDimRef = useRef<HTMLDivElement>(null);
  const storeDarkRef = useRef<HTMLDivElement>(null);
  const darkTintRef = useRef<HTMLDivElement>(null);

  // Yellow translucent content backdrop & transitions
  const yellowVeilRef = useRef<HTMLDivElement>(null);
  const whiteFlashRef = useRef<HTMLDivElement>(null);
  const thankYouRef = useRef<HTMLDivElement>(null);

  // Final nighttime Jumbotron footer overlay
  const closingFooterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

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
      let footerOpacity = 0;

      // === BRANCH A: EXIT SEQUENCE ACTIVE (User reached bottom of page) ===
      if (pExit > 0) {
        useDarkDoorwayInterior = true;

        if (pExit < 0.16) {
          storeLightOpacity = 1;
        } else if (pExit < 0.34) {
          // Rapid fluorescent flicker across 6 steps
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
          // Dark store hold + Farewell message
          storeDarkOpacity = 1;
          const fadeToBlack = easeInOut(clamp01((pExit - 0.34) / 0.07));
          darkTintOpacity = fadeToBlack * 0.78;

          const textIn = clamp01((pExit - 0.36) / 0.04);
          const textOut = 1 - clamp01((pExit - 0.44) / 0.04);
          thankYouOpacity = textIn * textOut;
        } else if (pExit < 0.54) {
          // White flash across the screen right after the words disappear,
          // revealing the storefront at a wider 2.65x framing so the full door frame is immediately visible
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
          // Smoothly pull back from 2.65x -> 1.08x -> 1.0x
          storeDarkOpacity = 0;
          darkTintOpacity = 0;
          exteriorOpacity = 1;

          const mainZoomOutT = easeInOut(clamp01((pExit - 0.54) / 0.24));
          const finalSettleT = easeInOut(clamp01((pExit - 0.78) / 0.14));
          exteriorScale = 2.65 - mainZoomOutT * 1.57 - finalSettleT * 0.08;
          exteriorOriginY = 86.5 + mainZoomOutT * 5.5;

          // Real illustrated doors + posters meet dead-on the 50.45% middle dark-blue line
          const doorCloseT = easeInOut(clamp01((pExit - 0.74) / 0.16));
          showDoorAssembly = true;
          doorLeafOpacity = 1;
          doorSlidePercent = (1 - doorCloseT) * 100;
          doorwayInteriorOpacity = doorCloseT < 0.998 ? 1 : 0;

          // Bring in the exterior nighttime tint gradually as the storefront zooms out and doors close
          exteriorNightOpacity = 0.35 + mainZoomOutT * 0.25 + doorCloseT * 0.1;

          // Fade in the centered WEMart 27' logo & footer over the nighttime Jumbotron
          footerOpacity = easeInOut(clamp01((pExit - 0.88) / 0.12));
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

      // --- APPLY GPU-COMPOSITED STYLES DIRECTLY ---
      if (exteriorRef.current) {
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

      // --- UPDATE NATIVE 1:1 UNSCALED POSTER OVERLAY (FIXED-CANVAS TEXT = ZERO REFLOW/JITTER) ---
      if (sharpPostersOverlayRef.current) {
        const isVisible =
          showDoorAssembly && exteriorOpacity > 0.01 && doorLeafOpacity > 0.01;
        sharpPostersOverlayRef.current.style.display = isVisible
          ? "block"
          : "none";

        if (isVisible) {
          const projTop =
            exteriorOriginY + (DOOR_TOP - exteriorOriginY) * exteriorScale;
          const projLeft =
            DOOR_CENTER_X + (DOOR_LEFT - DOOR_CENTER_X) * exteriorScale;
          const projWidth = DOOR_WIDTH * exteriorScale;
          const projHeight = DOOR_HEIGHT * exteriorScale;

          sharpPostersOverlayRef.current.style.top = `${projTop}%`;
          sharpPostersOverlayRef.current.style.left = `${projLeft}%`;
          sharpPostersOverlayRef.current.style.width = `${projWidth}%`;
          sharpPostersOverlayRef.current.style.height = `${projHeight}%`;
          sharpPostersOverlayRef.current.style.opacity = String(
            exteriorOpacity * doorLeafOpacity,
          );
          sharpPostersOverlayRef.current.style.setProperty(
            "--poster-scale",
            String(exteriorScale),
          );

          // Scale the fixed 340x440 left poster typography uniformly so text stays 100% locked in place
          if (leftPosterInnerRef.current) {
            const leftLeafPxW =
              ((projWidth / 100) * vw * DOOR_SPLIT_PCT) / 100;
            const leftLeafPxH = (projHeight / 100) * vh;
            const cardPxW = leftLeafPxW * 0.62;
            const cardPxH = leftLeafPxH * 0.54;
            const scaleX = cardPxW / POSTER_BASE_W;
            const scaleY = cardPxH / POSTER_BASE_H;
            leftPosterInnerRef.current.style.transform = `scale(${scaleX}, ${scaleY})`;
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

      if (closingFooterRef.current) {
        closingFooterRef.current.style.opacity = String(footerOpacity);
        closingFooterRef.current.style.pointerEvents =
          footerOpacity > 0.5 ? "auto" : "none";
        closingFooterRef.current.style.transform = `translateY(${(1 - footerOpacity) * 24}px)`;
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

  // Exact pixel-matched slice ratios split dead-on the 50.45% middle dark-blue line (47.48% / 52.52%)
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

      {/* PERSISTENT FIXED VIEWPORT STAGE (z-index: 0) */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
          backgroundColor: "#00072D",
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

        {/* 3. Exterior Storefront Layer (wemart-hero.png) */}
        <div
          ref={exteriorRef}
          className="jumbotron-bg-layer"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1,
            transform: "scale(1)",
            transformOrigin: `${DOOR_CENTER_X}% 92%`,
            zIndex: 6,
          }}
        >
          {/* EXACT INNER DOORWAY OPENING:
              Left inner jamb = 38.2% | Middle dark-blue line = 50.45% | Right inner jamb = 64.0% */}
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
            {/* Store Interior Preview */}
            <div
              ref={doorOpenInteriorRef}
              style={{
                position: "absolute",
                inset: "2.8% 0% 0% 0%",
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

            {/* LEFT SYMMETRICAL ILLUSTRATED DOOR LEAF (47.48% width — splits dead-on the 50.45% middle dark-blue line) */}
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
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* RIGHT SYMMETRICAL ILLUSTRATED DOOR LEAF (52.52% width — meets dead-on the 50.45% middle dark-blue line) */}
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
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* 3A. NATIVE 1:1 UNSCALED POSTER LAYER (z-index: 6):
            Both posters centered directly inside the yellow glass panes of their respective doors */}
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
            ["--poster-scale" as any]: "1",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              transform: "translate3d(0%, 0, 0)",
            }}
          >
            <div
              ref={leftPosterCardRef}
              className="relative h-[54%] w-[62%] translate-x-[2%] translate-y-[4%] overflow-hidden rounded-[2px]"
            >
              <img
                src="/img/static/images/About%20WEHack-01.png"
                alt="Dallas' Largest Inclusive Hackathon"
                className="h-full w-full object-cover"
              />
              {/* Fixed 340x440 coordinate system scaled uniformly so text never reflows or jitters */}
              <div
                ref={leftPosterInnerRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${POSTER_BASE_W}px`,
                  height: `${POSTER_BASE_H}px`,
                  transformOrigin: "top left",
                  transform: "scale(1, 1)",
                  padding: "36px 26px 32px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "14px",
                  WebkitFontSmoothing: "antialiased",
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

          {/* Right Poster Carrier */}
          <div
            ref={sharpRightPosterRef}
            style={{
              position: "absolute",
              top: 0,
              left: `${leftSplitPct}%`,
              width: `${rightSplitPct}%`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              transform: "translate3d(0%, 0, 0)",
            }}
          >
            <div className="flex h-[54%] w-[62%] -translate-x-[14%] translate-y-[4%] flex-col items-center justify-center rounded-[2px] border-[1.5px] border-[#00072D] bg-[#FFFDF7]/95 p-2 text-center">
              <span
                className="font-bold uppercase tracking-wider text-[#E88D9C]"
                style={{
                  fontFamily: "'Zen Maru Gothic', sans-serif",
                  fontSize: "calc(0.45vw * var(--poster-scale))",
                }}
              >
                Store Hours
              </span>
              <p
                className="mt-1 font-bold leading-tight text-[#00072D]"
                style={{
                  fontFamily: "'Zen Maru Gothic', sans-serif",
                  fontSize: "calc(0.56vw * var(--poster-scale))",
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
              April 3-4
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

      {/* =====================================================================
          7. FINAL NIGHTTIME JUMBOTRON FOOTER OVERLAY (Clickable, z-index: 20)
         ===================================================================== */}
      <footer
        ref={closingFooterRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          opacity: 0,
          pointerEvents: "none",
          transform: "translateY(24px)",
        }}
        className="w-full border-t-2 border-[#538FDD]/70 bg-[#00072D]/85 px-4 py-6 text-[#C5D9EB] backdrop-blur-md sm:px-6 sm:py-8"
      >
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
            <a
              href="https://discord.gg/wehack"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#538FDD] bg-[#060F38] px-3 py-2 text-[#C5D9EB] transition-all hover:border-[#EFB5D5] hover:bg-[#EFB5D5] hover:text-[#00072D]"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>

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

        {/* EXIT RUNWAY: Yellow veil clears -> store flickers -> dark + Thank you text -> white flash -> zoom out with dark store -> doors close -> nighttime Jumbotron + Footer */}
        <section
          ref={exitRunwayRef}
          id="goodbye"
          style={{ height: "440vh", width: "100%", pointerEvents: "none" }}
        />
      </div>
    </>
  );
}