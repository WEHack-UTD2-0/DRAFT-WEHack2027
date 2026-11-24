"use client";
import React, { useEffect, useRef } from "react";
import "./Jumbotron.css";

const clamp01 = (val: number) => Math.min(1, Math.max(0, val));
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export default function Jumbotron() {
  const sectionRef = useRef<HTMLElement>(null);
  const exteriorRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const leftPosterRef = useRef<HTMLDivElement>(null);
  const rightPosterRef = useRef<HTMLDivElement>(null);
  const whiteFlashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const applyScrollFrame = () => {
      ticking = false;
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const p = clamp01(-rect.top / scrollableDistance);

      // PHASE 1 (0.00 -> 0.30): Zoom into double doors (1.0x -> 3.1x)
      const approachT = easeInOut(clamp01(p / 0.3));

      // PHASE 2 (0.30 -> 0.52): Pause on the two posters
      // PHASE 3 (0.52 -> 0.78): Posters slide apart + gentle push + white flash
      const doorOpenT = easeInOut(clamp01((p - 0.52) / 0.26));

      // Cap scale at 3.85x max so the GPU never allocates an oversized texture that glitches Navbar
      const exteriorScale = 1 + approachT * 2.1 + doorOpenT * 0.75;

      // Hero text fades out cleanly in the first 22% of scroll
      const heroOpacity = clamp01(1 - p / 0.22);

      // Posters fade in (0.20 -> 0.30) and fade out as they slide apart (0.64 -> 0.75)
      const posterFadeIn = clamp01((p - 0.2) / 0.1);
      const posterFadeOut = 1 - clamp01((p - 0.64) / 0.11);
      const posterOpacity = posterFadeIn * posterFadeOut;
      const posterSlide = doorOpenT * 115;

      // Smooth white flash peaks at p = 0.76, then dissolves by p = 0.90
      let flashOpacity = 0;
      if (p >= 0.65 && p <= 0.76) {
        flashOpacity = easeInOut((p - 0.65) / 0.11);
      } else if (p > 0.76 && p <= 0.9) {
        flashOpacity = 1 - easeInOut((p - 0.76) / 0.14);
      }

      // Crossfade exterior -> interior right under the peak of the white flash (0.74 -> 0.78)
      const interiorOpacity = clamp01((p - 0.74) / 0.04);
      const exteriorOpacity = 1 - interiorOpacity;
      const interiorSettleT = easeInOut(clamp01((p - 0.76) / 0.24));
      const interiorScale = 1.05 - interiorSettleT * 0.05;

      if (exteriorRef.current) {
        exteriorRef.current.style.opacity = String(exteriorOpacity);
        exteriorRef.current.style.transform = `scale(${exteriorScale})`;
      }

      if (heroTextRef.current) {
        heroTextRef.current.style.opacity = String(heroOpacity);
        heroTextRef.current.style.transform = `translateY(${-p * 70}px)`;
      }

      if (leftPosterRef.current) {
        leftPosterRef.current.style.opacity = String(posterOpacity);
        leftPosterRef.current.style.transform = `translateX(-${posterSlide}%)`;
      }

      if (rightPosterRef.current) {
        rightPosterRef.current.style.opacity = String(posterOpacity);
        rightPosterRef.current.style.transform = `translateX(${posterSlide}%)`;
      }

      if (whiteFlashRef.current) {
        whiteFlashRef.current.style.opacity = String(flashOpacity);
      }

      if (interiorRef.current) {
        interiorRef.current.style.opacity = String(interiorOpacity);
        interiorRef.current.style.transform = `scale(${interiorScale})`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(applyScrollFrame);
      }
    };

    applyScrollFrame();
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
        href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&display=swap"
      />

      <section
        ref={sectionRef}
        id="home"
        style={{ position: "relative", height: "420vh", width: "100%" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            backgroundColor: "#00072D",
          }}
        >
          {/* LAYER 1: Interior Store Photo (storelight.png) */}
          <div
            ref={interiorRef}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              transform: "scale(1.05)",
              transformOrigin: "center center",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <img
              src="/img/static/images/storelight.png"
              alt="WEMart Store Interior"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
              }}
            />
          </div>

          {/* LAYER 2: Exterior WEMart Storefront + Two Door Posters */}
          <div
            ref={exteriorRef}
            className="jumbotron-bg-layer"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1,
              transform: "scale(1)",
              transformOrigin: "50.5% 92%",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            {/* Door glass pane alignment box */}
            <div
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
              {/* Left Door Poster */}
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

              {/* Right Door Poster */}
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

          {/* LAYER 3: Hero Title Overlay */}
          <div
            ref={heroTextRef}
            className="jumboText-container jumbotron-text-overlay pointer-events-none absolute inset-0"
            style={{
              opacity: 1,
              transform: "translateY(0px)",
              zIndex: 3,
            }}
          >
            <div className="jumbo-group mt-10 flex flex-col items-start md:ml-[1rem] md:mt-[2.5rem]">
              <h1
                className="my-3 text-5xl tracking-wider sm:text-7xl md:text-8xl lg:text-9xl"
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
                className="mt-1 text-lg tracking-wider sm:text-2xl md:text-3xl lg:text-4xl"
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

          {/* LAYER 4: White Flash Transition */}
          <div
            ref={whiteFlashRef}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#FFFFFF",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 4,
            }}
          />
        </div>
      </section>
    </>
  );
}