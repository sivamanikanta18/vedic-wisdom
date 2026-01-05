import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const WhatIsRealHappiness = () => (
  <main className="essential-main">
      <div className="content">
        <h1>What is Real Happiness?</h1>
        <p className="quote">Eternal Bliss in Krishna Consciousness - Srila Prabhupada's Teachings</p>

        <div className="section">
          <h2 className="section-title">Material Happiness is Temporary</h2>
          <p>Srila Prabhupada explains that people are searching for happiness in the wrong place. In Bhagavad Gita 5.22, Krishna says:</p>
          <div className="verse">
            "An intelligent person does not take part in the sources of misery, which are due to contact with the material senses. O son of Kunti, such pleasures have a beginning and an end, and so the wise man does not delight in them."
          </div>
          <p>Srila Prabhupada writes in the purport: "Material sense pleasures are actually sources of misery. They have a beginning and an end, and therefore the wise man does not take part in them."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Real Happiness is Spiritual</h2>
          <p>Srila Prabhupada teaches that we are spirit souls, not material bodies. Therefore, material things cannot satisfy us:</p>
          <div className="verse">
            "One whose happiness is within, who is active and rejoices within, and whose aim is inward is actually the perfect mystic. He is liberated in the Supreme, and ultimately he attains the Supreme." - Bhagavad Gita 5.24
          </div>
          <p>He writes: "The self-realized person is satisfied in himself. He is not agitated by the material dualities of happiness and distress. His happiness is within, in his relationship with Krishna."</p>
        </div>

        <div className="section">
          <h2 className="section-title">We Are Spirit Soul, Not Body</h2>
          <p>Srila Prabhupada uses the analogy: "If you feed the birdcage but not the bird inside, the bird will die. Similarly, if you only satisfy the body but not the soul, you will never be happy."</p>
          <p>In Bhagavad Gita 3.42, Krishna explains the hierarchy:</p>
          <div className="verse">
            "The working senses are superior to dull matter; mind is higher than the senses; intelligence is still higher than the mind; and he [the soul] is even higher than the intelligence."
          </div>
          <p>Srila Prabhupada explains: "The soul is the highest element. Unless the soul is satisfied, no amount of material adjustment will bring happiness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Krishna is the Source of All Happiness</h2>
          <p>Srila Prabhupada teaches that Krishna is the reservoir of all pleasure (akhila-rasamrita-sindhu). He writes: "Krishna is the source of all happiness. When we connect with Krishna through devotional service, we tap into unlimited spiritual bliss."</p>
          <div className="verse">
            "From the Supreme Lord, Krishna, everything emanates. He is the supreme source of all pleasure." - Srimad Bhagavatam
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">The Three Modes of Material Nature</h2>
          <p>Srila Prabhupada explains in Bhagavad Gita 14.6-9 that material happiness is influenced by three modes:</p>
          <ul>
            <li><strong>Goodness (sattva):</strong> Brings knowledge and happiness, but still binds to material world</li>
            <li><strong>Passion (rajas):</strong> Brings attachment, frustration, and hard work</li>
            <li><strong>Ignorance (tamas):</strong> Brings delusion, laziness, and sleep</li>
          </ul>
          <p>He writes: "Even happiness in the mode of goodness is material and temporary. Real happiness is transcendental, beyond the three modes."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Chanting Brings Transcendental Happiness</h2>
          <p>Srila Prabhupada gave the world the Hare Krishna mantra as the direct method to experience spiritual bliss:</p>
          <div className="verse">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare<br/>
            Hare Rama Hare Rama Rama Rama Hare Hare
          </div>
          <p>He writes: "This chanting is the sublime method for reviving our Krishna consciousness. By chanting, we cleanse the dust from the mirror of the mind and experience our original, blissful nature."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Examples of Transcendental Happiness</h2>
          <p>Srila Prabhupada cites examples of devotees who experienced supreme happiness:</p>
          <ul>
            <li><strong>Haridasa Thakura:</strong> Chanted 300,000 names daily in ecstasy</li>
            <li><strong>Rupa Goswami:</strong> Felt separation from Krishna as the highest happiness</li>
            <li><strong>Prahlada Maharaja:</strong> Remained blissful even while being tortured</li>
            <li><strong>Gopis of Vrindavan:</strong> Experienced unlimited joy in Krishna's association</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">How to Experience Real Happiness</h2>
          <p>Srila Prabhupada's practical formula for happiness:</p>
          <ol>
            <li><strong>Chant Hare Krishna daily:</strong> 16 rounds minimum for serious practitioners</li>
            <li><strong>Read Bhagavad Gita As It Is:</strong> Understand the science of happiness</li>
            <li><strong>Associate with devotees:</strong> Spiritual association increases joy</li>
            <li><strong>Eat only prasadam:</strong> Food offered to Krishna purifies consciousness</li>
            <li><strong>Engage in devotional service:</strong> Serving Krishna brings unlimited satisfaction</li>
            <li><strong>Follow regulative principles:</strong> Clean living creates platform for happiness</li>
          </ol>
        </div>

        <div className="section">
          <h2 className="section-title">The Ultimate Happiness</h2>
          <p>Srila Prabhupada concludes: "The highest happiness is to love Krishna and serve Him eternally. This is our constitutional position. When we revive this relationship, we experience ananda—unlimited spiritual bliss that never ends."</p>
          <div className="verse">
            "The devotees of the Lord are always happy in the service of the Lord. They have no material desires. They are fully satisfied in Krishna consciousness." - Srila Prabhupada
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

export default WhatIsRealHappiness;
