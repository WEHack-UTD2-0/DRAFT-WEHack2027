"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashNavItemProps {
	name: string;
	path: string;
}

export default function DashNavItem({ name, path }: DashNavItemProps) {
	const currPath = usePathname();
	const isActive =
		(currPath.startsWith(path) && path !== "/admin" && path !== "/dash") ||
		currPath === path;

	return (
		<Link href={path}>
			<button
				className={`h-full border-b-2 px-2 text-sm font-bold transition-colors duration-150 md:whitespace-nowrap md:px-3 ${
					isActive
						? "border-[#538FDD] text-[#538FDD] dark:border-[#EFB5D5] dark:text-[#EFB5D5]"
						: "border-b-transparent text-[#00072D]/70 hover:border-b-[#EFB5D5] hover:text-[#00072D] dark:text-[#C5D9EB]/75 dark:hover:text-[#EFB5D5]"
				}`}
				style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
			>
				{name}
			</button>
		</Link>
	);
}