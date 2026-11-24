import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import c from "config";
import GradientHero from "./GradientHero";
import QRCode from "react-qr-code";

export function Questions() {
	return (
		<div className="flex h-full min-h-[150px] w-full flex-col justify-between rounded-xl border-2 border-[#538FDD]/60 bg-[#FFFDF7] p-5 text-[#00072D]">
			<div className="pb-5">
				<h1
					className="text-lg font-bold text-[#00072D]"
					style={{ fontFamily: "'Dela Gothic One', 'Zen Maru Gothic', sans-serif" }}
				>
					Have a question?
				</h1>
				<p
					className="mt-1 text-base text-[#00072D]/80"
					style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
				>
					We&apos;re here to help! Feel free to reach out to us via email
					or on Discord.
				</p>
			</div>
			<div className="flex items-end gap-2">
				<Link href={c.links.discord}>
					<Button
						className="bg-[#538FDD] font-bold text-white transition-colors hover:bg-[#EFB5D5] hover:text-[#00072D]"
						style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
					>
						Discord
					</Button>
				</Link>
				<Link href={`mailto:${c.issueEmail}`}>
					<Button
						className="bg-[#00072D] font-bold text-[#E4DFAA] transition-colors hover:bg-[#EFB5D5] hover:text-[#00072D]"
						style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
					>
						Email
					</Button>
				</Link>
			</div>
		</div>
	);
}

export function TitleBubble() {
	return (
		<div className="relative col-span-1 !col-start-1 !row-start-1 aspect-video h-full w-full overflow-hidden rounded-xl border-2 border-[#538FDD] p-5 sm:col-span-2 sm:row-span-2 lg:!col-start-auto lg:!row-start-auto lg:aspect-auto">
			<GradientHero />
			<div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-xl text-center">
				<h1
					className="text-5xl font-black tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,7,45,0.65)] sm:text-7xl"
					style={{ fontFamily: "'Dela Gothic One', 'Zen Maru Gothic', sans-serif" }}
				>
					{c.hackathonName}
				</h1>
				<h2
					className="rounded-full bg-[#00072D]/55 px-4 py-1 text-xs font-semibold text-[#E4DFAA] backdrop-blur-sm sm:text-sm"
					style={{ fontFamily: "'IBM Plex Mono', monospace" }}
				>
					9:00AM, Apr 17-18, 2027 @ {c.prettyLocation}
				</h2>
			</div>
		</div>
	);
}

export function QuickQR({ qrPayload }: { qrPayload: string }) {
	return (
		<Link
			href={"/dash/pass"}
			className="row-span-2 flex flex-col items-center justify-center gap-y-3 rounded-xl border-2 border-[#538FDD]/60 bg-[#FFFDF7] p-4 text-[#00072D] transition-all hover:border-[#EFB5D5] hover:shadow-md"
		>
			<p
				className="text-2xl font-bold text-[#00072D] sm:text-3xl"
				style={{ fontFamily: "'Dela Gothic One', 'Zen Maru Gothic', sans-serif" }}
			>
				Quick QR
			</p>
			<div className="flex aspect-square h-[50%] items-center justify-center overflow-x-hidden rounded-xl border-2 border-dashed border-[#538FDD] bg-[#C5D9EB]/25 p-2">
				<QRCode
					className="h-full"
					value={qrPayload}
					size={220}
					level="M"
					bgColor="#ffffff"
					fgColor="#00072D"
					style={{ padding: 12, borderRadius: 8, background: "#ffffff" }}
				/>
			</div>
			<p
				className="text-center text-sm font-bold text-[#538FDD] sm:text-base"
				style={{ fontFamily: "'IBM Plex Mono', monospace" }}
			>
				Click / Tap To Open Event Pass
			</p>
		</Link>
	);
}