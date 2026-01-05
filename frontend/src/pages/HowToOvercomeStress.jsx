import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const HowToOvercomeStress = () => (
  <main className="essential-main">
      <div className="content">
        <h1>How to Overcome Stress</h1>
        <p className="quote">Find Peace Through Krishna Consciousness - Srila Prabhupada's Solution</p>

        <div className="section">
          <h2 className="section-title">The Root Cause of Stress</h2>
          <p>Srila Prabhupada explains that stress comes from material attachment and false identification with the body. In his purport to Bhagavad Gita 2.14, he writes: "Material happiness and distress are temporary. They come and go like seasonal changes. A spiritually advanced person is not disturbed by them."</p>
          <div className="verse">
            "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, O scion of Bharata, and one must learn to tolerate them without being disturbed." - Bhagavad Gita 2.14
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Work Without Attachment to Results</h2>
          <p>Srila Prabhupada teaches that stress comes from being overly attached to outcomes. Krishna's solution is karma-yoga:</p>
          <div className="verse">
            "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty." - Bhagavad Gita 2.47
          </div>
          <p>In the purport, Srila Prabhupada writes: "One has to learn that nothing belongs to any individual person. Everything belongs to the Supreme Lord, and therefore everything should be used in the service of the Lord. This perfect knowledge relieves one from all material anxieties."</p>
        </div>

        <div className="section">
          <h2 className="section-title">You Are Not This Body</h2>
          <p>Srila Prabhupada emphasizes that realizing our spiritual identity eliminates stress:</p>
          <div className="verse">
            "For the soul there is neither birth nor death at any time. He has not come into being, does not come into being, and will not come into being. He is unborn, eternal, ever-existing and primeval. He is not slain when the body is slain." - Bhagavad Gita 2.20
          </div>
          <p>He writes: "Bodily concept of life is animal life. When one is enlightened with the knowledge that he is not this body but spirit soul, he at once becomes joyful."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Control the Mind Through Practice</h2>
          <p>Arjuna asks Krishna how to control the restless mind. Krishna's answer:</p>
          <div className="verse">
            "The mind is restless, turbulent, obstinate and very strong, O Krishna, and to subdue it, I think, is more difficult than controlling the wind." - Bhagavad Gita 6.34
          </div>
          <div className="verse">
            "It is undoubtedly very difficult to curb the restless mind, but it is possible by suitable practice and by detachment." - Bhagavad Gita 6.35
          </div>
          <p>Srila Prabhupada explains: "The practice of Krishna consciousness is the greatest help for controlling the mind. By chanting Hare Krishna, the mind becomes absorbed in transcendental sound vibration and naturally becomes peaceful."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Peace Formula</h2>
          <p>Srila Prabhupada gives the ultimate solution for stress in his purport to Bhagavad Gita 5.29:</p>
          <div className="verse">
            "A person in full consciousness of Me, knowing Me to be the ultimate beneficiary of all sacrifices and austerities, the Supreme Lord of all planets and demigods, and the benefactor and well-wisher of all living entities, attains peace from the pangs of material miseries."
          </div>
          <p>He writes: "The conditioned souls are all anxious to attain peace in the material world. But they do not know the formula for peace. The formula is simple: one must know that Krishna is the supreme enjoyer, the supreme proprietor, and the supreme friend."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Steps to Overcome Stress</h2>
          <p>Srila Prabhupada's prescription for a stress-free life:</p>
          <ul>
            <li><strong>Chant Hare Krishna daily:</strong> 16 rounds purifies consciousness and brings peace</li>
            <li><strong>Read Bhagavad Gita As It Is:</strong> Spiritual knowledge removes ignorance, the cause of stress</li>
            <li><strong>Offer all work to Krishna:</strong> "Whatever you do, do it as an offering to Me" (BG 9.27)</li>
            <li><strong>Accept Krishna's plan:</strong> Trust that everything happens for our spiritual benefit</li>
            <li><strong>Follow regulative principles:</strong> Clean living reduces mental agitation</li>
            <li><strong>Associate with devotees:</strong> Spiritual company brings peace and happiness</li>
            <li><strong>Eat only prasadam:</strong> Food offered to Krishna purifies body and mind</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">The Ultimate Solution</h2>
          <p>Srila Prabhupada concludes: "The material world is full of anxieties. Real peace is only in Krishna consciousness. When we understand that we are eternal servants of Krishna and engage in His service, all stress and anxiety disappear. This is the perfection of life."</p>
          <div className="verse">
            "One who is not connected with the Supreme can have neither transcendental intelligence nor a steady mind, without which there is no possibility of peace. And how can there be any happiness without peace?" - Bhagavad Gita 2.66
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

export default HowToOvercomeStress;
