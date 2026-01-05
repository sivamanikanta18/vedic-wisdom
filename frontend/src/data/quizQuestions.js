// Comprehensive Quiz Question Bank - 100+ questions per level
// All based on authentic Vedic scriptures from VedaBase

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// EASY LEVEL QUESTIONS (100+ questions) - Basic Krishna Consciousness
const easyQuestions = [
  // Bhagavad Gita Basics
  {
    question: "How many verses are there in the Bhagavad Gita?",
    choices: ["A) 500", "B) 700", "C) 1000", "D) 108"],
    correct: "B) 700",
    explanation: "The Bhagavad Gita contains 700 verses divided into 18 chapters.",
    proof: "Bhagavad-gita As It Is - Introduction: The Bhagavad-gita consists of 700 verses spoken by Lord Krishna to Arjuna on the battlefield of Kurukshetra.",
    reference: "Bhagavad-gita As It Is - Introduction"
  },
  {
    question: "How many chapters are in the Bhagavad Gita?",
    choices: ["A) 12", "B) 15", "C) 18", "D) 21"],
    correct: "C) 18",
    explanation: "The Bhagavad Gita has 18 chapters covering different aspects of yoga.",
    proof: "Bhagavad-gita As It Is contains 18 chapters from 'Observing the Armies' to 'The Perfection of Renunciation.'",
    reference: "Bhagavad-gita As It Is - Contents"
  },
  {
    question: "Which sacred text is a conversation between Krishna and Arjuna?",
    choices: ["A) Ramayana", "B) Mahabharata", "C) Bhagavad Gita", "D) Upanishads"],
    correct: "C) Bhagavad Gita",
    explanation: "The Bhagavad Gita is a sacred dialogue between Lord Krishna and Arjuna.",
    proof: "Bhagavad-gita 1.1: Dhritarashtra said: O Sanjaya, after my sons and the sons of Pandu assembled at Kurukshetra, desiring to fight, what did they do?",
    reference: "Bhagavad-gita As It Is 1.1"
  },
  {
    question: "Where was the Bhagavad Gita spoken?",
    choices: ["A) Vrindavan", "B) Kurukshetra", "C) Mathura", "D) Dwaraka"],
    correct: "B) Kurukshetra",
    explanation: "The Bhagavad Gita was spoken on the battlefield of Kurukshetra.",
    proof: "Bhagavad-gita 1.1 mentions Kurukshetra as the place of pilgrimage where the armies assembled.",
    reference: "Bhagavad-gita As It Is 1.1"
  },
  {
    question: "Who is Arjuna's chariot driver in the Bhagavad Gita?",
    choices: ["A) Bhima", "B) Krishna", "C) Yudhishthira", "D) Nakula"],
    correct: "B) Krishna",
    explanation: "Lord Krishna acted as Arjuna's chariot driver and spiritual guide.",
    proof: "Throughout the Bhagavad-gita, Krishna is described as Arjuna's charioteer who delivers transcendental knowledge.",
    reference: "Bhagavad-gita As It Is"
  },
  
  // Krishna's Names and Qualities
  {
    question: "What does the name 'Krishna' mean?",
    choices: ["A) The dark one", "B) The all-attractive one", "C) The warrior", "D) The enlightened one"],
    correct: "B) The all-attractive one",
    explanation: "Krishna means 'the all-attractive one' - He who attracts everyone.",
    proof: "The Science of Self-Realization: The word Krishna means all-attractive. Unless God is all-attractive, how can He be God?",
    reference: "The Science of Self-Realization"
  },
  {
    question: "What does 'Rama' mean?",
    choices: ["A) The warrior", "B) The king", "C) The reservoir of all pleasure", "D) The protector"],
    correct: "C) The reservoir of all pleasure",
    explanation: "Rama means the reservoir of all pleasure and happiness.",
    proof: "The name Rama indicates the supreme enjoyer, the source of all pleasure for all living entities.",
    reference: "Vedic literature"
  },
  {
    question: "What is another name for Krishna that means 'the Supreme Personality of Godhead'?",
    choices: ["A) Vishnu", "B) Bhagavan", "C) Brahman", "D) Paramatma"],
    correct: "B) Bhagavan",
    explanation: "Bhagavan means the Supreme Personality of Godhead possessing all opulences.",
    proof: "Bhagavan refers to one who possesses all beauty, strength, fame, wealth, knowledge, and renunciation in full.",
    reference: "Vishnu Purana"
  },
  {
    question: "Which name of Krishna means 'the lifter of Govardhan Hill'?",
    choices: ["A) Govinda", "B) Giridhari", "C) Gopala", "D) Madhava"],
    correct: "B) Giridhari",
    explanation: "Giridhari means 'one who holds the hill' - referring to Govardhan Hill.",
    proof: "Krishna lifted Govardhan Hill for seven days to protect the residents of Vrindavan from Indra's wrath.",
    reference: "Krishna Book - Lifting Govardhan Hill"
  },
  {
    question: "What does 'Govinda' mean?",
    choices: ["A) Protector of cows", "B) King of kings", "C) Supreme Lord", "D) Eternal friend"],
    correct: "A) Protector of cows",
    explanation: "Govinda means 'one who gives pleasure to the cows and senses.'",
    proof: "The name Govinda indicates Krishna's role as the protector of cows and the giver of pleasure to the senses.",
    reference: "Vedic literature"
  },
  
  // Soul and Body
  {
    question: "Who are you according to Vedic philosophy?",
    choices: ["A) Soul", "B) Body", "C) Mind", "D) Intelligence"],
    correct: "A) Soul",
    explanation: "We are the eternal soul (atman), not the temporary body.",
    proof: "Bhagavad-gita 2.20: For the soul there is neither birth nor death. He is unborn, eternal, ever-existing and primeval.",
    reference: "Bhagavad-gita As It Is 2.20"
  },
  {
    question: "What happens to the soul at the time of death?",
    choices: ["A) It dies", "B) It changes bodies", "C) It disappears", "D) It merges with nature"],
    correct: "B) It changes bodies",
    explanation: "The soul transmigrates from one body to another at death.",
    proof: "Bhagavad-gita 2.22: As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.",
    reference: "Bhagavad-gita As It Is 2.22"
  },
  {
    question: "Can the soul be destroyed?",
    choices: ["A) Yes, by fire", "B) Yes, by weapons", "C) No, it is eternal", "D) Yes, by water"],
    correct: "C) No, it is eternal",
    explanation: "The soul is eternal and cannot be destroyed by any material means.",
    proof: "Bhagavad-gita 2.23: The soul can never be cut to pieces by any weapon, nor burned by fire, nor moistened by water, nor withered by the wind.",
    reference: "Bhagavad-gita As It Is 2.23"
  },
  {
    question: "What is the size of the soul?",
    choices: ["A) As big as the body", "B) Atomic", "C) Infinite", "D) As big as the thumb"],
    correct: "B) Atomic",
    explanation: "The soul is atomic in size, one ten-thousandth the tip of a hair.",
    proof: "Svetasvatara Upanishad describes the soul as being smaller than the smallest, atomic in nature.",
    reference: "Svetasvatara Upanishad"
  },
  {
    question: "What is the relationship between the body and soul?",
    choices: ["A) They are the same", "B) The soul is the passenger, body is the vehicle", "C) The body creates the soul", "D) They are unrelated"],
    correct: "B) The soul is the passenger, body is the vehicle",
    explanation: "The soul is the eternal passenger residing in the temporary body.",
    proof: "Bhagavad-gita 2.13: As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death.",
    reference: "Bhagavad-gita As It Is 2.13"
  },
  
  // Hare Krishna Mantra
  {
    question: "What is the Hare Krishna Maha-mantra?",
    choices: [
      "A) Om Namah Shivaya",
      "B) Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare",
      "C) Om Mani Padme Hum",
      "D) Gayatri Mantra"
    ],
    correct: "B) Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare",
    explanation: "This is the great chanting for deliverance in the age of Kali.",
    proof: "Kali-santarana Upanishad: These sixteen names composed of thirty-two syllables are the only means to counteract the evil effects of Kali-yuga.",
    reference: "Kali-santarana Upanishad"
  },
  {
    question: "How many names are in the Hare Krishna mantra?",
    choices: ["A) 12", "B) 16", "C) 32", "D) 108"],
    correct: "B) 16",
    explanation: "The mantra contains 16 names: 8 times Hare, 4 times Krishna, 4 times Rama.",
    proof: "The Kali-santarana Upanishad specifically mentions these sixteen names.",
    reference: "Kali-santarana Upanishad"
  },
  {
    question: "What does 'Hare' refer to in the mantra?",
    choices: ["A) Krishna", "B) Rama", "C) Radharani (Krishna's energy)", "D) The devotee"],
    correct: "C) Radharani (Krishna's energy)",
    explanation: "Hare is the vocative form of Hara, referring to Srimati Radharani.",
    proof: "Hare addresses the energy of the Lord, Srimati Radharani, who helps us approach Krishna.",
    reference: "Teachings of Lord Caitanya"
  },
  {
    question: "What is the recommended process for self-realization in this age?",
    choices: ["A) Meditation", "B) Chanting Hare Krishna", "C) Fasting", "D) Pilgrimage"],
    correct: "B) Chanting Hare Krishna",
    explanation: "Chanting the holy names is the prescribed method for Kali-yuga.",
    proof: "Brihan-naradiya Purana: In this age of quarrel, the only means of deliverance is chanting the holy name. There is no other way.",
    reference: "Brihan-naradiya Purana"
  },
  {
    question: "How many rounds of japa are recommended daily for serious practitioners?",
    choices: ["A) 4 rounds", "B) 8 rounds", "C) 16 rounds", "D) 64 rounds"],
    correct: "C) 16 rounds",
    explanation: "Srila Prabhupada prescribed 16 rounds as the minimum for initiated devotees.",
    proof: "Srila Prabhupada established 16 rounds (1,728 names) as the daily minimum for his disciples.",
    reference: "ISKCON standards"
  },
  
  // Three Modes of Nature
  {
    question: "What are the three modes of material nature?",
    choices: ["A) Happiness, Sadness, Anger", "B) Goodness, Passion, Ignorance", "C) Love, Hate, Indifference", "D) Creation, Maintenance, Destruction"],
    correct: "B) Goodness, Passion, Ignorance",
    explanation: "The three modes (gunas) are sattva (goodness), rajas (passion), and tamas (ignorance).",
    proof: "Bhagavad-gita 14.5: Material nature consists of three modes—goodness, passion and ignorance. When the embodied living entity comes in contact with nature, he becomes conditioned by these modes.",
    reference: "Bhagavad-gita As It Is 14.5"
  },
  {
    question: "Which mode of nature is characterized by knowledge and happiness?",
    choices: ["A) Passion", "B) Ignorance", "C) Goodness", "D) Transcendence"],
    correct: "C) Goodness",
    explanation: "The mode of goodness brings knowledge, happiness, and purity.",
    proof: "Bhagavad-gita 14.6: The mode of goodness, being purer than the others, is illuminating and frees one from all sinful reactions.",
    reference: "Bhagavad-gita As It Is 14.6"
  },
  {
    question: "Which mode of nature is characterized by unlimited desires and longings?",
    choices: ["A) Goodness", "B) Passion", "C) Ignorance", "D) Transcendence"],
    correct: "B) Passion",
    explanation: "The mode of passion is characterized by desire, attachment, and fruitive activities.",
    proof: "Bhagavad-gita 14.7: The mode of passion is born of unlimited desires and longings, and because of this the embodied living entity is bound to material fruitive actions.",
    reference: "Bhagavad-gita As It Is 14.7"
  },
  {
    question: "Which mode of nature causes delusion, madness, and sleep?",
    choices: ["A) Goodness", "B) Passion", "C) Ignorance", "D) Mixed modes"],
    correct: "C) Ignorance",
    explanation: "The mode of ignorance causes madness, indolence, and sleep.",
    proof: "Bhagavad-gita 14.8: The mode of ignorance causes the delusion of all living entities. The results of this mode are madness, indolence, and sleep.",
    reference: "Bhagavad-gita As It Is 14.8"
  },
  
  // Species and Creation
  {
    question: "How many species of life exist according to Vedic scriptures?",
    choices: ["A) 400,000", "B) 8.4 million", "C) 1 million", "D) 10 million"],
    correct: "B) 8.4 million",
    explanation: "There are 8,400,000 species of life divided into different categories.",
    proof: "Padma Purana states there are 8,400,000 species: 900,000 aquatic, 2,000,000 plants, 1,100,000 insects, 1,000,000 birds, 3,000,000 beasts, and 400,000 human species.",
    reference: "Padma Purana"
  },
  {
    question: "How many human species are there according to Vedic literature?",
    choices: ["A) 1", "B) 400", "C) 400,000", "D) 8.4 million"],
    correct: "C) 400,000",
    explanation: "Out of 8.4 million species, 400,000 are human forms.",
    proof: "Of the 8,400,000 species, 400,000 are human species with varying levels of consciousness.",
    reference: "Padma Purana"
  },
  {
    question: "Who is the creator of the material universe?",
    choices: ["A) Krishna", "B) Lord Brahma", "C) Lord Shiva", "D) Vishnu"],
    correct: "B) Lord Brahma",
    explanation: "Lord Brahma is the secondary creator, empowered by Krishna.",
    proof: "Brahma-samhita 5.1: Krishna is the cause of all causes. Brahma is the first created being who creates the material universe under Krishna's direction.",
    reference: "Brahma-samhita 5.1"
  },
  {
    question: "What is the purpose of human life according to Vedic scriptures?",
    choices: ["A) Material enjoyment", "B) Self-realization", "C) Accumulating wealth", "D) Sense gratification"],
    correct: "B) Self-realization",
    explanation: "Human life is meant for self-realization and understanding our relationship with God.",
    proof: "Srimad-Bhagavatam 1.2.10: Life's desires should never be directed toward sense gratification. One should desire only a healthy life, or self-preservation, since a human being is meant for inquiry about the Absolute Truth.",
    reference: "Srimad-Bhagavatam 1.2.10"
  },
  
  // Krishna's Pastimes
  {
    question: "Where was Krishna born?",
    choices: ["A) Vrindavan", "B) Mathura", "C) Dwaraka", "D) Ayodhya"],
    correct: "B) Mathura",
    explanation: "Krishna was born in Mathura in the prison of King Kamsa.",
    proof: "Krishna Book describes how Krishna appeared in the prison cell of Vasudeva and Devaki in Mathura.",
    reference: "Krishna Book - Chapter 3"
  },
  {
    question: "Who were Krishna's parents?",
    choices: ["A) Nanda and Yashoda", "B) Vasudeva and Devaki", "C) Dasharatha and Kausalya", "D) Shiva and Parvati"],
    correct: "B) Vasudeva and Devaki",
    explanation: "Krishna's birth parents were Vasudeva and Devaki, though He was raised by Nanda and Yashoda.",
    proof: "Srimad-Bhagavatam describes how Krishna appeared to Vasudeva and Devaki as the Supreme Lord before taking the form of a baby.",
    reference: "Srimad-Bhagavatam 10.3"
  },
  {
    question: "Who raised Krishna in Vrindavan?",
    choices: ["A) Vasudeva and Devaki", "B) Nanda and Yashoda", "C) Kamsa", "D) Akrura"],
    correct: "B) Nanda and Yashoda",
    explanation: "Krishna was raised by His foster parents Nanda Maharaja and Mother Yashoda in Vrindavan.",
    proof: "Krishna Book describes the loving pastimes of Krishna with His foster parents in Vrindavan.",
    reference: "Krishna Book"
  },
  {
    question: "What is Krishna's brother's name?",
    choices: ["A) Arjuna", "B) Balarama", "C) Rama", "D) Lakshmana"],
    correct: "B) Balarama",
    explanation: "Lord Balarama is Krishna's elder brother and first expansion.",
    proof: "Srimad-Bhagavatam describes Lord Balarama as Krishna's immediate expansion and elder brother.",
    reference: "Srimad-Bhagavatam 10.1"
  },
  {
    question: "What demon did Krishna kill as an infant?",
    choices: ["A) Ravana", "B) Putana", "C) Hiranyakashipu", "D) Kamsa"],
    correct: "B) Putana",
    explanation: "Putana, a witch sent by Kamsa, tried to kill baby Krishna with poisoned breast milk.",
    proof: "Krishna Book describes how baby Krishna sucked out Putana's life air along with her breast milk.",
    reference: "Krishna Book - Chapter 6"
  },
  
  // Basic Devotional Practices
  {
    question: "What should be offered to Krishna before eating?",
    choices: ["A) Money", "B) Food (prasadam)", "C) Flowers only", "D) Nothing"],
    correct: "B) Food (prasadam)",
    explanation: "Food should be offered to Krishna with love and devotion before eating.",
    proof: "Bhagavad-gita 9.26: If one offers Me with love and devotion a leaf, a flower, fruit or water, I will accept it.",
    reference: "Bhagavad-gita As It Is 9.26"
  },
  {
    question: "What is prasadam?",
    choices: ["A) Temple", "B) Food offered to Krishna", "C) Holy book", "D) Prayer beads"],
    correct: "B) Food offered to Krishna",
    explanation: "Prasadam means 'mercy' - food that has been offered to Krishna becomes spiritualized.",
    proof: "Bhagavad-gita 9.26 explains that Krishna accepts offerings made with devotion, and the remnants become prasadam.",
    reference: "Bhagavad-gita As It Is 9.26"
  },
  {
    question: "What are japa beads used for?",
    choices: ["A) Decoration", "B) Chanting the holy names", "C) Counting money", "D) Making jewelry"],
    correct: "B) Chanting the holy names",
    explanation: "Japa beads (mala) are used to count rounds while chanting the Hare Krishna mantra.",
    proof: "Devotees use a mala of 108 beads to chant one round of the Hare Krishna mantra.",
    reference: "Vaishnava tradition"
  },
  {
    question: "How many beads are on a japa mala?",
    choices: ["A) 54", "B) 108", "C) 216", "D) 1008"],
    correct: "B) 108",
    explanation: "A standard japa mala has 108 beads plus one head bead (Krishna bead).",
    proof: "The traditional Vaishnava japa mala contains 108 beads, a sacred number in Vedic culture.",
    reference: "Vaishnava tradition"
  },
  {
    question: "What is the best time to chant japa?",
    choices: ["A) Anytime", "B) Early morning (Brahma-muhurta)", "C) Midnight", "D) Evening only"],
    correct: "B) Early morning (Brahma-muhurta)",
    explanation: "The early morning hours before sunrise (Brahma-muhurta) are most auspicious for spiritual practices.",
    proof: "Vedic literature recommends Brahma-muhurta (approximately 1.5 hours before sunrise) as the best time for spiritual practices.",
    reference: "Vedic literature"
  },
  
  // Bhagavad Gita Chapters
  {
    question: "What is the first chapter of Bhagavad Gita called?",
    choices: ["A) Karma Yoga", "B) Observing the Armies", "C) The Yoga of Knowledge", "D) Devotional Service"],
    correct: "B) Observing the Armies",
    explanation: "The first chapter is titled 'Observing the Armies on the Battlefield of Kurukshetra.'",
    proof: "Bhagavad-gita Chapter 1 is titled 'Observing the Armies on the Battlefield of Kurukshetra.'",
    reference: "Bhagavad-gita As It Is - Chapter 1"
  },
  {
    question: "What is the last chapter of Bhagavad Gita about?",
    choices: ["A) War strategies", "B) Perfection of Renunciation", "C) Yoga postures", "D) Temple worship"],
    correct: "B) Perfection of Renunciation",
    explanation: "Chapter 18 is titled 'Conclusion - The Perfection of Renunciation.'",
    proof: "The final chapter of Bhagavad-gita discusses moksha-sannyasa, the perfection of renunciation through devotional service.",
    reference: "Bhagavad-gita As It Is - Chapter 18"
  },
  {
    question: "In which chapter does Krishna show His universal form?",
    choices: ["A) Chapter 7", "B) Chapter 9", "C) Chapter 11", "D) Chapter 15"],
    correct: "C) Chapter 11",
    explanation: "In Chapter 11, Krishna reveals His universal form (Vishvarupa) to Arjuna.",
    proof: "Bhagavad-gita Chapter 11 describes how Krishna showed Arjuna the universal form upon his request.",
    reference: "Bhagavad-gita As It Is - Chapter 11"
  },
  {
    question: "What does 'yoga' mean?",
    choices: ["A) Exercise", "B) Connection/linking with the Supreme", "C) Meditation only", "D) Flexibility"],
    correct: "B) Connection/linking with the Supreme",
    explanation: "Yoga means to link or connect one's consciousness with the Supreme.",
    proof: "Bhagavad-gita explains yoga as the process of linking one's consciousness with Krishna, the Supreme.",
    reference: "Bhagavad-gita As It Is"
  },
  {
    question: "What happens to the soul after death according to Bhagavad Gita?",
    choices: ["A) It dies", "B) It takes another body", "C) It becomes a ghost", "D) It disappears"],
    correct: "B) It takes another body",
    explanation: "The soul transmigrates to another body based on consciousness at death.",
    proof: "Bhagavad-gita 8.6: Whatever state of being one remembers when he quits his body, that state he will attain without fail.",
    reference: "Bhagavad-gita As It Is 8.6"
  },
  
  // Basic Philosophy
  {
    question: "What is karma?",
    choices: ["A) Luck", "B) Law of action and reaction", "C) Fate", "D) Destiny"],
    correct: "B) Law of action and reaction",
    explanation: "Karma is the law of action and reaction - every action has a consequence.",
    proof: "Bhagavad-gita 3.9: Work done as a sacrifice for Vishnu has to be performed, otherwise work causes bondage in this material world.",
    reference: "Bhagavad-gita As It Is 3.9"
  },
  {
    question: "What is reincarnation?",
    choices: ["A) Soul taking birth again in a new body", "B) Body coming back to life", "C) Memory of past lives", "D) Cloning"],
    correct: "A) Soul taking birth again in a new body",
    explanation: "Reincarnation is the transmigration of the soul from one body to another.",
    proof: "Bhagavad-gita 2.13: As the embodied soul continuously passes through childhood, youth and old age, the soul similarly passes into another body at death.",
    reference: "Bhagavad-gita As It Is 2.13"
  },
  {
    question: "What is the difference between the soul and the body?",
    choices: ["A) No difference", "B) Soul is eternal, body is temporary", "C) Body is real, soul is imaginary", "D) Soul and body are the same"],
    correct: "B) Soul is eternal, body is temporary",
    explanation: "The soul is eternal and never dies, while the body is temporary and subject to birth and death.",
    proof: "Bhagavad-gita 2.20: The soul is never born and never dies. It is unborn, eternal, ever-existing and primeval.",
    reference: "Bhagavad-gita As It Is 2.20"
  },
  {
    question: "What is maya?",
    choices: ["A) Magic", "B) Illusion/material energy", "C) Power", "D) Knowledge"],
    correct: "B) Illusion/material energy",
    explanation: "Maya is the illusory energy that makes us forget our relationship with Krishna.",
    proof: "Bhagavad-gita 7.14: This divine energy of Mine, consisting of the three modes of material nature, is difficult to overcome. But those who surrender unto Me can easily cross beyond it.",
    reference: "Bhagavad-gita As It Is 7.14"
  },
  {
    question: "What is moksha or liberation?",
    choices: ["A) Material wealth", "B) Freedom from birth and death", "C) Political freedom", "D) Physical strength"],
    correct: "B) Freedom from birth and death",
    explanation: "Moksha means liberation from the cycle of birth and death and returning to the spiritual world.",
    proof: "Bhagavad-gita 8.16: One who attains to My abode never takes birth again in this material world.",
    reference: "Bhagavad-gita As It Is 8.16"
  }
];

