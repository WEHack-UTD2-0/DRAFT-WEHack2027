// ✏️ All editable WEmart content lives here. Update this file each year.

/** Doors open (countdown target on the storefront sticker). */
export const EVENT_START = "2027-04-11T09:00:00-05:00";
export const NEXT_YEAR = "2027";

// ---------- Photos ----------
// Every photo box has an id. Add a path here (files go in apps/web/public/...) to show
// a real photo instead of the striped placeholder, e.g.
//   "officer-0": "/img/wemart/officers/president.jpg",
//   "team-0": "/img/wemart/teams/tech.jpg",
//   "mag-2026-cover": "/img/wemart/mags/2026-cover.jpg",   (and -p1 for the inside photo)
export const photos: Record<string, string> = {};

// ---------- 02 Ice cream / Officers ----------
export const officers: { name: string; role: string; flavor: string }[] = [
	{ name: "Name Here", role: "President", flavor: "¢100" },
	{ name: "Name Here", role: "Vice President", flavor: "¢100" },
	{ name: "Name Here", role: "Tech Lead", flavor: "¢80" },
	{ name: "Name Here", role: "Design Lead", flavor: "¢80" },
	{ name: "Name Here", role: "Marketing", flavor: "¢80" },
	{ name: "Name Here", role: "Logistics", flavor: "¢80" },
	{ name: "Name Here", role: "Sponsorship", flavor: "¢80" },
	{ name: "Name Here", role: "Outreach", flavor: "¢80" },
];

// ---------- 03 Capsule toys / Sponsors ----------
export const sponsorTiers: { label: string; color: string; w: number; dome: number; fs: number; names: string[] }[] = [
	{ label: "GOLD", color: "#EBD08A", w: 210, dome: 140, fs: 22, names: ["Verizon", "CBRE"] },
	{ label: "SILVER", color: "oklch(0.91 0.02 260)", w: 190, dome: 120, fs: 19, names: ["Capital One"] },
	{ label: "BRONZE", color: "oklch(0.87 0.06 50)", w: 165, dome: 96, fs: 15, names: ["HCSC", "CodePath", "State Farm", "North Highland", "DFW ATW", "Axxess"] },
];

// ---------- 04 Magazines / Past WEHacks ----------
// NEWEST FIRST, exactly 6: one per magazine in the stand illustration (row by row, left then
// right). Volume numbers count down automatically. `blurb` is the editor's letter in the viewer.
// TODO(content): confirm each year and title against the real WEHack archive (was there a 2021?)
// and replace every placeholder blurb with a short recap of that year.
/** How a cover's title is lettered in the issue viewer, matching that magazine on the stand. */
export type Lettering = "museum" | "timeless" | "enchanted" | "adventure" | "future" | "robotics";

// `bg` and `lettering` match each magazine's look in magazine-stand.png.
export const magazines: { year: string; title: string; bg: string; lettering: Lettering; line: string; headline: string; blurb: string }[] = [
	{ year: "2026", title: "Night at the Museum", bg: "#f6e3ee", lettering: "museum", line: "After-hours exhibits", headline: "Night at the Museum", blurb: "TODO: a short recap of WEHack 2026: the theme, the vibe, the moment everyone still talks about." },
	{ year: "2025", title: "Timeless Moments Await", bg: "#c5d9eb", lettering: "timeless", line: "Moments worth keeping", headline: "Timeless Moments Await", blurb: "TODO: a short recap of WEHack 2025." },
	{ year: "2024", title: "Enchanted to be Here", bg: "#c5d9eb", lettering: "enchanted", line: "Apps that captivate", headline: "Enchanted to be Here", blurb: "TODO: a short recap of WEHack 2024." },
	{ year: "2023", title: "Adventure is Out There", bg: "#f6f2cb", lettering: "adventure", line: "Travel, risk, bold ideas", headline: "Adventure is Out There", blurb: "TODO: a short recap of WEHack 2023." },
	{ year: "2022", title: "The Future is Now", bg: "#f6f2cb", lettering: "future", line: "Innovate, make change", headline: "The Future is Now", blurb: "TODO: a short recap of WEHack 2022." },
	{ year: "2020", title: "Robotics", bg: "#feebf6", lettering: "robotics", line: "Inaugural issue · hardware + software", headline: "Robotics", blurb: "TODO: a short recap of WEHack 2020, the inaugural issue." },
];

// The magazine stand illustration (files in apps/web/public/img/wemart/).
// A clean hover lift needs the art in layers. TODO(marketing): request
//   • magazine-stand-empty.png: the same 1000×1500 canvas with the six magazines removed
//   • six cover PNGs, each cropped to one magazine (newest first, same order as above)
// then fill in `empty` and `covers`. Until all of them are set, the page uses the flat
// illustration and lifts a cut-out of it on hover.
export const magazineStand = {
	flat: "/img/wemart/magazine-stand.png",
	empty: "",
	covers: ["", "", "", "", "", ""],
	// Clickable area over each magazine, in % of the 1000×1500 illustration [left, top, width, height].
	// Approximate. Check them by eye after any change to the art.
	spots: [
		[13.7, 14.5, 22.3, 20.3],
		[51.5, 14.7, 23.3, 20.2],
		[13.3, 36.5, 21.5, 20.3],
		[49.4, 36.9, 25.8, 20.1],
		[13.2, 59.0, 22.0, 20.2],
		[47.8, 59.0, 24.0, 20.3],
	] as [number, number, number, number][],
};

// ---------- 05 Shopping list / FAQ ----------
// [question, answer]. Add or remove freely; the checkbox count adjusts automatically.
export const faqs: [string, string][] = [
	["What is WEHack?", "A 24-hour hackathon centering women and gender-minority students. Build a project, learn something new, meet your people."],
	["Who can attend?", "Any current university student 18+ who identifies as a woman or gender minority. All majors welcome."],
	["How much does it cost?", "Nothing. Admission, food, swag and workshops are all free."],
	["I’ve never coded. Can I come?", "Yes. We run beginner workshops and have mentors on the floor all weekend."],
	["Do I need a team?", "No. Teams are up to 4 people, and we host team-forming at the start of the event."],
	["What should I bring?", "Student ID, laptop + charger, toiletries, and something comfy to sleep in."],
	["Will there be food?", "All meals and plenty of konbini-grade snacks, with dietary options."],
	["Where is it?", "Venue details coming soon. Check back or follow us on Instagram."],
];

// ---------- 07 Basket / Teams ----------
// Exactly 6 (the basket layout and scroll drop-in are built for 6 cards).
export const teams: { name: string; item1: string; item2: string; tilt: number }[] = [
	{ name: "Tech", item1: "Onigiri", item2: "Ramune", tilt: -3 },
	{ name: "Design", item1: "Melon pan", item2: "Pocky", tilt: 2 },
	{ name: "Marketing", item1: "Dango", item2: "Milk tea", tilt: -1.5 },
	{ name: "Logistics", item1: "Cup ramen", item2: "Onigiri", tilt: 2.5 },
	{ name: "Sponsorship", item1: "Mochi", item2: "Coffee", tilt: -2 },
	{ name: "Outreach", item1: "Taiyaki", item2: "Juice", tilt: 1.5 },
];
