import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const WhatIsReincarnation = () => (
  <main className="essential-main">
      <div className="content">
        <h1>What is Reincarnation?</h1>
        <p className="quote">Transmigration of the Soul - Explained by Srila Prabhupada</p>
        
        <div className="section">
          <h2 className="section-title">The Soul Transmigrates from Body to Body</h2>
          <p>Srila Prabhupada explains in Bhagavad Gita As It Is 2.13: "Acceptance of transmigration of the soul is the beginning of spiritual realization. One who cannot understand this is in the bodily concept of life."</p>
          <div className="verse">
            "As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change." - Bhagavad Gita 2.13
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">The Soul Never Dies</h2>
          <p>Krishna explains to Arjuna:</p>
          <div className="verse">
            "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones." - Bhagavad Gita 2.22
          </div>
          <p>Srila Prabhupada writes: "Change of body by the atomic individual soul is an accepted fact. Even some of the modern scientists who do not believe in the existence of the soul, but at the same time cannot explain the source of energy from the heart, have to accept continuous changes of body which appear from childhood to boyhood and from boyhood to youth and again from youth to old age."</p>
        </div>

        <div className="section">
          <h2 className="section-title">8,400,000 Species of Life</h2>
          <p>Srila Prabhupada teaches in Srimad Bhagavatam that there are 8,400,000 species of life:</p>
          <ul>
            <li><strong>900,000 aquatic species</strong></li>
            <li><strong>2,000,000 plant species</strong></li>
            <li><strong>1,100,000 insect species</strong></li>
            <li><strong>1,000,000 bird species</strong></li>
            <li><strong>3,000,000 animal species</strong></li>
            <li><strong>400,000 human species</strong></li>
          </ul>
          <p>The soul evolves through these species based on karma and desires until reaching the human form—the only form capable of spiritual liberation.</p>
        </div>

        <div className="section">
          <h2 className="section-title">What Determines Our Next Body?</h2>
          <p>Srila Prabhupada explains that our consciousness at death determines our next birth:</p>
          <div className="verse">
            "Whatever state of being one remembers when he quits his body, O son of Kunti, that state he will attain without fail." - Bhagavad Gita 8.6
          </div>
          <p>In the purport, Srila Prabhupada writes: "The process of changing one's nature at the critical moment of death is here explained. A person who at the end of his life quits his body thinking of Kṛṣṇa attains the transcendental nature of the Supreme Lord."</p>
        </div>

        <div className="section">
          <h2 className="section-title">How to Break Free from Reincarnation</h2>
          <p>Srila Prabhupada teaches that bhakti-yoga is the only way to escape the cycle of birth and death:</p>
          <div className="verse">
            "From the highest planet in the material world down to the lowest, all are places of misery wherein repeated birth and death take place. But one who attains to My abode, O son of Kunti, never takes birth again." - Bhagavad Gita 8.16
          </div>
          <p><strong>Practical steps to achieve liberation:</strong></p>
          <ul>
            <li><strong>Chant Hare Krishna constantly:</strong> Purify consciousness for remembering Krishna at death</li>
            <li><strong>Read Srila Prabhupada's books:</strong> Understand the science of the soul</li>
            <li><strong>Follow regulative principles:</strong> Avoid degrading to lower species</li>
            <li><strong>Engage in devotional service:</strong> Develop love for Krishna</li>
            <li><strong>Associate with devotees:</strong> Spiritual association elevates consciousness</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">The Goal: Return to Godhead</h2>
          <p>Srila Prabhupada's mission was to help souls return to the spiritual world. He writes: "This material world is a place of misery. Real happiness is in the spiritual world with Krishna. That is our eternal home."</p>
          <div className="verse">
            "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode, O Arjuna." - Bhagavad Gita 4.9
          </div>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <div className="button-container">
          <Link to="/essential-truths" className="back-button">Back to Topics</Link>
        </div>
      </div>
  </main>
);

export default WhatIsReincarnation;
