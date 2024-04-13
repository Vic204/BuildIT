import React,{useEffect,useState} from "react";
import "../components/Header.css";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import { usecartStore } from "../Store/cartStore";

function Header(){
    const { cart } = usecartStore((state) => ({ cart: state.cart }));
    const [cartLength, setCartLength] = useState(0);

    useEffect(() => {
        // Update cart length dynamically whenever cart changes
        setCartLength(cart.length);
    }, [cart]); // Include cart in dependency array
   
    return(
        <div className="header-container">
        <div className="topnavbar">
        <div className="Logo-container"><Link to="/" className="hlinking">
                <img src="" alt="LOGO" /></Link>
            </div>
            <Searchbar />
            <div className="top-nav-right">
            <Link to="/Login-page"><i className="fa-solid fa-user"></i> Login/Register</Link>
            <Link to="/cart-page">Cart</Link>
            <p className="Cart-length">{cartLength}</p>
            </div>
        </div>
        <div className="main-nav">
            <div className="main-nav-content">
                <a href="#HOME">PRE BUILD</a>
                <Link to="/brands">BRANDS</Link>
                <Link to="/products">CATEGORIES</Link>
                <Link to="/products">BUILD</Link>
                <a href="news.html">NEW</a>
                </div>
               
            </div>
        
        </div>
    )
}
export default Header;

    