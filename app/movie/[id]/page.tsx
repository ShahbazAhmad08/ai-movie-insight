export const dynamic = "force-dynamic";

import MovieCard from "@/components/MovieCard";
import SentimentCard from "@/components/SentimentCard";
import type { Movie } from "@/types/movie";

// ✅ Fix: VERCEL_URL already contains the full hostname on Vercel (no https:// prefix needed)
// VERCEL_PROJECT_PRODUCTION_URL is the stable production URL, VERCEL_URL is per-deployment
function getBaseUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function getMovie(id: string): Promise<Movie | null> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/movie?id=${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getReviews(id: string): Promise<string[]> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/reviews?id=${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.reviews || [];
  } catch {
    return [];
  }
}

async function getSentiment(
  movie: Movie,
  reviews: string[],
): Promise<{ summary: string; sentiment: "positive" | "mixed" | "negative" } | null> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/sentiment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie, reviews }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ✅ Fix: Next.js 15 — params is now a Promise
export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await getMovie(id);
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Movie not found. Please check the IMDb ID.</p>
      </div>
    );
  }

  const reviews = await getReviews(id);
  const sentiment = await getSentiment(movie, reviews);

  return (
    <main className="min-h-screen p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <MovieCard movie={movie} />
      {sentiment && <SentimentCard sentiment={sentiment} />}
    </main>
  );
}
