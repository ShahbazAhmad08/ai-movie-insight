export function classifySentiment(score: number) {
  if (score > 0.7) return "positive";
  if (score > 0.4) return "mixed";
  return "negative";
}
