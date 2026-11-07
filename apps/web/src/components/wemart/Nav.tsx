import React from "react";

export default function Nav() {
	return (
  <>
  <nav style={{ position: "fixed", top: "14px", left: "50%", transform: "translateX(-50%)", zIndex: "60", width: "min(1180px,calc(100% - 28px))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "10px 12px 10px 18px", background: "rgba(255,253,246,.88)", backdropFilter: "blur(10px)", border: "1.8px solid #4a3a30", borderRadius: "14px", boxShadow: "0 4px 7px rgba(74,58,48,.28)" }}>
    <a href="#about" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#4a3a30" }}>
      <span style={{ fontFamily: "'Yusei Magic'", fontSize: "20px", letterSpacing: "-.01em" }}>WE<span style={{ color: "#7ba3d6" }}>Hack</span></span>
      <span style={{ font: "500 10px 'IBM Plex Mono'", padding: "3px 6px", border: "1.5px solid #4a3a30", borderRadius: "4px" }}>2027</span>
    </a>
    <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,2.2vw,26px)", fontWeight: "700", fontSize: "14px", flexWrap: "wrap" }}>
      <a href="#about" style={{ color: "#4a3a30" }}>About</a>
      <a href="#sponsors" style={{ color: "#4a3a30" }}>Sponsors</a>
      <a href="#faq" style={{ color: "#4a3a30" }}>FAQ</a>
      <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" style={{ color: "#4a3a30" }}>MLH Conduct</a>
      <a href="/sign-in" style={{ background: "#BCD5D8", color: "#4a3a30", padding: "8px 16px", borderRadius: "9px", border: "2px solid #4a3a30" }}>Sign in</a>
    </div>
  </nav>
  </>
	);
}
