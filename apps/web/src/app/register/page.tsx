import c from "config";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import Image from "next/image";
import React from "react";

export default function Page() {
	return (
		<div className="min-h-screen w-full bg-[#00072D] text-[#C5D9EB]">
			{/* Top Navigation Brand Logo Bar */}
			<div className="z-50 w-screen pt-6">
				<div className="relative top-0 z-50 h-16 w-screen">
					<div className="mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-2 px-2 sm:px-6 lg:max-w-full lg:px-8">
						<div className="col-span-3 flex items-center justify-start gap-x-5 pl-4 md:pl-0">
							<Link
								href="/"
								className="mr-5 flex items-center gap-x-2 transition-transform duration-200 hover:scale-105"
							>
								<Image
									src="/img/static/images/WEMart%2027'%20logo.png"
									alt={`${c.hackathonName} 2027 Logo`}
									width={84}
									height={84}
									className="object-contain drop-shadow-[0_0_12px_rgba(197,217,235,0.45)]"
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Main Center-Aligned Registration Confirmation Card */}
			<main className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
				<div className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-y-6 rounded-2xl border-2 border-[#538FDD] bg-[#060F38] p-8 shadow-[0_0_40px_rgba(83,143,221,0.2)] md:p-12">
					{/* Status Pill */}
					<span
						className="rounded-full border border-[#EFB5D5] bg-[#EFB5D5]/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#EFB5D5]"
						style={{ fontFamily: "'IBM Plex Mono', monospace" }}
					>
						Registration Complete • April 17–18, 2027
					</span>

					{/* Header Title */}
					<h1
						className="text-3xl font-black tracking-wide text-[#FFFDF7] md:text-5xl"
						style={{
							fontFamily:
								"'Dela Gothic One', 'Zen Maru Gothic', sans-serif",
							textShadow: "2px 2px 0px #538FDD",
						}}
					>
						Thank You for Registering!
					</h1>

					{/* Styled Separator Line */}
					<div className="my-1 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#538FDD] via-[#EFB5D5] to-[#E4DFAA]" />

					{/* Confirmation Copy */}
					<p
						className="text-base font-medium leading-relaxed text-[#C5D9EB] md:text-lg"
						style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
					>
						We&apos;ve received your application for{" "}
						<span className="font-bold text-[#E4DFAA]">
							WEHack 2027: A Trip to WEMart
						</span>
						! Our team is reviewing applications and we will send out
						acceptance decisions via email soon.
					</p>

					{/* Action Buttons */}
					<div className="mt-4 flex w-full flex-col justify-center gap-4 sm:flex-row">
						<Link href="/dash">
							<Button
								className="w-full rounded-xl bg-[#538FDD] px-8 py-6 text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-[#EFB5D5] hover:text-[#00072D] sm:w-auto"
								style={{
									fontFamily: "'Zen Maru Gothic', sans-serif",
								}}
							>
								Go to Hacker Dashboard
							</Button>
						</Link>

						<Link href="/">
							<Button
								variant="outline"
								className="w-full rounded-xl border-2 border-[#538FDD]/60 bg-transparent px-8 py-6 text-base font-bold text-[#C5D9EB] transition-colors hover:border-[#E4DFAA] hover:bg-[#E4DFAA]/10 hover:text-[#E4DFAA] sm:w-auto"
								style={{
									fontFamily: "'Zen Maru Gothic', sans-serif",
								}}
							>
								Return Home
							</Button>
						</Link>
					</div>

					{/* Operational Support Contact Footer */}
					<p
						className="mt-4 text-xs text-[#C5D9EB]/75 sm:text-sm"
						style={{ fontFamily: "'IBM Plex Mono', monospace" }}
					>
						Running into an issue? Reach out to us at{" "}
						<a
							href={`mailto:${c.issueEmail}`}
							className="font-bold text-[#E4DFAA] underline decoration-[#EFB5D5] underline-offset-4 hover:text-[#EFB5D5]"
						>
							{c.issueEmail}
						</a>
					</p>
				</div>
			</main>
		</div>
	);
}

export const runtime = "edge";