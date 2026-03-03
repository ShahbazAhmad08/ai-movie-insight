import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

type TmdbReview = {
  content: string;
};

type TmdbReviewResponse = {
  results?: TmdbReview[];
};

type TmdbFindResponse = {
  movie_results?: { id: number }[];
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imdbId = searchParams.get("id");

    if (!imdbId) return NextResponse.json({ reviews: [], source: "none" });

    const findRes = await fetch(
      `${TMDB_BASE}/find/${imdbId}?api_key=${process.env.TMDB_API_KEY}&external_source=imdb_id`,
    );

    if (!findRes.ok) {
      return NextResponse.json({ reviews: [], source: "tmdb-error" });
    }

    const findData: TmdbFindResponse = await findRes.json();
    const movie = findData.movie_results?.[0];

    if (!movie) {
      return NextResponse.json({ reviews: [], source: "tmdb-not-found" });
    }

    const reviewRes = await fetch(
      `${TMDB_BASE}/movie/${movie.id}/reviews?api_key=${process.env.TMDB_API_KEY}`,
    );

    if (!reviewRes.ok) {
      return NextResponse.json({ reviews: [], source: "tmdb-error" });
    }

    const reviewData: TmdbReviewResponse = await reviewRes.json();
    const reviews = reviewData.results?.map((r) => r.content) ?? [];

    return NextResponse.json({
      reviews,
      source: reviews.length ? "tmdb" : "tmdb-empty",
    });
  } catch (error) {
    console.error("TMDB ERROR:", error);
    return NextResponse.json({ reviews: [], source: "fallback" });
  }
}
