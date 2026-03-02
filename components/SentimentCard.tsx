"use client";

import { motion } from "framer-motion";

type SentimentProps = {
  sentiment: {
    summary: string;
    sentiment: "positive" | "mixed" | "negative";
  };
};

export default function SentimentCard({ sentiment }: SentimentProps) {
  function getColor() {
    switch (sentiment.sentiment) {
      case "positive":
        return "bg-gradient-to-r from-green-400 to-emerald-600";
      case "mixed":
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
      case "negative":
        return "bg-gradient-to-r from-red-500 to-pink-600";
      default:
        return "bg-gray-500";
    }
  }
  const getWidth = () => {
    switch (sentiment.sentiment) {
      case "positive":
        return "85%";
      case "mixed":
        return "55%";
      case "negative":
        return "25%";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 space-y-6"
    >
      {/* Subtle Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

      <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
        🤖 AI Audience Insight
      </h2>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: getWidth() }}
          transition={{ duration: 1 }}
          className={`h-3 ${getColor()} rounded-full shadow-lg`}
        />
      </div>

      {/* Sentiment Badge */}
      <div
        className={`inline-flex items-center px-5 py-1.5 text-sm font-semibold tracking-wide text-white rounded-full ${getColor()} shadow-lg`}
      >
        {sentiment.sentiment.toUpperCase()}
      </div>

      {/* Summary Text */}
      <p className="text-gray-300 leading-relaxed text-base md:text-lg">
        {sentiment.summary}
      </p>
    </motion.div>
  );
}
