import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { defaultTheme } from "config";
import Script from "next/script";
import {
	Dela_Gothic_One,
	Zen_Maru_Gothic,
	IBM_Plex_Mono,
} from "next/font/google";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const dela_gothic = Dela_Gothic_One({
	subsets: ["latin"],
	variable: "--font-dela-gothic",
	weight: "400",
});

const zen_maru = Zen_Maru_Gothic({
	subsets: ["latin"],
	variable: "--font-zen-maru",
	weight: ["400", "500", "700", "900"],
});

const ibm_plex_mono = IBM_Plex_Mono({
	subsets: ["latin"],
	variable: "--font-ibm-plex-mono",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "WEHack 2027 — A Trip to WEMart",
	description: "A Trip to WEMart — WEHack 2027 (April 3–4, 2027)",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
		<ClerkProvider
			appearance={{
				variables: {
					colorPrimary: "#538FDD",
					colorBackground: "#00072D",
					colorText: "#C5D9EB",
					colorTextSecondary: "#EDD0E0",
					colorInputBackground: "#060F38",
					colorInputText: "#FFFFFF",
					borderRadius: "0.75rem",
					fontFamily: "var(--font-zen-maru), sans-serif",
				},
			}}
		>
			<html
				lang="en"
				className={`${theme} ${dela_gothic.variable} ${zen_maru.variable} ${ibm_plex_mono.variable}`}
			>
				<head>
					{/* google analytics tag */}
					<Script
						async
						src="https://www.googletagmanager.com/gtag/js?id=G-R5CQZPXHFV"
					></Script>
					<Script id="google analytics tag">
						{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-R5CQZPXHFV');
						`}
					</Script>
				</head>
				<body className="bg-[#00072D] text-[#C5D9EB] antialiased">
					{children}
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}

export const runtime = "edge";