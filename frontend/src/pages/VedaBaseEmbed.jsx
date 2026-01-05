import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VedaBaseEmbed.css";

const VedaBaseEmbed = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Map book IDs to VedaBase URLs
  const vedabaseUrls = {
    "bhagavad-gita": {
      title: "Bhagavad-gita As It Is",
      baseUrl: "https://vedabase.io/en/library/bg/",
      chapters: 18
    },
    "srimad-bhagavatam": {
      title: "Srimad-Bhagavatam",
      baseUrl: "https://vedabase.io/en/library/sb/",
      cantos: 12
    },
    "krishna-book": {
      title: "Krishna, The Supreme Personality of Godhead",
      baseUrl: "https://vedabase.io/en/library/kb/",
      chapters: 90
    },
    "nectar-of-devotion": {
      title: "The Nectar of Devotion",
      baseUrl: "https://vedabase.io/en/library/nod/"
    },
    "science-of-self-realization": {
      title: "The Science of Self-Realization",
      baseUrl: "https://vedabase.io/en/library/ssr/"
    },
    "beyond-birth-death": {
      title: "Beyond Birth and Death",
      baseUrl: "https://vedabase.io/en/library/bbd/"
    },
    "on-the-way-to-krishna": {
      title: "On the Way to Krishna",
      baseUrl: "https://vedabase.io/en/library/owk/"
    },
    "rajavidya": {
      title: "Raja-vidya: The King of Knowledge",
      baseUrl: "https://vedabase.io/en/library/rv/"
    },
    "elevation-krishna": {
      title: "Elevation to Krishna Consciousness",
      baseUrl: "https://vedabase.io/en/library/ekc/"
    },
    "perfect-questions-answers": {
      title: "Perfect Questions, Perfect Answers",
      baseUrl: "https://vedabase.io/en/library/pqpa/"
    },
    "easy-journey": {
      title: "Easy Journey to Other Planets",
      baseUrl: "https://vedabase.io/en/library/ejop/"
    },
    "civilization-transcendence": {
      title: "Civilization and Transcendence",
      baseUrl: "https://vedabase.io/en/library/ct/"
    },
    "matchless-gift": {
      title: "Matchless Gift",
      baseUrl: "https://vedabase.io/en/library/mg/"
    },
    // Lectures
    "bg-lectures": {
      title: "Bhagavad-gita Lectures",
      baseUrl: "https://vedabase.io/en/library/lectures/bg/"
    },
    "sb-lectures": {
      title: "Srimad-Bhagavatam Lectures",
      baseUrl: "https://vedabase.io/en/library/lectures/sb/"
    },
    "cc-lectures": {
      title: "Caitanya-caritamrta Lectures",
      baseUrl: "https://vedabase.io/en/library/lectures/cc/"
    },
    "general-lectures": {
      title: "General Lectures",
      baseUrl: "https://vedabase.io/en/library/lectures/general/"
    },
    // Conversations
    "morning-walks": {
      title: "Morning Walks",
      baseUrl: "https://vedabase.io/en/library/conversations/morning-walks/"
    },
    "room-conversations": {
      title: "Room Conversations",
      baseUrl: "https://vedabase.io/en/library/conversations/room/"
    },
    // Letters
    "letters": {
      title: "Letters 1947-1977",
      baseUrl: "https://vedabase.io/en/library/letters/"
    },
    "letters-by-year": {
      title: "Letters by Year",
      baseUrl: "https://vedabase.io/en/library/letters/by-year/"
    },
    "letters-by-recipient": {
      title: "Letters by Recipient",
      baseUrl: "https://vedabase.io/en/library/letters/by-recipient/"
    }
  };

  const book = vedabaseUrls[bookId];

  if (!book) {
    return (
      <div className="embed-error">
        <h2>Book Not Found</h2>
        <button onClick={() => navigate("/scriptures")} className="back-button">
          ← Back to Library
        </button>
      </div>
    );
  }

  // Construct the iframe URL
  let iframeUrl = book.baseUrl;
  if (chapterId) {
    iframeUrl += `${chapterId}/`;
  }

  return (
    <div className="vedabase-embed-page">
      {/* Header */}
      <div className="embed-header">
        <button onClick={() => navigate("/scriptures")} className="back-button">
          ← Back to Library
        </button>
        <div className="book-info">
          <h1>{book.title}</h1>
          {chapterId && <p className="chapter-info">Chapter {chapterId}</p>}
        </div>
        <a 
          href={iframeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="open-new-tab"
        >
          Open in New Tab ↗
        </a>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading content from VedaBase...</p>
        </div>
      )}

      {/* Embedded VedaBase Content */}
      <div className="embed-container">
        <iframe
          src={iframeUrl}
          className="vedabase-iframe"
          title={book.title}
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
        />
      </div>

      {/* Attribution Footer */}
      <div className="embed-footer">
        <p>
          📚 Content provided by{" "}
          <a href="https://vedabase.io" target="_blank" rel="noopener noreferrer">
            VedaBase.io
          </a>
          {" "}— The complete works of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
        </p>
        <p className="copyright">
          © Bhaktivedanta Book Trust International. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VedaBaseEmbed;
