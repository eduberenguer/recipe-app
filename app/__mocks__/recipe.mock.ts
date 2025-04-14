import { Recipe } from "@/types/recipes";

export const mockRecipe: Partial<Recipe> = {
  title: "Pasta Carbonara",
  owner: "user123",
  servings: 4,
  ingredients: [
    { name: "Pasta", quantity: 500, unity: "gr" },
    { name: "Bacon", quantity: 200, unity: "gr" },
    { name: "Eggs", quantity: 3, unity: "unit" },
  ],
  photo: "photo-url",
  description: "A classic Italian pasta dish.",
};

export const mockRecipeWithId: Recipe = {
  id: "recipe123",
  title: "Pasta Carbonara",
  owner: "user123",
  servings: 4,
  ingredients: [
    { name: "Pasta", quantity: 500, unity: "gr" },
    { name: "Bacon", quantity: 200, unity: "gr" },
    { name: "Eggs", quantity: 3, unity: "unit" },
  ],
  photo: "photo-url",
  description: "A classic Italian pasta dish.",
  favouritesCounter: 2,
};
