import { Unity } from "@/types/recipes";

export const initialStateForm = {
  title: "",
  servings: "",
  ingredients: [],
  photo: null as File | null,
  description: "",
};

export const initialStateIngredient = {
  name: "",
  quantity: "",
  unity: "" as Unity,
};
