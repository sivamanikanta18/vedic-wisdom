import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const WhyBadHappensToGoodPeople = () => (
  <main className="essential-main">
      <div className="content">
        <h1>Why Bad Happens to Good People</h1>
        <p className="quote">Understanding Karma and Krishna's Mercy - Srila Prabhupada's Explanation</p>

        <div className="section">
          <h2 className="section-title">The Law of Karma is Exact</h2>
          <p>Srila Prabhupada explains that nothing happens by chance. Every experience we have is the result of our past actions (karma). In Bhagavad Gita As It Is, he writes: "According to one's karma, one is placed in different conditions of life."</p>
          <div className="verse">
            "As they surrender unto Me, I reward them accordingly. Everyone follows My path in all respects, O son of Pritha." - Bhagavad Gita 4.11
          </div>
          <p>Even if someone appears "good" now, they may be experiencing reactions from past life karma. The law of karma is impartial and exact.</p>
        </div>

        <div className="section">
          <h2 className="section-title">Devotees See Suffering as Krishna's Mercy</h2>
          <p>Srila Prabhupada teaches that devotees accept all situations as Krishna's arrangement for their spiritual benefit. He writes: "A devotee takes everything, favorable or unfavorable, as Krishna's mercy."</p>
          <div className="verse">
            "One who is equal to friends and enemies, who is equipoised in honor and dishonor, heat and cold, happiness and distress, fame and infamy, who is always free from contaminating association and always silent and satisfied with anything, who doesn't care for any residence, who is fixed in knowledge and engaged in devotional service—such a person is very dear to Me." - Bhagavad Gita 12.18-19
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Examples of Great Devotees Who Suffered</h2>
          <p>Srila Prabhupada often cited examples of devotees who faced extreme difficulties:</p>
          <ul>
            <li><strong>Prahlada Maharaja:</strong> Tortured by his own father but never lost faith in Krishna</li>
            <li><strong>Haridas Thakura:</strong> Beaten in 22 marketplaces but continued chanting Hare Krishna</li>
            <li><strong>Pandavas:</strong> Lost their kingdom, exiled to forest, yet remained devoted to Krishna</li>
            <li><strong>Lord Jesus Christ:</strong> Crucified but forgave his persecutors</li>
          </ul>
          <p>Srila Prabhupada writes: "These great souls showed us that material suffering cannot touch one who is fixed in Krishna consciousness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Krishna's Protection is Spiritual, Not Always Material</h2>
          <p>Srila Prabhupada clarifies that Krishna's protection doesn't mean avoiding all material difficulties. He writes: "Krishna protects His devotee by giving him spiritual strength, not necessarily by removing all material problems."</p>
          <div className="verse">
            "But those who always worship Me with exclusive devotion, meditating on My transcendental form—to them I carry what they lack, and I preserve what they have." - Bhagavad Gita 9.22
          </div>
          <p>In the purport, Srila Prabhupada explains: "Krishna takes charge of the devotee's maintenance and protection. The devotee need not worry about material necessities."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Suffering Purifies and Brings Us Closer to Krishna</h2>
          <p>Srila Prabhupada teaches that difficulties can be blessings in disguise. He writes: "Sometimes Krishna puts His devotee in difficulty to increase his dependence on the Lord and decrease material attachment."</p>
          <p>The Pandavas lost everything materially but gained Krishna's personal association. Srila Prabhupada comments: "Material loss is spiritual gain when it increases our Krishna consciousness."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Chanting Burns Karmic Reactions</h2>
          <p>Srila Prabhupada gives the solution for overcoming karma:</p>
          <div className="verse">
            "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear." - Bhagavad Gita 18.66
          </div>
          <p>He writes: "By chanting Hare Krishna, all karmic reactions—past, present, and future—are burned to ashes. The devotee becomes free from the cycle of karma."</p>
          <p>In Srimad Bhagavatam 6.2, the story of Ajamila shows how chanting the holy name can nullify even the worst karma.</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Understanding</h2>
          <p>Srila Prabhupada's guidance for dealing with difficulties:</p>
          <ul>
            <li><strong>Accept it as Krishna's arrangement:</strong> Everything happens for our spiritual benefit</li>
            <li><strong>Don't blame others or circumstances:</strong> It's our own karma manifesting</li>
            <li><strong>Use difficulty to strengthen devotion:</strong> Adversity can deepen our relationship with Krishna</li>
            <li><strong>Chant more:</strong> The holy name destroys all karma</li>
            <li><strong>Serve devotees:</strong> Association with pure devotees purifies us</li>
            <li><strong>Read Srila Prabhupada's books:</strong> Spiritual knowledge gives proper perspective</li>
            <li><strong>Remember it's temporary:</strong> Material suffering is like a dream—it will pass</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">The Ultimate Perspective</h2>
          <p>Srila Prabhupada concludes: "For a devotee, there is no such thing as 'bad luck' or 'good luck.' Everything is Krishna's mercy. Whether Krishna gives us comfort or difficulty, both are meant to bring us closer to Him. This is the vision of a pure devotee."</p>
          <div className="verse">
            "My dear Lord, one who earnestly waits for You to bestow Your causeless mercy upon him, all the while patiently suffering the reactions of his past misdeeds and offering You respectful obeisances with his heart, words and body, is surely eligible for liberation, for it has become his rightful claim." - Srimad Bhagavatam 10.14.8
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

export default WhyBadHappensToGoodPeople;
