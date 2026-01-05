import React, { useEffect, useState } from "react";
import "./Quote.css";

function Quote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const quotes = [
      "Chanting Hare Krishna is the easiest process for self-realization because by chanting one can cleanse the dust from the mirror of the mind. - Srila Prabhupada",
      "Real knowledge means to know that I am not this body but I am the soul within. - Srila Prabhupada, Bhagavad Gita As It Is",
      "The highest perfection of human life is to remember Krishna at the time of death. - Srila Prabhupada",
      "One who is not envious but is a kind friend to all living entities is very dear to Me. - Bhagavad Gita 12.13-14",
      "Krishna consciousness is not an artificial imposition on the mind. This consciousness is the original energy of the living entity. - Srila Prabhupada",
      "The purpose of human life is to revive our dormant love for Krishna. - Srila Prabhupada",
      "By regular attendance in classes on the Bhagavatam and by rendering of service to the pure devotee, all that is troublesome to the heart is almost completely destroyed. - Srimad Bhagavatam 1.2.18",
      "One should not see the faults of others, but see only their good qualities. - Srila Prabhupada",
      "The soul is never born and never dies. It is eternal, indestructible, and primeval. - Bhagavad Gita 2.20",
      "Everything belongs to Krishna. We should use everything in Krishna's service and that will make us perfect. - Srila Prabhupada",
    ];

    const today = new Date();
    const quoteIndex = today.getDate() % quotes.length;
    setQuote(quotes[quoteIndex]);
  }, []);

  return (
    <div className="quote">
      <div className="quote-heading">Daily Quote</div>
      <div className="quote-text">“{quote}”</div>
    </div>
  );
}

export default Quote;
