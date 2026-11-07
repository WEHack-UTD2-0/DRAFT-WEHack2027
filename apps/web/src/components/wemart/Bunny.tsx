import React from "react";

// The pink WEmart bunny holding a shopping basket (onigiri, fruit, milk), with a speech bubble.
export default function Bunny({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<>
			<div style={{ position: "absolute", left: "62%", bottom: "88%", background: "#FBF5E3", border: "1.8px solid #4a3a30", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", boxShadow: "5px 5px 7px rgba(74,58,48,.28)", display: "flex", flexDirection: "column", gap: "2px", whiteSpace: "nowrap" }}><span style={{ fontFamily: "'Yusei Magic'", fontSize: "clamp(14px,1.6vw,22px)" }}>{title}</span><span style={{ fontWeight: "900", fontSize: "15px", color: "#7ba3d6" }}>{subtitle}</span></div>
			<svg viewBox="0 0 300 222" style={{ width: "100%", display: "block", overflow: "visible" }}>
			<ellipse cx="150" cy="214" rx="120" ry="6" fill="rgba(74,58,48,.18)" />
			<g>
			<ellipse cx="46" cy="24" rx="12" ry="31" transform="rotate(-9 46 24)" fill="#E9A593" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><ellipse cx="46" cy="28" rx="5.5" ry="21" transform="rotate(-9 46 28)" fill="#F1D9C6" />
			<ellipse cx="80" cy="22" rx="12" ry="31" transform="rotate(10 80 22)" fill="#E9A593" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><ellipse cx="80" cy="26" rx="5.5" ry="21" transform="rotate(10 80 26)" fill="#F1D9C6" />
			<ellipse cx="50" cy="196" rx="19" ry="10" fill="#E9A593" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><ellipse cx="92" cy="196" rx="19" ry="10" fill="#E9A593" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
			<path d="M30 160C30 118 50 104 64 104C80 104 100 118 100 160C100 182 84 196 64 196C44 196 30 182 30 160Z" fill="#E9A593" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
			<path d="M38 150C48 164 78 164 92 150L96 168C80 182 48 182 34 168Z" fill="#fff" opacity=".85" />
			<ellipse cx="66" cy="76" rx="42" ry="35" fill="#E9A593" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
			<circle cx="74" cy="72" r="3.6" fill="#4a3a30" /><circle cx="98" cy="72" r="3.6" fill="#4a3a30" />
			<ellipse cx="68" cy="84" rx="6" ry="4" fill="#E9A5C0" opacity=".8" /><ellipse cx="104" cy="84" rx="6" ry="4" fill="#E9A5C0" opacity=".8" />
			<path d="M82 80Q86 86 90 80Z" fill="#4a3a30" stroke="#4a3a30" strokeWidth="2" strokeLinejoin="round" />
			<circle cx="52" cy="50" r="7" fill="#fff" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><circle cx="52" cy="50" r="2.4" fill="#EBD08A" />
			<path d="M88 130C108 130 124 124 140 118" fill="none" stroke="#4a3a30" strokeWidth="13" strokeLinecap="round" /><path d="M88 130C108 130 124 124 140 118" fill="none" stroke="#E9A593" strokeWidth="7" strokeLinecap="round" />
			</g>
			<g>
			<circle cx="172" cy="112" r="17" fill="#E9A593" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><path d="M164 96l8 6 8-6" fill="none" stroke="#5f9a62" strokeWidth="3" strokeLinecap="round" />
			<circle cx="204" cy="108" r="17" fill="#EBD08A" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
			<rect x="224" y="76" width="14" height="46" rx="5" fill="#BCD5D8" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><rect x="227" y="68" width="8" height="10" fill="#7ba3d6" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
			<path d="M148 116C150 90 166 84 178 90" fill="none" stroke="#5f9a62" strokeWidth="9" strokeLinecap="round" opacity="0" />
			<path d="M138 118H258L240 176H156Z" fill="rgba(255,255,255,.55)" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
			<path d="M146 134H251M152 150H246M158 164H242M170 118L174 176M190 118L192 176M210 118L210 176M230 118L226 176" fill="none" stroke="#4a3a30" strokeWidth="1.8" opacity=".7" />
			<path d="M132 114H142M138 118L128 108" fill="none" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><path d="M150 176L162 196M244 176L232 196" fill="none" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><path d="M156 180H240" fill="none" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
			</g>
			<g><circle cx="164" cy="200" r="12" fill="#fff" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><path d="M164 190V210M154 200H174" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /></g><g><circle cx="232" cy="200" r="12" fill="#fff" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><path d="M232 190V210M222 200H242" stroke="#4a3a30" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /></g>
			</svg>
		</>
	);
}
