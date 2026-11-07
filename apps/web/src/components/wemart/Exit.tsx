import React from "react";
import Bunny from "./Bunny";

// 240vh exit spacer: the storefront zooms back out and the doors close (driven by the
// scroll engine). The engine fades the "Thank you" bunny in (fadeRef/bunnyRef)
// right after the basket.
export default function Exit({ outroRef, fadeRef, bunnyRef }: { outroRef: React.RefObject<HTMLElement>; fadeRef: React.RefObject<HTMLDivElement>; bunnyRef: React.RefObject<HTMLDivElement> }) {
	return (
		<section id="exit" ref={outroRef} style={{ position: "relative", zIndex: "3", height: "240vh", pointerEvents: "none" }}>
		  <div style={{ position: "sticky", top: "0", height: "100vh", overflow: "hidden" }}>
		    
		    <div ref={fadeRef} style={{ position: "absolute", inset: "0", opacity: "0", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "20px 20px 4vh", textAlign: "center" }}>
		      <div ref={bunnyRef} style={{ position: "relative", width: "min(24vw,240px)", minWidth: "170px", transform: "translateY(36px) scale(0.9)", transformOrigin: "50% 100%", willChange: "transform" }}><Bunny title="Thank you for shopping!" subtitle="ありがとうございました" /></div>
		    </div>
		  </div>
		</section>
	);
}
