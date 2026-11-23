import Navbar from "@/components/shared/Navbar";
import About from "./sections/About/About";
import Sponsor from "./sections/Sponsor/Sponsor";
import MLHBadge from "@/components/landing/MLHBadge";
import Footer from "./sections/Footer/Footer";
import FAQ from "./sections/FAQ/FAQ";
import Testimonials from "@/app/sections/Testimonials/Testimonials";
// import Countdown from "./sections/Countdown/Countdown";
import Gallery from "@/components/Gallery/Gallery";
// import FilmStrip from "@/components/FilmStrip/FilmStrip";
import Stats from "@/components/Stats/Stats";
import Donations from "./sections/Donations/Donations";
// import Team from "./sections/Team/Team";
// import Schedule from "./sections/Schedule/Schedule";
// import Livestream from "./sections/Livestream/Livestream";
// import Menu from "./sections/Menu/Menu";
import WEMartScrollExperience from "./sections/Jumbotron/WEMartScrollExperience";

export default function Home() {
  return (
    // this is where all our components will go
    <div className="App">
      <Navbar />
      <MLHBadge />
      <WEMartScrollExperience>
        {/* <Livestream/> */}
        {/* <Schedule/> */}
        {/* <Menu /> */}
        {/* <Countdown/> */}
        <About />
        {/* <FilmStrip/> */}
        <Gallery />
        <Stats />
        <Testimonials />
        <Sponsor />
        <Donations />
        <FAQ />
        {/* <Team/> */}
        <Footer />
      </WEMartScrollExperience>
    </div>
  );
}

export const runtime = "edge";
export const revalidate = 30;