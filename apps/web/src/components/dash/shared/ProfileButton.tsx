"use client";
import React from "react";
import Link from "next/link";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { Button } from "@/components/shadcn/ui/button";

const MOBILE_NAV_LINKS = [
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

export default function ProfileButton() {
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    aria-label="Open navigation menu"
                    className="flex h-11 w-11 items-center justify-center rounded-xl p-0 text-[#C5D9EB] transition-all duration-150 hover:bg-[#C5D9EB]/20 hover:text-[#C5D9EB] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:bg-[#C5D9EB]/25 data-[state=open]:bg-[#C5D9EB]/25 border-none"
                >
                    <svg
                        className="h-6 w-6 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="z-50 w-64 rounded-xl border border-[#C5D9EB]/30 bg-[#1A1C28]/95 p-3 text-[#C5D9EB] shadow-2xl backdrop-blur-xl focus:outline-none"
            >
                {/* User Header when Logged In */}
                {isSignedIn && (
                    <div className="mb-2 border-b border-[#C5D9EB]/20 px-2 pb-2 pt-1">
                        <span
                            className="text-[11px] uppercase tracking-wider text-[#C5D9EB]/70"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            Signed in as
                        </span>
                        <p
                            className="truncate text-sm font-semibold text-[#FFE9D7]"
                            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
                        >
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                )}

                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-1 lg:hidden">
                    {MOBILE_NAV_LINKS.map((link) => (
                        <DropdownMenuItem key={link.name} asChild>
                            <a
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                className="block rounded-lg px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#C5D9EB] transition-colors hover:bg-[#C5D9EB]/15 hover:text-[#C5D9EB] focus:bg-[#C5D9EB]/15 focus:text-[#C5D9EB] focus:outline-none"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                {link.name}
                            </a>
                        </DropdownMenuItem>
                    ))}
                    <div className="my-2 border-t border-[#C5D9EB]/20" />
                </div>

                {/* Registration / Account CTA */}
                <div className="flex flex-col space-y-2 pt-1">
                    <DropdownMenuItem asChild>
                        <Link
                            href="/register"
                            className="flex w-full items-center justify-center rounded-lg bg-[#538FDD] px-3 py-2.5 text-center text-sm font-bold tracking-wider text-[#1A1C28] shadow-md transition-colors hover:bg-[#EFB5D5] focus:bg-[#EFB5D5] focus:outline-none"
                            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
                        >
                            Register Now
                        </Link>
                    </DropdownMenuItem>

                    {isSignedIn ? (
                        <DropdownMenuItem asChild>
                            <button
                                onClick={() => signOut()}
                                className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs uppercase tracking-widest text-[#C5D9EB] transition-colors hover:bg-[#C5D9EB]/15 focus:bg-[#C5D9EB]/15 focus:outline-none"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                Sign Out
                            </button>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem asChild>
                            <Link
                                href="/sign-in"
                                className="flex w-full items-center justify-center rounded-lg border border-[#C5D9EB]/30 px-3 py-2 text-xs uppercase tracking-widest text-[#C5D9EB] transition-colors hover:bg-[#C5D9EB]/15 focus:bg-[#C5D9EB]/15 focus:outline-none"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                Sign In
                            </Link>
                        </DropdownMenuItem>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}