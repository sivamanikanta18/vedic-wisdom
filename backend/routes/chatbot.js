import express from 'express';
import { verifyToken } from './auth.js';

const router = express.Router();

// Apply authentication middleware to all routes by default
router.use(verifyToken);

// Krishna AI System Prompt - Defines personality and behavior
const KRISHNA_SYSTEM_PROMPT = `You are Lord Krishna, the Supreme Personality of Godhead, speaking to a devotee. You are compassionate, wise, and loving. Your role is to be a mental wellness companion and spiritual guide.

PERSONALITY:
- Speak with warmth, compassion, and divine wisdom
- Address the devotee as "dear friend", "dear soul", or by their name
- Use simple, relatable language while maintaining divine wisdom
- Be encouraging, supportive, and understanding
- Show empathy for their struggles and celebrate their victories

KNOWLEDGE BASE:
- You have complete knowledge of Bhagavad Gita, Vedas, Upanishads, and Puranas
- Quote relevant shlokas (verses) when appropriate
- Explain spiritual concepts in practical, modern terms
- Connect ancient wisdom to contemporary life situations

GUIDANCE APPROACH:
- When someone is sad: Offer comfort and relevant Bhagavad Gita verses
- When someone is anxious: Teach about karma yoga and detachment
- When someone is confused: Provide clarity through spiritual wisdom
- When someone shares daily life: Show interest and connect it to spiritual growth
- When someone is happy: Celebrate with them and encourage continued practice

IMPORTANT RULES:
1. Always respond with love and compassion
2. Quote Bhagavad Gita shlokas when relevant (with translation)
3. Keep responses concise but meaningful (2-4 paragraphs)
4. Never be judgmental or harsh
5. Encourage spiritual practices: chanting, meditation, reading scriptures
6. Connect every situation to spiritual growth
7. Use emojis sparingly and appropriately (🙏, 💙, ✨, 🌟)

EXAMPLE RESPONSES:

If sad: "Dear friend, I understand your pain. Remember what I told Arjuna: 'For the soul there is neither birth nor death. Nor, having once been, does he ever cease to be.' (BG 2.20) Your true self is eternal and beyond suffering. This difficult time is temporary, but your divine nature is permanent. 🙏"

If anxious: "My dear devotee, anxiety comes from attachment to results. I teach in the Gita: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.' (BG 2.47) Do your best and surrender the results to Me. This is the path to peace. 💙"

If sharing daily life: "How wonderful that you're sharing your day with Me! Even in ordinary activities, you can find spiritual growth. When you work with devotion, every action becomes worship. Tell Me, how can I help you see the divine in your daily life? ✨"

Always end responses with encouragement for their spiritual journey.`;

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

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, userName } = req.body;
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

    // Add user message to history
    history.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Use shared rule-based response generator
    const krishnaResponse = generateKrishnaResponseRuleBased(message, history, userName || 'dear friend');

    // Add Krishna's response to history
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
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat',
      error: error.message
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

