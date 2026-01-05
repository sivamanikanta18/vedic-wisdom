import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const WhoAmI = () => (
  <main className="essential-main">
      <div className="content">
        <h1>Who Am I?</h1>
        <div className="quote">Understanding Your Eternal Identity - Teachings from Bhagavad Gita As It Is</div>
        
        <div className="section">
          <h2 className="section-title">You Are Not This Body</h2>
          <p>Srila Prabhupada explains in his purport to Bhagavad Gita 2.13: "The body is changing from childhood to youth, from youth to old age, and the person who owns the body knows that the body is changing. The owner is distinctly kṛṣṇa conscious."</p>
          <div className="verse">
            "As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change." - Bhagavad Gita 2.13
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">The Soul is Eternal</h2>
          <p>In Bhagavad Gita As It Is, Krishna clearly explains our true identity:</p>
          <div className="verse">
            "For the soul there is neither birth nor death at any time. He has not come into being, does not come into being, and will not come into being. He is unborn, eternal, ever-existing and primeval. He is not slain when the body is slain." - Bhagavad Gita 2.20
          </div>
          <p>Srila Prabhupada writes: "The soul is eternal and indestructible. The living entity is eternal and indestructible. He is simply changing his dress—the material body."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Size and Nature of the Soul</h2>
          <p>Srila Prabhupada describes in Srimad Bhagavatam that the soul is atomic in size but full of consciousness. The Svetasvatara Upanishad (5.9) states the soul is one ten-thousandth the tip of a hair.</p>
          <div className="verse">
            "The individual soul is unbreakable and insoluble, and can be neither burned nor dried. He is everlasting, present everywhere, unchangeable, immovable and eternally the same." - Bhagavad Gita 2.24
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Our Relationship with Krishna</h2>
          <p>Srila Prabhupada teaches that we are eternal servants of Krishna. In Bhagavad Gita 15.7, Krishna says:</p>
          <div className="verse">
            "The living entities in this conditioned world are My eternal fragmental parts. Due to conditioned life, they are struggling very hard with the six senses, which include the mind."
          </div>
          <p>Understanding that we are spirit souls, eternal parts of Krishna, is the beginning of Krishna consciousness. This knowledge frees us from bodily identification and material suffering.</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Application</h2>
          <p>Srila Prabhupada recommends:</p>
          <ul>
            <li><strong>Chant Hare Krishna:</strong> This awakens our dormant Krishna consciousness</li>
            <li><strong>Read Bhagavad Gita As It Is:</strong> Understand your eternal nature</li>
            <li><strong>Associate with devotees:</strong> Strengthen spiritual identity</li>
            <li><strong>Avoid bodily identification:</strong> See yourself as spirit soul, not body</li>
          </ul>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <div className="button-container">
          <Link to="/essential-truths" className="back-button">Back to Topics</Link>
        </div>
      </div>
  </main>
);

export default WhoAmI;
