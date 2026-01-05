import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const EightyFourLakhSpecies = () => (
  <main className="essential-main">
      <div className="content">
        <h1>84 Lakh Types of Species</h1>
        <p className="quote">The Journey of the Soul - Srila Prabhupada's Explanation</p>

        <div className="section">
          <h2 className="section-title">8,400,000 Species of Life</h2>
          <p>Srila Prabhupada explains in Srimad Bhagavatam that there are 8,400,000 species of life in which the soul transmigrates. He writes: "The living entity wanders throughout the universe in different species of life according to his karma."</p>
          <div className="verse">
            "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones." - Bhagavad Gita 2.22
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">The Breakdown According to Padma Purana</h2>
          <p>Srila Prabhupada cites the Padma Purana classification:</p>
          <ul>
            <li><strong>Aquatics (Jalaja):</strong> 900,000 species</li>
            <li><strong>Plants & Trees (Sthavara):</strong> 2,000,000 species</li>
            <li><strong>Insects & Reptiles (Krimayo):</strong> 1,100,000 species</li>
            <li><strong>Birds (Pakshinah):</strong> 1,000,000 species</li>
            <li><strong>Animals (Pashavah):</strong> 3,000,000 species</li>
            <li><strong>Humans (Manavah):</strong> 400,000 species</li>
          </ul>
          <p>He writes: "The soul evolves through these 8,400,000 species by the law of karma. This is a long, painful journey."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Evolution of Consciousness</h2>
          <p>Srila Prabhupada explains: "The soul does not evolve from matter. The soul is eternal. But consciousness evolves through these species. In lower species, consciousness is covered. In human life, consciousness is developed enough to understand God."</p>
          <p>He writes in Bhagavad Gita As It Is: "After many, many births in lower species, one gets the human form. This is a great opportunity because only in human life can one understand Krishna and go back to Godhead."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Rarity of Human Life</h2>
          <p>Srila Prabhupada emphasizes how rare human birth is:</p>
          <div className="verse">
            "Out of many millions of wandering living entities, one who is very fortunate gets an opportunity to associate with a bona fide spiritual master. By the mercy of both Krishna and the spiritual master, such a person receives the seed of devotional service." - Caitanya Caritamrita
          </div>
          <p>He writes: "After wandering through 8,400,000 species, we finally get human life. If we waste it in sense gratification like animals, we go back down. This is the greatest tragedy."</p>
        </div>

        <div className="section">
          <h2 className="section-title">How Degradation Happens</h2>
          <p>Srila Prabhupada warns about degradation to lower species:</p>
          <div className="verse">
            "Those who are envious and mischievous, who are the lowest among men, are cast by Me into the ocean of material existence, into various demoniac species of life." - Bhagavad Gita 16.19
          </div>
          <p>He explains: "If someone lives like a dog—eating anything, having sex anywhere—he will get a dog's body next life. Nature is very exact. You get the body that matches your consciousness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Only Escape: Krishna Consciousness</h2>
          <p>Srila Prabhupada gives the solution:</p>
          <div className="verse">
            "From the highest planet in the material world down to the lowest, all are places of misery wherein repeated birth and death take place. But one who attains to My abode, O son of Kunti, never takes birth again." - Bhagavad Gita 8.16
          </div>
          <p>He writes: "The only way to escape this cycle of 8,400,000 species is to surrender to Krishna. By chanting Hare Krishna and engaging in devotional service, we can go back to the spiritual world and never return to material existence."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Chanting Frees Us from the Cycle</h2>
          <p>Srila Prabhupada's prescription:</p>
          <div className="verse">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare<br />
            Hare Rama Hare Rama Rama Rama Hare Hare
          </div>
          <p>He writes: "This maha-mantra is so powerful that it can immediately stop the cycle of birth and death. By sincerely chanting, we purify our consciousness and become eligible to return to the spiritual world."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Don't Waste Human Life</h2>
          <p>Srila Prabhupada's urgent plea: "Human life is meant for self-realization, not for sense gratification like animals. We have struggled through 8,400,000 births to get this human form. Don't waste it. Use it to become Krishna conscious and end this suffering forever."</p>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <Link to="/essential-truths" className="back-button">Back to Topics</Link>
      </div>
  </main>
);

export default EightyFourLakhSpecies;
