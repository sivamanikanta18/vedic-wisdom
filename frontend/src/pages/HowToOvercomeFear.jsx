import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const HowToOvercomeFear = () => (
  <main className="essential-main">
      <div className="content">
        <h1>How to Overcome Fear</h1>
        <p className="quote">Become Fearless Through Krishna Consciousness - Srila Prabhupada's Teachings</p>

        <div className="section">
          <h2 className="section-title">The Root Cause of Fear</h2>
          <p>Srila Prabhupada explains that fear comes from bodily identification and forgetting our relationship with Krishna. When we think "I am this body," we fear death, disease, old age, and loss.</p>
          <div className="verse">
            "One who is not connected with the Supreme can have neither transcendental intelligence nor a steady mind, without which there is no possibility of peace. And how can there be any happiness without peace?" - Bhagavad Gita 2.66
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Krishna is Our Supreme Protector</h2>
          <p>Srila Prabhupada teaches the "Peace Formula" from Bhagavad Gita 5.29:</p>
          <div className="verse">
            "A person in full consciousness of Me, knowing Me to be the ultimate beneficiary of all sacrifices and austerities, the Supreme Lord of all planets and demigods, and the benefactor and well-wisher of all living entities, attains peace from the pangs of material miseries."
          </div>
          <p>In his purport, Srila Prabhupada writes: "The conditioned souls within the clutches of illusory energy are all anxious to attain peace in the material world. But they do not know the formula for peace, which is explained in this part of the Bhagavad-gītā."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Soul Cannot Be Destroyed</h2>
          <p>Understanding our eternal nature removes fear of death. Krishna tells Arjuna:</p>
          <div className="verse">
            "The soul can never be cut to pieces by any weapon, nor burned by fire, nor moistened by water, nor withered by the wind." - Bhagavad Gita 2.23
          </div>
          <p>Srila Prabhupada explains: "All kinds of weapons—swords, flame weapons, rain weapons, tornado weapons, etc.—are unable to kill the spirit soul. It appears that there were many kinds of weapons made of earth, water, air, ether, etc., in addition to the modern weapons of fire. Even the nuclear weapons of the modern age are classified as fire weapons."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Krishna Protects His Devotees</h2>
          <p>Srila Prabhupada assures us that Krishna personally protects those who surrender to Him:</p>
          <div className="verse">
            "To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me." - Bhagavad Gita 10.10
          </div>
          <p>He writes: "A pure devotee constantly engaged in the loving service of the Lord should not fear anything in material existence."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Steps to Overcome Fear</h2>
          <p>Srila Prabhupada's instructions for becoming fearless:</p>
          <ul>
            <li><strong>Chant Hare Krishna Maha Mantra:</strong> This purifies the mind and connects us with Krishna's protection</li>
            <li><strong>Read Bhagavad Gita As It Is:</strong> Understand that you are eternal soul, not temporary body</li>
            <li><strong>Surrender to Krishna:</strong> "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear." (BG 18.66)</li>
            <li><strong>Associate with devotees:</strong> Spiritual association strengthens faith and removes anxiety</li>
            <li><strong>Engage in devotional service:</strong> When absorbed in Krishna's service, fear disappears</li>
            <li><strong>Remember Krishna constantly:</strong> "Always think of Me, become My devotee, worship Me and offer your homage unto Me." (BG 18.65)</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">The Ultimate Fearlessness</h2>
          <p>Srila Prabhupada writes: "A devotee of the Lord is always fearless because he knows that Krishna is always protecting him. This is real fearlessness—not false bravado, but genuine spiritual strength coming from connection with the Supreme."</p>
          <div className="verse">
            "For one who explains this supreme secret to the devotees, pure devotional service is guaranteed, and at the end he will come back to Me." - Bhagavad Gita 18.68
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

export default HowToOvercomeFear;