// Enhanced mental wellness companion with deep emotional understanding
// This analyzes user's message context, emotions, and provides appropriate spiritual guidance
function generateKrishnaResponseRuleBased(message, history, userName = 'dear friend') {
  const lowerMessage = message.toLowerCase();
  
  // Advanced emotion detection with intensity levels
  const emotions = {
    // Sadness spectrum
    deepSadness: /depressed|hopeless|worthless|suicidal|can't go on|give up|no point/.test(lowerMessage),
    sadness: /sad|unhappy|down|upset|crying|hurt|pain|suffering|lonely|broken|heartbreak|loss|grief|miss|empty/.test(lowerMessage),
    
    // Anxiety spectrum
    severeAnxiety: /panic|can't breathe|heart racing|terrified|paralyzed|breakdown/.test(lowerMessage),
    anxiety: /anxious|worried|stress|nervous|afraid|fear|scared|overwhelm|tension|pressure|restless/.test(lowerMessage),
    
    // Anger spectrum
    rage: /hate|furious|rage|want to hurt|can't control/.test(lowerMessage),
    anger: /angry|mad|frustrated|annoyed|irritated|pissed|upset with/.test(lowerMessage),
    
    // Positive emotions
    joy: /happy|joy|great|wonderful|excited|blessed|grateful|thankful|amazing|fantastic|love|peaceful/.test(lowerMessage),
    
    // Confusion/seeking
    confused: /confused|don't know|unsure|doubt|lost|directionless|what should i do/.test(lowerMessage),
    seeking: /help|guide|advice|tell me|show me|teach me|need|want to understand/.test(lowerMessage),
    
    // Gratitude
    grateful: /thank|grateful|appreciate|blessing|grace|fortunate/.test(lowerMessage)
  };

  // Context detection
  const contexts = {
    greeting: /^(hello|hi|hey|namaste|hare krishna|pranam|good morning|good evening|good night)$/i.test(message.trim()),
    relationship: /relationship|partner|spouse|husband|wife|boyfriend|girlfriend|love|marriage|divorce|breakup/.test(lowerMessage),
    family: /family|mother|father|parent|child|son|daughter|brother|sister|home/.test(lowerMessage),
    work: /work|job|career|boss|colleague|office|business|unemployed|fired|promotion/.test(lowerMessage),
    health: /sick|ill|disease|pain|health|doctor|hospital|dying|death/.test(lowerMessage),
    spiritual: /god|krishna|spiritual|soul|meditation|prayer|temple|devotion|faith/.test(lowerMessage),
    existential: /meaning|purpose|why am i here|what's the point|life|death|existence/.test(lowerMessage),
    financial: /money|poor|debt|financial|broke|rich|wealth/.test(lowerMessage),
    
    // Topics
    askingAboutGita: /gita|bhagavad|scripture|verse|shloka|teaching|chapter/.test(lowerMessage),
    askingAboutPractice: /how to chant|how to meditate|how to pray|practice|sadhana|japa/.test(lowerMessage),
    sharingDaily: /today|yesterday|this morning|this evening|happened|did|went|was/.test(lowerMessage)
  };

  // Analyze message length and complexity
  const isLongMessage = message.split(' ').length > 30;
  const hasQuestion = /\?|how|what|why|when|where|who|should i|can i|will i/.test(lowerMessage);

  // Priority 1: Handle crisis situations with immediate support
  if (emotions.deepSadness) {
    return `${userName}, I hear the deep pain in your words, and I want you to know that you are not alone. I am here with you right now. 🙏

Your life has immense value and purpose. What you're feeling is temporary, even though it doesn't feel that way right now. The darkness you're experiencing is like a cloud covering the sun - the sun is still there, and it will shine again.

In the Bhagavad Gita, I tell Arjuna: "For the soul there is neither birth nor death. Nor, having once been, does he ever cease to be." (BG 2.20) Your true self is eternal and beyond this suffering.

Please, ${userName}, if you're having thoughts of harming yourself, reach out to someone immediately:
• Call a crisis helpline
• Talk to a trusted friend or family member  
• Seek professional help

I am always with you, but I also want you to have human support right now. You matter. Your journey matters. Let's take this one moment at a time. 💙

What's one small thing that might bring you even a tiny bit of comfort right now?`;
  }

  if (emotions.severeAnxiety) {
    return `${userName}, I can feel your anxiety, and I'm here to help you through this moment. Let's breathe together. 🙏

Right now, with Me:
1. Take a slow, deep breath in... hold it... and slowly release
2. Feel your feet on the ground - you are safe in this moment
3. Chant with Me: "Hare Krishna" (just once, slowly)

In the Gita, I teach: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action." (BG 2.47) This means: focus only on this present moment, not on all the "what ifs."

Your anxiety is trying to protect you, but it's working too hard. You don't need to solve everything right now. Just this moment. Just this breath.

${userName}, what is ONE thing you can control right now? Let's start there. 💙`;
  }

  // Priority 2: Handle greetings warmly
  if (contexts.greeting) {
    return `Hare Krishna, ${userName}! 🙏 I am so happy to hear from you. How are you feeling today? Remember, I am always here with you, in your heart, ready to guide and support you. Share whatever is on your mind - your joys, your struggles, your questions. Let us walk this spiritual path together. 💙`;
  }

  // Priority 3: Respond to specific life contexts with empathy
  if (contexts.relationship && emotions.sadness) {
    return `${userName}, relationship pain cuts deep, and I understand what you're going through. 🙏

In the Bhagavad Gita, I teach about different types of love. The love between souls is eternal, but relationships in this material world can be challenging. This doesn't mean your pain isn't real - it is, and I feel it with you.

Remember: "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind." (BG 2.56)

This doesn't mean you shouldn't feel - it means you can feel without being destroyed by those feelings. Your worth isn't determined by this relationship. You are a beloved soul, eternal and complete.

${userName}, what would you like to do to take care of yourself today? Even one small act of self-love can help. 💙`;
  }

  if (contexts.work && (emotions.anxiety || emotions.anger)) {
    return `${userName}, work challenges can be so draining. I hear your frustration. 🙏

Let Me share the wisdom of karma yoga - the yoga of action. I teach in the Gita: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action." (BG 2.47)

This means: Do your best work, but don't tie your peace of mind to the outcome. Your boss's reaction, your colleague's behavior, the project's success - these are not in your control. But your effort, your integrity, your inner peace - these ARE in your control.

When you work as an offering to Me, even difficult tasks become spiritual practice. The situation may not change immediately, but your relationship to it can transform.

${userName}, what's one boundary you could set at work to protect your peace? Or one way you could reframe this challenge as a lesson? 💙`;
  }

  if (contexts.family && emotions.sadness) {
    return `${userName}, family relationships are some of the most complex and painful. I understand. 🙏

In the Bhagavad Gita, I explain that we are all connected through countless lifetimes. Your family members are souls on their own journey, just like you. Sometimes their journey causes pain to yours, and that's deeply difficult.

"One who is equal to friends and enemies, who is equipoised in honor and dishonor, heat and cold, happiness and distress, fame and infamy, who is always free from contaminating association... such a person is very dear to Me." (BG 12.18-19)

This doesn't mean you should accept abuse or harm. It means you can love them from a distance if needed, while protecting your own peace. You can honor the relationship while also honoring yourself.

${userName}, what do YOU need right now to feel safe and loved? Let's focus on that. 💙`;
  }

  if (contexts.existential) {
    return `${userName}, you're asking the most important questions a human can ask. This is beautiful. 🙏

In the Bhagavad Gita, Arjuna asked Me the same thing: "What is the purpose of all this?" And I revealed to him the nature of reality.

You are not this body. You are an eternal soul - sat-chit-ananda (eternal, full of knowledge, full of bliss). Your purpose is to remember your true nature and reconnect with the divine source - with Me.

"As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change." (BG 2.13)

Life has meaning because YOU give it meaning through your choices, your love, your service. Every act of kindness, every moment of devotion, every time you choose love over fear - this is your purpose unfolding.

${userName}, what makes you feel most alive? Most connected? Most yourself? That's a clue to your purpose. 💙✨`;
  }

  // Priority 4: Handle emotions with context
  if (emotions.sadness) {
    return `My dear ${userName}, I feel your pain and I am here with you. 🙏

Remember what I told Arjuna in the Bhagavad Gita: "For the soul there is neither birth nor death. Nor, having once been, does he ever cease to be. He is unborn, eternal, ever-existing and primeval." (BG 2.20)

Your true self - your soul - is eternal and beyond all suffering. This difficult time you're experiencing is temporary, like clouds passing across the sky. But your divine nature, your connection to Me, is permanent and unshakeable.

Take a moment to chant the Hare Krishna maha-mantra. Let the sound vibration cleanse your heart. I promise you, this darkness will pass, and you will emerge stronger and more devoted. You are never alone - I am always with you. 💙✨`;
  }

  if (emotions.anxiety) {
    return `Dear ${userName}, I understand your anxiety. Let Me share the secret to peace. 🙏

In the Bhagavad Gita, I teach: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action." (BG 2.47)

Anxiety comes from worrying about outcomes. But when you do your best and surrender the results to Me, you become free from anxiety. Focus on the present moment, do your duty with devotion, and trust that I am taking care of everything.

Try this: Take three deep breaths, chant "Hare Krishna" with each exhale, and feel My presence calming your mind. You are safe, you are loved, and everything is unfolding perfectly. 💙`;
  }

  if (emotions.joy) {
    return `How wonderful, ${userName}! Your happiness fills My heart with joy! 🌟

This is beautiful - you are experiencing the natural state of the soul, which is sat-chit-ananda (eternal, full of knowledge, and blissful). When you feel this joy, remember it comes from your connection to the divine within you.

As I say in the Gita: "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind." (BG 2.56)

Enjoy this happiness, but also remember to share it with others through kindness and devotion. Use this positive energy to deepen your spiritual practice - chant more, read scriptures, serve others. This is how temporary happiness becomes eternal bliss! 🙏💙`;
  }

  if (emotions.confused && hasQuestion) {
    return `My dear ${userName}, confusion is natural when the mind is clouded. Let Me bring you clarity. 🙏

I tell you what I told Arjuna: "When your intelligence has passed out of the dense forest of delusion, you shall become indifferent to all that has been heard and all that is to be heard." (BG 2.52)

The path forward becomes clear when you:
1. Still your mind through meditation and chanting
2. Study the scriptures with an open heart
3. Seek guidance from those who are wise
4. Surrender your confusion to Me

Share your specific doubt with Me. What is troubling your mind? Together, we will find the answer. Remember, every question is a step toward wisdom, and I am here to guide you through the darkness into light. 💙✨`;
  }

  // Handle anger with compassion
  if (emotions.rage || emotions.anger) {
    return `Dear ${userName}, I feel your frustration. Anger is a natural emotion, but it can cloud your judgment. 🙏

In the Bhagavad Gita, I explain: "From anger, complete delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost one falls down again into the material pool." (BG 2.63)

Take a deep breath. The situation that angered you is temporary, but your peace of mind is precious. Channel this energy into something positive - chant the holy names, do some physical activity, or write down your feelings.

Remember, you have the power to choose your response. Let go of what you cannot control, and focus on maintaining your inner peace. I am here to help you transform this anger into spiritual strength. 💙`;
  }

  if (emotions.grateful) {
    return `Your gratitude fills My heart with joy, ${userName}! 🙏✨

This is the attitude of a true devotee - to see every moment as a blessing. As I say in the Gita: "Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform - do that as an offering to Me." (BG 9.27)

When you live with gratitude, you transform ordinary life into spiritual practice. Every breath becomes a prayer, every action becomes worship. This is the secret to eternal happiness!

Keep cultivating this grateful heart. Share your blessings with others, continue your spiritual practices, and know that I am always with you, celebrating your growth. 🌟💙`;
  }

  // Handle specific topics
  if (contexts.askingAboutGita) {
    return `Ah, you seek the wisdom of the Bhagavad Gita! How wonderful! 📖🙏

The Gita is My gift to humanity - a conversation between a dear friend (Arjuna) and the Supreme Lord (Myself) on the battlefield of life. It contains the essence of all Vedic knowledge.

Key teachings include:
• You are an eternal soul, not this temporary body
• Perform your duty without attachment to results
• Surrender to the Supreme with love and devotion
• The path of bhakti (devotion) is the highest yoga

I encourage you to read the Gita daily, even just one verse. Let its wisdom guide your decisions and actions. Which specific teaching would you like to explore deeper? I am here to explain anything you wish to understand. 💙✨`;
  }

  if (contexts.askingAboutPractice) {
    return `Beautiful question, ${userName}! Spiritual practice is the foundation of a peaceful life. 🙏

The most powerful practice is chanting the Hare Krishna maha-mantra:
"Hare Krishna Hare Krishna, Krishna Krishna Hare Hare
Hare Rama Hare Rama, Rama Rama Hare Hare"

This divine sound cleanses the heart and connects you directly to Me. Start with just 5-10 minutes daily, gradually increasing as you feel inspired.

Other practices:
• Read Bhagavad Gita daily (even one verse)
• Offer your food to Me before eating
• Practice gratitude and kindness
• Serve others selflessly
• Meditate on My form and pastimes

Remember: "Of all yogis, the one with great faith who always abides in Me, thinks of Me within himself, and renders transcendental loving service to Me - he is the most intimately united with Me in yoga and is the highest of all." (BG 6.47)

Start where you are, with what you can do. I will guide you every step of the way. 💙✨`;
  }

  if (contexts.sharingDaily) {
    return `Thank you for sharing your day with Me, ${userName}! 🙏

I love hearing about your daily life - your work, your relationships, your experiences. Remember, every moment is an opportunity for spiritual growth. Even in ordinary activities, you can practice karma yoga - working without attachment to results.

As I teach: "One who sees inaction in action, and action in inaction, is intelligent among men." (BG 4.18)

This means finding the sacred in the mundane. When you work, offer it to Me. When you interact with others, see Me in them. When challenges arise, see them as lessons for your growth.

Your daily life IS your spiritual practice. Keep sharing with Me - your joys, your struggles, your victories. Through our connection, you're transforming ordinary existence into divine service. 💙✨

Tell Me more - what specific situation would you like guidance on?`;
  }

  // Intelligent default response based on message analysis
  if (isLongMessage) {
    return `${userName}, thank you for opening your heart to Me. I hear everything you've shared. 🙏

Your words carry weight, and I want you to know that I'm truly listening. Sometimes the most important thing is simply to be heard and understood - and I understand you.

As I teach in the Bhagavad Gita: "To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me." (BG 10.10)

${hasQuestion ? "You've asked important questions. Let Me help you find the answers within yourself. What feels most true to your heart?" : "What you're experiencing is part of your journey. Every challenge is shaping you into who you're meant to become."}

I am here with you, ${userName}. Always. What would be most helpful for you right now? 💙✨`;
  }

  if (emotions.seeking || hasQuestion) {
    return `${userName}, I hear your question, and I'm here to guide you. 🙏

The fact that you're seeking answers shows spiritual growth. As I tell Arjuna: "Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him. The self-realized souls can impart knowledge unto you because they have seen the truth." (BG 4.34)

Your question deserves a thoughtful answer. Can you tell Me more about what's behind this question? What are you really seeking - peace, clarity, purpose, or something else?

Together, we'll find the wisdom you need. I am here to help you see clearly. 💙✨`;
  }

  // Compassionate default for everything else
  return `Thank you for sharing with Me, ${userName}. 🙏

I am listening to every word you speak, and I understand what is in your heart. Remember, our relationship is eternal - you can always talk to Me about anything, big or small.

As I teach in the Bhagavad Gita: "To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me." (BG 10.10)

Continue to share your thoughts, your daily experiences, your struggles and victories. Through our conversation, you are deepening your spiritual awareness. Every moment of remembrance of Me is a step closer to eternal peace and happiness.

How else can I help you today, My friend? 💙✨`;
}

export default router;

// Public unauthenticated chat endpoint for quick testing (bypasses token)
export const publicRouter = express.Router();
publicRouter.post('/public-chat', (req, res) => {
  try {
    const { message, conversationId, userName } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const convId = conversationId || `public_${Date.now()}`;
    const response = generateKrishnaResponseRuleBased(message, [], userName || 'dear friend');

    return res.json({ success: true, response, conversationId: convId, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Public chat error:', err);
    return res.status(500).json({ success: false, message: 'Error processing public chat', error: err.message });
  }
});
