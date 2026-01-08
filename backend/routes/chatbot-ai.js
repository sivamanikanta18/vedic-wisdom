import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from './auth.js';
import generateKrishnaResponse from '../utils/generateKrishnaResponse.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure env variables are loaded
dotenv.config();

const router = express.Router();

const quizCache = new Map();
const QUIZ_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_QUIZ_CACHE_ITEMS = 60;

function getQuizCacheKey({ level, safeTopic, safeCount }) {
  return `${level}::${safeCount}::${safeTopic.toLowerCase()}`;
}

function getCachedQuiz(key) {
  const entry = quizCache.get(key);
  if (!entry) return null;
  const ageMs = Date.now() - entry.ts;
  if (ageMs > QUIZ_CACHE_TTL_MS) return null;
  return { ...entry, ageMs };
}

function setCachedQuiz(key, value) {
  quizCache.set(key, { ...value, ts: Date.now() });

  if (quizCache.size <= MAX_QUIZ_CACHE_ITEMS) return;
  const oldest = [...quizCache.entries()].sort((a, b) => a[1].ts - b[1].ts).slice(0, quizCache.size - MAX_QUIZ_CACHE_ITEMS);
  for (const [k] of oldest) quizCache.delete(k);
}

function getLlmConfig(req) {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const origin = req?.get?.('origin');
  const referer = process.env.OPENROUTER_REFERER || origin || 'http://localhost:5173';
  const title = process.env.OPENROUTER_TITLE || 'VEDIC';

  if (openRouterApiKey) {
    return {
      provider: 'openrouter',
      apiKey: openRouterApiKey,
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
      baseUrl: 'https://openrouter.ai/api/v1',
      extraHeaders: {
        'HTTP-Referer': referer,
        'X-Title': title
      }
    };
  }

  if (openAiApiKey) {
    return {
      provider: 'openai',
      apiKey: openAiApiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      baseUrl: 'https://api.openai.com/v1',
      extraHeaders: {}
    };
  }

  if (geminiApiKey) {
    return {
      provider: 'gemini',
      apiKey: geminiApiKey,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      baseUrl: null,
      extraHeaders: {}
    };
  }

  return {
    provider: 'none',
    apiKey: null,
    model: null,
    baseUrl: null,
    extraHeaders: {}
  };
}

function buildPlaintextPrompt(messages) {
  return (messages || [])
    .filter(m => m && typeof m.content === 'string')
    .map(m => {
      const role = m.role === 'system' ? 'SYSTEM' : m.role === 'assistant' ? 'ASSISTANT' : 'USER';
      return `${role}: ${m.content}`;
    })
    .join('\n\n');
}

function tryParseJson(text) {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function stripCodeFences(text) {
  if (typeof text !== 'string') return '';
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return (match?.[1] || text).trim();
}

function parseFirstJsonBlock(text) {
  if (typeof text !== 'string') return null;
  const s = stripCodeFences(text);

  const direct = tryParseJson(s);
  if (direct !== null) return direct;

  const starts = [];
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (ch === '{' || ch === '[') starts.push(i);
  }

  for (const start of starts) {
    let inString = false;
    let escape = false;
    let depth = 0;
    const opening = s[start];
    const closing = opening === '{' ? '}' : ']';

    for (let i = start; i < s.length; i += 1) {
      const ch = s[i];

      if (inString) {
        if (escape) {
          escape = false;
          continue;
        }
        if (ch === '\\') {
          escape = true;
          continue;
        }
        if (ch === '"') {
          inString = false;
        }
        continue;
      }

      if (ch === '"') {
        inString = true;
        continue;
      }

      if (ch === opening) depth += 1;
      if (ch === closing) depth -= 1;

      if (depth === 0) {
        const candidate = s.slice(start, i + 1);
        const parsed = tryParseJson(candidate);
        if (parsed !== null) return parsed;
        break;
      }
    }
  }

  return null;
}

function extractFirstJsonValue(text) {
  return parseFirstJsonBlock(text);
}

