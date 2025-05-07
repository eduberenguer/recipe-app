export type ToggleFavouriteRecipe = {
  userId: string;
  recipeId: string;
};

export type AddRecipeRating = {
  userId: string;
  recipeId: string;
  rating: number;
};

export type Message = {
  id: string;
  content: string;
  fromUserId: string;
  fromUserName?: string;
  created: Date;
};

export type MessageRecord = {
  id: string;
  content: string;
  from: string;
  to: string;
  read: boolean;
  created: Date;
  expand?: {
    from?: { name: string };
  };
};
