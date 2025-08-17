import { Difficulty } from "@/types/recipes";

export const isFormValid = ({
  recipe,
}: {
  recipe: {
    title: string;
    servings: string | number;
    ingredients: { name: string; quantity: string; unity: string }[];
    photo: File | null;
    description?: string;
    duration?: number;
    difficulty?: Difficulty;
  };
}): boolean => {
  return (
    recipe.title.trim() !== "" &&
    recipe.servings !== "" &&
    Number(recipe.servings) > 0 &&
    recipe.ingredients.length > 0 &&
    recipe.description !== "" &&
    recipe.photo !== null &&
    Number(recipe.duration) > 0 &&
    recipe.difficulty != null
  );
};
