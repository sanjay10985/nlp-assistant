import express from "express";
import cors from "cors";
import natural from "natural";
import rs from "text-readability";

const app = express();
app.use(cors());
app.use(express.json());

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const sentiment = new natural.SentimentAnalyzer("English", stemmer, "afinn");
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

app.post("/analyze", (req, res) => {
  const { text } = req.body;

  const tokens = tokenizer.tokenize(text);
  const wordCount = tokens.length;
  const sentenceCount = text.split(/[.!?]+/).length;

  // Sentiment analysis
  const sentimentScore = sentiment.getSentiment(tokens);
  // Readability scores
  const fkGrade = rs.fleschKincaidGrade(text);
  const fReadingEase = rs.fleschReadingEase(text);

  // Advanced analysis
  const posTagging = performPOSTagging(tokens);
  const keyPhrases = extractKeyPhrases(text);
  const suggestions = generateSuggestions(text, tokens, posTagging);

  res.json({
    wordCount,
    sentenceCount,
    tokens: tokens.slice(0, 10), // Return only first 10 tokens
    sentiment: sentimentScore,
    readability: {
      fleschKincaidGrade: fkGrade,
      fleschReadingEase: fReadingEase,
    },
    posTagging,
    keyPhrases,
    suggestions,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function performPOSTagging(tokens) {
  const language = "EN";
  const defaultCategory = "N";
  const defaultCategoryCapitalized = "NNP";
  const lexicon = new natural.Lexicon(
    language,
    defaultCategory,
    defaultCategoryCapitalized
  );
  const ruleSet = new natural.RuleSet("EN");
  const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

  return tagger.tag(tokens).taggedWords;
}

function extractKeyPhrases(text, tokens) {
  tfidf.addDocument(text);
  const items = tfidf.listTerms(0);
  const keyPhrases = items.slice(0, 3).map((item) => item.term); // Return top 3 key phrases

  // If we couldn't extract key phrases, return important words based on POS
  if (keyPhrases.length === 0) {
    const importantPos = ["NN", "NNP", "NNPS", "NNS", "JJ"];
    return tokens
      .filter((token, index) =>
        importantPos.includes(performPOSTagging([token])[0].tag)
      )
      .slice(0, 3);
  }

  return keyPhrases;
}

function generateSuggestions(text, tokens, posTagging, sentimentScore) {
  const suggestions = [];

  // Check for short text
  if (tokens.length < 20) {
    suggestions.push({
      type: "length",
      message:
        "Consider expanding your text for a more comprehensive analysis.",
    });
  }

  // Check for repeated words
  const repeatedWords = findRepeatedWords(tokens);
  if (repeatedWords.length > 0) {
    suggestions.push({
      type: "repetition",
      message: `Consider varying your word choice. Repeated words: ${repeatedWords.join(
        ", "
      )}`,
    });
  }

  // Sentiment-based suggestion
  if (sentimentScore < -0.5) {
    suggestions.push({
      type: "sentiment",
      message:
        "The text has a very negative tone. Consider revising if a more neutral or positive tone is desired.",
    });
  } else if (sentimentScore > 0.5) {
    suggestions.push({
      type: "sentiment",
      message:
        "The text has a very positive tone. Ensure this aligns with your intended message.",
    });
  }

  // Ensure we always return at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push({
      type: "general",
      message:
        "Your writing looks good! Consider adding more detail or expanding on your ideas.",
    });
  }

  return suggestions;
}

function findRepeatedWords(tokens) {
  const wordCounts = {};
  tokens.forEach((token) => {
    wordCounts[token.toLowerCase()] =
      (wordCounts[token.toLowerCase()] || 0) + 1;
  });
  return Object.keys(wordCounts).filter(
    (word) => wordCounts[word] > 1 && word.length > 3
  );
}

function findLongSentences(text) {
  return text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.split(" ").length > 20);
}

function detectPassiveVoice(posTagging) {
  return posTagging.filter((item, index, array) => {
    if (item.tag === "VBN") {
      const previousWords = array.slice(Math.max(0, index - 3), index);
      return previousWords.some((word) =>
        ["am", "is", "are", "was", "were", "be", "been", "being"].includes(
          word.token.toLowerCase()
        )
      );
    }
    return false;
  });
}