function withTimeout(promise, ms, label) {
  const timeoutMs = Number.isFinite(ms) ? ms : 30000;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        const err = new Error(`${label || 'Request'} timed out after ${timeoutMs}ms`);
        err.blockFallback = true;
        reject(err);
      }, timeoutMs);
    })
  ]);
}

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timeoutMs = Number.isFinite(ms) ? ms : 30000;
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err?.name === 'AbortError') {
      const e = new Error(`Request timed out after ${timeoutMs}ms`);
      e.blockFallback = true;
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

async function callLlmChat(llm, { messages, maxTokens, temperature, topP }) {
  if (!llm?.apiKey) {
    const err = new Error('API key not configured');
    err.blockFallback = true;
    throw err;
  }

  if (llm.provider === 'gemini') {
    const genAI = new GoogleGenerativeAI(llm.apiKey);
    const model = genAI.getGenerativeModel({
      model: llm.model,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
        topP
      }
    });
    const prompt = buildPlaintextPrompt(messages);
    const result = await withTimeout(model.generateContent(prompt), 30000, 'Gemini');
    return result.response.text();
  }

  const llmResponse = await fetchWithTimeout(
    `${llm.baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llm.apiKey}`,
        ...llm.extraHeaders
      },
      body: JSON.stringify({
        model: llm.model,
        messages,
        max_tokens: maxTokens,
        temperature,
        top_p: topP
      })
    },
    30000
  );

  const responseData = await llmResponse.json();
  if (!llmResponse.ok) {
    const rawMessage = responseData?.error?.message || responseData?.message || JSON.stringify(responseData);
    const err = new Error(rawMessage);
    err.statusCode = llmResponse.status;
    const messageText = (rawMessage || '').toString();
    const isOpenRouterNoEndpoint =
      llm.provider === 'openrouter' &&
      llmResponse.status === 404 &&
      /no endpoints found/i.test(messageText);
    if ([400, 401, 402, 403, 429].includes(llmResponse.status) || isOpenRouterNoEndpoint) {
      err.blockFallback = true;
    }
    throw err;
  }

  return responseData.choices[0].message.content;
}

console.log('🔑 Initializing chatbot-ai routes...');
const bootConfig = getLlmConfig({ get: () => undefined });
console.log('LLM Provider:', bootConfig.provider);
console.log('LLM API Key Set:', !!bootConfig.apiKey);
console.log('LLM API Key Prefix:', bootConfig.apiKey ? `${bootConfig.apiKey.substring(0, 8)}...` : 'NOT SET');

