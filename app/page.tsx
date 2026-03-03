"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// IMDb IDs always start with "tt" followed by 7-8 digits
const IMDB_ID_REGEX = /^tt\d{7,8}$/;

export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = imdbId.trim();

    if (!trimmed) {
      setError("Please enter an IMDb ID.");
      return;
    }

    if (!IMDB_ID_REGEX.test(trimmed)) {
      setError("Invalid format. IMDb IDs look like: tt0133093");
      return;
    }

    setError("");
    router.push(`/movie/${trimmed}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-12 text-center space-y-6 max-w-lg w-full"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          🎬 AI Movie Insight
        </h1>

        <p className="text-gray-300 text-sm">
          Enter an IMDb ID and get AI-powered audience sentiment analysis
        </p>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="e.g. tt0133093"
            className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
              error ? "border-red-500" : "border-gray-600"
            }`}
            value={imdbId}
            onChange={(e) => {
              setImdbId(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            aria-label="IMDb ID input"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-left px-1"
            >
              ⚠️ {error}
            </motion.p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSearch}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg"
        >
          Analyze Movie
        </motion.button>

        <p className="text-gray-500 text-xs">
          Try: <span className="text-gray-400 font-mono">tt0111161</span>{" "}
          (Shawshank Redemption) or{" "}
          <span className="text-gray-400 font-mono">tt0133093</span> (The
          Matrix)
        </p>
      </motion.div>
    </main>
  );
}
