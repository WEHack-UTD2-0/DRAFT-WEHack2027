import React from "react";
import { photos } from "./content";

// Replaces the prototype's <image-slot> drop zones. If a photo is listed for this id
// in content.ts (photos), it's shown; otherwise a striped placeholder with a label.
// `plain` shows an empty flat panel instead (used by the issue viewer).
export default function Photo({ id, label, src, plain }: { id?: string; label: string; src?: string; plain?: boolean }) {
	const url = src ?? (id ? photos[id] : undefined);
	return (
		<div className={plain ? "wm-photo plain" : "wm-photo"}>
			{url ? <img src={url} alt={label} /> : plain ? null : <span>{label}</span>}
		</div>
	);
}
