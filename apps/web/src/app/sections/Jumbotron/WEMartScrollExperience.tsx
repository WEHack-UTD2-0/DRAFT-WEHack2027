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
  const postersContainerRef = useRef<HTMLDivElement>(null);
  const leftPosterRef = useRef<HTMLDivElement>(null);
  const rightPosterRef = useRef<HTMLDivElement>(null);

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
      let exteriorNightOpacity = 0;
      let heroOpacity = 0;
      let heroTranslateY = 0;

      let showEntryPosters = false;
      let posterOpacity = 0;
      let posterSlide = 0;

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
        } else if (pExit < 0.54) {
          // Dark store hold (~1.5s) + Farewell message
          storeDarkOpacity = 1;
          const fadeToBlack = easeInOut(clamp01((pExit - 0.34) / 0.1));
          darkTintOpacity = fadeToBlack * 0.78;

          const textIn = clamp01((pExit - 0.37) / 0.06);
          const textOut = 1 - clamp01((pExit - 0.49) / 0.05);
          thankYouOpacity = textIn * textOut;
        } else {
          // 0.54 -> 0.86: Crossfade to nighttime Jumbotron & zoom out to 1.0x
          const revealExteriorT = easeInOut(clamp01((pExit - 0.54) / 0.1));
          storeDarkOpacity = 1 - revealExteriorT;
          darkTintOpacity = (1 - revealExteriorT) * 0.78;
          exteriorOpacity = revealExteriorT;
          exteriorNightOpacity = revealExteriorT * 0.68;

          const zoomOutT = easeInOut(clamp01((pExit - 0.6) / 0.26));
          exteriorScale = 3.1 - zoomOutT * 2.1;

          // 0.84 -> 1.00: Fade in the WEMart 27' logo & footer over the nighttime Jumbotron
          footerOpacity = easeInOut(clamp01((pExit - 0.84) / 0.12));
        }
      } else {
        // === BRANCH B: ENTRY RUNWAY + CONTENT SECTIONS ===
        const approachT = easeInOut(clamp01(pEntry / 0.25));
        const doorOpenT = easeInOut(clamp01((pEntry - 0.45) / 0.25));

        exteriorScale = 1 + approachT * 2.1 + doorOpenT * 0.75;
        heroOpacity = clamp01(1 - pEntry / 0.2);
        heroTranslateY = -pEntry * 70;

        showEntryPosters = pEntry < 0.72;
        const posterFadeIn = clamp01((pEntry - 0.17) / 0.08);
        const posterFadeOut = 1 - clamp01((pEntry - 0.58) / 0.1);
        posterOpacity = posterFadeIn * posterFadeOut;
        posterSlide = doorOpenT * 115;

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

      if (postersContainerRef.current) {
        postersContainerRef.current.style.display = showEntryPosters
          ? "flex"
          : "none";
      }
      if (leftPosterRef.current) {
        leftPosterRef.current.style.opacity = String(posterOpacity);
        leftPosterRef.current.style.transform = `translateX(-${posterSlide}%)`;
      }
      if (rightPosterRef.current) {
        rightPosterRef.current.style.opacity = String(posterOpacity);
        rightPosterRef.current.style.transform = `translateX(${posterSlide}%)`;
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
            transformOrigin: "50.5% 92%",
            zIndex: 6,
          }}
        >
          {/* ENTRY DOORS: Two Posters on the Double Doors (hidden during exit zoom-out) */}
          <div
            ref={postersContainerRef}
            style={{
              position: "absolute",
              top: "70.5%",
              left: "38.2%",
              width: "24.6%",
              height: "20.5%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "4%",
              padding: "0 1.8%",
            }}
          >
            <div
              ref={leftPosterRef}
              style={{ opacity: 0, transform: "translateX(0%)" }}
              className="flex h-[76%] w-[46%] flex-col items-center justify-center rounded-sm border-[1.5px] border-[#00072D] bg-[#FFFDF7]/95 p-1.5 text-center shadow-md"
            >
              <span
                className="text-[6.5px] font-bold uppercase tracking-wider text-[#538FDD]"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
              >
                WEHack 2027
              </span>
              <p
                className="mt-0.5 text-[8.5px] font-bold leading-tight text-[#00072D]"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
              >
                Poster 1 Content
              </p>
            </div>

            <div
              ref={rightPosterRef}
              style={{ opacity: 0, transform: "translateX(0%)" }}
              className="flex h-[76%] w-[46%] flex-col items-center justify-center rounded-sm border-[1.5px] border-[#00072D] bg-[#FFFDF7]/95 p-1.5 text-center shadow-md"
            >
              <span
                className="text-[6.5px] font-bold uppercase tracking-wider text-[#E88D9C]"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
              >
                Store Hours
              </span>
              <p
                className="mt-0.5 text-[8.5px] font-bold leading-tight text-[#00072D]"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
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
              "radial-gradient(circle at 50% 65%, rgba(0, 7, 45, 0.62) 0%, rgba(0, 5, 32, 0.86) 100%)",
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

        {/* EXIT RUNWAY: Yellow veil clears -> store flickers -> dark + Thank you text -> nighttime Jumbotron + Footer */}
        <section
          ref={exitRunwayRef}
          id="goodbye"
          style={{ height: "420vh", width: "100%", pointerEvents: "none" }}
        />
      </div>
    </>
  );
}