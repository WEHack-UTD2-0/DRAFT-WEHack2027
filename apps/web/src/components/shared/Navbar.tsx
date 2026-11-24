import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "./ProfileButton";
import { currentUser } from "@clerk/nextjs";
import NavBarLinksGrouper from "./NavBarLinksGrouper";
import { cn } from "@/lib/utils/client/cn";
import { getUser } from "db/functions";
import "./Nav.css";

interface NavbarProps {
    className?: string;
}

const NAV_LINKS = [
    { name: "About", href: "#about-wehack" },
    { name: "Sponsors", href: "#Sponsor" },
    { name: "Donations", href: "#Donations" },
    { name: "FAQ", href: "#FAQ" },
    { name: "MLH Conduct", href: "http://hackp.ac/coc", external: true },
    {
        name: "Hackerpack",
        href: "https://ultra-spell-68d.notion.site/WEHack-2026-Hacker-Guide-3150c60731128055a92cf2e6e1190852",
        external: true,
    },
];

export default async function Navbar({ className }: NavbarProps) {
    const user = await currentUser();
    const registrationIsComplete =
        user != null && (await getUser(user.id)) != undefined;

    return (
        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
            />

            {/* Right padding reserves space for the top-right MLH 2027 badge so nothing overlaps */}
            <div className="fixed left-0 right-0 top-0 z-50 pl-3 pr-20 pt-2.5 sm:pl-6 sm:pr-24 md:pr-28 lg:pl-8 lg:pr-32">
                <div
                    className={cn(
                        `relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-2xl border-[1.5px] border-[#538FDD] bg-[#FFFDF7]/95 px-3 shadow-[3px_3px_0px_#538FDD] backdrop-blur-md sm:px-4 md:h-16 md:px-6`,
                        className,
                    )}
                >
                    {/* Logo (2x Bigger while keeping bar slim) */}
                    <div className="flex items-center justify-start">
                        <Link
                            href={"/"}
                            className="mr-2 flex items-center transition-transform duration-200 hover:scale-105"
                        >
                            <Image
                                src={"/img/static/images/WEMart%2027'%20logo.png"}
                                alt={c.hackathonName + " Logo"}
                                width={160}
                                height={160}
                                className={
                                    "h-20 w-auto sm:h-24 md:h-28 drop-shadow-[0_0px_10px_rgba(239,181,213,0.45)] transform-gpu"
                                }
                            />
                        </Link>
                    </div>

                    {/* Navigation Links, Button, and Hamburger Menu scooted left */}
                    <div className="flex items-center justify-end gap-x-2.5 pr-1 sm:gap-x-3.5 md:pr-2 lg:gap-x-5">
                        <div className="hidden items-center justify-end gap-x-4 lg:flex xl:gap-x-6">
                            <NavBarLinksGrouper />
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.name}
                                    className="text-xs xl:text-sm uppercase tracking-[0.11em] transition-colors duration-200 hover:opacity-75"
                                    style={{
                                        fontFamily: "'IBM Plex Mono', monospace",
                                        fontWeight: 600,
                                        color: "#00072D",
                                    }}
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={
                                        link.external
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Authentication / CTA Button */}
                        <div className="hidden gap-x-3 lg:flex">
                            {user ? (
                                <Link
                                    href={
                                        registrationIsComplete
                                            ? "/dash"
                                            : "/register"
                                    }
                                >
                                    <Button
                                        className="h-9 rounded-xl border-[1.5px] border-[#00072D] bg-[#C5D9EB] px-4 py-1.5 text-xs xl:text-sm uppercase tracking-[0.11em] text-[#00072D] shadow-[2px_2px_0px_#00072D] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EFB5D5] hover:shadow-[3px_3px_0px_#00072D]"
                                        style={{
                                            fontFamily:
                                                "'IBM Plex Mono', monospace",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {registrationIsComplete
                                            ? "Dashboard"
                                            : "Complete Registration"}
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={"/register"}>
                                    <Button
                                        className="h-9 rounded-xl border-[1.5px] border-[#00072D] bg-[#C5D9EB] px-4 py-1.5 text-xs xl:text-sm uppercase tracking-[0.11em] text-[#00072D] shadow-[2px_2px_0px_#00072D] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EFB5D5] hover:shadow-[3px_3px_0px_#00072D]"
                                        style={{
                                            fontFamily:
                                                "'IBM Plex Mono', monospace",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Register
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Hamburger Menu & Profile Trigger */}
                        <div className="relative scale-105 md:scale-110 origin-right [&_svg]:h-6 [&_svg]:w-6">
                            <ProfileButton />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const runtime = "edge";