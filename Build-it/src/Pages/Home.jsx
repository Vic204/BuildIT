import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Buildlink from "../components/buildlink.jsx";
import Footer from "../components/Footer.jsx";
import Profile from "../components/Profile.jsx";
import { Reveal, Marquee } from "../fx";

const SECTIONS = [
  {
    id: 0, name: "PROCESSORS", category: "processors",
    imageurl: "https://pcper.com/wp-content/uploads/2018/04/c808-dsc04805-scaled.jpg",
  },
  {
    id: 1, name: "GRAPHICS CARDS", category: "graphicscards",
    imageurl: "https://dlcdnwebimgs.asus.com/gain/CD41F925-4CD0-4D43-8722-0BBA1953E46D/w717/h525",
  },
  {
    id: 2, name: "MEMORY", category: "ram",
    imageurl: "https://assets.corsair.com/image/upload/f_auto,q_auto/v1/akamai/pdp/vengeance-rgb-pro/Content/Vengeance_RGB_Pro_PDP_Black_04.png",
  },
];

const ETHOS = [
  { icon: "fa-vial-circle-check", title: "Tested parts", text: "Every component is stress-tested before it lists. If it can't survive a ranked marathon, it doesn't ship." },
  { icon: "fa-bolt", title: "Live pricing", text: "Prices recalculate the moment you add a part. No checkout surprises — the number you see is the number you pay." },
  { icon: "fa-screwdriver-wrench", title: "Guided PC builder", text: "Seven clear steps take you from parts to finished PC, with socket and power-supply checks along the way." },
];

export default function Home() {
  return (
    <div>
      <Header />
      <Buildlink />
      <Marquee
        items={[
          "REAL-TIME PRICING",
          "7-STEP PC BUILDER",
          "52 PARTS IN STOCK",
          "FREE SHIPPING OVER ₹5,000",
          "3-YEAR WARRANTY",
          "EASY 7-DAY RETURNS",
        ]}
      />
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Start here</div>
              <h2>Shop by <i>category</i></h2>
              <p>Three aisles hold the heart of every build — or skip ahead and assemble the whole PC in the builder.</p>
            </div>
            <Link to="/build" className="btn btn-solid">Build your own PC</Link>
          </div>
        </Reveal>
        <Profile list={SECTIONS} url="/products" identifier="category" />
      </div>
      <div className="wrap" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="ethos">
            <div className="eyebrow" style={{ color: "#ff5040" }}>Why BuildIT</div>
            <h2>Machines <em>built to last.</em></h2>
            <div className="ethos-grid">
              {ETHOS.map((e, i) => (
                <Reveal key={e.title} delay={i * 100}>
                  <div className="ethos-cell">
                    <i className={`fa-solid ${e.icon}`} />
                    <b>{e.title}</b>
                    <p>{e.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}
