import { POST } from "../../app/api/sentiment/route";

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        candidates: [
          {
            content: {
              parts: [
                { text: '{"summary":"Great movie","sentiment":"positive"}' },
              ],
            },
          },
        ],
      }),
  }),
) as jest.Mock;

describe("/api/sentiment POST", () => {
  it("returns sentiment JSON", async () => {
    const movie = {
      Title: "Test Movie",
      Year: "2025",
      imdbRating: "8.0",
      Actors: "Actor A, Actor B",
      Genre: "Action",
      Plot: "Test plot...",
    };

    const mockReq = new Request("http://localhost/api/sentiment", {
      method: "POST",
      body: JSON.stringify({ movie, reviews: [] }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(mockReq);
    const data = await res.json();

    expect(data).toHaveProperty("summary");
    expect(data).toHaveProperty("sentiment");
    expect(["positive", "mixed", "negative"]).toContain(data.sentiment);
  });
});
