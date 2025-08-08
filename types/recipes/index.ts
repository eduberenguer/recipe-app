export type Unity = "kg" | "gr" | "mg" | "litres" | "ml" | "unit";

export type Allergen =
  | "gluten"
  | "lactose"
  | "nuts"
  | "egg"
  | "soy"
  | "fish"
  | "shellfish"
  | "sesame"
  | "mustard";

export const ALLERGENS: Allergen[] = [
  "gluten",
  "lactose",
  "nuts",
  "egg",
  "soy",
  "fish",
  "shellfish",
  "sesame",
  "mustard",
];

export const ALLERGEN_ICONS: Record<Allergen, { icon: string; title: string }> =
  {
    gluten: { icon: "🌾", title: "Contains gluten" },
    lactose: { icon: "🥛", title: "Contains lactose" },
    nuts: { icon: "🥜", title: "Contains nuts" },
    egg: { icon: "🥚", title: "Contains egg" },
    soy: { icon: "🫘", title: "Contains soy" },
    fish: { icon: "🐟", title: "Contains fish" },
    shellfish: { icon: "🦐", title: "Contains shellfish" },
    sesame: { icon: "🌱", title: "Contains sesame" },
    mustard: { icon: "🌶️", title: "Contains mustard" },
  };

export interface Recipe {
  id: string;
  owner: string;
  title: string;
  servings: number;
  ingredients: { name: string; quantity: number; unity: Unity }[];
  allergens: Allergen[];
  photo: File | string;
  favouritesCounter: number;
  description: string;
  views: number;
  isVisible: boolean;
  created: Date;
  duration: number;
}
export interface RecipeWithRating extends Recipe {
  rating: {
    average: number;
    count: number;
  };
  expand?: {
    owner?: {
      id: string;
      name?: string;
    };
  };
}

export interface AddRating {
  userId: string;
  recipeId: string;
  rating: number;
}

export interface RecipeChefAI {
  title: string;
  servings: number;
  description: string;
  photo: string;
  ingredients: {
    name: string;
    quantity: number;
    unity: string;
  }[];
  allergens: Allergen[];
  duration: number;
}

export interface RecipeRating {
  average: number;
  count: number;
}

export interface RecipeServerResponse {
  success: boolean;
  recipe?: Recipe;
  error?: string;
}
