import { RecipeWithRating, Unity } from "@/types/recipes";

export const mockRecipe: Partial<RecipeWithRating> = {
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
  rating: {
    average: 4.5,
    count: 10,
  },
};

export const mockRecipeWithIdv1: RecipeWithRating = {
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
  rating: {
    average: 3,
    count: 1,
  },
  views: 7,
  isVisible: true,
};

export const mockRecipeWithIdv2 = [
  {
    id: "recipe123",
    owner: "user1",
    title: "Test Recipe",
    servings: 4,
    ingredients: [
      { name: "Egg", quantity: 2, unity: "unit" as Unity },
      { name: "Flour", quantity: 200, unity: "gr" as Unity },
    ],
    photo: "undefined/recipe123/test-photo.jpg",
    favouritesCounter: 5,
    description: "A test recipe",
    views: 10,
    isVisible: true,
  },
  {
    id: "recipe456",
    owner: "user2",
    title: "Test Recipe 2",
    servings: 2,
    ingredients: [
      { name: "Milk", quantity: 1, unity: "ml" as Unity },
      { name: "Sugar", quantity: 100, unity: "gr" as Unity },
    ],
    photo: "undefined/recipe456/test-photo2.jpg",
    favouritesCounter: 3,
    description: "Another test recipe",
    views: 7,
    isVisible: true,
  },
];
