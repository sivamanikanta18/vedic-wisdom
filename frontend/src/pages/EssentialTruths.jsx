import React, { useState } from "react";
import "./EssentialTruths.css";
import { Link } from "react-router-dom";

const problems = [
  { id: 1, title: "Who am I?", link: "/essential-truths/who-am-i", react: true, icon: "🧘" },
  { id: 2, title: "What is our purpose?", link: "/essential-truths/what-is-our-purpose", react: true, icon: "🎯" },
  { id: 3, title: "What is Karma?", link: "/essential-truths/what-is-karma", react: true, icon: "⚡" },
  { id: 4, title: "What is Reincarnation?", link: "/essential-truths/what-is-reincarnation", react: true, icon: "🔄" },
  { id: 5, title: "How to overcome fear?", link: "/essential-truths/overcome-fear", react: true, icon: "💪" },
  { id: 6, title: "How to overcome anger?", link: "/essential-truths/overcome-anger", react: true, icon: "😌" },
  { id: 7, title: "Why does bad happen to good people?", link: "/essential-truths/why-bad-happens", react: true, icon: "🙏" },
  { id: 8, title: "How to manage time?", link: "/essential-truths/manage-time", react: true, icon: "⏰" },
  { id: 9, title: "How to overcome stress?", link: "/essential-truths/overcome-stress", react: true, icon: "🌿" },
  { id: 10, title: "Yoga for the modern age", link: "/essential-truths/yoga-modern-age", react: true, icon: "🧘‍♀️" },
  { id: 11, title: "What is real happiness?", link: "/essential-truths/real-happiness", react: true, icon: "😊" },
  { id: 12, title: "The truth about human origin", link: "/human-origin", react: true, icon: "👤" },
  { id: 13, title: "The six opulences of Lord Sri Krishna", link: "/essential-truths/six-opulences", react: true, icon: "👑" },
  { id: 14, title: "4 regulative principles of spiritual life", link: "/essential-truths/regulative-principles", react: true, icon: "📜" },
  { id: 15, title: "ABCDE of Bhakti", link: "/essential-truths/abcde-bhakti", react: true, icon: "🔤" },
  { id: 16, title: "The power of chanting Hare Krishna Maha Mantra", link: "/essential-truths/power-of-chanting", react: true, icon: "📿" },
  { id: 17, title: "What is called pure love? Is it possible in this world?", link: "/essential-truths/pure-love", react: true, icon: "💕" },
  { id: 18, title: "84 lakh types of species - clear explanation", link: "/essential-truths/84-lakh-species", react: true, icon: "🐾" },
  { id: 19, title: "Who is Maya? Is material world Maya? Who is controlling it?", link: "/essential-truths/maya-and-material-world", react: true, icon: "🌫️" },
  { id: 20, title: "How to control lust?", link: "/essential-truths/control-lust", react: true, icon: "🔥" },
];

const EssentialTruths = () => {
  const [search, setSearch] = useState("");
  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="essential-main">
        <div className="content">
          <h2>Find Answers to Life's Questions</h2>
          <p>Explore ancient wisdom to overcome material challenges.</p>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="problems-container">
            {filteredProblems.map((problem) => (
              <div className="problem-item" key={problem.id}>
                  <div className="topic-number">Topic {problem.id}</div>
                  <div className="topic-icon">{problem.icon}</div>
                  <h3>{problem.title}</h3>
                  {problem.title === "The truth about human origin" ? (
                    <Link to="/human-origin" className="read-more-link">Read More</Link>
                  ) : problem.react ? (
                    <Link to={problem.link} className="read-more-link">Read More</Link>
                  ) : (
                    <a href={problem.link} target="_blank" rel="noopener noreferrer" className="read-more-link">
                      Read More
                    </a>
                  )}
              </div>
            ))}
          </div>
        </div>
    </main>
  );
};

export default EssentialTruths;
