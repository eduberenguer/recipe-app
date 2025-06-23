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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="text-lg font-semibold" htmlFor="rating">
        Rate this recipe:
      </label>
      <input
        type="number"
        id="rating"
        name="rating"
        value={rating}
        onChange={handleRatingChange}
        min={1}
        max={5}
        className="w-full p-2 border rounded-md"
      />
      <button
        type="submit"
        className="mt-2 p-2 bg-blue-500 text-white rounded-md"
      >
        Submit Rating
      </button>
    </form>
  );
}
