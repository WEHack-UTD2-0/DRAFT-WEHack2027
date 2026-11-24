import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { defaultTheme } from "config";
import { neobrutalism } from "@clerk/themes";
import Script from "next/script";
import { Shojumaru, Dela_Gothic_One, Zen_Maru_Gothic, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const shojumaru = Shojumaru({ subsets: ["latin"], variable: "--font-shojumaru", weight: "400" });
const dela_gothic_one = Dela_Gothic_One({ subsets: ["latin"], variable: "--font-dela-gothic-one", weight: "400" });
const zen_maru_gothic = Zen_Maru_Gothic({ subsets: ["latin"], variable: "--font-zen-maru-gothic", weight: ["400", "700"] });
const ibm_plex_mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-ibm-plex-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
	title: "WEHack",
	description: "WEHack 25-26 Website",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
		<ClerkProvider>
			<html lang="en">
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
				<body
					className={`${shojumaru.variable} ${dela_gothic_one.variable} ${zen_maru_gothic.variable} ${ibm_plex_mono.variable}`}
				>
					{children}
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}

// export const runtime = "edge";
