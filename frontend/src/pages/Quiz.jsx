import React, { useState, useEffect } from "react";
import "./Quiz.css";
import { questionBank, shuffleArray } from "../data/quizQuestions";

const Quiz = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [askInput, setAskInput] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState("");
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    streak: 0,
    bestStreak: 0
  });
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState([]);

  // Shuffle questions when difficulty is selected
  useEffect(() => {
    if (difficulty && questionBank[difficulty]) {
      setShuffledQuestions(shuffleArray(questionBank[difficulty]));
      setAskedQuestions([]);
    }
  }, [difficulty]);

  const questions = shuffledQuestions;

  const getContextSnippets = (query) => {
    const q = (query || '').toLowerCase();
    const keywords = q
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .filter(w => w.length >= 4)
      .slice(0, 12);

    const allQuestions = [
      ...(questionBank?.easy || []),
      ...(questionBank?.medium || []),
      ...(questionBank?.hard || [])
    ];

    const scored = allQuestions
      .map((item) => {
        const hay = `${item.question || ''} ${item.explanation || ''} ${item.proof || ''} ${item.reference || ''}`.toLowerCase();
        const score = keywords.reduce((acc, kw) => (hay.includes(kw) ? acc + 1 : acc), 0);
        return { item, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ item }) => ({
        text: `${item.proof || ''}\n${item.explanation || ''}`.trim(),
        source: item.reference || 'Quiz Question Bank'
      }));

    return scored;
  };

  const askQuestion = async () => {
    const question = askInput.trim();
    if (!question || askLoading) return;

    setAskLoading(true);
    setAskError("");
    setAskAnswer("");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const response = await fetch(`${API_URL}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          contextSnippets: getContextSnippets(question)
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to get answer');
      }

      setAskAnswer(data.answer || '');
    } catch (err) {
      console.error('Ask AI error:', err);
      setAskError(err.message || 'Error generating answer');
    } finally {
      setAskLoading(false);
    }
  };

  const handleSelect = (choice) => {
    setSelected(choice);
  };

  const handleSubmit = () => {
    if (!selected) {
      alert("Please select an answer!");
      return;
    }
    setShowResult(true);
    setTotalAnswered(totalAnswered + 1);
    
    if (selected === questions[current].correct) {
      setScore(score + 1);
      setSessionStats(prev => ({
        correct: prev.correct + 1,
        incorrect: prev.incorrect,
        streak: prev.streak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.streak + 1)
      }));
    } else {
      setSessionStats(prev => ({
        correct: prev.correct,
        incorrect: prev.incorrect + 1,
        streak: 0,
        bestStreak: prev.bestStreak
      }));
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelected("");
    
    // Mark current question as asked
    const newAskedQuestions = [...askedQuestions, questions[current].question];
    setAskedQuestions(newAskedQuestions);
    
    // Get remaining unasked questions
    const remainingQuestions = questionBank[difficulty].filter(
      q => !newAskedQuestions.includes(q.question)
    );
    
    // If all questions have been asked, reset and reshuffle
    if (remainingQuestions.length === 0) {
      setShuffledQuestions(shuffleArray(questionBank[difficulty]));
      setAskedQuestions([]);
      setCurrent(0);
    } else {
      // Move to next unasked question
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        // Reshuffle remaining questions
        setShuffledQuestions(shuffleArray(remainingQuestions));
        setCurrent(0);
      }
    }
  };

  const changeLevel = () => {
    if (window.confirm("Are you sure you want to change difficulty level? Your current progress will be saved to stats.")) {
      setDifficulty(null);
      setCurrent(0);
      setSelected("");
      setShowResult(false);
      setShuffledQuestions([]);
    }
  };

  // Level Selection Screen
  if (!difficulty) {
    return (
      <main className="quiz-main">
        <div className="quiz-container">
          <div className="quiz-header">
            <h1>📚 Vedic Wisdom Quiz</h1>
            <p className="quiz-subtitle">Continuous learning journey in Krishna Consciousness</p>
          </div>

          <div className="quiz-header" style={{ marginTop: '16px' }}>
            <h2 style={{ marginBottom: '8px' }}>Ask a Question (Scripture-Based)</h2>
            <p className="quiz-subtitle" style={{ marginTop: 0 }}>
              Ask any question. Krishna will answer using the available scripture proofs in this app.
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Type your question (e.g., What is karma yoga?)"
                style={{ flex: '1 1 320px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd' }}
                disabled={askLoading}
              />
              <button
                onClick={askQuestion}
                disabled={!askInput.trim() || askLoading}
                style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', background: '#D4AF37', color: '#111', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {askLoading ? 'Thinking...' : 'Ask'}
              </button>
            </div>
            {askError && (
              <div style={{ marginTop: '10px', color: '#c33' }}>{askError}</div>
            )}
            {askAnswer && (
              <div style={{ marginTop: '12px', background: '#fff', borderRadius: '10px', padding: '12px', border: '1px solid #eee' }}>
                {askAnswer.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: '6px 0' }}>{line}</p>
                ))}
              </div>
            )}
          </div>

          <div className="difficulty-selection">
            <h2>Choose Your Learning Level</h2>
            <div className="difficulty-cards">
              <div className="difficulty-card easy" onClick={() => setDifficulty('easy')}>
                <div className="difficulty-icon">🌱</div>
                <h3>Basic Questions</h3>
                <p>Perfect for beginners</p>
                <span className="question-count">Continuous Learning</span>
              </div>
              
              <div className="difficulty-card medium" onClick={() => setDifficulty('medium')}>
                <div className="difficulty-icon">🔥</div>
                <h3>Medium Level Questions</h3>
                <p>For developing practitioners</p>
                <span className="question-count">Continuous Learning</span>
              </div>
              
              <div className="difficulty-card hard" onClick={() => setDifficulty('hard')}>
                <div className="difficulty-icon">💎</div>
                <h3>Hard Questions</h3>
                <p>For advanced students</p>
                <span className="question-count">Continuous Learning</span>
              </div>
            </div>
            
            {sessionStats.correct > 0 && (
              <div className="session-summary">
                <h3>📊 Your Session Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{sessionStats.correct}</span>
                    <span className="stat-label">Correct</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{sessionStats.incorrect}</span>
                    <span className="stat-label">Incorrect</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{sessionStats.bestStreak}</span>
                    <span className="stat-label">Best Streak</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{totalAnswered}</span>
                    <span className="stat-label">Total Answered</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // If no questions loaded yet
  if (questions.length === 0) {
    return (
      <main className="quiz-main">
        <div className="quiz-container">
          <div className="quiz-header">
            <h1>Loading Questions...</h1>
          </div>
        </div>
      </main>
    );
  }

  // Quiz Question Screen
  return (
    <main className="quiz-main">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="header-top">
            <button className="back-btn" onClick={changeLevel}>← Change Level</button>
            <span className={`difficulty-badge ${difficulty}`}>{difficulty.toUpperCase()} LEVEL</span>
          </div>
          <div className="quiz-stats-bar">
            <div className="stat-mini">
              <span className="stat-mini-label">Questions Answered:</span>
              <span className="stat-mini-value">{totalAnswered}</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-label">Correct:</span>
              <span className="stat-mini-value correct">{sessionStats.correct}</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-label">Incorrect:</span>
              <span className="stat-mini-value incorrect">{sessionStats.incorrect}</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-label">Current Streak:</span>
              <span className="stat-mini-value streak">🔥 {sessionStats.streak}</span>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-label">Best Streak:</span>
              <span className="stat-mini-value">⭐ {sessionStats.bestStreak}</span>
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="question-indicator">
          <span>Question {totalAnswered + 1}</span>
        </div>

        <div className="question-card">
          <h2 className="question-text">{questions[current].question}</h2>

          <div style={{ marginTop: '14px', marginBottom: '12px', padding: '12px', borderRadius: '10px', border: '1px solid #eee', background: '#fff' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Ask Krishna about this topic</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask any question from scriptures..."
                style={{ flex: '1 1 320px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd' }}
                disabled={askLoading}
              />
              <button
                onClick={askQuestion}
                disabled={!askInput.trim() || askLoading}
                style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', background: '#D4AF37', color: '#111', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {askLoading ? 'Thinking...' : 'Ask'}
              </button>
            </div>
            {askError && (
              <div style={{ marginTop: '10px', color: '#c33' }}>{askError}</div>
            )}
            {askAnswer && (
              <div style={{ marginTop: '12px' }}>
                {askAnswer.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: '6px 0' }}>{line}</p>
                ))}
              </div>
            )}
          </div>
          
          <div className="choices-container">
            {questions[current].choices.map((choice, index) => (
              <label
                key={index}
                className={`choice-label ${
                  showResult
                    ? choice === questions[current].correct
                      ? "correct"
                      : choice === selected
                      ? "incorrect"
                      : ""
                    : selected === choice
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="choice"
                  value={choice}
                  checked={selected === choice}
                  onChange={() => handleSelect(choice)}
                  disabled={showResult}
                />
                <span className="choice-text">{choice}</span>
                {showResult && choice === questions[current].correct && (
                  <span className="choice-icon">✓</span>
                )}
                {showResult && choice === selected && choice !== questions[current].correct && (
                  <span className="choice-icon">✗</span>
                )}
              </label>
            ))}
          </div>

          {!showResult && (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Answer
            </button>
          )}

          {showResult && (
            <div className="result-section">
              <div className={`result-banner ${selected === questions[current].correct ? 'correct' : 'incorrect'}`}>
                {selected === questions[current].correct ? (
                  <span>✓ Correct!</span>
                ) : (
                  <span>✗ Incorrect</span>
                )}
              </div>

              <div className="explanation-box">
                <h3>📖 Explanation</h3>
                <p>{questions[current].explanation}</p>
              </div>

              <div className="proof-box">
                <h3>📜 Scriptural Proof</h3>
                <blockquote>{questions[current].proof}</blockquote>
                <p className="reference">
                  <strong>Reference:</strong> {questions[current].reference}
                </p>
              </div>

              <button className="next-btn" onClick={handleNext}>
                Next Question →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Quiz;
