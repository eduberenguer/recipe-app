const POCKETBASE_URL = process.env.NEXT_PUBLIC_PHOTO_URL!;

export default function photoSrc(
  recipeId: string,
  photoRecipe: string
): string {
  return `${POCKETBASE_URL}/${recipeId}/${photoRecipe}`;
}
