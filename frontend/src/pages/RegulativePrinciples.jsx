import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const RegulativePrinciples = () => (
  <main className="essential-main">
      <div className="content">
        <h1>Four Regulative Principles of Spiritual Life</h1>
        <p className="quote">Essential Guidelines from Srila Prabhupada</p>

        <div className="section">
          <h2 className="section-title">The Foundation of Krishna Consciousness</h2>
          <p>Srila Prabhupada established four regulative principles as the foundation for spiritual life. He writes: "These four principles are the pillars of spiritual life. Without following them, one cannot make advancement in Krishna consciousness."</p>
          <p>These principles protect the four pillars of religion mentioned in Srimad Bhagavatam:</p>
          <ul>
            <li><strong>Mercy (Daya)</strong></li>
            <li><strong>Truthfulness (Satya)</strong></li>
            <li><strong>Austerity (Tapas)</strong></li>
            <li><strong>Cleanliness (Sauca)</strong></li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">1. No Meat-Eating (Protects Mercy)</h2>
          <p>Srila Prabhupada strongly emphasized vegetarianism. He writes: "The eating of meat is simply an uncivilized habit. In the Vedic culture, there is no meat-eating."</p>
          <div className="verse">
            "Those who are ignorant of real dharma and, though wicked and haughty, account themselves virtuous, kill animals without any feeling of remorse or fear of punishment. Further, in their next lives, such sinful persons will be eaten by the same creatures they have killed in this world." - Srimad Bhagavatam 11.5.14
          </div>
          <p>He explains: "Killing animals destroys the quality of mercy. A devotee must be merciful to all living entities. How can one claim to love God while killing His children?"</p>
          <p><strong>What to avoid:</strong> All meat, fish, eggs (including products containing them)</p>
        </div>

        <div className="section">
          <h2 className="section-title">2. No Gambling (Protects Truthfulness)</h2>
          <p>Srila Prabhupada taught that gambling destroys truthfulness and creates dishonest mentality. He writes: "Gambling means unnecessary risk-taking for profit. It makes one greedy and dishonest."</p>
          <p>This includes:</p>
          <ul>
            <li>Casino gambling, betting, lottery</li>
            <li>Speculation in business for quick profit</li>
            <li>Any activity based on cheating or taking advantage of others</li>
          </ul>
          <p>Srila Prabhupada explains: "A devotee should earn money honestly through hard work and use it in Krishna's service. Gambling mentality is opposed to Krishna consciousness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">3. No Intoxication (Protects Austerity)</h2>
          <p>Srila Prabhupada was very strict about this principle. He writes: "Intoxication means anything that intoxicates the body and dulls the brain. A devotee must keep the mind clear for chanting and remembering Krishna."</p>
          <div className="verse">
            "One who is not connected with the Supreme can have neither transcendental intelligence nor a steady mind, without which there is no possibility of peace." - Bhagavad Gita 2.66
          </div>
          <p><strong>What to avoid:</strong></p>
          <ul>
            <li>Alcohol in any form</li>
            <li>Drugs (marijuana, cocaine, etc.)</li>
            <li>Tobacco and cigarettes</li>
            <li>Coffee and tea (caffeine)</li>
          </ul>
          <p>Srila Prabhupada explains: "These substances cloud consciousness and make spiritual realization impossible. A clear mind is essential for Krishna consciousness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">4. No Illicit Sex (Protects Cleanliness)</h2>
          <p>Srila Prabhupada taught that sex should be restricted to married life for procreation only. He writes: "Sex life is the most powerful force binding us to material existence. It must be controlled."</p>
          <div className="verse">
            "There are three gates leading to this hell—lust, anger and greed. Every sane man should give these up, for they lead to the degradation of the soul." - Bhagavad Gita 16.21
          </div>
          <p>He explains: "Illicit sex means any sex outside of marriage, or sex within marriage not for having Krishna conscious children. This principle protects mental and spiritual cleanliness."</p>
          <p>Srila Prabhupada writes: "Of all material attachments, sex desire is the strongest. By controlling this, one becomes spiritually powerful."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Higher Taste</h2>
          <p>Srila Prabhupada assures us that following these principles is not dry renunciation:</p>
          <div className="verse">
            "The embodied soul may be restricted from sense enjoyment, though the taste for sense objects remains. But, ceasing such engagements by experiencing a higher taste, he is fixed in consciousness." - Bhagavad Gita 2.59
          </div>
          <p>He writes: "By chanting Hare Krishna and following these principles, we develop a higher taste—the taste of spiritual bliss. Then material pleasures automatically become distasteful. This is not suppression but transcendence."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Application</h2>
          <p>Srila Prabhupada's guidance for following these principles:</p>
          <ol>
            <li><strong>Chant 16 rounds daily:</strong> This gives spiritual strength to follow the principles</li>
            <li><strong>Eat only Krishna prasadam:</strong> Food offered to Krishna is pure and satisfying</li>
            <li><strong>Associate with devotees:</strong> Good association makes it easier to follow</li>
            <li><strong>Read Srila Prabhupada's books:</strong> Understanding the philosophy strengthens determination</li>
            <li><strong>Engage in devotional service:</strong> Active engagement prevents falling down</li>
          </ol>
        </div>

        <div className="section">
          <h2 className="section-title">The Result</h2>
          <p>Srila Prabhupada concludes: "By following these four principles and chanting Hare Krishna, anyone can become a pure devotee. These are not arbitrary rules but scientific principles for spiritual advancement. They purify the body and mind, making us fit vessels for Krishna consciousness."</p>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <Link to="/essential-truths" className="back-button">Back to Topics</Link>
      </div>
  </main>
);

export default RegulativePrinciples;
