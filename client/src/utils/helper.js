export function getSentimentDescription(score) {
  if (score > 0.5) return "Very Positive";
  if (score > 0) return "Positive";
  if (score === 0) return "Neutral";
  if (score > -0.5) return "Negative";
  return "Very Negative";
}

export function getReadabilityDescription(score) {
  if (score > 90) return "Very Easy";
  if (score > 80) return "Easy";
  if (score > 70) return "Fairly Easy";
  if (score > 60) return "Standard";
  if (score > 50) return "Fairly Difficult";
  if (score > 30) return "Difficult";
  return "Very Difficult";
}
