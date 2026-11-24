"use client";

import { useTimer } from "react-timer-hook";
import { Badge } from "@/components/shadcn/ui/badge";

interface CountdownProps {
	title: string;
	date: Date;
}

export function Countdown({ title, date }: CountdownProps) {
	const { seconds, minutes, hours, days } = useTimer({
		expiryTimestamp: date,
	});

	const timeUnits = [
		{ label: "Days", value: days },
		{ label: "Hours", value: hours },
		{ label: "Minutes", value: minutes },
		{ label: "Seconds", value: seconds },
	];

	return (
		<div className="flex min-h-[150px] flex-col justify-between rounded-xl border-2 border-[#538FDD]/60 bg-[#FFFDF7] p-5 text-[#00072D]">
			<div className="grid grid-cols-4 gap-2">
				{timeUnits.map((unit) => (
					<div
						key={unit.label}
						className="flex flex-col items-center rounded-lg border border-[#538FDD]/30 bg-[#C5D9EB]/25 px-2 py-2"
					>
						<h2
							className="text-2xl font-black text-[#00072D] sm:text-3xl"
							style={{
								fontFamily:
									"'Dela Gothic One', 'Zen Maru Gothic', sans-serif",
							}}
							suppressHydrationWarning
						>
							{unit.value}
						</h2>
						<h3
							className="mt-0.5 text-xs font-bold text-[#538FDD] sm:text-sm"
							style={{
								fontFamily: "'Zen Maru Gothic', sans-serif",
							}}
						>
							{unit.label}
						</h3>
					</div>
				))}
			</div>
			<div className="pt-4">
				<Badge
					variant="outline"
					className="border-[#538FDD] bg-[#EFB5D5]/30 px-3 py-1 text-xs font-semibold text-[#00072D]"
					style={{ fontFamily: "'IBM Plex Mono', monospace" }}
				>
					Time To {title}
				</Badge>
			</div>
		</div>
	);
}