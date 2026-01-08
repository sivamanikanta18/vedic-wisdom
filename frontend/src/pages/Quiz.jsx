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
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    streak: 0,
    bestStreak: 0
  });
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Shuffle questions when difficulty is selected
  useEffect(() => {
    const load = async () => {
      if (!difficulty || !questionBank[difficulty]) return;

      setQuizError('');

      setQuizLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const resp = await fetch(`${API_URL}/ai/generate-quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            difficulty,
            count: 10
          })
        });

        clearTimeout(timeoutId);

        const data = await resp.json();
        if (!resp.ok || !data.success || !Array.isArray(data.questions)) {
          throw new Error(data.message || 'Failed to generate quiz questions');
        }

        setShuffledQuestions(shuffleArray(data.questions));
      } catch (err) {
        console.error('AI quiz generation error:', err);
        const isTimeout = err?.name === 'AbortError' || /aborted|timeout/i.test(err?.message || '');
        setQuizError(
          isTimeout
            ? 'AI is taking too long. Using built-in questions for now.'
            : (err.message || 'Failed to generate AI quiz. Using built-in questions.')
        );
        setShuffledQuestions(shuffleArray(questionBank[difficulty]));
      } finally {
        setQuizLoading(false);
      }
    };

    load();
  }, [difficulty]);

  const questions = shuffledQuestions;

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

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }

    // Restart the session with a fresh shuffle
    setShuffledQuestions(shuffleArray(questions));
    setCurrent(0);
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

          <div className="difficulty-selection">
            <h2>Choose Your Learning Level</h2>
            {quizError && (
              <div style={{ marginTop: '10px', color: '#c33' }}>{quizError}</div>
            )}
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
            <h1>{quizLoading ? 'Generating Questions...' : 'Loading Questions...'}</h1>
            {quizError && (
              <div style={{ marginTop: '10px', color: '#c33' }}>{quizError}</div>
            )}
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
