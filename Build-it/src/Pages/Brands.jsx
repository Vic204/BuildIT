import React from "react";
import Profile from "../components/Profile";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { Reveal, Marquee } from "../fx";

function Brands() {
  const location = useLocation();
  const { pathname } = location;

  const brandlist = [
    { id: 0, name: "AMD", brand: "amd", imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1920px-AMD_Logo.svg.png" },
    { id: 1, name: "INTEL", brand: "intel", imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/2560px-Intel_logo_%282006-2020%29.svg.png" },
    { id: 2, name: "NVIDIA", brand: "nvidia", imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/NVIDIA_logo.svg/1920px-NVIDIA_logo.svg.png" },
    { id: 3, name: "MSI", brand: "msi", imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Micro-Star_International_logo.svg/1920px-Micro-Star_International_logo.svg.png" },
    { id: 4, name: "GIGABYTE", brand: "gigabyte", imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Gigabyte_Technology_logo_20080107.svg/1920px-Gigabyte_Technology_logo_20080107.svg.png" },
    { id: 5, name: "RAZER", brand: "razer", imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Razer_wordmark.svg/1920px-Razer_wordmark.svg.png" },
  ];

  return (
    <>
      <Header />
      <Marquee items={["AMD", "INTEL", "NVIDIA", "MSI", "GIGABYTE", "CORSAIR", "G.SKILL", "ASUS"]} />
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Brands</div>
              <h2>Shop by <i>brand</i></h2>
              <p>Pick a brand to see its full lineup, sorted your way.</p>
            </div>
            <span className="pill">6 BRANDS</span>
          </div>
        </Reveal>
        <Profile list={brandlist} url={pathname} identifier="brand" />
      </div>
      <Footer />
    </>
  );
}

export default Brands;
