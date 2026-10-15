import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../api";

export default function Searchbar() {
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (search === "") {
      setProduct([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const response = await axios.get(`${API}/`, { params: { search } });
        if (response.status === 200) setProduct(response.data);
      } catch {
        setProduct([]);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="search-wrap">
      <i className="fa-solid fa-magnifying-glass sb-icon" />
      <input
        className="sb-input"
        value={search}
        type="text"
        placeholder="Search parts…"
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowMenu(true)}
        onBlur={() => setTimeout(() => setShowMenu(false), 150)}
      />
      {showMenu && product.length > 0 && (
        <div className="sb-drop">
          <ul>
            {product.map((item) => (
              <li key={item.id}>
                <Link to={`/products/${item.category}/${item.id}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
