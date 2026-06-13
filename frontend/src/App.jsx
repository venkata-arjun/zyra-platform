import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import Verify from "./pages/Verify";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Footer from "./components/Footer";

const NO_FOOTER_ROUTES = ["/place-order", "/orders", "/cart"];

const App = () => {
  const { pathname } = useLocation();

  const showFooter = !NO_FOOTER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />

      {/* Common Container */}
      <div className="flex flex-col flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        {/* Navbar */}
        <Navbar />

        {/* Search */}
        <SearchBar />

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />;
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default App;