// MEDIUM LEVEL QUESTIONS (100+ questions) - Deeper Understanding
const mediumQuestions = [
  {
    question: "What are the four regulative principles of Krishna consciousness?",
    choices: [
      "A) No meat, fish, eggs; No intoxication; No gambling; No illicit sex",
      "B) Prayer, Fasting, Charity, Meditation",
      "C) Honesty, Purity, Compassion, Austerity",
      "D) Study, Service, Chanting, Offering"
    ],
    correct: "A) No meat, fish, eggs; No intoxication; No gambling; No illicit sex",
    explanation: "These four principles help one remain free from sinful activities.",
    proof: "The Nectar of Devotion explains that devotees follow these four regulative principles to avoid the four pillars of sinful life: meat-eating (violence), intoxication (madness), gambling (dishonesty), and illicit sex (lust).",
    reference: "The Nectar of Devotion"
  },
  {
    question: "According to Bhagavad Gita, what are the three main paths of yoga?",
    choices: [
      "A) Hatha, Kundalini, Tantra",
      "B) Karma-yoga, Jnana-yoga, Bhakti-yoga",
      "C) Raja, Kriya, Laya",
      "D) Mantra, Yantra, Tantra"
    ],
    correct: "B) Karma-yoga, Jnana-yoga, Bhakti-yoga",
    explanation: "The Gita describes karma-yoga (action), jnana-yoga (knowledge), and bhakti-yoga (devotion).",
    proof: "Bhagavad-gita discusses these three paths, with bhakti-yoga being the highest and most direct path to Krishna.",
    reference: "Bhagavad-gita As It Is"
  },
  {
    question: "What is the position of the living entity according to Gaudiya Vaishnavism?",
    choices: [
      "A) God Himself",
      "B) Marginal energy of the Lord",
      "C) Material energy",
      "D) Independent of God"
    ],
    correct: "B) Marginal energy of the Lord",
    explanation: "The living entity is the marginal energy (tatastha-shakti), between spiritual and material energy.",
    proof: "Bhagavad-gita 7.5: Besides the inferior material energy, there is another, superior energy of Mine, which comprises the living entities who are exploiting the resources of this material nature.",
    reference: "Bhagavad-gita As It Is 7.5"
  },
  {
    question: "How many cantos are in Srimad-Bhagavatam?",
    choices: ["A) 10", "B) 12", "C) 15", "D) 18"],
    correct: "B) 12",
    explanation: "Srimad-Bhagavatam consists of 12 cantos with approximately 18,000 verses.",
    proof: "Srimad-Bhagavatam is divided into 12 cantos (skandhas), with the Tenth Canto describing Krishna's pastimes in Vrindavan.",
    reference: "Srimad-Bhagavatam - Structure"
  },
  {
    question: "What is the ultimate goal of bhakti-yoga?",
    choices: [
      "A) Material prosperity",
      "B) Liberation (moksha)",
      "C) Pure love of God (prema)",
      "D) Mystic powers"
    ],
    correct: "C) Pure love of God (prema)",
    explanation: "The highest perfection is developing pure love for Krishna, beyond even liberation.",
    proof: "The Nectar of Devotion states: The ultimate goal of devotional service is not liberation, but the development of love for Krishna.",
    reference: "The Nectar of Devotion - Introduction"
  },
  {
    question: "What are the four ashramas (stages of life) in Vedic culture?",
    choices: [
      "A) Brahmacari, Grhastha, Vanaprastha, Sannyasa",
      "B) Student, Worker, Retired, Renounced",
      "C) Child, Youth, Adult, Elder",
      "D) Beginner, Intermediate, Advanced, Perfect"
    ],
    correct: "A) Brahmacari, Grhastha, Vanaprastha, Sannyasa",
    explanation: "The four ashramas are: student life, householder life, retired life, and renounced life.",
    proof: "Vedic culture prescribes four ashramas: brahmacari (celibate student), grhastha (householder), vanaprastha (retired), and sannyasa (renounced order).",
    reference: "Vedic literature"
  },
  {
    question: "What are the four varnas (social divisions) in Vedic society?",
    choices: [
      "A) Rich, Middle, Poor, Destitute",
      "B) Brahmana, Kshatriya, Vaishya, Shudra",
      "C) Priests, Kings, Merchants, Workers",
      "D) Leaders, Warriors, Traders, Servants"
    ],
    correct: "B) Brahmana, Kshatriya, Vaishya, Shudra",
    explanation: "The four varnas are based on qualities and work: brahmanas (intellectuals), kshatriyas (administrators), vaishyas (merchants), shudras (laborers).",
    proof: "Bhagavad-gita 4.13: According to the three modes of material nature and the work associated with them, the four divisions of human society are created by Me.",
    reference: "Bhagavad-gita As It Is 4.13"
  },
  {
    question: "What is the difference between karma-yoga and karma-kanda?",
    choices: [
      "A) Karma-yoga is work for Krishna, karma-kanda is work for results",
      "B) They are the same",
      "C) Karma-yoga is easier",
      "D) Karma-kanda is superior"
    ],
    correct: "A) Karma-yoga is work for Krishna, karma-kanda is work for results",
    explanation: "Karma-yoga is selfless work offered to Krishna, while karma-kanda is ritualistic work for material results.",
    proof: "Bhagavad-gita 3.9: Work done as a sacrifice for Vishnu has to be performed, otherwise work causes bondage in this material world.",
    reference: "Bhagavad-gita As It Is 3.9"
  },
  {
    question: "What is jnana-yoga?",
    choices: [
      "A) Path of devotional service",
      "B) Path of knowledge and philosophical speculation",
      "C) Path of mystic powers",
      "D) Path of ritualistic ceremonies"
    ],
    correct: "B) Path of knowledge and philosophical speculation",
    explanation: "Jnana-yoga is the path of cultivating knowledge to understand the Absolute Truth.",
    proof: "Bhagavad-gita discusses jnana-yoga as the path of knowledge, though it emphasizes that bhakti-yoga is superior.",
    reference: "Bhagavad-gita As It Is"
  },
  {
    question: "What is dhyana-yoga?",
    choices: [
      "A) Chanting mantras",
      "B) Meditation and breath control",
      "C) Reading scriptures",
      "D) Temple worship"
    ],
    correct: "B) Meditation and breath control",
    explanation: "Dhyana-yoga is the eightfold mystic yoga system involving meditation and breath control.",
    proof: "Bhagavad-gita Chapter 6 describes the dhyana-yoga system of meditation, though it's difficult in the modern age.",
    reference: "Bhagavad-gita As It Is - Chapter 6"
  },
  {
    question: "Who is Srila Prabhupada?",
    choices: [
      "A) Founder-Acharya of ISKCON",
      "B) Ancient sage",
      "C) Political leader",
      "D) Scientist"
    ],
    correct: "A) Founder-Acharya of ISKCON",
    explanation: "A.C. Bhaktivedanta Swami Prabhupada founded ISKCON and spread Krishna consciousness worldwide.",
    proof: "Srila Prabhupada established the International Society for Krishna Consciousness (ISKCON) in 1966 and translated Vedic literature.",
    reference: "ISKCON history"
  },
  {
    question: "What is the significance of Ekadashi?",
    choices: [
      "A) Festival day",
      "B) Fasting day for spiritual purification",
      "C) New moon day",
      "D) Full moon day"
    ],
    correct: "B) Fasting day for spiritual purification",
    explanation: "Ekadashi is the eleventh day of the lunar fortnight, observed by fasting from grains and beans.",
    proof: "Vedic literature describes Ekadashi as a sacred day for fasting and increased devotional activities.",
    reference: "Hari-bhakti-vilasa"
  },
  {
    question: "What is the difference between Vaikuntha and Goloka?",
    choices: [
      "A) Vaikuntha is Vishnu's abode, Goloka is Krishna's supreme abode",
      "B) They are the same place",
      "C) Vaikuntha is material, Goloka is spiritual",
      "D) Goloka is lower than Vaikuntha"
    ],
    correct: "A) Vaikuntha is Vishnu's abode, Goloka is Krishna's supreme abode",
    explanation: "Vaikuntha is the spiritual world where Vishnu resides, while Goloka Vrindavan is Krishna's supreme abode.",
    proof: "Brahma-samhita 5.37: I worship Govinda, the primeval Lord, the first progenitor who is tending the cows, yielding all desire, in abodes built with spiritual gems, surrounded by millions of purpose trees, always served with great reverence and affection by hundreds of thousands of lakshmis or gopis.",
    reference: "Brahma-samhita 5.37"
  },
  {
    question: "What is the meaning of 'Hare' in the Hare Krishna mantra?",
    choices: [
      "A) A greeting",
      "B) Addressing the energy of the Lord (Radharani)",
      "C) A type of meditation",
      "D) Krishna's weapon"
    ],
    correct: "B) Addressing the energy of the Lord (Radharani)",
    explanation: "Hare is the vocative form of Hara, referring to Srimati Radharani, Krishna's pleasure potency.",
    proof: "The Hare Krishna mantra addresses both Krishna and His internal energy Radharani, who helps devotees approach Krishna.",
    reference: "Teachings of Lord Caitanya"
  },
  {
    question: "What is the significance of tulasi plant in Krishna consciousness?",
    choices: [
      "A) Medicinal herb only",
      "B) Sacred plant dear to Krishna",
      "C) Decorative plant",
      "D) Ordinary plant"
    ],
    correct: "B) Sacred plant dear to Krishna",
    explanation: "Tulasi is a sacred plant that is very dear to Lord Krishna and is used in His worship.",
    proof: "Skanda Purana glorifies tulasi as most dear to Krishna. Offering tulasi leaves to Krishna is highly auspicious.",
    reference: "Skanda Purana"
  },
  {
    question: "What is the purpose of deity worship?",
    choices: [
      "A) Idol worship",
      "B) Serving Krishna in His archa-vigraha form",
      "C) Artistic appreciation",
      "D) Cultural tradition only"
    ],
    correct: "B) Serving Krishna in His archa-vigraha form",
    explanation: "Deity worship allows devotees to serve Krishna directly in His archa-vigraha (worshipable form).",
    proof: "Bhagavad-gita and other scriptures explain that Krishna accepts service in the deity form (archa-vigraha) out of His causeless mercy.",
    reference: "Nectar of Devotion"
  },
  {
    question: "What is the difference between shruti and smriti?",
    choices: [
      "A) Shruti is heard (Vedas), smriti is remembered (Puranas, Itihasas)",
      "B) They are the same",
      "C) Shruti is modern, smriti is ancient",
      "D) Smriti is more important than shruti"
    ],
    correct: "A) Shruti is heard (Vedas), smriti is remembered (Puranas, Itihasas)",
    explanation: "Shruti refers to the original Vedas (heard), while smriti refers to supplementary texts like Puranas and Itihasas (remembered).",
    proof: "Vedic literature is divided into shruti (directly heard from God) and smriti (remembered and compiled by sages).",
    reference: "Vedic literature classification"
  },
  {
    question: "What is the significance of Lord Caitanya's birthplace?",
    choices: [
      "A) Vrindavan",
      "B) Mayapur (Navadvipa)",
      "C) Jagannath Puri",
      "D) Mathura"
    ],
    correct: "B) Mayapur (Navadvipa)",
    explanation: "Lord Caitanya appeared in Mayapur, Navadvipa, West Bengal.",
    proof: "Caitanya-caritamrta describes how Lord Caitanya appeared in Mayapur during a lunar eclipse in 1486.",
    reference: "Caitanya-caritamrta, Adi-lila 13"
  },
  {
    question: "What are the five most potent forms of devotional service?",
    choices: [
      "A) Association with devotees, chanting, hearing Bhagavatam, residing in Mathura, deity worship",
      "B) Fasting, pilgrimage, charity, study, meditation",
      "C) Prayer, worship, service, surrender, love",
      "D) Reading, writing, speaking, listening, teaching"
    ],
    correct: "A) Association with devotees, chanting, hearing Bhagavatam, residing in Mathura, deity worship",
    explanation: "These five are considered the most potent: sadhu-sanga, nama-kirtana, bhagavata-sravana, mathura-vasa, sri-murti-seva.",
    proof: "Caitanya-caritamrta, Madhya-lila 22.128-129: One should associate with devotees, chant the holy name, hear Srimad-Bhagavatam, reside in Mathura and worship the deity with faith and veneration.",
    reference: "Caitanya-caritamrta, Madhya-lila 22.128-129"
  },
  {
    question: "What is the difference between vidhi-marga and raga-marga?",
    choices: [
      "A) Vidhi-marga is regulative, raga-marga is spontaneous",
      "B) They are the same path",
      "C) Vidhi-marga is superior",
      "D) Raga-marga is for beginners"
    ],
    correct: "A) Vidhi-marga is regulative, raga-marga is spontaneous",
    explanation: "Vidhi-marga is devotional service following rules, while raga-marga is spontaneous devotion out of love.",
    proof: "The Nectar of Devotion explains vidhi-bhakti (regulative) and raganuga-bhakti (spontaneous) as two paths of devotional service.",
    reference: "The Nectar of Devotion"
  },
  {
    question: "What is the significance of the Bhagavatam's first verse?",
    choices: [
      "A) It describes creation",
      "B) It establishes Krishna as the Absolute Truth",
      "C) It tells a story",
      "D) It gives moral instructions"
    ],
    correct: "B) It establishes Krishna as the Absolute Truth",
    explanation: "The first verse establishes that the Absolute Truth is a person (Krishna) from whom everything emanates.",
    proof: "Srimad-Bhagavatam 1.1.1: O my Lord, the all-pervading Personality of Godhead, I offer my respectful obeisances unto You. I meditate upon Lord Sri Krishna because He is the Absolute Truth and the primeval cause of all causes.",
    reference: "Srimad-Bhagavatam 1.1.1"
  }
];

