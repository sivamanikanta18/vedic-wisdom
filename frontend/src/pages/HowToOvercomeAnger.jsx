import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const HowToOvercomeAnger = () => (
  <main className="essential-main">
      <div className="content">
        <h1>How to Overcome Anger</h1>
        <p className="quote">Control the Mind Through Krishna Consciousness - Srila Prabhupada's Guidance</p>

        <div className="section">
          <h2 className="section-title">The Destructive Chain of Anger</h2>
          <p>Krishna explains the progression of material consciousness in Bhagavad Gita 2.62-63:</p>
          <div className="verse">
            "While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises. From anger, complete delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost one falls down again into the material pool."
          </div>
          <p>Srila Prabhupada writes in the purport: "One who is not Kṛṣṇa conscious is subjected to material desires while contemplating the objects of the senses. The senses require real engagements, and if they are not engaged in the transcendental loving service of the Lord, they will certainly seek engagement in the service of materialism."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Anger is One of the Six Enemies</h2>
          <p>Srila Prabhupada teaches that there are six enemies on the path of spiritual life:</p>
          <ul>
            <li><strong>Kama (Lust)</strong></li>
            <li><strong>Krodha (Anger)</strong></li>
            <li><strong>Lobha (Greed)</strong></li>
            <li><strong>Moha (Illusion)</strong></li>
            <li><strong>Mada (Pride)</strong></li>
            <li><strong>Matsarya (Envy)</strong></li>
          </ul>
          <p>These enemies must be conquered through Krishna consciousness.</p>
        </div>

        <div className="section">
          <h2 className="section-title">Anger Destroys Spiritual Progress</h2>
          <p>In Bhagavad Gita 16.21, Krishna warns:</p>
          <div className="verse">
            "There are three gates leading to this hell—lust, anger and greed. Every sane man should give these up, for they lead to the degradation of the soul."
          </div>
          <p>Srila Prabhupada explains: "The beginning of demoniac life is described herein. One tries to satisfy his lust, and when he cannot, anger and greed arise. A sane man who does not want to glide down to the species of demoniac life must try to give up these three enemies."</p>
        </div>

        <div className="section">
          <h2 className="section-title">How to Control Anger - Srila Prabhupada's Method</h2>
          <p>Srila Prabhupada gives practical instructions:</p>
          <ul>
            <li><strong>Chant Hare Krishna:</strong> The holy name purifies the heart and calms the mind</li>
            <li><strong>Remember you are not the body:</strong> Anger comes from false ego and bodily identification</li>
            <li><strong>See Krishna in everyone:</strong> "The humble sages, by virtue of true knowledge, see with equal vision a learned and gentle brāhmaṇa, a cow, an elephant, a dog and a dog-eater." (BG 5.18)</li>
            <li><strong>Engage the mind in Krishna's service:</strong> A mind engaged in devotional service has no time for anger</li>
            <li><strong>Follow regulative principles:</strong> Avoid meat, intoxication, gambling, and illicit sex—these increase anger</li>
            <li><strong>Associate with devotees:</strong> Saintly association purifies consciousness</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">Righteous Anger vs Sinful Anger</h2>
          <p>Srila Prabhupada explains that devotees like Hanuman showed anger only in Krishna's service, not for personal reasons. He writes: "A devotee may sometimes show anger toward the enemies of the Lord, but this is not material anger. This is spiritual anger for the service of the Lord."</p>
          <p>However, for ordinary practitioners, it's best to avoid anger altogether and cultivate tolerance and humility.</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Power of Tolerance</h2>
          <p>Krishna teaches in Bhagavad Gita 12.13-14:</p>
          <div className="verse">
            "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant, always satisfied, self-controlled, and engaged in devotional service with determination, his mind and intelligence fixed on Me—such a devotee of Mine is very dear to Me."
          </div>
          <p>Srila Prabhupada writes: "Tolerance means that one should be practiced to bear insults and dishonor from others. If one is engaged in the advancement of spiritual knowledge, there will be so many insults and much dishonor from others."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Daily Practice</h2>
          <p>Srila Prabhupada's prescription for overcoming anger:</p>
          <ol>
            <li><strong>Morning chanting:</strong> Start the day with 16 rounds of Hare Krishna</li>
            <li><strong>Read Bhagavad Gita As It Is:</strong> Understand the philosophy of detachment</li>
            <li><strong>Offer food to Krishna:</strong> Eat only prasadam, which purifies consciousness</li>
            <li><strong>Serve devotees:</strong> Humility destroys false ego, the root of anger</li>
            <li><strong>Remember Krishna constantly:</strong> Keep the mind absorbed in transcendence</li>
          </ol>
        </div>

        <p className="thank-you">Thank you for reading</p>
        <p className="thank-you"><strong>Hare Krishna</strong></p>
        <div className="button-container">
          <Link to="/essential-truths" className="back-button">Back to Topics</Link>
        </div>
      </div>
  </main>
);

export default HowToOvercomeAnger;
