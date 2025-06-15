/**
 * Fallback typing content and content management utilities
 */

export const fallbackQuotes = [
  {
    content:
      "The only way to do great work is to love what you do. Stay hungry, stay foolish, and never give up on your dreams.",
    author: "Steve Jobs",
    tags: ["motivational", "work", "dreams"],
    category: "motivational",
  },
  {
    content:
      "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward.",
    author: "Winston Churchill",
    tags: ["wisdom", "perseverance", "courage"],
    category: "wisdom",
  },
  {
    content:
      "Innovation distinguishes between a leader and a follower. Think different and make your mark on the world.",
    author: "Steve Jobs",
    tags: ["innovation", "leadership", "creativity"],
    category: "innovation",
  },
  {
    content:
      "The future belongs to those who believe in the beauty of their dreams. Chase your aspirations with unwavering determination.",
    author: "Eleanor Roosevelt",
    tags: ["future", "dreams", "determination"],
    category: "inspirational",
  },
  {
    content:
      "It is during our darkest moments that we must focus to see the light. Resilience is the key to overcoming any obstacle.",
    author: "Aristotle",
    tags: ["resilience", "hope", "strength"],
    category: "wisdom",
  },
  {
    content:
      "The way to get started is to quit talking and begin doing. Action is the foundational key to all success.",
    author: "Walt Disney",
    tags: ["action", "success", "productivity"],
    category: "motivational",
  },
  {
    content:
      "Life is what happens to you while you're busy making other plans. Embrace the unexpected and find joy in every moment.",
    author: "John Lennon",
    tags: ["life", "mindfulness", "acceptance"],
    category: "philosophical",
  },
  {
    content:
      "The only impossible journey is the one you never begin. Take that first step towards your goals today.",
    author: "Tony Robbins",
    tags: ["journey", "goals", "beginning"],
    category: "motivational",
  },
];

export const practiceTexts = [
  {
    content:
      "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once.",
    author: "Classic Pangram",
    tags: ["practice", "alphabet"],
    category: "practice",
  },
  {
    content:
      "Pack my box with five dozen liquor jugs. Waltz, bad nymph, for quick jigs vex. How vexingly quick daft zebras jump!",
    author: "Pangram Collection",
    tags: ["practice", "alphabet", "typing"],
    category: "practice",
  },
  {
    content:
      "Programming is the art of telling another human what one wants the computer to do. Code is poetry written in logic.",
    author: "Donald Knuth",
    tags: ["programming", "technology", "logic"],
    category: "technology",
  },
];

export const getRandomQuote = (category = null) => {
  let availableQuotes = [...fallbackQuotes];

  if (category && category !== "all") {
    availableQuotes = fallbackQuotes.filter(
      (quote) => quote.category === category || quote.tags.includes(category)
    );

    // If no quotes found for the category, use all quotes
    if (availableQuotes.length === 0) {
      availableQuotes = [...fallbackQuotes];
    }
  }

  return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
};

export const getRandomPracticeText = () => {
  return practiceTexts[Math.floor(Math.random() * practiceTexts.length)];
};

export const getAllCategories = () => {
  const categories = new Set();

  fallbackQuotes.forEach((quote) => {
    categories.add(quote.category);
    quote.tags.forEach((tag) => categories.add(tag));
  });

  return Array.from(categories).sort();
};

export const getQuotesByCategory = (category) => {
  return fallbackQuotes.filter(
    (quote) => quote.category === category || quote.tags.includes(category)
  );
};

export const getDefaultText = () => ({
  content:
    "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once.",
  author: "Classic Pangram",
  category: "practice",
});

// API endpoint configurations
export const API_CONFIG = {
  quotable: {
    baseUrl: "https://api.quotable.io",
    endpoints: {
      random: "/quotes/random",
      search: "/search/quotes",
    },
  },
};

// Content fetching utilities
export const buildQuotableUrl = (options = {}) => {
  const {
    minLength = 50,
    maxLength = 100,
    category = "motivational",
    limit = 1,
  } = options;

  return `${API_CONFIG.quotable.baseUrl}${API_CONFIG.quotable.endpoints.random}?minLength=${minLength}&maxLength=${maxLength}&tags=${category}&limit=${limit}`;
};
