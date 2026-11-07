import React from "react";
import { photos } from "./content";

// Replaces the prototype's <image-slot> drop zones. If a photo is listed for this id
// in content.ts (photos), it's shown; otherwise a striped placeholder with a label.
export default function Photo({ id, label, src }: { id?: string; label: string; src?: string }) {
	const url = src ?? (id ? photos[id] : undefined);
	return (
		<div className="wm-photo">
			{url ? <img src={url} alt={label} /> : <span>{label}</span>}
		</div>
	);
}
