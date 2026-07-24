import { useState } from "react";
import { NewCommentRecipe } from "@/types/userInteractions";
import CustomSpinner from "./CustomSpinner";
import {
  useCommentsQuery,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
} from "@/app/queries/userInteractions";

export default function Comments({
  userId,
  recipeId,
}: {
  userId: string;
  recipeId: string;
}) {
  const [newComment, setNewComment] = useState<string>("");
  const { data: comments = [], isLoading: loadingComments } = useCommentsQuery(
    userId,
    recipeId,
  );
  const toggleLikeMutation = useToggleCommentLikeMutation(recipeId);
  const createCommentMutation = useCreateCommentMutation();

  const handleToggleLike = (commentId: string) => {
    if (!userId) return;

    toggleLikeMutation.mutate({ commentId, userId });
  };

  const handleAddComment = (userId: string, recipeId: string) => {
    const newCommentRecipe: NewCommentRecipe = {
      content: newComment,
      userId,
      recipeId,
      commentLikes: 0,
    };

    createCommentMutation.mutate(newCommentRecipe, {
      onSuccess: () => setNewComment(""),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {loadingComments ? (
        <CustomSpinner message={"Loading comments..."} />
      ) : comments.length === 0 ? (
        <p className="text-gray-400 italic">No comments yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 bg-gray-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700">
                {(comment.expand?.userId?.name &&
                  comment.expand?.userId?.name[0]?.toUpperCase()) ||
                  "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {comment.expand?.userId?.name || "Unknown"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.created).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    className="ml-2 flex items-center gap-1 text-gray-500 hover:text-red-500 transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer hover:scale-110"
                    onClick={() => handleToggleLike(comment.id)}
                    disabled={!userId}
                    title={userId ? undefined : "Sign in to like comments"}
                  >
                    <span role="img" aria-label="like">
                      {comment.userHasLiked ? "❤️" : "🤍"}
                    </span>
                    <span className="text-sm">{comment.commentLikes || 0}</span>
                  </button>
                </div>
                <p className="text-gray-700 mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {userId ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Add a comment"
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="bg-[#6366F1] text-white px-4 py-2 rounded-lg w-1/3 self-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleAddComment(userId, recipeId);
            }}
          >
            Add comment
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Sign in to add a comment.
        </p>
      )}
    </div>
  );
}
