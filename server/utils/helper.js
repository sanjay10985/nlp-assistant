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

function extractKeyPhrases(text) {
  tfidf.addDocument(text);
  const items = tfidf.listTerms(0);
  return items.slice(0, 5).map((item) => item.term); // Return top 5 key phrases
}

function generateSuggestions(text, tokens, posTagging) {
  const suggestions = [];

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

  // Check for sentence length
  const longSentences = findLongSentences(text);
  if (longSentences.length > 0) {
    suggestions.push({
      type: "sentence_length",
      message: `Consider breaking up long sentences for better readability.`,
    });
  }

  // Check for passive voice
  const passiveVoice = detectPassiveVoice(posTagging);
  if (passiveVoice.length > 0) {
    suggestions.push({
      type: "passive_voice",
      message: `Consider using active voice for more engaging writing.`,
    });
  }

  return suggestions;
}

function findRepeatedWords(tokens) {
  const wordCounts = {};
  tokens.forEach((token) => {
    wordCounts[token] = (wordCounts[token] || 0) + 1;
  });
  return Object.keys(wordCounts).filter((word) => wordCounts[word] > 3);
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
