"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!imdbId.trim()) return;
    router.push(`/movie/${imdbId}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-12 text-center space-y-6 max-w-lg w-full"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          🎬 AI Movie Insight Builder
        </h1>

        <p className="text-gray-300 text-sm">
          Enter an IMDb ID and get AI-powered audience sentiment analysis
        </p>

        <input
          type="text"
          placeholder="e.g. tt0133093"
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={imdbId}
          onChange={(e) => setImdbId(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSearch}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg"
        >
          Analyze Movie
        </motion.button>
      </motion.div>
    </main>
  );
}
