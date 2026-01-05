import React from "react";
import "./CardSection.css";

function CardSection() {
  const cards = [
    {
      title: "Explore Scriptures",
      desc: "Discover wisdom from the Bhagavad Gita, and all Srila Prabhupada's books, lectures, letters and conversations.",
      link: "#",
      button: "Learn More",
    },
    {
      title: "Find Solutions",
      desc: "Overcome material problems using timeless solutions from ancient texts.",
      link: "#",
      button: "Learn More",
    },
    {
      title: "Chant Hare Krishna",
      desc: "Join us in chanting the Hare Krishna Maha Mantra and feel the spiritual connection.",
      link: "#",
      button: "Start Chanting",
    },
  ];

  return (
    <div className="section">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <h3>{card.title}</h3>
          <p>{card.desc}</p>
          <a href={card.link}>{card.button}</a>
        </div>
      ))}
    </div>
  );
}

export default CardSection;
