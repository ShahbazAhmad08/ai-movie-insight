"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Movie } from "@/types/movie";

type MovieProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieProps) {
  const posterSrc =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="backdrop-blur-xl bg-white/90 text-black shadow-2xl rounded-3xl p-6 md:flex gap-8"
    >
      <div className="flex justify-center md:block shrink-0">
        <Image
          src={posterSrc}
          alt={movie.Title ? `${movie.Title} poster` : "Movie Poster"}
          width={256}
          height={384}
          className="rounded-xl shadow-xl object-cover"
          priority
        />
      </div>

      <div className="mt-6 md:mt-0 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">{movie.Title}</h1>

        <div className="flex flex-wrap gap-4 text-gray-700 text-sm">
          <span>📅 {movie.Year}</span>
          <span>⭐ {movie.imdbRating}</span>
          <span>🎭 {movie.Genre}</span>
        </div>

        <p className="text-gray-600 text-sm">{movie.Actors}</p>

        <p className="text-gray-800 leading-relaxed mt-4">{movie.Plot}</p>
      </div>
    </motion.div>
  );
}
