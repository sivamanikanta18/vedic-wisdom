import React from "react";
import Quote from "../components/Quote";
import CardSection from "../components/CardSection";
import "./Home.css";

function Home() {
  return (
    <main className="main-content">
        <div className="content">
          <h2>Welcome to the Path of Eternal Wisdom</h2>
          <p>
            Discover wisdom from the Bhagavad Gita, and all Srila Prabhupada's books, lectures, letters and conversations.
          </p>

          <Quote />
          <CardSection />

          <div className="about-us">
            <h2>About Us</h2>
            <p>
              Vedic Wisdom is dedicated to spreading Krishna consciousness through Srila Prabhupada's teachings. 
              We provide access to his books, lectures, letters, and conversations, helping devotees practice 
              chanting, study scriptures, and progress on the path of bhakti-yoga towards pure love of Krishna.
            </p>
          </div>
        </div>
    </main>
  );
}

export default Home;
