"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Jumbotron.css";

export default function Jumbotron() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const updateScrollProgress = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const rawProgress = -rect.top / scrollableDistance;
      const clamped = Math.min(1, Math.max(0, rawProgress));
      setProgress(clamped);
    };

    const onScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const eased =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  // 3.1x zoom keeps the full door frame & both posters completely inside 100vh
  const zoomScale = 1 + eased * 2.1;
  const heroTextOpacity = Math.max(0, 1 - progress * 2.8);
  const postersOpacity = Math.min(1, Math.max(0, (progress - 0.65) / 0.35));

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
        style={{ position: "relative", height: "240vh", width: "100%" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Zooming WEMart storefront layer */}
          <div
            className="jumbotron-bg-layer"
            style={{
              position: "relative",
              height: "100%",
              width: "100%",
              transform: `scale(${zoomScale})`,
              // Aiming lower (92%) lifts the bottom of the doors up into full view
              transformOrigin: "50.5% 92%",
              willChange: "transform",
            }}
          >
            {/* Double-door glass pane bounding box */}
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
                opacity: postersOpacity,
                pointerEvents: postersOpacity > 0.8 ? "auto" : "none",
              }}
            >
              {/* Left Door Poster */}
              <div className="flex h-[76%] w-[46%] flex-col items-center justify-center rounded-sm border-[1.5px] border-[#00072D] bg-[#FFFDF7]/95 p-1.5 text-center shadow-md">
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
              <div className="flex h-[76%] w-[46%] flex-col items-center justify-center rounded-sm border-[1.5px] border-[#00072D] bg-[#FFFDF7]/95 p-1.5 text-center shadow-md">
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

          {/* Hero Title Overlay */}
          <div
            className="jumboText-container jumbotron-text-overlay pointer-events-none absolute inset-0"
            style={{
              opacity: heroTextOpacity,
              transform: `translateY(${-progress * 60}px)`,
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
                April 3-4
              </h2>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}