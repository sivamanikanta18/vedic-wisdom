import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const HumanOrigin = () => (
  <main className="essential-main">
    <div className="content">
      <h1>The Truth About Human Origin</h1>
      <p className="quote">Revealing the Eternal Journey of the Soul through Vedic Insights</p>

      <div className="section">
        </div>
        <div className="section">
          <h2>1. The First Created Being</h2>
          <p>The first living being in this universe is <strong>Lord Brahma</strong>, born from the lotus emerging from the navel of Lord Vishnu. He is empowered to create various species, including humans, based on the directions of the Supreme Lord.</p>
        </div>
        <div className="section">
          <h2>2. Who Was the First Human?</h2>
          <p>The first human being was <strong>Svayambhuva Manu</strong>, created by Lord Brahma. He and his wife Shatarupa are the progenitors of all mankind. Thus, we are called “manushya”—descendants of Manu.</p>
        </div>
        <div className="section">
          <h2>3. Why Did We Come to This World?</h2>
          <p>We are originally from the spiritual world, eternal servants of Krishna. But when we desire to enjoy independently of Him, we fall into the material world. This is Krishna’s mercy—giving us a place to reform our consciousness and return to Him.</p>
          <div className="verse">
            "We are not human beings having a spiritual experience; we are spiritual beings having a human experience." — Srila Prabhupada
          </div>
        </div>
        <div className="section">
          <h2>4. Is There a First Fallen Soul?</h2>
          <p>It is said that as long as we misuse our free will, we can fall. The exact first soul is not traceable—it’s a cyclic phenomenon. What matters is that each of us has this opportunity to choose Krishna now.</p>
        </div>
        <div className="section">
          <h2>5. Humans Are Meant for Spiritual Inquiry</h2>
          <p>Out of 84 lakh species, the human form is rare and special. Only in human life can we inquire: “Who am I?”, “What is my purpose?”, and strive to return to Godhead.</p>
        </div>
        <div className="section">
          <h2>6. Real Origin Is Spiritual</h2>
          <p>Our true identity is not the body but the soul. We are eternal, full of knowledge and bliss—part and parcel of Krishna. Human life is a chance to realize this and revive our lost relationship with Him through <strong>bhakti-yoga</strong>.</p>
        </div>
        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <Link to="/essential-truths" className="back-button">Back to Topics</Link>
      </div>
  </main>
);

export default HumanOrigin;
