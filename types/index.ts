export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  name: string;
  servings: number;
  containers: number;
  ingredients: { name: string; quantity: number; unit: string }[];
}
