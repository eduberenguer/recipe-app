import { Recipe, Unity } from "@/types/recipes";

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

export const mockRecipeWithIdv1: Recipe = {
  id: "recipe123",
  title: "Pasta Carbonara",
  owner: "user123",
  servings: 4,
  ingredients: [
    { name: "Pasta", quantity: 500, unity: "gr" as Unity },
    { name: "Bacon", quantity: 200, unity: "gr" as Unity },
    { name: "Eggs", quantity: 3, unity: "unit" as Unity },
  ],
  photo: "photo-url",
  description: "A classic Italian pasta dish.",
  favouritesCounter: 2,
};

export const mockRecipeWithIdv2 = [
  {
    id: "recipe123",
    owner: "user123",
    title: "Test Recipe",
    servings: 4,
    ingredients: [
      { name: "Ingredient 1", quantity: 2, unity: "kg" as Unity },
      { name: "Ingredient 2", quantity: 1, unity: "ml" as Unity },
    ],
    photo: "test-photo.jpg",
    favouritesCounter: 10,
    description: "A test recipe",
  },
  {
    id: "recipe124",
    owner: "user124",
    title: "Test Recipe 2",
    servings: 2,
    ingredients: [
      { name: "Ingredient A", quantity: 3, unity: "gr" as Unity },
      { name: "Ingredient B", quantity: 5, unity: "ml" as Unity },
    ],
    photo: "test-photo-2.jpg",
    favouritesCounter: 5,
    description: "Another test recipe",
  },
];
