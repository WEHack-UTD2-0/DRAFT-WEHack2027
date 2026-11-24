import React from "react";
import "./Footer.css";

function Footer() {
	return (
		<div className="footer-container flex h-auto w-full flex-col gap-y-10 px-10 py-10 pb-20 md:flex-row md:items-start md:justify-start md:gap-x-3 md:px-20 lg:flex-row lg:items-start lg:justify-start lg:gap-x-5 lg:px-20 overflow-x-hidden">
			{/* Main Container */}
			<div className="main-container flex w-full flex-col flex-wrap gap-y-5 md:content-start md:items-start lg:content-start lg:items-start lg:w-1/4">
				<img
					className="wehack-logo h-auto drop-shadow-[0_0px_25px_rgba(255,255,255,1.0)] max-w-40 sm:max-w-64 md:max-w-48 lg:max-w-32 transform-gpu"
					src={"/img/static/images/white wehack logo.png"}
					alt="wehack logo"
				></img>
				<div className="gap-x-0">
					<p className="about-text text-lg font-medium text-[#F0D4E2]">
						Made with 💪🤍 by WEHack 2026
					</p>
					<p className="about-text text-lg font-medium text-[#F0D4E2]">
						<a
							href="https://github.com/acmutsa/HackKit"
							target="_blank"
						>
							<u>Powered by HackKit</u>
						</a>
					</p>
				</div>
			</div>

			{/* Navigation and Contact Sections */}
			<div className="lg:items-end flex flex-col gap-y-10 md:flex-row md:items-end md:gap-x-10 lg:w-3/4 lg:flex-row lg:gap-x-10">
				<div className="flex flex-row gap-x-20 md:gap-x-10 lg:w-2/3">
					{/* Navigation */}
					<div className="navigation-container flex flex-col flex-wrap gap-y-1 lg:w-1/2">
						<h1 className="about-title text-left text-xl font-medium text-[#F0D4E2]">
							Navigation
						</h1>
						<a className="nav-link" href="#home">
							Home
						</a>
						<a className="nav-link" href="#about-wehack">
							About
						</a>
						<a
								className="nav-link"
								href="#Testimonials"
							>
								Testimonials
							</a>
							<a
								className="nav-link"
								href="#Sponsor"
							>
								Sponsors
							</a>
							<a
								className="nav-link"
								href="#FAQ"
							>
								FAQ
							</a>
							{/* <a
								className="nav-link"
								href="#Team"
							>
								Meet the Team
							</a> */}
						<a
							className="nav-link"
							href="http://hackp.ac/coc"
							target="_blank"
						>
							MLH Conduct
						</a>
					</div>

					{/* Contact Us */}
					<div className="contact-container flex flex-col flex-wrap gap-y-1 md:content-start lg:w-1/2">
						<h1 className="about-title text-left text-xl font-medium text-[#F0D4E2]">
							Contact Us
						</h1>
						<a
							className="nav-link"
							href="mailto:wehackutd@gmail.com"
							target="_blank"
						>
							Email
						</a>
						<a
							className="nav-link"
							href="https://www.instagram.com/wehackutd/"
							target="_blank"
						>
							Instagram
						</a>
						<a
							className="nav-link"
							href="https://www.linkedin.com/company/wehackutd-2020/"
							target="_blank"
						>
							LinkedIn
						</a>
						<a
							className="nav-link"
							href="https://www.facebook.com/WEHackUTD/"
							target="_blank"
						>
							Facebook
						</a>
						<a
							className="nav-link"
							href="https://x.com/wehackutd"
							target="_blank"
						>
							X
						</a>
					</div>
				</div>

				{/* Other Hackathons */}
				<div className="contact-container flex flex-col flex-wrap gap-y-1 lg:w-1/3">
					<h1 className="about-title text-left text-xl font-medium text-[#F0D4E2]">
						Other Hackathons
					</h1>
					<a
						className="nav-link"
						href="https://hackutd.co/"
						target="_blank"
					>
						HackUTD
					</a>
					<a
						className="nav-link"
						href="https://hacktx.com/"
						target="_blank"
					>
						HackTX
					</a>
					<a
						className="nav-link"
						href="https://hackuta.org/"
						target="_blank"
					>
						HackUTA
					</a>
					<a
						className="nav-link"
						href="https://rowdyhacks.org/"
						target="_blank"
					>
						RowdyHacks
					</a>
					<a
						className="nav-link"
						href="https://cqhacks.org/"
						target="_blank"
					>
						CodeQuantum
					</a>
				</div>

				{/* New Column with Image */}
				<div className="image-container flex flex-col items-center lg:w-1/3 sm:max-w-20px">
					<img
						className="w-full h-auto object-contain max-w-[150px]"
						src="img/static/images/Poses 8.png"
						alt="Poses 8"
					/>
				</div>
			</div>
		</div>
	);
}

export default Footer;
