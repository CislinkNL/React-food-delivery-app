import React from "react";

import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Routes from "../../routes/Routers";
import Carts from "../UI/cart/Carts.jsx";
import "../../styles/layout.css";

import { useSelector } from "react-redux";

const Layout = () => {
  const showCart = useSelector((state) => state.cartUi.cartIsVisible);

  return (
    <div className="layout-wrapper">
      <Header />
      {showCart && <Carts />}
      <main className="main-content">
        <Routes />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
