// ✏️ All editable WEmart content lives here. Update this file each year.

/** Doors open (countdown target on the storefront sticker). */
export const EVENT_START = "2027-04-11T09:00:00-05:00";
export const NEXT_YEAR = "2027";

// ---------- Photos ----------
// Every photo box has an id. Add a path here (files go in apps/web/public/...) to show
// a real photo instead of the striped placeholder, e.g.
//   "officer-0": "/img/wemart/officers/president.jpg",
//   "team-0": "/img/wemart/teams/tech.jpg",
//   "mag-2026-cover": "/img/wemart/mags/2026-cover.jpg",   (also -p1, -p2, -p3)
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
// NEWEST FIRST. Keep an even count (the rack is 2 columns). Volume numbers count down automatically.
export const magazines: { year: string; title: string; bg: string; line: string; headline: string }[] = [
	{ year: "2026", title: "Night at the Museum", bg: "#BCD5D8", line: "After-hours exhibits", headline: "Night at the Museum" },
	{ year: "2025", title: "Timeless Moments Await", bg: "#EBD08A", line: "Moments worth keeping", headline: "Timeless Moments Await" },
	{ year: "2024", title: "Enchanted to be Here", bg: "#E9A593", line: "Apps that captivate", headline: "Enchanted to be Here" },
	{ year: "2023", title: "Adventure is Out There", bg: "#BCD5D8", line: "Travel, risk, bold ideas", headline: "Adventure is Out There" },
	{ year: "2022", title: "The Future is Now", bg: "#F1D9C6", line: "Innovate, make change", headline: "The Future is Now" },
	{ year: "2020", title: "Robotics", bg: "#EBD08A", line: "Inaugural issue · hardware + software", headline: "Robotics" },
];

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
