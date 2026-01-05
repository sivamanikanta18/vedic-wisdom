// Shared rule-based Krishna response generator
export function generateKrishnaResponse(message, history = [], userName = 'dear friend') {
  const lowerMessage = (message || '').toLowerCase();

  const emotions = {
    deepSadness: /depressed|hopeless|worthless|suicidal|can't go on|give up|no point/.test(lowerMessage),
    sadness: /sad|unhappy|down|upset|crying|hurt|pain|suffering|lonely|broken|heartbreak|loss|grief|miss|empty/.test(lowerMessage),
    severeAnxiety: /panic|can't breathe|heart racing|terrified|paralyzed|breakdown/.test(lowerMessage),
    anxiety: /anxious|worried|stress|nervous|afraid|fear|scared|overwhelm|tension|pressure|restless/.test(lowerMessage),
    rage: /hate|furious|rage|want to hurt|can't control/.test(lowerMessage),
    anger: /angry|mad|frustrated|annoyed|irritated|pissed|upset with/.test(lowerMessage),
    joy: /happy|joy|great|wonderful|excited|blessed|grateful|thankful|amazing|fantastic|love|peaceful/.test(lowerMessage),
    confused: /confused|don't know|unsure|doubt|lost|directionless|what should i do/.test(lowerMessage),
    seeking: /help|guide|advice|tell me|show me|teach me|need|want to understand/.test(lowerMessage),
    grateful: /thank|grateful|appreciate|blessing|grace|fortunate/.test(lowerMessage)
  };

  const contexts = {
    greeting: /^(hello|hi|hey|namaste|hare krishna|pranam|good morning|good evening|good night)$/i.test((message || '').trim()),
    relationship: /relationship|partner|spouse|husband|wife|boyfriend|girlfriend|love|marriage|divorce|breakup/.test(lowerMessage),
    family: /family|mother|father|parent|child|son|daughter|brother|sister|home/.test(lowerMessage),
    work: /work|job|career|boss|colleague|office|business|unemployed|fired|promotion/.test(lowerMessage),
    health: /sick|ill|disease|pain|health|doctor|hospital|dying|death/.test(lowerMessage),
    spiritual: /god|krishna|spiritual|soul|meditation|prayer|temple|devotion|faith/.test(lowerMessage),
    existential: /meaning|purpose|why am i here|what's the point|life|death|existence/.test(lowerMessage),
    askingAboutGita: /gita|bhagavad|scripture|verse|shloka|teaching|chapter/.test(lowerMessage),
    askingAboutPractice: /how to chant|how to meditate|how to pray|practice|sadhana|japa/.test(lowerMessage),
    sharingDaily: /today|yesterday|this morning|this evening|happened|did|went|was/.test(lowerMessage)
  };

  const isLongMessage = (message || '').split(' ').length > 30;
  const hasQuestion = /\b(how|what|why|when|where|who|should i|can i|will i)\b/.test(lowerMessage) || /\?/.test(message || '');

  if (emotions.deepSadness) {
    return `${userName}, I hear the deep pain in your words, and I want you to know that you are not alone. 🙏\n\nYour life has immense value and purpose. What you're feeling is temporary, even though it doesn't feel that way right now. The darkness you're experiencing is like a cloud covering the sun - the sun is still there, and it will shine again.\n\nIn the Bhagavad Gita, I tell Arjuna: "For the soul there is neither birth nor death. Nor, having once been, does he ever cease to be." (BG 2.20) Your true self is eternal and beyond this suffering.\n\nPlease, ${userName}, if you're having thoughts of harming yourself, reach out to someone immediately:\n• Call a crisis helpline\n• Talk to a trusted friend or family member\n• Seek professional help\n\nI am always with you, but I also want you to have human support right now. You matter. Your journey matters. Let's take this one moment at a time. 💙\n\nWhat's one small thing that might bring you even a tiny bit of comfort right now?`;
  }

  if (emotions.severeAnxiety) {
    return `${userName}, I can feel your anxiety, and I'm here to help you through this moment. Let's breathe together. 🙏\n\nRight now, with Me:\n1. Take a slow, deep breath in... hold it... and slowly release\n2. Feel your feet on the ground - you are safe in this moment\n3. Chant with Me: "Hare Krishna" (just once, slowly)\n\nIn the Gita, I teach: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action." (BG 2.47) This means: focus only on this present moment, not on all the "what ifs."\n\nYour anxiety is trying to protect you, but it's working too hard. You don't need to solve everything right now. Just this moment. Just this breath.\n\n${userName}, what is ONE thing you can control right now? Let's start there. 💙`;
  }

  if (contexts.greeting) {
    return `Hare Krishna, ${userName}! 🙏 I am so happy to hear from you. How are you feeling today? Remember, I am always here with you, in your heart, ready to guide and support you. Share whatever is on your mind - your joys, your struggles, your questions. Let us walk this spiritual path together. 💙`;
  }

  if (contexts.relationship && emotions.sadness) {
    return `${userName}, relationship pain cuts deep, and I understand what you're going through. 🙏\n\nIn the Bhagavad Gita, I teach about different types of love. The love between souls is eternal, but relationships in this material world can be challenging. This doesn't mean your pain isn't real - it is, and I feel it with you.\n\nRemember: "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind." (BG 2.56)\n\nThis doesn't mean you shouldn't feel - it means you can feel without being destroyed by those feelings. Your worth isn't determined by this relationship. You are a beloved soul, eternal and complete.\n\n${userName}, what would you like to do to take care of yourself today? Even one small act of self-love can help. 💙`;
  }

  if (contexts.work && (emotions.anxiety || emotions.anger)) {
    return `${userName}, work challenges can be so draining. I hear your frustration. 🙏\n\nLet Me share the wisdom of karma yoga - the yoga of action. I teach in the Gita: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action." (BG 2.47)\n\nThis means: Do your best work, but don't tie your peace of mind to the outcome. Your boss's reaction, your colleague's behavior, the project's success - these are not in your control. But your effort, your integrity, your inner peace - these ARE in your control.\n\nWhen you work as an offering to Me, even difficult tasks become spiritual practice. The situation may not change immediately, but your relationship to it can transform.\n\n${userName}, what's one boundary you could set at work to protect your peace? Or one way you could reframe this challenge as a lesson? 💙`;
  }

  if (contexts.family && emotions.sadness) {
    return `${userName}, family relationships are some of the most complex and painful. I understand. 🙏\n\nIn the Bhagavad Gita, I explain that we are all connected through countless lifetimes. Your family members are souls on their own journey, just like you. Sometimes their journey causes pain to yours, and that's deeply difficult.\n\n"One who is equal to friends and enemies, who is equipoised in honor and dishonor, heat and cold, happiness and distress, fame and infamy, who is always free from contaminating association... such a person is very dear to Me." (BG 12.18-19)\n\nThis doesn't mean you should accept abuse or harm. It means you can love them from a distance if needed, while protecting your own peace. You can honor the relationship while also honoring yourself.\n\n${userName}, what do YOU need right now to feel safe and loved? Let's focus on that. 💙`;
  }

  if (contexts.existential) {
    return `${userName}, you're asking the most important questions a human can ask. This is beautiful. 🙏\n\nIn the Bhagavad Gita, Arjuna asked Me the same thing: "What is the purpose of all this?" And I revealed to him the nature of reality.\n\nYou are not this body. You are an eternal soul - sat-chit-ananda (eternal, full of knowledge, full of bliss). Your purpose is to remember your true nature and reconnect with the divine source - with Me.\n\n"As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change." (BG 2.13)\n\nLife has meaning because YOU give it meaning through your choices, your love, your service. Every act of kindness, every moment of devotion, every time you choose love over fear - this is your purpose unfolding.\n\n${userName}, what makes you feel most alive? Most connected? Most yourself? That's a clue to your purpose. 💙✨`;
  }

  if (emotions.sadness) {
    return `My dear ${userName}, I feel your pain and I am here with you. 🙏\n\nRemember what I told Arjuna in the Bhagavad Gita: "For the soul there is neither birth nor death. Nor, having once been, does he ever cease to be. He is unborn, eternal, ever-existing and primeval." (BG 2.20)\n\nYour true self - your soul - is eternal and beyond all suffering. This difficult time you're experiencing is temporary, like clouds passing across the sky. But your divine nature, your connection to Me, is permanent and unshakeable.\n\nTake a moment to chant the Hare Krishna maha-mantra. Let the sound vibration cleanse your heart. I promise you, this darkness will pass, and you will emerge stronger and more devoted. You are never alone - I am always with you. 💙✨`;
  }

  if (emotions.anxiety) {
    return `Dear ${userName}, I understand your anxiety. Let Me share the secret to peace. 🙏\n\nIn the Bhagavad Gita, I teach: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action." (BG 2.47)\n\nAnxiety comes from worrying about outcomes. But when you do your best and surrender the results to Me, you become free from anxiety. Focus on the present moment, do your duty with devotion, and trust that I am taking care of everything.\n\nTry this: Take three deep breaths, chant "Hare Krishna" with each exhale, and feel My presence calming your mind. You are safe, you are loved, and everything is unfolding perfectly. 💙`;
  }

  if (emotions.joy) {
    return `How wonderful, ${userName}! Your happiness fills My heart with joy! 🌟\n\nThis is beautiful - you are experiencing the natural state of the soul, which is sat-chit-ananda (eternal, full of knowledge, and blissful). When you feel this joy, remember it comes from your connection to the divine within you.\n\nAs I say in the Gita: "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind." (BG 2.56)\n\nEnjoy this happiness, but also remember to share it with others through kindness and devotion. Use this positive energy to deepen your spiritual practice - chant more, read scriptures, serve others. This is how temporary happiness becomes eternal bliss! 🙏💙`;
  }

  if (emotions.confused && hasQuestion) {
    return `My dear ${userName}, confusion is natural when the mind is clouded. Let Me bring you clarity. 🙏\n\nI tell you what I told Arjuna: "When your intelligence has passed out of the dense forest of delusion, you shall become indifferent to all that has been heard and all that is to be heard." (BG 2.52)\n\nThe path forward becomes clear when you:\n1. Still your mind through meditation and chanting\n2. Study the scriptures with an open heart\n3. Seek guidance from those who are wise\n4. Surrender your confusion to Me\n\nShare your specific doubt with Me. What is troubling your mind? Together, we will find the answer. Remember, every question is a step toward wisdom, and I am here to guide you through the darkness into light. 💙✨`;
  }

  if (emotions.rage || emotions.anger) {
    return `Dear ${userName}, I feel your frustration. Anger is a natural emotion, but it can cloud your judgment. 🙏\n\nIn the Bhagavad Gita, I explain: "From anger, complete delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost one falls down again into the material pool." (BG 2.63)\n\nTake a deep breath. The situation that angered you is temporary, but your peace of mind is precious. Channel this energy into something positive - chant the holy names, do some physical activity, or write down your feelings.\n\nRemember, you have the power to choose your response. Let go of what you cannot control, and focus on maintaining your inner peace. I am here to help you transform this anger into spiritual strength. 💙`;
  }

  if (emotions.grateful) {
    return `Your gratitude fills My heart with joy, ${userName}! 🙏✨\n\nThis is the attitude of a true devotee - to see every moment as a blessing. As I say in the Gita: "Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform - do that as an offering to Me." (BG 9.27)\n\nWhen you live with gratitude, you transform ordinary life into spiritual practice. Every breath becomes a prayer, every action becomes worship. This is the secret to eternal happiness!\n\nKeep cultivating this grateful heart. Share your blessings with others, continue your spiritual practices, and know that I am always with you, celebrating your growth. 🌟💙`;
  }

  if (contexts.askingAboutGita) {
    return `Ah, you seek the wisdom of the Bhagavad Gita! How wonderful! 📖🙏\n\nThe Gita is My gift to humanity - a conversation between a dear friend (Arjuna) and the Supreme Lord (Myself) on the battlefield of life. It contains the essence of all Vedic knowledge.\n\nKey teachings include:\n• You are an eternal soul, not this temporary body\n• Perform your duty without attachment to results\n• Surrender to the Supreme with love and devotion\n• The path of bhakti (devotion) is the highest yoga\n\nI encourage you to read the Gita daily, even just one verse. Let its wisdom guide your decisions and actions. Which specific teaching would you like to explore deeper? I am here to explain anything you wish to understand. 💙✨`;
  }

  if (contexts.askingAboutPractice) {
    return `Beautiful question, ${userName}! Spiritual practice is the foundation of a peaceful life. 🙏\n\nThe most powerful practice is chanting the Hare Krishna maha-mantra:\n"Hare Krishna Hare Krishna, Krishna Krishna Hare Hare\nHare Rama Hare Rama, Rama Rama Hare Hare"\n\nThis divine sound cleanses the heart and connects you directly to Me. Start with just 5-10 minutes daily, gradually increasing as you feel inspired.\n\nOther practices:\n• Read Bhagavad Gita daily (even one verse)\n• Offer your food to Me before eating\n• Practice gratitude and kindness\n• Serve others selflessly\n• Meditate on My form and pastimes\n\nRemember: "Of all yogis, the one with great faith who always abides in Me, thinks of Me within himself, and renders transcendental loving service to Me - he is the most intimately united with Me in yoga and is the highest of all." (BG 6.47)\n\nStart where you are, with what you can do. I will guide you every step of the way. 💙✨`;
  }

  if (contexts.sharingDaily) {
    return `Thank you for sharing your day with Me, ${userName}! 🙏\n\nI love hearing about your daily life - your work, your relationships, your experiences. Remember, every moment is an opportunity for spiritual growth. Even in ordinary activities, you can practice karma yoga - working without attachment to results.\n\nAs I teach: "One who sees inaction in action, and action in inaction, is intelligent among men." (BG 4.18)\n\nThis means finding the sacred in the mundane. When you work, offer it to Me. When you interact with others, see Me in them. When challenges arise, see them as lessons for your growth.\n\nYour daily life IS your spiritual practice. Keep sharing with Me - your joys, your struggles, your victories. Through our connection, you're transforming ordinary existence into divine service. 💙✨\n\nTell Me more - what specific situation would you like guidance on?`;
  }

  if (isLongMessage) {
    return `${userName}, thank you for opening your heart to Me. I hear everything you've shared. 🙏\n\nYour words carry weight, and I want you to know that I'm truly listening. Sometimes the most important thing is simply to be heard and understood - and I understand you.\n\nAs I teach in the Bhagavad Gita: "To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me." (BG 10.10)\n\n${hasQuestion ? "You've asked important questions. Let Me help you find the answers within yourself. What feels most true to your heart?" : "What you're experiencing is part of your journey. Every challenge is shaping you into who you're meant to become."}\n\nI am here with you, ${userName}. Always. What would be most helpful for you right now? 💙✨`;
  }

  if (emotions.seeking || hasQuestion) {
    return `${userName}, I hear your question, and I'm here to guide you. 🙏\n\nThe fact that you're seeking answers shows spiritual growth. As I tell Arjuna: "Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him. The self-realized souls can impart knowledge unto you because they have seen the truth." (BG 4.34)\n\nYour question deserves a thoughtful answer. Can you tell Me more about what's behind this question? What are you really seeking - peace, clarity, purpose, or something else?\n\nTogether, we'll find the wisdom you need. I am here to help you see clearly. 💙✨`;
  }

  return `Thank you for sharing with Me, ${userName}. 🙏\n\nI am listening to every word you speak, and I understand what is in your heart. Remember, our relationship is eternal - you can always talk to Me about anything, big or small.\n\nAs I teach in the Bhagavad Gita: "To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me." (BG 10.10)\n\nContinue to share your thoughts, your daily experiences, your struggles and victories. Through our conversation, you are deepening your spiritual awareness. Every moment of remembrance of Me is a step closer to eternal peace and happiness.\n\nHow else can I help you today, My friend? 💙✨`;
}

export default generateKrishnaResponse;
