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
            className="text-xs uppercase tracking-[0.18em] transition-colors duration-200"
            style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: "#C5D9EB",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#EFB5D5")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#C5D9EB")}
        >
            {children}
        </Link>
    );
}