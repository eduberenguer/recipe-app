export async function fetchPexelsImageUrl(query: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  if (!apiKey) {
    console.error("No Pexels API key found.");
    return "";
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=3`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!res.ok) {
      console.error("Pexels API response error:", await res.text());
      return "";
    }

    const data = await res.json();

    if (data.photos && data.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.photos.length);
      return data.photos[randomIndex].src.medium;
    }
    return "";
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return "";
  }
}
