import React from "react";
import { Link } from "react-router-dom";
import { SolarCanvas, Magnetic, CountUp } from "../fx";

const STEPS = [
  { icon: "fa-microchip", title: "Pick the core", sub: "Processor · board · memory" },
  { icon: "fa-bolt", title: "Power it up", sub: "Power supply · cooling · case" },
  { icon: "fa-tags", title: "Watch the price", sub: "Live total as you add" },
];

export default function Buildlink() {
  return (
    <section className="hero">
      <SolarCanvas />
      <div className="hero-in">
        <div>
          <span className="kicker">
            <span className="dot" /> CUSTOM PC WORKSHOP
          </span>
          <h1>
            Can we build it? <span className="grad">Yes, we can.</span>
          </h1>
          <p className="lead">
            Pick processors, graphics cards and gaming gear — every price updates live while you
            build. Sturdy parts, honest prices, zero guesswork.
          </p>
          <div className="hero-cta">
            <Magnetic>
              <Link to="/build" className="btn btn-solid">
                Build your own PC <i className="fa-solid fa-arrow-right" />
              </Link>
            </Magnetic>
            <Link to="/products" className="btn btn-line">
              Browse parts
            </Link>
          </div>
          <div className="hero-stats">
            <div><b><CountUp to={52} suffix="+" /></b><span>parts in stock</span></div>
            <div><b><CountUp to={24} /></b><span>top brands</span></div>
            <div><b><em>₹</em><CountUp to={500} /></b><span>avg. saved per build</span></div>
          </div>
        </div>
        <div className="grow-card">
          <h3>How a build comes together</h3>
          <p>Seven steps from parts to powerhouse.</p>
          {STEPS.map((s, i) => (
            <div className="grow-row" key={s.title}>
              <span className="grow-ico"><i className={`fa-solid ${s.icon}`} /></span>
              <span><b>{i + 1}. {s.title}</b><small>{s.sub}</small></span>
              <i className="fa-solid fa-chevron-right go" />
            </div>
          ))}
          <Link to="/build" className="btn btn-solid btn-block" style={{ marginTop: 8 }}>
            Start building <i className="fa-solid fa-screwdriver-wrench" />
          </Link>
        </div>
      </div>
    </section>
  );
}
