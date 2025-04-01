export interface User {
  id: string;
  email: string;
  name: string;
  created: string;
  updated: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export type Unity = "kg" | "gr" | "mg" | "litres" | "ml" | "unit";
export interface Recipe {
  id: string;
  owner: string;
  title: string;
  servings: number;
  ingredients: { name: string; quantity: number; unity: Unity }[];
  photo: File | string;
  description: string;
}
