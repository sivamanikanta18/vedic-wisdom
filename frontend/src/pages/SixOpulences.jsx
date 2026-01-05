import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const SixOpulences = () => (
  <main className="essential-main">
    <div className="content">
      <h1>The Six Opulences of Lord Sri Krishna</h1>
      <p className="quote">Understanding Bhagavan - Srila Prabhupada's Explanation</p>

      <div className="section">
        <h2 className="section-title">The Definition of Bhagavan</h2>
        <p>Srila Prabhupada explains in his books that the word "Bhagavan" means the Supreme Personality of Godhead who possesses all opulences in full. This definition comes from the great sage Parasara Muni:</p>
        <div className="verse">
          "One who is full in six opulences—who has full strength, full fame, full wealth, full knowledge, full beauty, and full renunciation—is Bhagavan, or the Supreme Personality of Godhead."
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">The Six Opulences Explained</h2>
        <p>Srila Prabhupada describes each opulence in detail:</p>
        <ul>
          <li><strong>Wealth (Aisvarya):</strong> Krishna possesses all riches, both material and spiritual. All universes belong to Him</li>
          <li><strong>Strength (Virya):</strong> Krishna has unlimited power. As a child, He lifted Govardhana Hill for seven days</li>
          <li><strong>Fame (Yasas):</strong> Krishna is glorified throughout all Vedic literature and by all great sages</li>
          <li><strong>Beauty (Sri):</strong> Krishna is the most beautiful person. Even Cupid is attracted by His beauty</li>
          <li><strong>Knowledge (Jnana):</strong> Krishna is omniscient. He spoke Bhagavad Gita, the supreme knowledge</li>
          <li><strong>Renunciation (Vairagya):</strong> Though Krishna owns everything, He is completely detached</li>
        </ul>
      </div>

      <div className="section">
        <h2 className="section-title">Krishna is the Original Bhagavan</h2>
        <p>Srila Prabhupada establishes from Brahma Samhita 5.1:</p>
        <div className="verse">
          "īśvaraḥ paramaḥ kṛṣṇaḥ sac-cid-ānanda-vigrahaḥ<br/>
          anādir ādir govindaḥ sarva-kāraṇa-kāraṇam"
        </div>
        <p><strong>Translation:</strong> "Krishna, who is known as Govinda, is the Supreme Godhead. He has an eternal blissful spiritual body. He is the origin of all. He has no other origin and He is the prime cause of all causes."</p>
        <p>Srila Prabhupada writes: "Krishna is the original Bhagavan. All other incarnations are His expansions or parts of His expansions."</p>
      </div>

      <div className="section">
        <h2 className="section-title">1. Krishna's Unlimited Wealth</h2>
        <p>Srila Prabhupada explains that Krishna owns all the universes. In Bhagavad Gita 5.29, Krishna says:</p>
        <div className="verse">
          "A person in full consciousness of Me, knowing Me to be the ultimate beneficiary of all sacrifices and austerities, the Supreme Lord of all planets and demigods, and the benefactor and well-wisher of all living entities, attains peace from the pangs of material miseries."
        </div>
        <p>He is the proprietor of everything. Vrindavan, Vaikuntha, and countless spiritual planets are His opulences.</p>
      </div>

      <div className="section">
        <h2 className="section-title">2. Krishna's Unlimited Strength</h2>
        <p>Srila Prabhupada describes Krishna's strength through His pastimes:</p>
        <ul>
          <li>As a baby, He killed the demon Putana</li>
          <li>As a child, He lifted Govardhana Hill with His little finger</li>
          <li>He killed countless powerful demons like Kamsa, Jarasandha</li>
          <li>He created unlimited universes through His expansion Maha-Vishnu</li>
        </ul>
        <p>Yet He appeared as a cowherd boy to attract devotees through His sweetness.</p>
      </div>

      <div className="section">
        <h2 className="section-title">3. Krishna's Unlimited Fame</h2>
        <p>Srila Prabhupada writes: "Krishna is famous throughout the three worlds. All Vedic literature glorifies Him. The Vedas say: 'Krishna is the Supreme Personality of Godhead.'"</p>
        <p>His fame is eternal. Even after 5,000 years, millions chant His name and worship Him worldwide.</p>
      </div>

      <div className="section">
        <h2 className="section-title">4. Krishna's Unlimited Beauty</h2>
        <p>Srila Prabhupada describes Krishna's beauty in Srimad Bhagavatam purports:</p>
        <div className="verse">
          "Krishna's beauty is so attractive that it attracts even Cupid. His complexion is like a dark rain cloud, His eyes are like lotus petals, and His smile captivates the entire universe."
        </div>
        <p>The gopis of Vrindavan were so attracted by His beauty that they forgot everything else. This is spiritual beauty, not material.</p>
      </div>

      <div className="section">
        <h2 className="section-title">5. Krishna's Unlimited Knowledge</h2>
        <p>Srila Prabhupada explains that Krishna is the source of all knowledge. In Bhagavad Gita 10.8, Krishna says:</p>
        <div className="verse">
          "I am the source of all spiritual and material worlds. Everything emanates from Me. The wise who perfectly know this engage in My devotional service and worship Me with all their hearts."
        </div>
        <p>Krishna spoke Bhagavad Gita, the supreme knowledge. He knows past, present, and future of all living entities.</p>
      </div>

      <div className="section">
        <h2 className="section-title">6. Krishna's Complete Renunciation</h2>
        <p>Srila Prabhupada writes: "Although Krishna is the proprietor of everything, He is completely detached. He does not need anything. His renunciation is perfect because He has no material desire."</p>
        <p>Krishna left His kingdom in Dvaraka without attachment. He lived simply in Vrindavan as a cowherd boy, showing perfect renunciation.</p>
      </div>

      <div className="section">
        <h2 className="section-title">Why This Understanding is Important</h2>
        <p>Srila Prabhupada emphasizes: "Understanding Krishna as Bhagavan—the Supreme Personality of Godhead with all six opulences—is essential for spiritual advancement. When we understand His supreme position, we can surrender to Him completely."</p>
        <div className="verse">
          "Those who know Me as the Supreme Personality of Godhead, without doubting, are the knowers of everything, and they therefore engage themselves in full devotional service to Me." - Bhagavad Gita 15.19
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

export default SixOpulences;
