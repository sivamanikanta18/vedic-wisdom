import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const ManageTime = () => (
  <main className="essential-main">
      <div className="content">
        <h1>How to Manage Time</h1>
        <p className="quote">Use Time for Krishna - Srila Prabhupada's Guidance on Time Management</p>

        <div className="section">
          <h2 className="section-title">Time is Krishna's Energy</h2>
          <p>Srila Prabhupada teaches that time (kala) is one of Krishna's energies. In Bhagavad Gita 10.30, Krishna says: "Among the Ādityas I am Viṣṇu, among lights I am the radiant sun, among the Maruts I am Marīci, and among the stars I am the moon."</p>
          <p>In his purport, Srila Prabhupada writes: "Time is also a representation of Krishna because time is the energy of Krishna by which the material manifestation takes place."</p>
          <div className="verse">
            "I am time, the great destroyer of the worlds, and I have come here to destroy all people." - Bhagavad Gita 11.32
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Human Life is Precious and Short</h2>
          <p>Srila Prabhupada constantly emphasized that human life is rare and temporary. He writes in Srimad Bhagavatam purports: "Out of 8,400,000 species, the human form is very rare. One should not waste this opportunity. Every moment should be used for Krishna consciousness."</p>
          <div className="verse">
            "Out of many thousands among men, one may endeavor for perfection, and of those who have achieved perfection, hardly one knows Me in truth." - Bhagavad Gita 7.3
          </div>
          <p>Time wasted is life wasted. Srila Prabhupada urges us to use every moment for spiritual advancement.</p>
        </div>

        <div className="section">
          <h2 className="section-title">Prioritize Spiritual Activities</h2>
          <p>Srila Prabhupada's daily schedule was exemplary. He would:</p>
          <ul>
            <li><strong>Rise early (1-2 AM):</strong> Chant, write books, and translate scriptures</li>
            <li><strong>Morning program:</strong> Attend mangala-arati and give class</li>
            <li><strong>Daytime:</strong> Meet devotees, manage ISKCON affairs, preach</li>
            <li><strong>Evening:</strong> More writing, correspondence, and rest</li>
          </ul>
          <p>He demonstrated that a Krishna conscious person can accomplish extraordinary things by organizing time properly.</p>
        </div>

        <div className="section">
          <h2 className="section-title">Balance Material Duties and Spiritual Life</h2>
          <p>Srila Prabhupada taught that we must fulfill our material responsibilities while keeping Krishna in the center:</p>
          <div className="verse">
            "Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme." - Bhagavad Gita 3.19
          </div>
          <p>In his purport, he writes: "One has to learn to perform his duty without attachment to the result. That is the secret of success in Krishna consciousness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Avoid Time-Wasting Activities</h2>
          <p>Srila Prabhupada warned against wasting time on frivolous activities. He taught:</p>
          <ul>
            <li><strong>Avoid idle gossip:</strong> "Idle talks about others' affairs is not good for spiritual advancement"</li>
            <li><strong>Minimize sense gratification:</strong> Eating, sleeping, mating, defending beyond necessity wastes precious time</li>
            <li><strong>Avoid unnecessary association:</strong> Associate with devotees, not materialistic people</li>
            <li><strong>Control the mind:</strong> Don't let the mind wander in useless thoughts</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Time Management for Devotees</h2>
          <p>Srila Prabhupada's instructions for managing time:</p>
          <ol>
            <li><strong>Early morning chanting:</strong> Complete 16 rounds before other activities begin</li>
            <li><strong>Daily scripture reading:</strong> Read Bhagavad Gita and Srimad Bhagavatam every day</li>
            <li><strong>Attend temple programs:</strong> Morning and evening programs purify consciousness</li>
            <li><strong>Engage in devotional service:</strong> Use your skills and talents for Krishna</li>
            <li><strong>Offer all work to Krishna:</strong> "Whatever you do, do it as an offering to Me" (BG 9.27)</li>
            <li><strong>Minimize material activities:</strong> Simple living, high thinking</li>
            <li><strong>Associate with devotees:</strong> Spend time with those who inspire Krishna consciousness</li>
          </ol>
        </div>

        <div className="section">
          <h2 className="section-title">Remember Death is Coming</h2>
          <p>Srila Prabhupada often reminded us that death can come at any moment. Therefore, we must prepare by practicing Krishna consciousness now:</p>
          <div className="verse">
            "And whoever, at the end of his life, quits his body remembering Me alone at once attains My nature. Of this there is no doubt." - Bhagavad Gita 8.5
          </div>
          <p>He writes: "The highest perfection of life is to remember Krishna at the time of death. To achieve this, we must practice throughout our life. Time management means using every moment to develop Krishna consciousness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Ultimate Goal</h2>
          <p>Srila Prabhupada concludes: "Don't waste time. Life is short. Use every moment for Krishna. Chant Hare Krishna, read books, serve devotees, and preach. This is perfect time management—using time for the eternal benefit of the soul."</p>
          <div className="verse">
            "Those who are on this path are resolute in purpose, and their aim is one. O beloved child of the Kurus, the intelligence of those who are irresolute is many-branched." - Bhagavad Gita 2.41
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

export default ManageTime;
