import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const AbcdeBhakti = () => (
  <main className="essential-main">
    <div className="content">
      <h1>ABCDE of Bhakti</h1>
      <p className="quote">Purify your consciousness and progress on the path of devotion</p>

      <div className="section">
        <h2>Understanding Consciousness and Modes of Nature</h2>
        <p>We interact with the material world through five senses and three subtle elements: mind, intelligence, and false ego. These eight elements form the vehicle through which our consciousness perceives the world. Our perception influences thoughts, memories, attitudes, and behavior—creating a cycle of action and reaction shaped by the three modes of material nature: goodness, passion, and ignorance.</p>
      </div>

      <div className="section">
        <h2>Effect of Daily Inputs on Consciousness</h2>
        <p>Whatever we associate with—be it people, books, food, or media—we intake their corresponding mode (guna). Spicy food triggers passion, alcohol causes ignorance, and association with worldly people shapes material desires. Hence, our consciousness gets molded accordingly.</p>
      </div>

      <div className="section">
        <h2>Purification through Nirguna Input</h2>
        <p>We cannot stop perceiving or engaging, but we must purify what we consume. This is done by engaging with nirguna (transcendental) subjects connected to Krishna, who is beyond all modes.</p>
        <ul>
          <li><strong>Association:</strong> Associate with devotees discussing Krishna katha.</li>
          <li><strong>Books:</strong> Read Srila Prabhupada's books like Bhagavad Gita and Srimad Bhagavatam.</li>
          <li><strong>Food:</strong> Take only sattvik food offered to Krishna (no meat, onion, garlic).</li>
          <li><strong>Chanting:</strong> Chant 16 rounds daily to cleanse the heart of anarthas (lust, anger, greed, pride, envy, illusion).</li>
        </ul>
      </div>

      <div className="section">
        <h2>The 9 Stages of Bhakti</h2>
        <ol>
          <li>Śraddhā: Faith</li>
          <li>Sādhu-saṅga: Association with devotees</li>
          <li>Bhajana-kriyā: Performing devotional service</li>
          <li>Anartha-nivṛtti: Removal of unwanted desires</li>
          <li>Niṣṭhā: Steadiness</li>
          <li>Ruci: Taste</li>
          <li>Āsakti: Attachment</li>
          <li>Bhāva: Spiritual emotion</li>
          <li>Prema: Pure love of God</li>
        </ol>
      </div>

      <p className="thank-you">Thank you for reading</p>
      <p className="thank-you"><strong>Hare Krishna</strong></p>
      <Link to="/essential-truths" className="back-button">Back to Topics</Link>
    </div>
  </main>
);

export default AbcdeBhakti;
