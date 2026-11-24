import c from "config";
import { Badge } from "@/components/shadcn/ui/badge";
import { BadgeCheck } from "lucide-react";

interface RoleBadgeProps {
	role: keyof typeof c.roleBadges;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
	return (
		<Badge
			style={{
				backgroundColor: c.roleBadges[role].color,
				borderColor: "#00072D33",
				fontFamily: "'IBM Plex Mono', monospace",
				width: role === "super_admin" ? "4.9rem" : "auto",
				padding:
					role === "super_admin" ? "0rem 0.5rem 0rem 0.5rem" : "auto",
			}}
			className={`${c.roleBadges[role].checked ? "px-1.5" : ""} gap-x-1 border font-bold tracking-wide`}
		>
			<span style={{ color: c.roleBadges[role].foreground }}>
				{c.roleBadges[role].title}
			</span>
			{c.roleBadges[role].checked ? (
				<BadgeCheck
					className="text-lg"
					style={{
						color:
							typeof c.roleBadges[role].checked == "boolean"
								? `color-mix(in hsl longer hue, ${c.roleBadges[role].color} 95%, ${c.roleBadges[role].foreground})`
								: (c.roleBadges[role].checked as string),
					}}
				/>
			) : null}
		</Badge>
	);
}