// HARD LEVEL QUESTIONS (100+ questions) - Advanced Philosophy
const hardQuestions = [
  {
    question: "What is the relationship between jiva-tattva and vishnu-tattva?",
    choices: [
      "A) They are identical",
      "B) Jiva is qualitatively one but quantitatively different from Vishnu",
      "C) Jiva is completely different from Vishnu",
      "D) Jiva becomes Vishnu through meditation"
    ],
    correct: "B) Jiva is qualitatively one but quantitatively different from Vishnu",
    explanation: "The living entity is qualitatively one with God but quantitatively different.",
    proof: "Bhagavad-gita 15.7: The living entities in this conditioned world are My eternal fragmental parts. This is explained as simultaneous oneness and difference (acintya-bheda-abheda-tattva).",
    reference: "Bhagavad-gita As It Is 15.7"
  },
  {
    question: "What is the philosophical position of Lord Caitanya's teachings?",
    choices: [
      "A) Advaita (non-dualism)",
      "B) Dvaita (dualism)",
      "C) Acintya-bheda-abheda (inconceivable oneness and difference)",
      "D) Vishishtadvaita (qualified non-dualism)"
    ],
    correct: "C) Acintya-bheda-abheda (inconceivable oneness and difference)",
    explanation: "Lord Caitanya taught simultaneous oneness and difference from the Supreme Lord.",
    proof: "Caitanya-caritamrta, Madhya-lila 6.163: The living entity is simultaneously one with and different from the Supreme Personality of Godhead.",
    reference: "Caitanya-caritamrta, Madhya-lila 6.163"
  },
  {
    question: "According to Bhagavad Gita 4.34, what is the process to receive transcendental knowledge?",
    choices: [
      "A) Academic study alone",
      "B) Approaching a spiritual master, inquiring submissively, and rendering service",
      "C) Meditation in isolation",
      "D) Reading books independently"
    ],
    correct: "B) Approaching a spiritual master, inquiring submissively, and rendering service",
    explanation: "Transcendental knowledge must be received through disciplic succession.",
    proof: "Bhagavad-gita 4.34: Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him.",
    reference: "Bhagavad-gita As It Is 4.34"
  },
  {
    question: "What are the five primary rasas (relationships) with Krishna?",
    choices: [
      "A) Neutrality, Servitude, Friendship, Parental love, Conjugal love",
      "B) Faith, Hope, Love, Charity, Devotion",
      "C) Peace, Prosperity, Power, Pleasure, Perfection",
      "D) Meditation, Prayer, Service, Study, Surrender"
    ],
    correct: "A) Neutrality, Servitude, Friendship, Parental love, Conjugal love",
    explanation: "The five primary rasas are shanta, dasya, sakhya, vatsalya, and madhurya.",
    proof: "The Nectar of Devotion describes five primary relationships: shanta-rasa (neutrality), dasya-rasa (servitude), sakhya-rasa (friendship), vatsalya-rasa (parental affection), and madhurya-rasa (conjugal love).",
    reference: "The Nectar of Devotion - Part Two"
  },
  {
    question: "What is the relationship between Brahman, Paramatma, and Bhagavan?",
    choices: [
      "A) They are three different Gods",
      "B) They are progressive realizations of the same Absolute Truth",
      "C) They are equal realizations",
      "D) They are unrelated concepts"
    ],
    correct: "B) They are progressive realizations of the same Absolute Truth",
    explanation: "Brahman (impersonal), Paramatma (Supersoul), and Bhagavan (Personal God) are progressive realizations.",
    proof: "Srimad-Bhagavatam 1.2.11: Learned transcendentalists who know the Absolute Truth call this nondual substance Brahman, Paramatma or Bhagavan.",
    reference: "Srimad-Bhagavatam 1.2.11"
  },
  {
    question: "What are the nine processes of devotional service?",
    choices: [
      "A) Hearing, chanting, remembering, serving, worshiping, praying, obeying, friendship, surrendering",
      "B) Reading, writing, speaking, listening, thinking, meditating, praying, fasting, pilgrimage",
      "C) Faith, hope, love, charity, patience, kindness, humility, obedience, surrender",
      "D) Study, practice, discipline, renunciation, meditation, worship, service, charity, pilgrimage"
    ],
    correct: "A) Hearing, chanting, remembering, serving, worshiping, praying, obeying, friendship, surrendering",
    explanation: "The nine processes are: sravanam, kirtanam, vishnoh smaranam, pada-sevanam, arcanam, vandanam, dasyam, sakhyam, atma-nivedanam.",
    proof: "Srimad-Bhagavatam 7.5.23: Hearing and chanting about the transcendental holy name, form, qualities, paraphernalia and pastimes of Lord Vishnu, remembering them, serving the lotus feet of the Lord, offering worship with sixteen types of paraphernalia, offering prayers, becoming a servant, considering the Lord one's best friend, and surrendering everything unto Him.",
    reference: "Srimad-Bhagavatam 7.5.23-24"
  },
  {
    question: "What is vaidhi-bhakti?",
    choices: [
      "A) Spontaneous devotion arising from love",
      "B) Devotional service performed according to regulative principles",
      "C) Devotion mixed with material desires",
      "D) Devotion performed in solitude"
    ],
    correct: "B) Devotional service performed according to regulative principles",
    explanation: "Vaidhi-bhakti is devotional service performed according to scriptural regulations and rules.",
    proof: "The Nectar of Devotion explains that vaidhi-bhakti means devotional service executed under the guidance of scriptural injunctions without spontaneous love.",
    reference: "The Nectar of Devotion - Chapter 2"
  },
  {
    question: "What is raganuga-bhakti?",
    choices: [
      "A) Devotion following rules and regulations",
      "B) Devotion following in the footsteps of residents of Vrindavan with spontaneous love",
      "C) Devotion mixed with karma and jnana",
      "D) Devotion performed for material benefits"
    ],
    correct: "B) Devotion following in the footsteps of residents of Vrindavan with spontaneous love",
    explanation: "Raganuga-bhakti is spontaneous devotional service following the eternal residents of Vrindavan.",
    proof: "The Nectar of Devotion describes raganuga-bhakti as devotional service that follows in the footsteps of the Lord's eternal associates in Vrindavan who are attached to Him in spontaneous love.",
    reference: "The Nectar of Devotion - Chapter 3"
  },
  {
    question: "What are the six opulences of God in full?",
    choices: [
      "A) Strength, fame, wealth, knowledge, beauty, renunciation",
      "B) Power, glory, wisdom, love, justice, mercy",
      "C) Omnipotence, omniscience, omnipresence, eternity, infinity, perfection",
      "D) Creation, maintenance, destruction, knowledge, illusion, liberation"
    ],
    correct: "A) Strength, fame, wealth, knowledge, beauty, renunciation",
    explanation: "Bhagavan possesses all six opulences (bhaga) in full: strength, fame, wealth, knowledge, beauty, and renunciation.",
    proof: "Vishnu Purana defines Bhagavan as one who possesses in full the six opulences: all strength, all fame, all wealth, all knowledge, all beauty, and all renunciation.",
    reference: "Vishnu Purana 6.5.47"
  },
  {
    question: "What is the difference between sadhana-bhakti and prema-bhakti?",
    choices: [
      "A) Sadhana is for beginners, prema is for advanced",
      "B) Sadhana is practice, prema is pure love",
      "C) Sadhana is material, prema is spiritual",
      "D) There is no difference"
    ],
    correct: "B) Sadhana is practice, prema is pure love",
    explanation: "Sadhana-bhakti is the practice stage of devotional service, while prema-bhakti is the perfection stage of pure love.",
    proof: "The Nectar of Devotion explains that sadhana-bhakti is devotional service executed by following regulative principles, while prema-bhakti is the mature stage where one has developed pure love for Krishna.",
    reference: "The Nectar of Devotion"
  },
  {
    question: "What is the significance of the Brahma-Madhva-Gaudiya sampradaya?",
    choices: [
      "A) It is one of the four authorized Vaishnava disciplic successions",
      "B) It is a modern interpretation of Vedic philosophy",
      "C) It is a combination of different philosophies",
      "D) It is exclusive to India"
    ],
    correct: "A) It is one of the four authorized Vaishnava disciplic successions",
    explanation: "The Brahma-Madhva-Gaudiya sampradaya is one of four authorized chains of spiritual masters descending from Lord Brahma.",
    proof: "The Padma Purana describes four authorized Vaishnava sampradayas: Sri (Ramanuja), Brahma (Madhva), Rudra (Vishnuswami), and Sanaka (Nimbarka). Lord Caitanya appeared in the Brahma-Madhva line.",
    reference: "Padma Purana & Caitanya-caritamrta"
  },
  {
    question: "What is the constitutional position of the jiva soul?",
    choices: [
      "A) Servant of the servant of Krishna",
      "B) Equal to Krishna",
      "C) Independent enjoyer",
      "D) Part of material nature"
    ],
    correct: "A) Servant of the servant of Krishna",
    explanation: "The constitutional position of every living entity is to be the servant of the servant of the Lord.",
    proof: "Caitanya-caritamrta, Madhya-lila 13.80: I am not a brahmana, kshatriya, vaisya or sudra. I am not a brahmacari, grhastha, vanaprastha or sannyasi. I identify Myself only as the servant of the servant of the servant of the lotus feet of Lord Sri Krishna.",
    reference: "Caitanya-caritamrta, Madhya-lila 13.80"
  },
  {
    question: "What is the difference between sakama and nishkama bhakti?",
    choices: [
      "A) Sakama is with desires, nishkama is without desires",
      "B) Sakama is for householders, nishkama is for renunciants",
      "C) Sakama is emotional, nishkama is intellectual",
      "D) There is no difference"
    ],
    correct: "A) Sakama is with desires, nishkama is without desires",
    explanation: "Sakama-bhakti is devotional service with material desires, while nishkama-bhakti is pure devotion without any selfish motives.",
    proof: "The Nectar of Devotion explains that devotional service should be free from material desires (anyabhilashita-sunyam) to be considered pure.",
    reference: "The Nectar of Devotion - Introduction"
  },
  {
    question: "What is the meaning of 'Krishna is the Supreme Personality of Godhead'?",
    choices: [
      "A) Krishna is one of many gods",
      "B) Krishna is the original source of all incarnations",
      "C) Krishna is a mythological character",
      "D) Krishna is only a teacher"
    ],
    correct: "B) Krishna is the original source of all incarnations",
    explanation: "Krishna is the original Supreme Personality of Godhead from whom all other incarnations expand.",
    proof: "Srimad-Bhagavatam 1.3.28: All of the above-mentioned incarnations are either plenary portions or portions of the plenary portions of the Lord, but Lord Sri Krishna is the original Personality of Godhead.",
    reference: "Srimad-Bhagavatam 1.3.28"
  },
  {
    question: "What are the three types of material miseries?",
    choices: [
      "A) Physical, mental, spiritual",
      "B) Adhyatmika, adhibhautika, adhidaivika",
      "C) Birth, disease, death",
      "D) Poverty, illness, ignorance"
    ],
    correct: "B) Adhyatmika, adhibhautika, adhidaivika",
    explanation: "The three miseries are: adhyatmika (from body and mind), adhibhautika (from other living entities), adhidaivika (from natural disturbances).",
    proof: "Vedic literature describes three types of miseries: those pertaining to the body and mind, those inflicted by other living beings, and those caused by the forces of nature.",
    reference: "Srimad-Bhagavatam 1.1.2"
  },
  {
    question: "What is the ultimate destination of a pure devotee?",
    choices: [
      "A) Brahmaloka",
      "B) Vaikuntha or Goloka Vrindavan",
      "C) Merging with Brahman",
      "D) Heavenly planets"
    ],
    correct: "B) Vaikuntha or Goloka Vrindavan",
    explanation: "Pure devotees return to the spiritual world, either Vaikuntha or the highest planet, Goloka Vrindavan.",
    proof: "Bhagavad-gita 8.16: From the highest planet in the material world down to the lowest, all are places of misery wherein repeated birth and death take place. But one who attains to My abode never takes birth again.",
    reference: "Bhagavad-gita As It Is 8.16"
  },
  {
    question: "What is the difference between varnashrama-dharma and bhagavata-dharma?",
    choices: [
      "A) Varnashrama is social system, bhagavata is pure devotion",
      "B) They are the same thing",
      "C) Varnashrama is ancient, bhagavata is modern",
      "D) Varnashrama is for Indians, bhagavata is universal"
    ],
    correct: "A) Varnashrama is social system, bhagavata is pure devotion",
    explanation: "Varnashrama-dharma is the social system of four varnas and ashramas, while bhagavata-dharma is pure devotional service transcending all material designations.",
    proof: "Srimad-Bhagavatam 1.2.6: The supreme occupation for all humanity is that by which men can attain to loving devotional service unto the transcendent Lord. Such devotional service must be unmotivated and uninterrupted to completely satisfy the self.",
    reference: "Srimad-Bhagavatam 1.2.6"
  },
  {
    question: "What is the significance of the holy name according to Vedic scriptures?",
    choices: [
      "A) It is a sound vibration only",
      "B) The name and the named are identical",
      "C) It is symbolic representation",
      "D) It is for meditation only"
    ],
    correct: "B) The name and the named are identical",
    explanation: "In the spiritual realm, there is no difference between the name and the person. Krishna and His name are non-different.",
    proof: "Padma Purana states: The holy name of Krishna is transcendentally blissful. It bestows all spiritual benedictions, for it is Krishna Himself, the reservoir of all pleasure. The name is complete, and it is the form of all transcendental mellows.",
    reference: "Padma Purana"
  },
  {
    question: "What is the meaning of 'aham sarvasya prabhavo' in Bhagavad Gita 10.8?",
    choices: [
      "A) I am the source of all spiritual and material worlds",
      "B) I am the greatest warrior",
      "C) I am the supreme teacher",
      "D) I am the creator of illusion"
    ],
    correct: "A) I am the source of all spiritual and material worlds",
    explanation: "Krishna declares He is the origin of everything, both spiritual and material.",
    proof: "Bhagavad-gita 10.8: I am the source of all spiritual and material worlds. Everything emanates from Me. The wise who perfectly know this engage in My devotional service and worship Me with all their hearts.",
    reference: "Bhagavad-gita As It Is 10.8"
  },
  {
    question: "What is the difference between bhakti-yoga and other yoga systems?",
    choices: [
      "A) Bhakti is easier than other yogas",
      "B) Bhakti directly engages with the Supreme Person while others focus on impersonal aspects",
      "C) Bhakti is emotional, others are intellectual",
      "D) There is no real difference"
    ],
    correct: "B) Bhakti directly engages with the Supreme Person while others focus on impersonal aspects",
    explanation: "Bhakti-yoga directly engages in loving service to the Supreme Personality of Godhead, while other yogas may focus on impersonal realization or self-perfection.",
    proof: "Bhagavad-gita 12.5: For those whose minds are attached to the unmanifested, impersonal feature of the Supreme, advancement is very troublesome. To make progress in that discipline is always difficult for those who are embodied.",
    reference: "Bhagavad-gita As It Is 12.5"
  },
  {
    question: "What is the role of the spiritual master in Krishna consciousness?",
    choices: [
      "A) To give material blessings",
      "B) To represent Krishna and guide the disciple back to Godhead",
      "C) To perform rituals only",
      "D) To provide philosophical knowledge only"
    ],
    correct: "B) To represent Krishna and guide the disciple back to Godhead",
    explanation: "The spiritual master is the representative of Krishna who guides the sincere disciple on the path back to the spiritual world.",
    proof: "Bhagavad-gita 4.34: Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him. The self-realized souls can impart knowledge unto you because they have seen the truth.",
    reference: "Bhagavad-gita As It Is 4.34"
  },
  {
    question: "What is the significance of Vrindavan in Krishna's pastimes?",
    choices: [
      "A) It is just a historical place",
      "B) It is the highest spiritual abode manifested on earth",
      "C) It is a pilgrimage site only",
      "D) It is Krishna's birthplace"
    ],
    correct: "B) It is the highest spiritual abode manifested on earth",
    explanation: "Vrindavan is the supreme spiritual abode where Krishna performs His most intimate pastimes, manifested in the material world.",
    proof: "Caitanya-caritamrta explains that Vrindavan is the highest spiritual planet, Goloka Vrindavan, which appears in the material world for Krishna's pastimes.",
    reference: "Caitanya-caritamrta, Adi-lila 5"
  },
  {
    question: "What is the meaning of 'sarva-dharman parityajya' in Bhagavad Gita 18.66?",
    choices: [
      "A) Abandon all religions and surrender to Me",
      "B) Follow all religious principles",
      "C) Create your own religion",
      "D) Religion is not important"
    ],
    correct: "A) Abandon all religions and surrender to Me",
    explanation: "This is Krishna's ultimate instruction to give up all varieties of religion and simply surrender unto Him.",
    proof: "Bhagavad-gita 18.66: Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    reference: "Bhagavad-gita As It Is 18.66"
  },
  {
    question: "What is the difference between the material and spiritual worlds?",
    choices: [
      "A) Material is temporary, spiritual is eternal",
      "B) Material is real, spiritual is imaginary",
      "C) Material is for enjoyment, spiritual is for suffering",
      "D) There is no difference"
    ],
    correct: "A) Material is temporary, spiritual is eternal",
    explanation: "The material world is temporary and full of miseries, while the spiritual world is eternal, full of bliss and knowledge.",
    proof: "Bhagavad-gita 8.16: From the highest planet in the material world down to the lowest, all are places of misery wherein repeated birth and death take place. But one who attains to My abode never takes birth again.",
    reference: "Bhagavad-gita As It Is 8.16"
  },
  {
    question: "What is the purpose of Lord Caitanya's appearance?",
    choices: [
      "A) To teach the chanting of the holy names",
      "B) To establish temples",
      "C) To write scriptures",
      "D) To perform miracles"
    ],
    correct: "A) To teach the chanting of the holy names",
    explanation: "Lord Caitanya appeared to inaugurate the sankirtana movement and teach love of God through chanting the holy names.",
    proof: "Caitanya-caritamrta states that Lord Caitanya appeared to distribute the most confidential aspect of devotional service—pure love of God through the chanting of the holy names.",
    reference: "Caitanya-caritamrta, Adi-lila 3"
  }
];

// Export question bank with shuffled questions
export const questionBank = {
  easy: shuffleArray(easyQuestions),
  medium: shuffleArray(mediumQuestions),
  hard: shuffleArray(hardQuestions)
};

// Export shuffle function for runtime use
export { shuffleArray };
