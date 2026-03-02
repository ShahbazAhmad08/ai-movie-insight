export const dynamic = "force-dynamic";
import MovieCard from "@/components/MovieCard";
import SentimentCard from "@/components/SentimentCard";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

async function getMovie(id: string) {
  const res = await fetch(`${baseUrl}/api/movie?id=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

async function getReviews(id: string) {
  const res = await fetch(`${baseUrl}/api/reviews?id=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.reviews || [];
}

async function getSentiment(movie: any, reviews: string[]) {
  const res = await fetch(`${baseUrl}/api/sentiment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ movie, reviews }),
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const movie = await getMovie(id);
  console.log("Movie data:", movie);
  if (!movie) return <div>Movie not found</div>;

  const reviews = await getReviews(id);

  const sentiment = await getSentiment(movie, reviews);
  //   const sentiment = await getSentiment(movie);

  return (
    <div className="p-10 space-y-8">
      <MovieCard movie={movie} />
      {sentiment && <SentimentCard sentiment={sentiment} />}
    </div>
  );
}
