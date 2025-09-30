import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Menu from "../pages/Menu";
import PizzaDetails from "../pages/PizzaDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import FirebaseTest from "../pages/FirebaseTest";
import CategoryTest from "../pages/CategoryTest";
import CategoryDebugPage from "../pages/CategoryDebugPage";
import SimpleTest from "../pages/SimpleTest";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/menu/:id" element={<PizzaDetails />} />
      <Route path="/firebase-test" element={<FirebaseTest />} />
      <Route path="/category-test" element={<CategoryTest />} />
      <Route path="/category-debug" element={<CategoryDebugPage />} />
      <Route path="/simple-test" element={<SimpleTest />} />
    </Routes>
  );
};

export default Routers;
