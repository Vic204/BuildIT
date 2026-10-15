import React from "react";
import { Link } from "react-router-dom";
import Profile from "../components/Profile";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { Reveal } from "../fx";

function Productpage() {
  const location = useLocation();
  const { pathname } = location;

  // category slugs MUST match the products.category values in the database
  const mainproductlist = [
    { id: 0, name: "PROCESSORS", imageurl: "https://pcper.com/wp-content/uploads/2018/04/c808-dsc04805-scaled.jpg", category: "processors" },
    { id: 1, name: "GRAPHICS CARDS", imageurl: "https://dlcdnwebimgs.asus.com/gain/CD41F925-4CD0-4D43-8722-0BBA1953E46D/w717/h525", category: "graphicscards" },
    { id: 2, name: "MEMORY", imageurl: "https://assets.corsair.com/image/upload/f_auto,q_auto/v1/akamai/pdp/vengeance-rgb-pro/Content/Vengeance_RGB_Pro_PDP_Black_04.png", category: "ram" },
    { id: 3, name: "MOTHERBOARDS", imageurl: "https://zakelijk.alternate.nl/p/1200x630/5/0/MSI_B650_GAMING_PLUS_WIFI_socket_AM5_moederbord@@1919705_1.jpg", category: "motherboard" },
    { id: 4, name: "STORAGE", imageurl: "https://content.crucial.com/content/dam/crucial/dram-products/ddr5-pro/images/product/crucial-ddr5-pro-udimm-kit-front.psd.transform/medium-png/image.png", category: "storage" },
    { id: 5, name: "POWER SUPPLY", imageurl: "https://e7.pngegg.com/pngimages/405/611/png-clipart-power-supply-unit-power-converters-atx-gigabyte-technology-80-plus-psu-electronic-device-computer-hardware.png", category: "psu" },
  ];
  const otherproductlist = [
    { id: 6, name: "COOLING", imageurl: "https://m.media-amazon.com/images/I/61i9iqYEEbL._SX522_.jpg", category: "cooling" },
    { id: 7, name: "CASES", imageurl: "https://www.montechpc.com/Upload/product/product_d_202310301103572.png", category: "case" },
    { id: 8, name: "HEADSETS", imageurl: "https://e7.pngegg.com/pngimages/833/918/png-clipart-kingston-hyperx-cloud-ii-headset-7-1-surround-sound-headphones-headphones-electronics-cloud.png", category: "headphone" },
    { id: 9, name: "KEYBOARDS", imageurl: "https://m.media-amazon.com/images/I/71hrbNjKqhL._AC_SL1500_.jpg", category: "keyboard" },
    { id: 10, name: "MICE", imageurl: "https://www.vhv.rs/dpng/d/460-4603856_gaming-mouse-png-transparent-png.png", category: "mouse" },
    { id: 11, name: "MONITORS", imageurl: "https://images.samsung.com/is/image/samsung/p6pim/my/ls57cg952nexxs/gallery/my-odyssey-neo-g9-g95nc-ls57cg952nexxs-537965891?$650_519_PNG$", category: "monitor" },
    { id: 12, name: "SPEAKERS", imageurl: "https://www.bhphotovideo.com/images/images1000x1000/creative_labs_51mf1680aa000_pebble_2_0_speakers_usb_1434945.jpg", category: "speaker" },
    { id: 13, name: "UPS", imageurl: "https://www.rackyrax.com/23551-thickbox_default/tripp-lite-smx1500lcdt-uninterruptible-power-supply-ups.jpg", category: "ups" },
  ];

  return (
    <>
      <Header />
      <div className="wrap">
        <Reveal>
          <Link to="/build" className="builder-banner">
            <span className="builder-banner-ico"><i className="fa-solid fa-screwdriver-wrench" /></span>
            <span>
              <b>Short on time? Build a full PC in 7 guided steps.</b>
              <small>Socket + power-supply compatibility checked live →</small>
            </span>
          </Link>
        </Reveal>
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Catalog</div>
              <h2>Core <i>components</i></h2>
              <p>The beating heart of every PC — live from the database.</p>
            </div>
            <span className="pill">6 CATEGORIES</span>
          </div>
        </Reveal>
        <Profile list={mainproductlist} url={pathname} identifier="category" />
        <div style={{ height: 44 }} />
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow">Peripherals</div>
              <h2>Gear &amp; <i>accessories</i></h2>
            </div>
            <span className="pill">8 CATEGORIES</span>
          </div>
        </Reveal>
        <Profile list={otherproductlist} url={pathname} identifier="category" />
      </div>
      <Footer />
    </>
  );
}

export default Productpage;
