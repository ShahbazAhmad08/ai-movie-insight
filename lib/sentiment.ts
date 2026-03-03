// Utility: classify numeric sentiment score into a label
// Used for any future numeric-score-based analysis
export function classifySentiment(score: number): "positive" | "mixed" | "negative" {
  if (score > 0.7) return "positive";
  if (score > 0.4) return "mixed";
  return "negative";
}
