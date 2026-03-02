// Path: app/api/reviews/route.ts
import { NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imdbId = searchParams.get("id");

    if (!imdbId) return NextResponse.json({ reviews: [], source: "none" });

    // Better approach: Find TMDB ID directly using IMDB ID
    // This avoids title-matching errors
    const findRes = await fetch(
      `${TMDB_BASE}/find/${imdbId}?api_key=${process.env.TMDB_API_KEY}&external_source=imdb_id`,
    );

    const findData = await findRes.json();
    const movie = findData.movie_results?.[0];

    if (!movie) {
      return NextResponse.json({ reviews: [], source: "tmdb-not-found" });
    }

    const reviewRes = await fetch(
      `${TMDB_BASE}/movie/${movie.id}/reviews?api_key=${process.env.TMDB_API_KEY}`,
    );

    const reviewData = await reviewRes.json();
    const reviews = reviewData.results?.map((r: any) => r.content) || [];
    console.log(
      `Fetched ${reviews.length} reviews for IMDB ID ${imdbId} (TMDB ID ${movie.id})`,
    );
    return NextResponse.json({
      reviews,
      source: reviews.length ? "tmdb" : "tmdb-empty",
    });
  } catch (error) {
    console.error("TMDB ERROR:", error);
    return NextResponse.json({ reviews: [], source: "fallback" });
  }
}
