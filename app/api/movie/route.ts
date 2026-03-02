import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imdbId = searchParams.get("id");

    if (!imdbId) {
      return NextResponse.json(
        { error: "IMDb ID is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("OMDb API request failed");
    }

    const data = await response.json();

    if (data.Response === "False") {
      return NextResponse.json(
        { error: data.Error || "Movie not found" },
        { status: 404 },
      );
    }

    // 🎯 Return only needed fields (clean API design)
    const formattedMovie = {
      Title: data.Title,
      Year: data.Year,
      Poster: data.Poster,
      imdbRating: data.imdbRating,
      Actors: data.Actors,
      Genre: data.Genre,
      Plot: data.Plot,
    };

    return NextResponse.json(formattedMovie);
  } catch (error) {
    console.error("Movie API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 },
    );
  }
}
