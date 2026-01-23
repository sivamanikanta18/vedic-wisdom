import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import EventReminderBanner from "./EventReminderBanner";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <Navbar />
      <EventReminderBanner />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
