import { Dela_Gothic_One, IBM_Plex_Mono, Zen_Maru_Gothic } from "next/font/google";
import localFont from "next/font/local";

// WEmart brand kit typefaces:
//  - Dela Gothic One  → titles ("THE TEAMS", receipt titles)
//  - Zen Maru Gothic  → subtitles and buttons
//  - IBM Plex Mono    → body text (receipt rows, "BASKET" tag, page counter)
//  - Gang of Three    → "Meet the staff!" (local file: ./GangOfThree.ttf)
export const delaGothicOne = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela-gothic-one",
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-zen-maru-gothic",
  display: "swap",
});

export const gangOfThree = localFont({
  src: "./GangOfThree.ttf",
  variable: "--font-gang-of-three",
  display: "swap",
});
