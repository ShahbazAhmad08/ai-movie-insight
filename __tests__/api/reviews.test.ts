import { GET } from "../../app/api/reviews/route";

describe("/api/reviews GET", () => {
  it("returns reviews and source for a valid IMDb ID", async () => {
    const mockReq = new Request("http://localhost/api/reviews?id=tt0111161");
    const res = await GET(mockReq);
    const data = await res.json();

    expect(data).toHaveProperty("reviews");
    expect(Array.isArray(data.reviews)).toBe(true);
    expect(data).toHaveProperty("source");
  });

  it("returns empty reviews if id missing", async () => {
    const mockReq = new Request("http://localhost/api/reviews");
    const res = await GET(mockReq);
    const data = await res.json();

    expect(data.reviews).toEqual([]);
    expect(data.source).toBe("none");
  });
});
