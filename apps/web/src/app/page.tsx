import WEmartSite from "@/components/wemart/WEmartSite";

// WEHack 2027 landing page — "The Trip to WEmart".
// The previous landing page sections are still in ./sections if needed.
export default function Home() {
	return <WEmartSite />;
}

export const runtime = "edge";
export const revalidate = 30;
