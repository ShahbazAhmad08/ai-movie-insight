import { GET } from "../../app/api/movie/route";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        Title: "The Shawshank Redemption",
        Year: "1994",
        Poster: "poster.jpg",
        imdbRating: "9.3",
        Actors: "Tim Robbins, Morgan Freeman",
        Genre: "Drama",
        Plot: "Two imprisoned men bond...",
        Response: "True",
      }),
  }),
) as jest.Mock;

describe("/api/movie GET", () => {
  it("returns movie data for a valid IMDb ID", async () => {
    const mockReq = new Request("http://localhost/api/movie?id=tt0111161");
    const res = await GET(mockReq);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("Title");
    expect(data.Title).toBe("The Shawshank Redemption");
  });
});
