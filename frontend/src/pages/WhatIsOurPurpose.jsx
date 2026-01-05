import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const WhatIsOurPurpose = () => (
  <main className="essential-main">
      <div className="content">
        <h1>What is Our Purpose?</h1>
        <p className="quote">The Ultimate Goal of Human Life - From Srila Prabhupada's Teachings</p>
        
        <div className="section">
          <h2 className="section-title">The Special Opportunity of Human Life</h2>
          <p>Srila Prabhupada explains in Srimad Bhagavatam 11.20.17 purport: "Human life is meant for self-realization. The human form of life is a rare opportunity to get out of the cycle of birth and death."</p>
          <div className="verse">
            "Out of many thousands among men, one may endeavor for perfection, and of those who have achieved perfection, hardly one knows Me in truth." - Bhagavad Gita 7.3
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">To Revive Our Love for Krishna</h2>
          <p>Srila Prabhupada writes in the Introduction to Bhagavad Gita As It Is: "The constitutional position of the living entity is to be the eternal servant of Krishna. When we forget this relationship, we suffer in material existence. The purpose of human life is to revive our dormant love for Krishna."</p>
          <div className="verse">
            "Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me. Being completely absorbed in Me, surely you will come to Me." - Bhagavad Gita 9.34
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Four Goals - But Only One is Eternal</h2>
          <p>Srila Prabhupada explains that people pursue dharma (religiosity), artha (economic development), kama (sense gratification), and moksha (liberation). But the real goal is prema - pure love of God.</p>
          <p>In Srimad Bhagavatam 1.2.8, it states:</p>
          <div className="verse">
            "The supreme occupation for all humanity is that by which men can attain to loving devotional service unto the transcendent Lord. Such devotional service must be unmotivated and uninterrupted to completely satisfy the self."
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">How to Achieve This Purpose</h2>
          <p>Srila Prabhupada gave us a simple process:</p>
          <ul>
            <li><strong>Chant Hare Krishna Maha Mantra:</strong> The easiest method for this age (Kali-yuga)</li>
            <li><strong>Read Bhagavad Gita and Srimad Bhagavatam:</strong> Understand Krishna's teachings</li>
            <li><strong>Follow the four regulative principles:</strong> No meat-eating, no intoxication, no gambling, no illicit sex</li>
            <li><strong>Associate with devotees:</strong> Spiritual advancement through saintly association</li>
            <li><strong>Render devotional service:</strong> Use your talents in Krishna's service</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">The Ultimate Goal</h2>
          <p>Srila Prabhupada writes: "The highest perfection of human life is to remember Krishna at the time of death. This is the ultimate goal."</p>
          <div className="verse">
            "And whoever, at the end of his life, quits his body remembering Me alone at once attains My nature. Of this there is no doubt." - Bhagavad Gita 8.5
          </div>
          <p>By practicing Krishna consciousness throughout life, we prepare ourselves to return to our eternal home in the spiritual world, where we can serve Krishna in pure love forever.</p>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <div className="button-container">
          <Link to="/essential-truths" className="back-button">Back to Topics</Link>
        </div>
      </div>
  </main>
);

export default WhatIsOurPurpose;
