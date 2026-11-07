import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "./ProfileButton";
import { auth, currentUser } from "@clerk/nextjs";
import NavBarLinksGrouper from "./NavBarLinksGrouper";
import { Oswald } from "next/font/google";
import { cn } from "@/lib/utils/client/cn";
import { getUser } from "db/functions";
import "./Nav.css";
import { clerkEnabled } from "@/lib/clerk-enabled";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

interface NavbarProps {
	className?: string;
}

export default async function Navbar({ className }: NavbarProps) {
	const user = clerkEnabled ? await currentUser() : null;
	const registrationIsComplete =
		user != null && (await getUser(user.id)) != undefined;
	return (
		<div className="absolute z-50 w-screen pt-6">
			<div className={cn(`relative top-0 z-50 h-16 w-screen`, className)}>
				<div className="mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-2 px-2 sm:px-6 lg:max-w-full lg:px-8">
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
								className={"drop-shadow-[0_0px_8px_rgba(255,255,255,0.90)] transform-gpu"}
							/>
						</Link>
					</div>

					<div className="flex items-center justify-between space-x-2 pr-20 md:justify-center md:pr-32">
						<div className="col-span-2 hidden items-center justify-end gap-x-5 lg:flex md:pr-10">
							<NavBarLinksGrouper />
							<a
								className="text-lg font-medium md:text-sm"
								href="#about-wehack"
							>
								About
							</a>
							<a
								className="text-lg font-medium md:text-sm"
								href="#LiveStream"
							>
								Live Stream
							</a>
							<a
								className="text-lg font-medium md:text-sm"
								href="#Schedule"
							>
								Schedule
							</a>	
							<a
								className="text-lg font-medium md:text-sm"
								href="#Menu"
							>
								Menu
							</a>
							{/* <a
								className="text-lg font-medium md:text-sm"
								href="#Testimonials"
							>
								Testimonials
							</a> */}
							<a
								className="text-lg font-medium md:text-sm"
								href="#Sponsor"
							>
								Sponsors
							</a>
							<a
								className="text-lg font-medium md:text-sm"
								href="#Donations"
							>
								Donations
							</a>
							<a
								className="text-lg font-medium md:text-sm"
								href="#FAQ"
							>
								FAQ
							</a>
							{/* <a
								className="text-lg font-medium md:text-sm"
								href="#ImageGallery"
							>
								Meet the Team
							</a> */}
							<a
								className="text-lg font-medium md:text-sm"
								href="http://hackp.ac/coc"
								target="_blank"
							>
								MLH Conduct
							</a>
							<a
								className="text-lg font-medium md:text-sm"
								href="https://ultra-spell-68d.notion.site/WEHack-2026-Hacker-Guide-3150c60731128055a92cf2e6e1190852"
								target="_blank"
							>
								Hackerpack
							</a>
						</div>
						<div className="hidden gap-x-4 lg:flex">
							{user ? (
								<>
									<Link
										href={
											registrationIsComplete
												? "/dash"
												: "/register"
										}
									>
										<Button className="primary-btn w-full bg-[#A6CDC4] px-5 py-3 text-[#282738] hover:bg-[#6e8d85]">
											{registrationIsComplete
												? "Dashboard"
												: "Complete Registration"}
										</Button>
									</Link>
								</>
							) : (
								<>
									{/* <Link href={"/sign-in"}>
										<Button className="primary-btn w-full bg-[#A6CDC4] px-5 py-3 text-[#282738] hover:bg-[#6e8d85]">
											Sign In
										</Button>
									</Link> */}
									<Link href={"/register"}>
										<Button className="primary-btn w-full bg-[#A6CDC4] px-5 py-3 text-[#282738] hover:bg-[#6e8d85]">
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
	);
}

export const runtime = "edge";
