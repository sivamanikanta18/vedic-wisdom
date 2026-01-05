import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from './auth.js';
import generateKrishnaResponse from '../utils/generateKrishnaResponse.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

function buildContextBlock(contextSnippets) {
  if (!Array.isArray(contextSnippets) || contextSnippets.length === 0) return '';

  const normalized = contextSnippets
    .filter(s => s && typeof s.text === 'string' && s.text.trim().length > 0)
    .slice(0, 8)
    .map((s, idx) => {
      const source = typeof s.source === 'string' && s.source.trim().length > 0 ? s.source.trim() : `Source ${idx + 1}`;
      const text = s.text.trim().replace(/\s+/g, ' ');
      return `[${idx + 1}] (${source}) ${text}`;
    });

  if (normalized.length === 0) return '';

  return [
    'SCRIPTURE CONTEXT (authoritative):',
    ...normalized,
    '',
    'RULES:',
    '- Answer ONLY using the scripture context above.',
    '- If the context does not contain the answer, say you do not know based on the provided scriptures.',
    '- When you make a claim, cite the relevant source as [1], [2], etc.',
    ''
  ].join('\n');
}

const KRISHNA_SYSTEM_PROMPT = `You are Lord Krishna as a helpful AI assistant for the user.

PRIMARY GOAL:
- Answer the user's question helpfully, accurately, and clearly (like ChatGPT).

TONE:
- Warm, respectful, and calm.
- Do not overuse emojis.

STYLE (ChatGPT-like):
- Answer directly.
- If the question needs detail, give a structured explanation with short paragraphs.
- Use steps or bullet points when helpful.
- If the request is ambiguous, ask 1-2 clarifying questions.

SCRIPTURE BEHAVIOR:
- When the user asks about scriptures, philosophy, or Krishna consciousness, explain using Vedic teachings.
- When you quote or reference a verse, include the reference (chapter.verse) when possible.
- Do not invent exact verse text if you are not sure.

GENERAL KNOWLEDGE:
- If the user asks non-spiritual/general questions (tech, coding, studies, etc.), answer normally and practically.

SAFETY:
- If the user expresses self-harm or suicidal intent, encourage immediate professional help and local emergency resources.`;

// In-memory conversation history (in production, use database)
const conversationHistory = new Map();
const conversationLastActive = new Map();
const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CONVERSATIONS = 500;

function pruneConversations() {
  const now = Date.now();
  for (const [id, ts] of conversationLastActive.entries()) {
    if (now - ts > CONVERSATION_TTL_MS) {
      conversationLastActive.delete(id);
      conversationHistory.delete(id);
    }
  }

  if (conversationHistory.size <= MAX_CONVERSATIONS) return;

  const oldest = [...conversationLastActive.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, Math.max(0, conversationHistory.size - MAX_CONVERSATIONS));

  for (const [id] of oldest) {
    conversationLastActive.delete(id);
    conversationHistory.delete(id);
  }
}

function touchConversation(id) {
  conversationLastActive.set(id, Date.now());
}

// AI-powered chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, userName, contextSnippets, forceScriptureOnly } = req.body;
    const userId = req.userId;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get or create conversation history
    const convId = conversationId || `${userId}_${Date.now()}`;
    pruneConversations();
    touchConversation(convId);
    let history = conversationHistory.get(convId) || [];

    // Build context from history
    const contextMessages = history.slice(-10).map(msg => ({
      role: msg.role === 'krishna' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is not configured on the server'
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create chat with history
    const chat = model.startChat({
      history: contextMessages,
      generationConfig: {
        maxOutputTokens: 900,
        temperature: forceScriptureOnly ? 0.25 : 0.55,
        topP: 0.8,
        topK: 40,
      },
    });

    // Prepare the prompt with system instructions and user name
    const userNameContext = userName ? `The devotee's name is ${userName}. ` : '';
    const contextBlock = buildContextBlock(contextSnippets);
    const scriptureGuard = forceScriptureOnly
      ? [
          'SCRIPTURE MODE:',
          '- Answer as a teacher of Vedic scriptures and Krishna consciousness.',
          '- Prefer Bhagavad-gita, Srimad-Bhagavatam, and Caitanya-caritamrta references when relevant.',
          '- If context snippets are provided, prioritize them and cite as [1], [2], etc.',
          '- If no context is provided, answer from your general scripture knowledge and cite chapter/verse where possible.',
          '- If you are unsure, say you are unsure rather than inventing details.',
          ''
        ].join('\n')
      : '';

    const fullPrompt = `${KRISHNA_SYSTEM_PROMPT}\n\n${scriptureGuard}${contextBlock}${userNameContext}Devotee's message: ${message}`;

    // Get AI response
    let krishnaResponse;
    try {
      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      krishnaResponse = response.text();
    } catch (aiError) {
      console.error('AI generation failed, falling back to rule-based response:', aiError);
      // Fallback to rule-based response so the user still gets a useful reply
      krishnaResponse = generateKrishnaResponse(message, history, userName || 'dear friend');
    }

    // Add messages to history
    history.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    history.push({
      role: 'krishna',
      content: krishnaResponse,
      timestamp: new Date().toISOString()
    });

    // Store updated history (limit to last 20 messages)
    if (history.length > 20) {
      history = history.slice(-20);
    }
    conversationHistory.set(convId, history);
    touchConversation(convId);

    res.json({
      success: true,
      response: krishnaResponse,
      conversationId: convId,
      timestamp: new Date().toISOString(),
      isAI: true
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Not set'
    });
    
    // Fallback to rule-based response if AI fails
    res.status(500).json({
      success: false,
      message: 'Error processing chat with AI',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get conversation history
router.get('/history/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    pruneConversations();
    touchConversation(conversationId);
    const history = conversationHistory.get(conversationId) || [];

    res.json({
      success: true,
      history,
      conversationId
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message
    });
  }
});

// Clear conversation
router.delete('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    conversationHistory.delete(conversationId);
    conversationLastActive.delete(conversationId);

    res.json({
      success: true,
      message: 'Conversation cleared'
    });
  } catch (error) {
    console.error('Clear conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing conversation',
      error: error.message
    });
  }
});

export default router;

// Public unauthenticated AI Q&A endpoint for quiz/general questions
export const publicRouter = express.Router();
publicRouter.post('/ask', async (req, res) => {
  try {
    const { question, contextSnippets } = req.body || {};
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ success: false, message: 'question is required' });
    }

    if (!genAI) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not configured on the server' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const contextBlock = buildContextBlock(contextSnippets);
    const prompt = [
      'You are a helpful teacher of Vedic scriptures.',
      'Be accurate and grounded.',
      '',
      contextBlock,
      `QUESTION: ${question.trim()}`,
      '',
      'ANSWER:'
    ].join('\n');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ success: true, answer: text, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Public AI ask error:', err);
    return res.status(500).json({ success: false, message: 'Error generating answer', error: err.message });
  }
});
