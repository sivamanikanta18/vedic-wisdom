import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const About = () => (
  <main className="essential-main">
      <div className="content" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1>About Us</h1>
        <p style={{ color: '#388e3c', fontSize: '1.15em', marginBottom: 24 }}>Learn more about our mission and vision</p>
        <h2>Our Mission</h2>
        <div className="about-us-text" style={{ fontSize: '1.2em', color: '#555', marginTop: 20, lineHeight: 1.6 }}>
          <p>At Vedic Wisdom, we are dedicated to spreading the knowledge and wisdom contained in the ancient scriptures of Sanatana Dharma. Our goal is to provide practical solutions to the problems of the modern world by incorporating timeless spiritual teachings. We believe that through wisdom and spiritual practice, individuals can find true peace and fulfillment in their lives.</p>

          <p>Our platform serves as a bridge between ancient spiritual wisdom and contemporary society. We aim to inspire individuals to live with purpose, overcoming life's challenges with grace and wisdom. Our teachings come from the Bhagavad Gita, Vedas, Upanishads, and other sacred texts that have been passed down through generations.</p>

          <h3 style={{ color: '#2e7d32', marginTop: 32 }}>Our Vision</h3>
          <p>Our vision is to create a world where spiritual knowledge is accessible to everyone, enabling them to live harmoniously and lead purposeful lives. We aspire to make the teachings of ancient scriptures available to all, guiding them toward spiritual enlightenment and practical solutions for everyday life.</p>

          <p>To connect with the divine and experience peace, we invite you to visit our <Link to="/chanting" style={{ color: '#2196f3', textDecoration: 'underline' }}>Chant Hare Krishna Maha Mantra</Link> page.</p>
        </div>
      </div>
  </main>
);

export default About;
