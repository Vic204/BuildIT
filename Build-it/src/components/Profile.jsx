import React from "react";
import { Link } from "react-router-dom";
import { Reveal, Tilt } from "../fx";

/* Generic card grid. identifier = field used for the link slug.
   Optional price display when item.price exists. */
export default function Profile({ list, url, identifier }) {
  return (
    <div className="grid-cards">
      {list.map((item, i) => (
        <Reveal key={item.id ?? i} delay={(i % 3) * 90}>
          <Tilt>
            <Link to={`${url}/${item[identifier]}`} className="pcard">
              <div className="pcard-img">
                <img src={item.imageurl} alt={item.name} loading="lazy" />
              </div>
              <div className="pcard-body">
                <b>{item.name}</b>
                <div className="pcard-meta">
                  {item.price ? (
                    <span className="price">₹{parseInt(item.price).toLocaleString("en-IN")}</span>
                  ) : (
                    <span className="pill soft">EXPLORE</span>
                  )}
                  <span className="arrow">
                    View <i className="fa-solid fa-arrow-right" />
                  </span>
                </div>
              </div>
            </Link>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}
