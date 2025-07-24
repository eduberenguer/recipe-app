export type ToggleFavouriteRecipe = {
  userId: string;
  recipeId: string;
};

export type AddRecipeRating = {
  userId: string;
  recipeId: string;
  rating: number;
};

export type BaseMessage = {
  id: string;
  content: string;
  fromUserId: string;
  toUserId?: string;
  created: Date;
};

export type MessageWithSenderName = BaseMessage & {
  fromUserName: string;
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

export interface UserInteractionsServerResponse {
  success: boolean;
  alreadyRated?: boolean;
  error?: string;
}

export interface CommentsRecipe {
  id: string;
  content: string;
  userId: string;
  recipeId: string;
  created: Date;
  commentLikes: number;
  expand?: {
    userId?: {
      id: string;
      name: string;
    };
  };
  userHasLiked: boolean;
}
export interface NewCommentRecipe {
  content: string;
  userId: string;
  recipeId: string;
  commentLikes: number;
}

export interface ToogleLikeCommentRecipe {
  commentId: string;
  userId: string;
}
