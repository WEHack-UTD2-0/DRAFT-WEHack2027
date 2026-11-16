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

            <div className="absolute z-50 w-screen pt-6">
                <div className={cn(`relative top-0 z-50 h-16 w-screen`, className)}>
                    <div className="mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-2 px-2 sm:px-6 lg:max-w-full lg:px-8">
                        
                        {/* Logo */}
                        <div className="col-span-3 flex items-center justify-start gap-x-5 pl-4 md:pl-0">
                            <Link
                                href={"/"}
                                className="mr-5 flex items-center gap-x-2"
                            >
                                <Image
                                    src={"/img/static/images/white wehack logo.png"}
                                    alt={c.hackathonName + " Logo"}
                                    width={65}
                                    height={65}
                                    className={"drop-shadow-[0_0px_10px_rgba(239,181,213,0.35)] transform-gpu"}
                                />
                            </Link>
                        </div>

                        {/* Navigation Links and Actions */}
                        <div className="flex items-center justify-between space-x-2 pr-4 md:justify-center md:pr-10 lg:pr-16">
                            <div className="col-span-2 hidden items-center justify-end gap-x-5 lg:flex md:pr-6">
                                <NavBarLinksGrouper />
                                {NAV_LINKS.map((link) => (
                                    <a
                                        key={link.name}
                                        className="text-xs uppercase tracking-[0.12em] transition-colors duration-200 hover:opacity-75"
                                        style={{
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            fontWeight: 500,
                                            color: "#538FDD",
                                        }}
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>

                            {/* Authentication / CTA Button */}
                            <div className="hidden gap-x-4 lg:flex">
                                {user ? (
                                    <Link
                                        href={
                                            registrationIsComplete
                                                ? "/dash"
                                                : "/register"
                                        }
                                    >
                                        <Button 
                                            className="w-full rounded-xl px-6 py-3 text-xs uppercase tracking-[0.12em] shadow-lg transition-all duration-200 hover:scale-[1.03] border-none hover:opacity-90"
                                            style={{
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                fontWeight: 600,
                                                backgroundColor: "#538FDD",
                                                color: "#C5D9EB",
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
                                            className="w-full rounded-xl px-6 py-3 text-xs uppercase tracking-[0.12em] shadow-lg transition-all duration-200 hover:scale-[1.03] border-none hover:opacity-90"
                                            style={{
                                                fontFamily: "'IBM Plex Mono', monospace",
                                                fontWeight: 600,
                                                backgroundColor: "#538FDD",
                                                color: "#FFFFFF",
                                            }}
                                        >
                                            Register
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {/* Hamburger Menu & Profile Trigger */}
                            <div className="relative">
                                <ProfileButton />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export const runtime = "edge";