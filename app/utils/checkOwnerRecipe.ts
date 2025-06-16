export default function checkOwnerRecipe(
  ownerId: string,
  recipeOwner: string
): boolean {
  return ownerId === recipeOwner;
}