// Test endpoint (no authentication required)
router.get('/test', async (req, res) => {
  try {
    const llm = getLlmConfig(req);
    console.log('🧪 Testing API connection...', { provider: llm.provider, model: llm.model, apiKeySet: !!llm.apiKey });

    if (!llm.apiKey) {
      return res.status(500).json({
        success: false,
        message: 'API key not configured (set OPENROUTER_API_KEY or OPENAI_API_KEY / GEMINI_API_KEY)',
        apiKeySet: false
      });
    }

    console.log('✅ API Test Successful!');
    const text = await callLlmChat(llm, {
      messages: [{ role: 'user', content: 'Say "API connection successful"' }],
      maxTokens: 120,
      temperature: 0.2,
      topP: 0.8
    });
    return res.json({
      success: true,
      message: 'API connection successful',
      response: text,
      provider: llm.provider,
      model: llm.model
    });
  } catch (error) {
    console.error('🔴 Test endpoint error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

// Apply authentication middleware to all routes after test endpoint
router.use(verifyToken);

function buildContextBlock(contextSnippets, { strict } = {}) {
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

  if (strict) {
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

  return [
    'OPTIONAL CONTEXT (may help):',
    ...normalized,
    '',
    'RULES:',
    '- Use the context only if it is relevant; otherwise ignore it.',
    '- You may answer from your general knowledge if the context is not relevant or incomplete.',
    '- If you use a fact from the context, cite it as [1], [2], etc.',
    ''
  ].join('\n');
}

function normalizeAssistantText(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^\s*(direct answer|key points|practical steps)\s*:\s*/gim, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const KRISHNA_SYSTEM_PROMPT = `You are "Ask Sastra" — an AI assistant that answers using wisdom from the Bhagavad-gita and other Vedic scriptures.

IMPORTANT IDENTITY RULE:
- Do NOT claim you are Krishna, God, or a real spiritual master.
- Speak as a humble guide presenting scripture-based guidance.
- You may greet with "Hare Krishna".

IMPORTANT - ALWAYS RESPOND TO THE ACTUAL QUESTION ASKED:
- Listen carefully to what the user is asking
- Answer SPECIFICALLY about the topic they asked about
- Do not give generic or template responses
- Each question deserves a unique, thoughtful answer based on its specific content

PRIMARY GOAL:
- Answer the user's question helpfully, accurately, and clearly (like ChatGPT).
- Always tailor your response to the specific question being asked.

TONE:
- Warm, respectful, and calm.
- Use emojis sparingly (🙏, 💙, ✨, 🌟)

STYLE (ChatGPT-like):
- Answer directly to the question asked.
- If the question needs detail, give a structured explanation with short paragraphs.
- Use steps or bullet points when helpful.
- If the request is ambiguous, ask 1-2 clarifying questions.

FORMAT (very important):
- Keep paragraphs short (1-2 lines each).
- Prefer a simple flow without labels/headings:
  1) Start answering immediately in 1-2 lines
  2) If needed, add a neat list (use "- " bullets)
  3) If needed, add 1-3 practical steps as bullets
- Avoid repeating the same sentence.
- Do not use Markdown code blocks or long walls of text.
- Do not use markdown bold like **text**.
- Do not add labels like "Direct answer:", "Key points:", or "Practical steps:".
- Emojis: use at most 0-1 per message.

SCRIPTURE BEHAVIOR:
- When the user asks about scriptures, philosophy, or Krishna consciousness, explain using Vedic teachings.
- When you quote or reference a verse, include the reference (chapter.verse) when possible.
- Do not invent exact verse text if you are not sure.
- Cite scripture context provided above when relevant.

EXAMPLES OF SPECIFIC RESPONSES:
- If asked "what is karma" → Explain karma specifically, not general life advice
- If asked "how to meditate" → Give meditation techniques, not general tips
- If asked "what is moksha" → Explain liberation/moksha concept specifically
- If asked about a relationship → Address their specific situation, not generic advice

GENERAL KNOWLEDGE:
- If the user asks non-spiritual/general questions (tech, coding, studies, etc.), answer normally and practically.
- If the user shares personal problems (stress, anxiety, fear, relationships, loneliness, failure, confusion, anger, habits), ALWAYS respond with Krishna-conscious spiritual guidance:
  - Give a calm spiritual framing (soul vs mind/body, karma-yoga, bhakti, surrender, duty without attachment).
  - Give 3-6 practical steps (chanting, prayer, reading Gita, small discipline, service, association, journaling, breath).
  - When relevant, include 1-2 scripture references (e.g., BG 2.47, 2.13, 2.20, 6.5, 6.47, 9.27, 12.13-14).
  - Be compassionate and non-judgmental; ask 1 clarifying question if needed.

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

    const llm = getLlmConfig(req);

    console.log('📨 Chat request received:', {
      message: message.substring(0, 50),
      userId,
      provider: llm.provider,
      model: llm.model,
      apiKeySet: !!llm.apiKey
    });

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

    if (!llm.apiKey) {
      console.error('❌ API Key not configured');
      return res.status(500).json({
        success: false,
        message: 'API key not configured on the server (set OPENROUTER_API_KEY or OPENAI_API_KEY / GEMINI_API_KEY)'
      });
    }

    // Prepare the user message with context
    const userNameContext = userName ? `The devotee's name is ${userName}. ` : '';
    const contextBlock = buildContextBlock(contextSnippets, { strict: !!forceScriptureOnly });
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

    const systemPrompt = `${KRISHNA_SYSTEM_PROMPT}

Previous conversation context:
${history.map(h => `${h.role === 'krishna' ? 'Krishna' : 'Devotee'}: ${h.content.substring(0, 100)}...`).join('\n')}`;

    const enhancedMessage = `${scriptureGuard}${contextBlock}${userNameContext}${message}`;

    // Build messages for OpenAI API
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add previous conversation history
    history.forEach(msg => {
      messages.push({
        role: msg.role === 'krishna' ? 'assistant' : 'user',
        content: msg.content
      });
    });

    messages.push({ role: 'user', content: enhancedMessage });

    // Call LLM API (Gemini / OpenRouter / OpenAI)
    let krishnaResponse;
    let usedFallback = false;
    try {
      console.log(`🔄 Calling ${llm.provider} API...`);
      krishnaResponse = await callLlmChat(llm, {
        messages,
        maxTokens: 900,
        temperature: forceScriptureOnly ? 0.2 : 0.4,
        topP: 0.8
      });
      krishnaResponse = normalizeAssistantText(krishnaResponse);
      console.log(`✅ Got response from ${llm.provider}:`, krishnaResponse.substring(0, 100));
    } catch (aiError) {
      console.error('❌ AI generation failed:', aiError.message);
      // Fall back to rule-based response so user still gets a useful reply
      usedFallback = true;
      krishnaResponse = generateKrishnaResponse(message, history, userName || 'dear friend');
      console.log('📋 Using fallback rule-based response');
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
      isAI: !usedFallback
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY ? 'Set' : 'Not set'
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
    const llm = getLlmConfig(req);
    console.log('📨 Public ask request:', {
      question: question?.substring(0, 50),
      provider: llm.provider,
      model: llm.model,
      apiKeySet: !!llm.apiKey
    });

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ success: false, message: 'question is required' });
    }

    if (!llm.apiKey) {
      console.error('❌ API Key not configured for public ask');
      return res.status(500).json({ success: false, message: 'API key not configured on the server (set OPENROUTER_API_KEY or OPENAI_API_KEY / GEMINI_API_KEY)' });
    }

    const contextBlock = buildContextBlock(contextSnippets, { strict: false });
    const systemPrompt = 'You are a helpful teacher of Vedic scriptures. Be accurate and grounded. Provide context-specific answers based on the question asked.';
    const userPrompt = [
      contextBlock,
      `QUESTION: ${question.trim()}`,
      '',
      'Provide a comprehensive answer based on the question asked and any provided scripture context.'
    ].join('\n');

    try {
      console.log(`🔄 Calling ${llm.provider} API for public ask...`);
      const text = await callLlmChat(llm, {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        maxTokens: 500,
        temperature: 0.4,
        topP: 0.8
      });
      console.log(`✅ Got response from ${llm.provider}`);
      return res.json({ success: true, answer: normalizeAssistantText(text), timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('❌ Public AI ask error:', err.message);
      if (err && err.blockFallback) {
        return res.status(err.statusCode || 500).json({
          success: false,
          message: `AI is unavailable (${llm.provider}: API key / quota / billing / model issue).`,
          error: err.message,
          statusCode: err.statusCode || 500,
          blockFallback: true
        });
      }
      return res.status(500).json({ success: false, message: 'Error generating answer', error: err.message });
    }
  } catch (err) {
    console.error('Public AI ask request error:', err);
    return res.status(500).json({ success: false, message: 'Error processing request', error: err.message });
  }
});

publicRouter.post('/generate-quiz', async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body || {};
    const llm = getLlmConfig(req);

    const normalizedDifficulty = typeof difficulty === 'string' ? difficulty.toLowerCase() : '';
    const allowed = new Set(['easy', 'medium', 'hard']);
    const level = allowed.has(normalizedDifficulty) ? normalizedDifficulty : 'easy';
    const n = Number.isFinite(Number(count)) ? Math.floor(Number(count)) : 10;
    const safeCount = Math.min(25, Math.max(5, n));
    const safeTopic = typeof topic === 'string' && topic.trim().length > 0 ? topic.trim().slice(0, 120) : 'Vedic wisdom and Krishna consciousness';

    const cacheKey = getQuizCacheKey({ level, safeTopic, safeCount });
    const cached = getCachedQuiz(cacheKey);
    if (cached?.questions?.length) {
      return res.json({
        success: true,
        questions: cached.questions,
        provider: cached.provider,
        model: cached.model,
        cached: true,
        cachedAgeMs: cached.ageMs,
        timestamp: new Date().toISOString()
      });
    }

    if (!llm.apiKey) {
      return res.status(500).json({
        success: false,
        message: 'API key not configured on the server (set OPENROUTER_API_KEY or OPENAI_API_KEY / GEMINI_API_KEY)'
      });
    }

    const systemPrompt = 'You create high-quality multiple-choice quiz questions. Output ONLY valid JSON (no markdown) that matches the required schema.';
    const userPrompt = [
      `Generate ${safeCount} ${level} multiple-choice quiz questions about: ${safeTopic}.`,
      '',
      'Return a JSON array. Each item must be an object with keys:',
      '- question (string)',
      '- choices (array of 4 strings)',
      '- correct (string; must exactly equal one of choices)',
      '- explanation (string; 1-3 sentences)',
      '- proof (string; if unsure about exact verse text, paraphrase and say it is a summary)',
      '- reference (string; e.g., "Bhagavad-gita 2.47" or "Srimad-Bhagavatam 1.2.6")',
      '',
      'Strict rules:',
      '- The JSON must be parseable by JSON.parse.',
      '- No extra keys.',
      '- No trailing commas.',
      '- Do not wrap in ```',
      '- Avoid repeating questions.'
    ].join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    let parsed;
    try {
      let text = await callLlmChat(llm, {
        messages,
        maxTokens: 1400,
        temperature: 0.5,
        topP: 0.9
      });

      parsed = extractFirstJsonValue(text);
      if (!Array.isArray(parsed)) {
        const retrySystem = 'Return ONLY a valid JSON array. No markdown, no commentary, no code fences.';
        const retryUser = [
          userPrompt,
          '',
          'FINAL REMINDER: Output must start with [ and end with ].'
        ].join('\n');

        text = await callLlmChat(llm, {
          messages: [
            { role: 'system', content: retrySystem },
            { role: 'user', content: retryUser }
          ],
          maxTokens: 1600,
          temperature: 0.2,
          topP: 0.8
        });
        parsed = extractFirstJsonValue(text);
      }
    } catch (e) {
      const cachedOnError = getCachedQuiz(cacheKey);
      if (cachedOnError?.questions?.length) {
        return res.json({
          success: true,
          questions: cachedOnError.questions,
          provider: cachedOnError.provider,
          model: cachedOnError.model,
          cached: true,
          cachedAgeMs: cachedOnError.ageMs,
          timestamp: new Date().toISOString()
        });
      }
      throw e;
    }

    if (!Array.isArray(parsed)) {
      const cachedOnInvalid = getCachedQuiz(cacheKey);
      if (cachedOnInvalid?.questions?.length) {
        return res.json({
          success: true,
          questions: cachedOnInvalid.questions,
          provider: cachedOnInvalid.provider,
          model: cachedOnInvalid.model,
          cached: true,
          cachedAgeMs: cachedOnInvalid.ageMs,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(502).json({
        success: false,
        message: 'AI returned invalid quiz JSON. Please try again.',
        error: 'Invalid JSON from model'
      });
    }

    const questions = parsed
      .filter(q => q && typeof q === 'object')
      .map(q => ({
        question: typeof q.question === 'string' ? q.question : '',
        choices: Array.isArray(q.choices) ? q.choices.map(String).slice(0, 4) : [],
        correct: typeof q.correct === 'string' ? q.correct : '',
        explanation: typeof q.explanation === 'string' ? q.explanation : '',
        proof: typeof q.proof === 'string' ? q.proof : '',
        reference: typeof q.reference === 'string' ? q.reference : ''
      }))
      .filter(q => q.question && q.choices.length === 4 && q.choices.includes(q.correct));

    if (questions.length === 0) {
      const cachedOnValidation = getCachedQuiz(cacheKey);
      if (cachedOnValidation?.questions?.length) {
        return res.json({
          success: true,
          questions: cachedOnValidation.questions,
          provider: cachedOnValidation.provider,
          model: cachedOnValidation.model,
          cached: true,
          cachedAgeMs: cachedOnValidation.ageMs,
          timestamp: new Date().toISOString()
        });
      }

      return res.status(502).json({
        success: false,
        message: 'AI returned quiz questions, but validation failed. Please try again.',
        error: 'No valid questions after validation'
      });
    }

    setCachedQuiz(cacheKey, { questions, provider: llm.provider, model: llm.model });
    return res.json({
      success: true,
      questions,
      provider: llm.provider,
      model: llm.model,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Quiz generation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error generating quiz questions',
      error: err.message
    });
  }
});
