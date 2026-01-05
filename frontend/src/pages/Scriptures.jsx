import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Scriptures.css";

// Comprehensive book data with multiple access options
export const SCRIPTURES_LIBRARY = [
  // Major Works by Srila Prabhupada
  {
    section: "Major Works by Srila Prabhupada",
    books: [
      { 
        title: "Bhagavad-gita As It Is", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "The timeless classic of spiritual wisdom",
        bookId: "bhagavad-gita",
        chapters: 18,
        verses: 700,
        image: "/images/bhagavad_gita.jpg"
      },
      { 
        title: "Srimad-Bhagavatam (Bhagavata Purana)", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "The beautiful story of Krishna and His devotees",
        bookId: "srimad-bhagavatam",
        cantos: 12,
        verses: 18000,
        image: "/images/bhagavatham.jpg"
      },
      { 
        title: "Krishna, The Supreme Personality of Godhead", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Summary study of the Tenth Canto of Srimad-Bhagavatam",
        bookId: "krishna-book",
        chapters: 90,
        image: "/images/krishna_book.jpg"
      },
      { 
        title: "The Nectar of Devotion", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "The complete science of bhakti-yoga",
        bookId: "nectar-of-devotion",
        image: "/images/nectar_of_devotion.jpg"
      },
    ],
  },
  // Essential Reading
  {
    section: "Essential Reading for Beginners",
    books: [
      { 
        title: "The Science of Self-Realization", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Introduction to Krishna consciousness",
        bookId: "science-of-self-realization",
        image: "/images/science_of_self_realization.jpg"
      },
      { 
        title: "Beyond Birth and Death", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Understanding the eternal soul",
        bookId: "beyond-birth-death",
        image: "/images/beyond_birth_death.jpg"
      },
      { 
        title: "On the Way to Krishna", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "A simple introduction to Krishna consciousness",
        bookId: "on-the-way-to-krishna",
        image: "/images/on_the_way_to_krishna.jpg"
      },
      { 
        title: "Raja-vidya: The King of Knowledge", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "The supreme knowledge for spiritual realization",
        bookId: "rajavidya",
        image: "/images/rajavidya.jpg"
      },
      { 
        title: "Elevation to Krishna Consciousness", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Practical guidance for spiritual life",
        bookId: "elevation-krishna",
        image: "/images/elevation_krishna.jpg"
      },
    ],
  },
  // Philosophy & Practice
  {
    section: "Philosophy & Practice",
    books: [
      { 
        title: "Perfect Questions, Perfect Answers", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Conversations with a young seeker",
        bookId: "perfect-questions-answers",
        image: "/images/perfect_questions_and_perfect_answers.jpg"
      },
      { 
        title: "Easy Journey to Other Planets", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "The science of antimaterial worlds",
        bookId: "easy-journey",
        image: "/images/easy_journey.jpg"
      },
      { 
        title: "Civilization and Transcendence", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Conversations on society and spirituality",
        bookId: "civilization-transcendence",
        image: "/images/civilization_transcendence.jpg"
      },
      { 
        title: "Matchless Gift", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "The gift of Krishna consciousness",
        bookId: "matchless-gift",
        image: "/images/matchless_gift.jpg"
      },
    ],
  },
  // Lectures & Conversations
  {
    section: "Lectures & Conversations",
    books: [
      { 
        title: "Bhagavad-gita Lectures", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Transcripts of lectures on Bhagavad-gita",
        bookId: "bg-lectures",
        type: "lectures"
      },
      { 
        title: "Srimad-Bhagavatam Lectures", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Transcripts of lectures on Srimad-Bhagavatam",
        bookId: "sb-lectures",
        type: "lectures"
      },
      { 
        title: "Caitanya-caritamrta Lectures", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Transcripts of lectures on Caitanya-caritamrta",
        bookId: "cc-lectures",
        type: "lectures"
      },
      { 
        title: "General Lectures", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Various lectures on spiritual topics",
        bookId: "general-lectures",
        type: "lectures"
      },
      { 
        title: "Morning Walks", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Conversations during morning walks",
        bookId: "morning-walks",
        type: "conversations"
      },
      { 
        title: "Room Conversations", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Private conversations and discussions",
        bookId: "room-conversations",
        type: "conversations"
      },
    ],
  },
  // Letters
  {
    section: "Letters",
    books: [
      { 
        title: "Letters 1947-1977", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Complete collection of letters to disciples and well-wishers",
        bookId: "letters",
        type: "letters",
        count: "7000+ letters"
      },
      { 
        title: "Letters by Year", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Browse letters organized by year",
        bookId: "letters-by-year",
        type: "letters"
      },
      { 
        title: "Letters by Recipient", 
        author: "A.C. Bhaktivedanta Swami Prabhupada",
        description: "Browse letters organized by recipient",
        bookId: "letters-by-recipient",
        type: "letters"
      },
    ],
  },
];

const Scriptures = () => {
  const [search, setSearch] = useState("");

  // Filtered books by search
  const getFilteredBooks = (books) =>
    books.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="scriptures-main">
      <div className="content">
        <div className="scriptures-header">
          <h1>📚 Sacred Scriptures Library</h1>
          <p className="subtitle">Complete works by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada</p>
          <p className="source-info">✨ All books available from official VedaBase</p>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search for scriptures by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {SCRIPTURES_LIBRARY.map((section) => {
          const filteredBooks = getFilteredBooks(section.books);
          if (filteredBooks.length === 0) return null;
          
          return (
            <div key={section.section} className="scripture-section">
              <h2 className="section-title">{section.section}</h2>
              <div className="scripture-grid">
                {filteredBooks.map((book) => (
                  <div className="book-card" key={book.title}>
                    {book.image ? (
                      <div className="book-image">
                        <img src={book.image} alt={book.title} />
                      </div>
                    ) : (
                      <div className="book-image book-image-placeholder">
                        <div className="placeholder-icon">📖</div>
                      </div>
                    )}
                    <div className="book-header">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                    </div>
                    
                    <p className="book-description">{book.description}</p>
                    
                    {(book.chapters || book.cantos || book.verses || book.count) && (
                      <div className="book-stats">
                        {book.chapters && <span>📖 {book.chapters} Chapters</span>}
                        {book.cantos && <span>📚 {book.cantos} Cantos</span>}
                        {book.verses && <span>✨ {book.verses.toLocaleString()} Verses</span>}
                        {book.count && <span>📝 {book.count}</span>}
                      </div>
                    )}
                    
                    <div className="book-actions">
                      {book.bookId ? (
                        <Link 
                          to={`/vedabase/${book.bookId}`}
                          className="btn btn-primary"
                          title="Read from Official VedaBase"
                        >
                          {book.type === 'lectures' && '🎤 View Lectures'}
                          {book.type === 'conversations' && '💬 View Conversations'}
                          {book.type === 'letters' && '✉️ View Letters'}
                          {!book.type && '📖 Read Now (VedaBase)'}
                        </Link>
                      ) : (
                        <span className="btn btn-disabled">Coming Soon</span>
                      )}
                    </div>
                    
                    <div className="book-footer">
                      <span className="source-badge">Free Access</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="library-info">
          <h2>📚 About This Library</h2>
          <p>All books are freely available to read online. Click "Read Now" to start reading any book directly in your browser.</p>
          <p>These are authentic works by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, founder of ISKCON.</p>
        </div>
      </div>
    </main>
  );
};

export default Scriptures;
