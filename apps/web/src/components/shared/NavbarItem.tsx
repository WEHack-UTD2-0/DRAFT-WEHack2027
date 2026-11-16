"use client";
import React from "react";
import Link from "next/link";

interface NavbarItemProps {
    link: string;
    children: React.ReactNode;
}

export default function NavbarItem({ link, children }: NavbarItemProps) {
    const isExternal = link.startsWith("http");

    return (
        <Link
            href={link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-xs uppercase tracking-[0.12em] transition-colors duration-200 hover:opacity-75"
            style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                color: "#538FDD",
            }}
        >
            {children}
        </Link>
    );
}