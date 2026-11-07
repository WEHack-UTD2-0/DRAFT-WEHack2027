import React from "react";
import Bunny from "./Bunny";

// 300vh spacer that drives the storefront zoom + door opening. The engine fades the bunny in
// (bunnyRef) while it rises and grows slightly into place.
export default function Hero({ heroRef, bunnyRef }: { heroRef: React.RefObject<HTMLElement>; bunnyRef: React.RefObject<HTMLDivElement> }) {
	return (
  <>
  <section id="about" ref={heroRef} style={{ position: "relative", zIndex: "3", height: "300vh", pointerEvents: "none" }}>
    <div style={{ position: "sticky", top: "0", height: "100vh", overflow: "hidden" }}>
      <div ref={bunnyRef} style={{ position: "absolute", left: "50%", bottom: "4vh", transform: "translateX(-50%) translateY(36px) scale(0.9)", transformOrigin: "50% 100%", width: "min(24vw,240px)", minWidth: "170px", opacity: "0", willChange: "opacity, transform", pointerEvents: "none" }}><Bunny title="Welcome to WEmart!" subtitle="いらっしゃいませ" /></div>
    </div>
  </section>
  </>
	);
}
