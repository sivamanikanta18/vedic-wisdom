import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookReader.css";

const BookReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Book metadata
  const bookData = {
    "bhagavad-gita": {
      title: "Bhagavad-gita As It Is",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/bhagavad_gita.pdf"
    },
    "srimad-bhagavatam": {
      title: "Srimad-Bhagavatam",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/bhagavatham.pdf"
    },
    "krishna-book": {
      title: "Krishna, The Supreme Personality of Godhead",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/krishna_book.pdf"
    },
    "nectar-of-devotion": {
      title: "The Nectar of Devotion",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/nectar_of_devotion.pdf"
    },
    "science-of-self-realization": {
      title: "The Science of Self-Realization",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/science_of_self_realization.pdf"
    },
    "beyond-birth-death": {
      title: "Beyond Birth and Death",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/beyond_birth_death.pdf"
    },
    "on-the-way-to-krishna": {
      title: "On the Way to Krishna",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/on_the_way_to_krishna.pdf"
    },
    "rajavidya": {
      title: "Raja-vidya: The King of Knowledge",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/rajavidya.pdf"
    },
    "elevation-krishna": {
      title: "Elevation to Krishna Consciousness",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/elevation_krishna.pdf"
    },
    "perfect-questions-answers": {
      title: "Perfect Questions, Perfect Answers",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/perfect_questions_and_perfect_answers.pdf"
    },
    "easy-journey": {
      title: "Easy Journey to Other Planets",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/easy_journey.pdf"
    },
    "civilization-transcendence": {
      title: "Civilization and Transcendence",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/civilization_transcendence.pdf"
    },
    "matchless-gift": {
      title: "Matchless Gift",
      author: "A.C. Bhaktivedanta Swami Prabhupada",
      pdfPath: "/books/matchless_gift.pdf"
    }
  };

  const book = bookData[bookId];

  if (!book) {
    return (
      <div className="reader-error">
        <h2>Book Not Found</h2>
        <p>The requested book could not be found.</p>
        <button onClick={() => navigate("/scriptures")} className="back-button">
          ← Back to Scriptures
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = book.pdfPath;
    link.download = `${book.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="book-reader">
      <div className="reader-header">
        <button onClick={() => navigate("/scriptures")} className="back-button">
          ← Back to Library
        </button>
        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>
        </div>
        <button onClick={handleDownload} className="download-button">
          📥 Download PDF
        </button>
      </div>

      <div className="reader-container">
        {isLoading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Loading book...</p>
          </div>
        )}
        <iframe
          src={book.pdfPath}
          className="pdf-viewer"
          title={book.title}
          onLoad={() => setIsLoading(false)}
        />
      </div>

      <div className="reader-footer">
        <p>Reading: {book.title}</p>
        <p>Use browser controls to navigate pages</p>
      </div>
    </div>
  );
};

export default BookReader;
