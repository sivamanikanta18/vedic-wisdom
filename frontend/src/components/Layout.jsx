import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import EventReminderBanner from "./EventReminderBanner";
import Footer from "./Footer";
import { isAuthenticated } from "../utils/api";

const Layout = () => {
  return (
    <>
      <Header />
      <Navbar />
      {isAuthenticated() && <EventReminderBanner />}
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
