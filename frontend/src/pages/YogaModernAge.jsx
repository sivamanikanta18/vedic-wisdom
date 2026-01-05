import React from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const YogaModernAge = () => (
  <main className="essential-main">
      <div className="content">
        <h1>Yoga for the Modern Age</h1>
        <p className="quote">Bhakti-Yoga: The Supreme Path - Srila Prabhupada's Teachings</p>

        <div className="section">
          <h2 className="section-title">The Difficulty of Astanga-Yoga</h2>
          <p>Srila Prabhupada explains in Bhagavad Gita As It Is that the eightfold yoga system (astanga-yoga) described in Chapter 6 is extremely difficult in this age. He writes: "This yoga system is not possible to perform in this age of Kali. The present age is characterized by a bitter struggle for existence."</p>
          <div className="verse">
            "O Madhusudana, the system of yoga which You have summarized appears impractical and unendurable to me, for the mind is restless and unsteady." - Bhagavad Gita 6.33
          </div>
          <p>Even Arjuna, a great warrior with Krishna as his personal guide, found this system impractical.</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Mind is More Difficult to Control Than Wind</h2>
          <p>Arjuna honestly admits:</p>
          <div className="verse">
            "For the mind is restless, turbulent, obstinate and very strong, O Krishna, and to subdue it, I think, is more difficult than controlling the wind." - Bhagavad Gita 6.34
          </div>
          <p>Srila Prabhupada comments: "The mind is so strong and obstinate that it sometimes overcomes the intelligence, although the mind is supposed to be subservient to the intelligence. For a man in the practical world who has to fight so many opposing elements, it is certainly very difficult to control the mind."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Krishna Recommends Bhakti-Yoga</h2>
          <p>After describing various yoga systems, Krishna concludes in Bhagavad Gita 6.47:</p>
          <div className="verse">
            "And of all yogis, the one with great faith who always abides in Me, thinks of Me within himself, and renders transcendental loving service to Me—he is the most intimately united with Me in yoga and is the highest of all. That is My opinion."
          </div>
          <p>Srila Prabhupada writes in the purport: "The word bhajate is significant here. Bhajate has its root in the verb bhaj, which is used when there is need of service. The English word 'worship' cannot be always used for bhaj. Worship means to adore, or to show respect and honor to the worthy one. But service with love and faith is especially meant for the Supreme Personality of Godhead."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Chanting: The Yoga for Kali-Yuga</h2>
          <p>Srila Prabhupada emphasizes that Lord Caitanya Mahaprabhu gave the perfect process for this age:</p>
          <div className="verse">
            "harer nāma harer nāma harer nāmaiva kevalam<br/>
            kalau nāsty eva nāsty eva nāsty eva gatir anyathā"
          </div>
          <p><strong>Translation:</strong> "In this age of quarrel and hypocrisy, the only means of deliverance is chanting the holy name of the Lord. There is no other way. There is no other way. There is no other way."</p>
          <p>Srila Prabhupada writes: "This is not a sentimental statement. It is a fact confirmed by all Vedic literature."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Why Chanting is Perfect for Modern Life</h2>
          <p>Srila Prabhupada explains the advantages of bhakti-yoga through chanting:</p>
          <ul>
            <li><strong>No special place required:</strong> Can be done anywhere—home, office, street</li>
            <li><strong>No special time required:</strong> Any time is suitable for chanting</li>
            <li><strong>No special qualification:</strong> Anyone can chant—young, old, educated, uneducated</li>
            <li><strong>No cost:</strong> Completely free, no equipment needed</li>
            <li><strong>Immediate effect:</strong> Purifies consciousness from the very beginning</li>
            <li><strong>Joyful process:</strong> Brings happiness, not austerity</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">The Hare Krishna Maha Mantra</h2>
          <p>Srila Prabhupada gave the world this simple yet powerful mantra:</p>
          <div className="verse">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare<br/>
            Hare Rama Hare Rama Rama Rama Hare Hare
          </div>
          <p>He writes: "This transcendental vibration—by chanting of Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare—is the sublime method for reviving our transcendental consciousness. As living spiritual souls, we are all originally Krishna conscious entities, but due to our association with matter from time immemorial, our consciousness is now adulterated by the material atmosphere."</p>
        </div>

        <div className="section">
          <h2 className="section-title">The Real Goal of All Yoga</h2>
          <p>Srila Prabhupada explains that the goal of all yoga systems is the same—to connect with Krishna. But bhakti-yoga is the direct path:</p>
          <div className="verse">
            "After many births and deaths, he who is actually in knowledge surrenders unto Me, knowing Me to be the cause of all causes and all that is. Such a great soul is very rare." - Bhagavad Gita 7.19
          </div>
          <p>He writes: "The bhakti-yoga process is the direct method. Other yoga systems may take many lifetimes, but bhakti-yoga can give perfection in this very life."</p>
        </div>

        <div className="section">
          <h2 className="section-title">Practical Application</h2>
          <p>Srila Prabhupada's simple formula for practicing bhakti-yoga in modern life:</p>
          <ol>
            <li><strong>Chant 16 rounds daily:</strong> The foundation of spiritual life</li>
            <li><strong>Follow 4 regulative principles:</strong> No meat, intoxication, gambling, or illicit sex</li>
            <li><strong>Read Bhagavad Gita As It Is:</strong> Understand the philosophy</li>
            <li><strong>Associate with devotees:</strong> Spiritual company is essential</li>
            <li><strong>Offer food to Krishna:</strong> Eat only prasadam</li>
            <li><strong>Engage in devotional service:</strong> Use your talents for Krishna</li>
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

export default YogaModernAge;
