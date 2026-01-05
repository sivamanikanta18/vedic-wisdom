import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './KrishnaChatbot.css';
import { questionBank } from "../data/quizQuestions";
import { SCRIPTURES_LIBRARY } from './Scriptures';

const ALL_QUIZ_QUESTIONS = [
  ...(questionBank?.easy || []),
  ...(questionBank?.medium || []),
  ...(questionBank?.hard || [])
];

const ALL_BOOK_TITLES = (SCRIPTURES_LIBRARY || [])
  .flatMap(s => s?.books || [])
  .map(b => (b?.title || '').toLowerCase())
  .filter(Boolean);

const SCRIPTURE_KEYWORDS = [
  'scripture',
  'scriptures',
  'karma',
  'dharma',
  'atma',
  'maya',
  'moksha',
  'bhakti',
  'yoga',
  'samsara',
  'reincarnation',
  'gita',
  'bhagavad',
  'bhagavad-gita',
  'bhagavatam',
  'srimad',
  'purana',
  'upanishad',
  'vedas',
  'veda',
  'shloka',
  'sloka',
  'verse',
  'purport',
  'canto',
  'chapter',
  'cc',
  'caitanya',
  'caritamrta'
];

const KrishnaChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [userName, setUserName] = useState('dear friend');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const isScriptureQuestion = (query) => {
    const q = (query || '').toLowerCase();

    if (SCRIPTURE_KEYWORDS.some(k => q.includes(k))) return true;

    return ALL_BOOK_TITLES.some(t => t.length > 6 && q.includes(t));
  };

  const getScriptureContextSnippets = (query) => {
    const base = getContextSnippets(query);
    const extra = [
      {
        text: 'The soul is eternal and is not destroyed when the body is destroyed. (Bhagavad-gita 2.20)',
        source: 'Bhagavad-gita 2.20 (summary)'
      },
      {
        text: 'Karma means action and its reactions; spiritual progress comes by acting as duty without attachment to results. (Bhagavad-gita 2.47)',
        source: 'Bhagavad-gita 2.47 (summary)'
      },
      {
        text: 'Offer your work, food, charity, and austerities as an offering to Krishna. (Bhagavad-gita 9.27)',
        source: 'Bhagavad-gita 9.27 (summary)'
      },
      {
        text: 'One who is not envious and is a kind friend to all living entities is very dear to Krishna. (Bhagavad-gita 12.13-14)',
        source: 'Bhagavad-gita 12.13-14 (summary)'
      }
    ];

    return [...base, ...extra].slice(0, 8);
  };

  const getContextSnippets = (query) => {
    const q = (query || '').toLowerCase();
    const keywords = q
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .filter(w => w.length >= 4)
      .slice(0, 12);

    const scored = ALL_QUIZ_QUESTIONS
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

  // Check authentication and get user name
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user name from localStorage
    const userStr = localStorage.getItem('user');
    let name = 'dear friend';
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        name = user.name || 'dear friend';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    setUserName(name);

    // Add welcome message from Krishna with user's name
    setMessages([{
      role: 'krishna',
      content: `Hare Krishna, ${name}! 🙏

I am Lord Krishna, and I am here to be your companion on this spiritual journey. You can share anything with Me - your joys, your sorrows, your questions, or simply how your day went.

Whether you seek guidance from the Bhagavad Gita, need encouragement during difficult times, or just want to talk, I am here to listen and guide you with love and wisdom.

How are you feeling today, My dear devotee? 💙`,
      timestamp: new Date().toISOString()
    }]);
  }, [navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);

    setIsLoading(true);

    // Read token once so fallback can use it as well
    const token = localStorage.getItem('authToken');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const forceScriptureOnly = isScriptureQuestion(userMessage);

    try {
      // Primary: AI endpoint
      const response = await fetch(`${API_URL}/chatbot-ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          userName: userName,
          forceScriptureOnly,
          contextSnippets: forceScriptureOnly ? getScriptureContextSnippets(userMessage) : getContextSnippets(userMessage)
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add Krishna's response to chat
        const krishnaMessage = {
          role: 'krishna',
          content: data.response,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, krishnaMessage]);
        setConversationId(data.conversationId);
        setIsLoading(false);
        return;
      }

      // If AI endpoint returned an error, fall through to fallback
      console.warn('AI endpoint returned an error, falling back to rule-based chatbot:', data.message || data);
    } catch (error) {
      console.warn('AI endpoint request failed, attempting rule-based fallback:', error.message || error);
    }

    // Fallback: rule-based chatbot endpoint
    try {
      const fbResponse = await fetch(`${API_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          userName: userName
        })
      });

      const fbData = await fbResponse.json();
      if (fbData.success) {
        const krishnaMessage = {
          role: 'krishna',
          content: fbData.response,
          timestamp: fbData.timestamp
        };
        setMessages(prev => [...prev, krishnaMessage]);
        setConversationId(fbData.conversationId);
      } else {
        throw new Error(fbData.message || 'Fallback chatbot failed');
      }
    } catch (fallbackError) {
      console.error('Chat error (both AI and fallback failed):', fallbackError);
      let errorMessage = `Error: ${fallbackError.message}\n\nSorry, I am having trouble connecting right now. Please check the console for details. 🙏`;
      if (fallbackError.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on port 5000. 🙏';
      } else if (fallbackError.message.includes('401') || fallbackError.message.includes('token')) {
        errorMessage = 'Authentication error. Please try logging out and logging in again. 🙏';
      }

      setMessages(prev => [...prev, {
        role: 'system',
        content: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to start a new conversation with Krishna?')) {
      setMessages([{
        role: 'krishna',
        content: `Hare Krishna! 🙏 Let us begin anew. What is on your mind, dear friend? 💙`,
        timestamp: new Date().toISOString()
      }]);
      setConversationId(null);
    }
  };

  const quickPrompts = [
    "I'm feeling sad today",
    "I'm anxious about my future",
    "Tell me about the Bhagavad Gita",
    "How can I find inner peace?",
    "I'm grateful for today"
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="krishna-chatbot-page">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="krishna-avatar">
            <img src="/images/krishna_book.jpg" alt="Krishna" className="avatar-image" />
          </div>
          <div className="header-info">
            <h1>Chat with Krishna</h1>
            <p className="status">
              <span className="status-dot"></span>
              Always here for you
            </p>
          </div>
          <button onClick={clearChat} className="clear-btn" title="New Conversation">
            🔄
          </button>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'krishna' && (
                <div className="message-avatar">
                  <img src="/images/krishna_book.jpg" alt="Krishna" className="avatar-img" />
                </div>
              )}
              <div className="message-content">
                {msg.role === 'krishna' && (
                  <div className="message-sender">Krishna</div>
                )}
                <div className="message-text">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="message-avatar user-avatar">👤</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message krishna">
              <div className="message-avatar">
                <img src="/images/krishna_book.jpg" alt="Krishna" className="avatar-img" />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="quick-prompts">
            <p className="prompts-label">Quick topics to discuss:</p>
            <div className="prompts-grid">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="prompt-btn"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with Krishna..."
            className="message-input"
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>

        {/* Footer Note */}
        <div className="chatbot-footer">
          <p>💙 Krishna is here to guide you with wisdom from the Bhagavad Gita and Vedic scriptures</p>
        </div>
      </div>
    </div>
  );
};

export default KrishnaChatbot;
