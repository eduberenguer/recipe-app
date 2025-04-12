export async function retrieveFavouritesApi(id: string) {
  const res = await fetch(`/api/userInteractions/retrieveFavourites/${id}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error");
  }

  return res.json();
}
