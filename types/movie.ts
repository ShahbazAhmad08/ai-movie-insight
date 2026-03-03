export type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbRating: string;
  Actors: string;
  Genre: string;
  Plot: string;
};

export type SentimentResult = {
  summary: string;
  sentiment: "positive" | "mixed" | "negative";
};
