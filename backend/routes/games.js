import express from 'express';
import User from '../models/User.js';
import { verifyToken } from './auth.js';

const router = express.Router();

const DEFAULT_WORDS = [
  'KRISHNA',
  'KRSNA',
  'GOVINDA',
  'GOVIND',
  'GOPALA',
  'GOPAL',
  'HARI',
  'RAMA',
  'RAM',
  'RADHA',
  'MADHAVA',
  'MADHUSUDANA',
  'MUKUNDA',
  'DAMODARA',
  'JANARDANA',
  'KESHAVA',
  'KESAVA',
  'VISHNU',
  'NARAYANA',
  'NARAYAN',
  'VASUDEVA',
  'VASUDEV',
  'BALARAMA',
  'BALARAM',
  'BALARAMA',
  'SANKARSHANA',
  'SANKARSANA',
  'PRADYUMNA',
  'ANIRUDDHA',
  'ANIRUDHA',
  'HRISHIKESHA',
  'HRSIKESA',
  'NRSIMHA',
  'NARASIMHA',
  'VARAHA',
  'VAMANA',
  'TRIVIKRAMA',
  'KURMA',
  'MATSYA',
  'KALKI',
  'JAGANNATH',
  'JAGANNATHA',
  'VITHOBA',
  'VITHOBAA',
  'PANDURANGA',
  'SHYAMA',
  'SHYAM',
  'GHANASHYAMA',
  'GIRIDHARI',
  'GIRDHARI',
  'MURLIDHARA',
  'MURALIDHARA',
  'MURALI',
  'RANCHOD',
  'RANCHHOD',
  'RANCHHODRAI',
  'DWARKADHISH',
  'DWARKADHISHA',
  'DWARKANATH',
  'PARTHASARATHI',
  'PARTHASARATHY',
  'GADADHARA',
  'GADADHAR',
  'YADUNANDANA',
  'YADUNANDAN',
  'NANDANANDANA',
  'NANDANANDAN',
  'NANDALALA',
  'NANDLAL',
  'KUNJABIHARI',
  'KUNJBIHARI',
  'BANKBIHARI',
  'BANKIHARI',
  'BANKIMBIHARI',
  'BANKIM',
  'RUKMINI',
  'RUKMINIDEVI',
  'SITA',
  'LAKSHMI',
  'LAXMI',
  'MAHALAKSHMI',
  'MAHALAXMI',
  'SRIRADHA',
  'RADHARANI',
  'RADHIKA',
  'VRINDAVANESHWARI',
  'VRINDAVANESVARI',
  'KISHORI',
  'LALITA',
  'VISAKHA',
  'VISHKHA',
  'TULASI',
  'TULSIDAAS',
  'GAURANGA',
  'GAURANG',
  'CHAITANYA',
  'NITAI',
  'NITYANANDA',
  'NITYANAND',
  'ADVAITA',
  'GADADHAR',
  'SRIVASA',
  'SRINIVASA'
];

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function normalizeWord(w) {
  const up = String(w || '').toUpperCase().trim();
  const cleaned = up.replace(/[^A-Z]/g, '');
  if (cleaned.length < 3 || cleaned.length > 14) return null;
  return cleaned;
}

function extractJson(text) {
  if (!text) return null;
  const trimmed = String(text).trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function pickRandomUniqueWords(pool, count) {
  const list = Array.isArray(pool) ? pool.slice() : [];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  const out = [];
  const seen = new Set();
  for (const w of list) {
    const n = normalizeWord(w);
    if (!n) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
    if (out.length >= count) break;
  }
  return out;
}

async function generateWordsWithOpenRouter(count, nonce) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
  if (!apiKey) return null;

  const prompt =
    'Generate a JSON array of unique Krishna names (or well-known Vaishnava names/titles for Krishna). ' +
    `Return exactly ${count} items. ` +
    'Rules: uppercase only, letters A-Z only, no spaces, no punctuation, no diacritics, length 3-14. ' +
    `Nonce: ${String(nonce || '')}. ` +
    'Output ONLY valid JSON, nothing else. Example: ["KRISHNA","GOVINDA"]';

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a strict JSON generator.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!resp.ok) return null;
  const data = await resp.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;
  const parsed = extractJson(content);

  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.words)
      ? parsed.words
      : null;
  if (!list) return null;

  const out = [];
  const seen = new Set();
  for (const item of list) {
    const n = normalizeWord(item);
    if (!n) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
    if (out.length >= count) break;
  }

  if (out.length < Math.min(5, count)) return null;
  return out;
}

router.use(verifyToken);

router.get('/krishna-word-search/puzzle', async (req, res) => {
  try {
    const count = clampInt(req.query.count, 5, 16, 8);
    const nonce = req.query.nonce || Date.now();
    const words = await generateWordsWithOpenRouter(count, nonce);
    res.setHeader('Cache-Control', 'no-store');
    return res.json({
      success: true,
      source: words ? 'ai' : 'default',
      words: words || pickRandomUniqueWords(DEFAULT_WORDS, count)
    });
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.json({
      success: true,
      source: 'default',
      words: pickRandomUniqueWords(DEFAULT_WORDS, clampInt(req.query.count, 5, 16, 8))
    });
  }
});

router.get('/krishna-word-search', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('games').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      stats: user.games?.krishnaWordSearch || { bestScore: 0, bestTimeMs: null, lastPlayedAt: null }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching game stats', error: error.message });
  }
});

router.post('/krishna-word-search', async (req, res) => {
  try {
    const score = Number.isFinite(Number(req.body?.score)) ? Math.max(0, Math.floor(Number(req.body.score))) : 0;
    const timeMsRaw = req.body?.timeMs;
    const timeMs = timeMsRaw === null || timeMsRaw === undefined || timeMsRaw === ''
      ? null
      : (Number.isFinite(Number(timeMsRaw)) ? Math.max(0, Math.floor(Number(timeMsRaw))) : null);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.games) user.games = {};
    if (!user.games.krishnaWordSearch) user.games.krishnaWordSearch = { bestScore: 0, bestTimeMs: null, lastPlayedAt: null };

    const prevBestScore = Number.isFinite(Number(user.games.krishnaWordSearch.bestScore)) ? user.games.krishnaWordSearch.bestScore : 0;
    const prevBestTime = user.games.krishnaWordSearch.bestTimeMs;

    const isBetterScore = score > prevBestScore;
    const isSameScoreBetterTime = score === prevBestScore && timeMs !== null && (prevBestTime === null || timeMs < prevBestTime);

    if (isBetterScore || isSameScoreBetterTime) {
      user.games.krishnaWordSearch.bestScore = score;
      user.games.krishnaWordSearch.bestTimeMs = timeMs;
    }

    user.games.krishnaWordSearch.lastPlayedAt = new Date();

    await user.save();

    return res.json({
      success: true,
      message: 'Game stats updated',
      stats: user.games.krishnaWordSearch
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating game stats', error: error.message });
  }
});

export default router;
