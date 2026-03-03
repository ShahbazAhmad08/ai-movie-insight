import { GET } from "../../app/api/reviews/route";

// ✅ Mock global fetch to avoid real network calls in tests
global.fetch = jest.fn((url: string) => {
  if (url.includes("/find/")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          movie_results: [{ id: 278 }],
        }),
    });
  }

  if (url.includes("/reviews")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            { content: "Incredible film, deeply moving." },
            { content: "One of the best movies ever made." },
          ],
        }),
    });
  }

  return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
}) as jest.Mock;

describe("/api/reviews GET", () => {
  it("returns reviews and source for a valid IMDb ID", async () => {
    const mockReq = new Request("http://localhost/api/reviews?id=tt0111161");
    const res = await GET(mockReq);
    const data = await res.json();

    expect(data).toHaveProperty("reviews");
    expect(Array.isArray(data.reviews)).toBe(true);
    expect(data.reviews.length).toBeGreaterThan(0);
    expect(data).toHaveProperty("source", "tmdb");
  });

  it("returns empty reviews if id is missing", async () => {
    const mockReq = new Request("http://localhost/api/reviews");
    const res = await GET(mockReq);
    const data = await res.json();

    expect(data.reviews).toEqual([]);
    expect(data.source).toBe("none");
  });
});
