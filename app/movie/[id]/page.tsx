export const dynamic = "force-dynamic";

import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import SentimentCard from "@/components/SentimentCard";
import type { Movie } from "@/types/movie";

// ✅ Resolves the correct base URL on Vercel vs localhost
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
    const res = await fetch(`${baseUrl}/api/movie?id=${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getReviews(id: string): Promise<string[]> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/reviews?id=${id}`, { cache: "no-store" });
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

// ✅ Next.js 15: params is a Promise
export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await getMovie(id);

  if (!movie) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center space-y-3">
          <p className="text-6xl">🎬</p>
          <h1 className="text-2xl font-bold text-white">Movie Not Found</h1>
          <p className="text-gray-400 text-sm">
            No movie found for IMDb ID <span className="font-mono text-indigo-400">{id}</span>.
            <br />
            Make sure it starts with <span className="font-mono">tt</span> followed by digits.
          </p>
        </div>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          ← Try Another Movie
        </Link>
      </main>
    );
  }

  const reviews = await getReviews(id);
  const sentiment = await getSentiment(movie, reviews);

  return (
    <main className="min-h-screen p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Back navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
      >
        ← Back to Search
      </Link>

      <MovieCard movie={movie} />
      {sentiment && <SentimentCard sentiment={sentiment} />}
    </main>
  );
}
