import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const MayaAndMaterialWorld = () => (
  <main className="essential-main">
      <div className="content">
        <h1>Who is Maya?</h1>
        <p className="quote">Is the Material World Maya? Who is Controlling It?</p>

        <div className="section">
          <p>In Vedic philosophy, Maya is the Lord’s external energy that bewilders the living beings. Although powerful, Maya is not independent. She works strictly under the supervision of the Supreme Personality of Godhead, Sri Krishna.</p>
        </div>

        <div className="section">
          <h2>Yogamaya vs Mahamaya</h2>
          <p>Krishna has two major energies: Yogamaya (internal spiritual energy) and Mahamaya (external material energy). While Yogamaya helps devotees come closer to Krishna, Mahamaya binds conditioned souls to illusion and forgetfulness of their real identity.</p>
          <p>Both serve the Lord in different capacities, but Mahamaya's task is more difficult—keeping the living beings entangled in temporary enjoyment.</p>
        </div>

        <div className="section">
          <h2>The Role of Mahamaya</h2>
          <p>Mahamaya traps the soul in the cycle of birth and death through three modes of nature: goodness, passion, and ignorance. Her illusion makes us think we are the body, forgetting we are eternal souls.</p>
          <div className="verse">"daivī hy eṣā guṇa-mayī mama māyā duratyayā<br />mām eva ye prapadyante māyām etāṁ taranti te" – B.G 7.14</div>
          <p>Translation: "This divine energy of Mine, consisting of the modes of nature, is difficult to overcome. But those who surrender unto Me can easily cross beyond it."</p>
        </div>

        <div className="section">
          <h2>Is the Material World False?</h2>
          <p>According to Vedic wisdom, the material world is not false but temporary. It is real as Krishna has created it, but attaching ourselves to it as if it's eternal is illusion (maya). This world is a testing ground, not our permanent home.</p>
        </div>

        <div className="section">
          <h2>Who Controls Maya?</h2>
          <p>Maya is fully controlled by Krishna. She cannot act independently. Just like a shadow cannot exist without light, Maya cannot function without Krishna’s will. She punishes or tests the living beings, based on their karma.</p>
        </div>

        <div className="section">
          <h2>How to Overcome Maya?</h2>
          <p>The only way to escape the clutches of Maya is by surrendering to Krishna and engaging in Bhakti. Through devotional service and chanting the holy names, we awaken our dormant love and become free from illusion.</p>
          <div className="verse">Hare Krishna Hare Krishna Krishna Krishna Hare Hare<br />Hare Rama Hare Rama Rama Rama Hare Hare</div>
          <p>Chanting the Hare Krishna Maha Mantra cleanses the heart and destroys the illusion created by Maya.</p>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <Link to="/essential-truths" className="back-button">Back to Topics</Link>
      </div>
  </main>
);

export default MayaAndMaterialWorld;
