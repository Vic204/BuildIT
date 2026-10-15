import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams, useLocation } from "react-router-dom";
import Profile from "../components/Profile";
import axios from "axios";
import { API } from "../api";
import { Reveal } from "../fx";

export default function CategoryPage() {
  const [filter, setfilter] = useState("hightolow");
  const [productset, setProductset] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category, brandname } = useParams();
  const location = useLocation();
  const { pathname } = location;
  const title = category ? category.toUpperCase() : brandname ? brandname.toUpperCase() : "NOT FOUND";

  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        if (category) {
          response = await axios.get(`${API}/products/${category}`, { params: { filter } });
        } else if (brandname) {
          response = await axios.get(`${API}/brands/${brandname}`, { params: { filter } });
        }
        if (alive && response?.status === 200) setProductset(response.data);
      } catch {
        if (alive) setProductset([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchData();
    return () => {
      alive = false;
    };
  }, [category, brandname, filter]);

  return (
    <div>
      <Header />
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">{category ? "Category" : "Brand"}</div>
              <h2>{title.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</h2>
            </div>
            <div className="filterbar">
              <span className="count-badge">
                <i className="fa-solid fa-microchip" /> {productset.length} products
              </span>
              <select value={filter} onChange={(e) => setfilter(e.target.value)} aria-label="Sort by price">
                <option value="hightolow">Price: high → low</option>
                <option value="lowtohigh">Price: low → high</option>
              </select>
            </div>
          </div>
        </Reveal>
        {loading ? (
          <div className="skel">Loading products…</div>
        ) : productset.length === 0 ? (
          <div className="empty">
            <i className="fa-solid fa-box-open" />
            <h3>Nothing here yet</h3>
            <p>This shelf is empty in the store database. Run <code>npm run seed</code> on the server, or try another category.</p>
          </div>
        ) : (
          <Profile list={productset} url={pathname} identifier="id" />
        )}
      </div>
      <Footer />
    </div>
  );
}
