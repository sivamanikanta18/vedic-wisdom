import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const ControlLust = () => (
  <main className="essential-main">
      <div className="content">
        <h1>How to Control Lust?</h1>
        <p className="quote">Understand the Cause, Consequences, and Spiritual Remedy</p>

        <div className="section">
          <p>Lust is the greatest enemy of spiritual advancement. It binds the soul to the body and keeps one entangled in illusion. In Vedic wisdom, controlling lust is essential for achieving peace, purity, and Krishna consciousness.</p>
        </div>

        <div className="section">
          <h2>What is the Root of Lust?</h2>
          <p>Lust originates from contemplation of sense objects, as stated in the Bhagavad Gita. It begins in the mind and quickly dominates the senses. It is not real love—it is a perverted reflection of the soul’s pure desire to love Krishna.</p>
        </div>

        <div className="section">
          <h2>The Dangers of Lust</h2>
          <p>Lust leads to degradation. When unfulfilled, it turns into anger and frustration. When fulfilled, it creates deeper attachment, binding us further to the cycle of birth and death.</p>
          <div className="verse">"kāma eṣa krodha eṣa rajoguṇa-samudbhavaḥ<br />mahāśano mahā-pāpmā viddhy enam iha vairiṇam" – B.G 3.37</div>
          <p>Translation: "It is lust only, Arjuna, which is born of contact with the material mode of passion and later transformed into wrath. It is the all-devouring sinful enemy of this world."</p>
        </div>

        <div className="section">
          <h2>How to Conquer Lust?</h2>
          <p>Lust cannot be defeated by suppression. It can only be conquered by higher taste—spiritual joy. Here are practical ways to overcome lust:</p>
          <ul>
            <li>Engage the senses in devotional service.</li>
            <li>Avoid association with sensual content and bad company.</li>
            <li>Keep the mind busy with Krishna's names, forms, and pastimes.</li>
            <li>Chant the Hare Krishna Maha Mantra sincerely every day.</li>
          </ul>
        </div>

        <div className="section">
          <h2>Spiritual Vision</h2>
          <p>Train the mind to see the body as a temporary bag of bones and flesh. The soul within is what we must connect with. All beauty in this world is a reflection of Krishna’s beauty and should remind us of Him.</p>
        </div>

        <div className="section">
          <h2>The Role of Krishna Consciousness</h2>
          <p>By surrendering to Krishna, we become free from the binding forces of lust. Krishna helps His devotee cross over lust as He is the Supreme Controller.</p>
          <div className="verse">Hare Krishna Hare Krishna Krishna Krishna Hare Hare<br />Hare Rama Hare Rama Rama Rama Hare Hare</div>
          <p>This mantra cleanses the heart and awakens pure spiritual love.</p>
        </div>

        <div className="section">
          <h2>Be Inspired by Great Souls</h2>
          <p>Take inspiration from devotees like Hanuman, Bhishma, and Prahlada who conquered lust through devotion. Their strength came from unwavering faith in the Lord.</p>
        </div>

        <div className="section">
          <h2>The Goal: Pure Love</h2>
          <p>Krishna is the reservoir of all pleasure. When we love Krishna, our desire for lustful enjoyment disappears. We discover the eternal joy of serving and loving Him purely.</p>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <Link to="/essential-truths" className="back-button">Back to Topics</Link>
      </div>
  </main>
);

export default ControlLust;
