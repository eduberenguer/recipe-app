import { fetchPexelsImageUrl } from "../pexelsImageUrl";

describe("fetchPexelsImageUrl", () => {
  const apiKey = "test-key";
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NEXT_PUBLIC_PEXELS_API_KEY: apiKey };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should return image url when API returns photos", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        photos: [
          { src: { medium: "url1" } },
          { src: { medium: "url2" } },
          { src: { medium: "url3" } },
        ],
      }),
    });

    const url = await fetchPexelsImageUrl("bread");
    expect(["url1", "url2", "url3"]).toContain(url);
    expect(global.fetch).toHaveBeenCalled();
  });

  it("should return empty string if no API key", async () => {
    process.env.NEXT_PUBLIC_PEXELS_API_KEY = "";
    const url = await fetchPexelsImageUrl("bread");
    expect(url).toBe("");
  });

  it("should return empty string if API returns no photos", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ photos: [] }),
    });

    const url = await fetchPexelsImageUrl("bread");
    expect(url).toBe("");
  });

  it("should return empty string if API response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => "error",
    });

    const url = await fetchPexelsImageUrl("bread");
    expect(url).toBe("");
  });

  it("should return empty string if fetch throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const url = await fetchPexelsImageUrl("bread");
    expect(url).toBe("");
  });
});
