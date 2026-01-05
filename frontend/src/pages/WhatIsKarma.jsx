import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const WhatIsKarma = () => (
  <main className="essential-main">
      <div className="content">
        <h1>What is Karma?</h1>
        <div className="quote">The Law of Action and Reaction - Explained by Srila Prabhupada</div>
        
        <div className="section">
          <h2 className="section-title">Three Types of Karma</h2>
          <p>Srila Prabhupada explains in Bhagavad Gita As It Is that there are three types of activities:</p>
          <ul>
            <li><strong>Karma:</strong> Fruitive activities that bind us to material world</li>
            <li><strong>Vikarma:</strong> Sinful activities that lead to degradation</li>
            <li><strong>Akarma:</strong> Activities in Krishna consciousness that free us from karma</li>
          </ul>
          <div className="verse">
            "One who sees inaction in action, and action in inaction, is intelligent among men, and he is in the transcendental position, although engaged in all sorts of activities." - Bhagavad Gita 4.18
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">The Binding Nature of Karma</h2>
          <p>Krishna explains in Bhagavad Gita 3.9:</p>
          <div className="verse">
            "Work done as a sacrifice for Vishnu has to be performed; otherwise work causes bondage in this material world. Therefore, O son of Kunti, perform your prescribed duties for His satisfaction, and in that way you will always remain free from bondage."
          </div>
          <p>Srila Prabhupada writes in the purport: "Since one has to work even for the simple maintenance of the body, the prescribed duties for a particular social position and quality are so made that that purpose can be fulfilled. Yajña means Lord Viṣṇu, or sacrificial performances."</p>
        </div>

        <div className="section">
          <h2 className="section-title">How Karma Works Across Lifetimes</h2>
          <p>Srila Prabhupada explains that we carry our karma from life to life. Our current situation—family, body, intelligence, wealth—is the result of past karma. Our future depends on present actions.</p>
          <div className="verse">
            "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones." - Bhagavad Gita 2.22
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">How to Become Free from Karma</h2>
          <p>Srila Prabhupada teaches that devotional service (bhakti-yoga) is the only way to become free from karmic reactions:</p>
          <div className="verse">
            "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear." - Bhagavad Gita 18.66
          </div>
          <p>When we work for Krishna's satisfaction, our actions become akarma—transcendental activities that don't bind us to material existence.</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Application</h2>
          <p>Srila Prabhupada's instructions for transcending karma:</p>
          <ul>
            <li><strong>Offer all work to Krishna:</strong> "Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform—do that as an offering to Me." (BG 9.27)</li>
            <li><strong>Chant Hare Krishna:</strong> Purifies all karmic reactions</li>
            <li><strong>Follow regulative principles:</strong> Avoid creating new bad karma</li>
            <li><strong>Eat only Krishna prasadam:</strong> Food offered to Krishna is karma-free</li>
            <li><strong>Engage in devotional service:</strong> All activities become transcendental</li>
          </ul>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <div className="button-container">
          <Link to="/essential-truths" className="back-button">Back to Topics</Link>
        </div>
      </div>
  </main>
);

export default WhatIsKarma;
