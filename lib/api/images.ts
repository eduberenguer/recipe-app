export async function fetchPexelsImageUrlApi(query: string): Promise<string> {
  const res = await fetch(
    `/api/images/pexels?query=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    return "";
  }

  const data = await res.json();
  return data.url ?? "";
}
