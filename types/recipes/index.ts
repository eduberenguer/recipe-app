export type Unity = "kg" | "gr" | "mg" | "litres" | "ml" | "unit";

export interface Recipe {
  id: string;
  owner: string;
  title: string;
  servings: number;
  ingredients: { name: string; quantity: number; unity: Unity }[];
  photo: File | string;
  favouritesCounter: number;
  description: string;
}
