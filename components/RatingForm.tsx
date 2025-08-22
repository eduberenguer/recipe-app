import { useState } from "react";

export default function RatingForm({
  recipeId,
  handleAddRating,
}: {
  recipeId: string;
  handleAddRating: (recipeId: string, rating: number) => void;
}) {
  const [rating, setRating] = useState("");

  const handleRatingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRating(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const numericRating = Number(rating);

    handleAddRating(recipeId, numericRating);
    setRating("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="text-lg font-semibold" htmlFor="rating">
        Rate this recipe:
      </label>
      <div className="flex justify-start gap-3 mt-3">
        <input
          type="number"
          id="rating"
          name="rating"
          value={rating}
          onChange={handleRatingChange}
          min={1}
          max={5}
          className="w-1/4 p-2 border rounded-md"
        />
        <button
          type="submit"
          className="p-2 bg-[#6366F1] text-white rounded-md w-1/3 hover:bg-[#6366F1]/90 cursor-pointer"
        >
          Submit Rating
        </button>
      </div>
    </form>
  );
}
