"use client";

import { useEffect } from "react";
import { Gradient } from "@/lib/utils/client/gradient.js";

export default function GradientHero() {
	useEffect(() => {
		// Create your instance
		const gradient = new Gradient();

		// Call `initGradient` with the selector to your canvas
		gradient.initGradient("#gradient-canvas");
	}, []);

	return (
		<>
			<style>
				{`
					#gradient-canvas {
						width: 100%;
						height: 100%;
						--gradient-color-1: #00072D;
						--gradient-color-2: #538FDD;
						--gradient-color-3: #EFB5D5;
						--gradient-color-4: #E4DFAA;
					}
				`}
			</style>
			<canvas
				className="absolute bottom-0 left-0 right-0 top-0 -z-10"
				id="gradient-canvas"
				data-transition-in
			/>
		</>
	);
}