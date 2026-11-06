import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "./ProfileButton";
import { auth, currentUser } from "@clerk/nextjs";
import NavBarLinksGrouper from "./NavBarLinksGrouper";
import { cn } from "@/lib/utils/client/cn";
import { getUser } from "db/functions";
import "./Nav.css";
import DashNavItem from "../dash/shared/DashNavItem";

interface NavbarNonDashProps {
    className?: string;
    title: string;
}

export default async function NavbarNonDash({
    className,
    title,
}: NavbarNonDashProps) {
    const user = await currentUser();
    const registrationIsComplete =
        user != null && (await getUser(user.id)) != undefined;

    return (
        <>
            {/* Google Fonts: Zen Maru Gothic & IBM Plex Mono */}
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Zen+Maru+Gothic:wght@700&display=swap"
            />

            <div className="fixed z-50 w-screen pt-[0.1rem]">
                <div
                    className={cn(
                        `relative top-0 z-50 h-16 w-screen border-b border-[#C5D9EB]/15 bg-[#1A1C28]/85 backdrop-blur-md transition-all duration-300`,
                        className
                    )}
                >
                    <div className="mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-2 px-2 sm:px-5 lg:max-w-full lg:px-5">
                        <div className="col-span-3 flex items-center justify-start gap-x-5 pl-4 md:pl-0">
                            <Link href="/">
                                <Image
                                    src={"/img/static/images/white wehack logo.png"}
                                    alt={c.hackathonName + " Logo"}
                                    width={32}
                                    height={32}
                                    className="drop-shadow-[0_0px_8px_rgba(239,181,213,0.35)]"
                                />
                            </Link>

                            <div className="h-[45%] w-[2px] rotate-[25deg] bg-[#C5D9EB]/30" />
                            
                            {/* Page Title: Zen Maru Gothic in Soft Blue */}
                            <h2
                                className="mr-2 text-lg font-bold tracking-wide"
                                style={{
                                    fontFamily: "'Zen Maru Gothic', sans-serif",
                                    color: "#C5D9EB",
                                }}
                            >
                                {title}
                            </h2>

                            {/* Code of Conduct Link: IBM Plex Mono */}
                            <a
                                href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 hidden pt-0.5 text-xs font-semibold uppercase tracking-widest text-[#C5D9EB]/70 transition-colors hover:text-[#EFB5D5] sm:inline-block"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                Code of Conduct
                            </a>
                        </div>

                        <div className="flex items-center justify-between space-x-5 pr-2 md:justify-center md:pr-0">
                            <div className="hidden gap-x-4 md:flex">
                                {user ? (
                                    <Link
                                        href={
                                            registrationIsComplete
                                                ? "/dash"
                                                : "/register"
                                        }
                                    >
                                        <Button
                                            className="w-full rounded-xl px-5 py-3 font-bold tracking-wider text-[#1A1C28] shadow-md transition-all duration-200 hover:scale-[1.02] border-none"
                                            style={{
                                                fontFamily: "'Zen Maru Gothic', sans-serif",
                                                backgroundColor: "#538FDD",
                                            }}
                                        >
                                            {registrationIsComplete
                                                ? "Dashboard"
                                                : "Complete Registration"}
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        {/* Sign In: IBM Plex Mono + Outline with Soft Blue */}
                                        <Link href={"/sign-in"}>
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl border border-[#C5D9EB]/40 bg-transparent px-5 py-3 font-medium uppercase tracking-wider text-[#C5D9EB] transition-all duration-200 hover:border-[#EFB5D5] hover:bg-[#EFB5D5]/10 hover:text-[#EFB5D5]"
                                                style={{
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                }}
                                            >
                                                Sign In
                                            </Button>
                                        </Link>

                                        {/* Register: Zen Maru Gothic + Accent Blue Button */}
                                        <Link href={"/register"}>
                                            <Button
                                                className="w-full rounded-xl px-5 py-3 font-bold tracking-wider text-[#1A1C28] shadow-md transition-all duration-200 hover:scale-[1.02] border-none hover:bg-[#EFB5D5]"
                                                style={{
                                                    fontFamily: "'Zen Maru Gothic', sans-serif",
                                                    backgroundColor: "#538FDD",
                                                }}
                                            >
                                                Register
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
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