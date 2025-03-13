export default function checkOwnerRecipe(ownerId: string, recipeOwner: string) {
  return ownerId === recipeOwner;
}
