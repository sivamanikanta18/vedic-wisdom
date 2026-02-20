import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./MinimalLayout.css";

const MinimalLayout = () => {
  return (
    <div className="minimal-layout">
      <div className="minimal-layout-header">
        <Header />
      </div>
      <div className="minimal-layout-content">
        <Outlet />
      </div>
      <div className="minimal-layout-footer">
        <Footer />
      </div>
    </div>
  );
};

export default MinimalLayout;
