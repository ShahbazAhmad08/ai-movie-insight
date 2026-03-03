import { NextResponse } from "next/server";
import type { Movie, SentimentResult } from "@/types/movie";

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const movie: Movie = body.movie;
    const reviews: string[] = body.reviews ?? [];
    const source: string = body.source ?? "none";

    if (!movie) {
      return NextResponse.json({ error: "Movie data is required" }, { status: 400 });
    }

    let prompt = "";

    if (reviews.length > 0) {
      prompt = `
You are a movie critic AI.

Analyze real audience reviews and determine overall sentiment.

Return ONLY valid JSON with no markdown or extra text:

{
  "summary": "Short professional analysis of audience opinion",
  "sentiment": "positive | mixed | negative"
}

Audience Reviews:
${reviews.slice(0, 5).join("\n\n")}
`.trim();
    } else {
      prompt = `
You are a movie critic AI.

No audience reviews were available${source !== "none" ? ` (source: ${source})` : ""}.
Estimate probable audience sentiment based on movie metadata.

Return ONLY valid JSON with no markdown or extra text:

{
  "summary": "Short professional analysis",
  "sentiment": "positive | mixed | negative"
}

Movie Details:
Title: ${movie.Title}
Year: ${movie.Year}
IMDB Rating: ${movie.imdbRating}
Actors: ${movie.Actors}
Genre: ${movie.Genre}
Plot: ${movie.Plot}
`.trim();
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API Error:", errText);
      return NextResponse.json({ error: "Gemini request failed" }, { status: 500 });
    }

    const data: GeminiResponse = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Invalid Gemini Response:", text);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    const parsed: SentimentResult = JSON.parse(jsonMatch[0]);

    // Validate sentiment value
    if (!["positive", "mixed", "negative"].includes(parsed.sentiment)) {
      return NextResponse.json({ error: "Invalid sentiment value from AI" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Sentiment API Error:", err);
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
  }
}
