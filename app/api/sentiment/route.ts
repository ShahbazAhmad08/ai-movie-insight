import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { movie, reviews = [], source = "none" } = await req.json();

    let prompt = "";

    // 🎯 If real reviews exist
    if (reviews && reviews.length > 0) {
      prompt = `
You are a movie critic AI.

Analyze real audience reviews and determine overall sentiment.

Return ONLY valid JSON:

{
  "summary": "Short professional analysis of audience opinion",
  "sentiment": "positive | mixed | negative"
}

Audience Reviews:
${reviews.slice(0, 5).join("\n\n")}
`;
    } else {
      // 🔁 Fallback to metadata
      prompt = `
You are a movie critic AI.

No audience reviews were available.
Estimate probable audience sentiment based on movie metadata.

Return ONLY valid JSON:

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
`;
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API Error:", errText);
      return NextResponse.json(
        { error: "Gemini request failed" },
        { status: 500 },
      );
    }

    const data = await geminiRes.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("Invalid Gemini Response:", text);
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Sentiment API Error:", err);
    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 },
    );
  }
}
