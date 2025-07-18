import { useState } from "react";
import { RecipesContextType } from "@/app/context/context";

export default function FilterByIngredients({
  ingredients,
  selectedIngredients,
  setSelectedIngredients,
  onReset,
  contextRecipes,
}: {
  ingredients: string[];
  selectedIngredients: string[];
  setSelectedIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onReset: () => void;
  contextRecipes: RecipesContextType;
}) {
  const [search, setSearch] = useState("");

  const handleSelectIngredient = (ingredient: string) => {
    let newSelected;
    if (selectedIngredients.includes(ingredient)) {
      newSelected = selectedIngredients.filter(
        (ingredientSelect) => ingredientSelect !== ingredient
      );
    } else {
      newSelected = [...selectedIngredients, ingredient];
    }
    setSelectedIngredients(newSelected);
    if (newSelected.length === 0) {
      contextRecipes?.retrieveRecipesList();
    } else {
      contextRecipes?.retrieveRecipesByIngredients(newSelected);
    }
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Search ingredient..."
        className="mb-3 w-full px-3 py-1 border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="overflow-y-auto max-h-[60vh] flex flex-wrap gap-1">
        {filteredIngredients.map((ingredient) => (
          <button
            key={ingredient}
            className={`rounded-full px-2 py-0.5 text-xs font-medium border shadow-sm transition cursor-pointer
              ${
                selectedIngredients.includes(ingredient)
                  ? "bg-indigo-500 text-white border-indigo-500 shadow"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-100"
              }
            `}
            onClick={() => handleSelectIngredient(ingredient)}
          >
            {ingredient}
          </button>
        ))}
      </div>
      <button
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-full shadow transition text-sm cursor-pointer hover:bg-indigo-600"
        onClick={() => {
          setSelectedIngredients([]);
          contextRecipes?.retrieveRecipesList();
          if (onReset) onReset();
        }}
      >
        Clear filters
      </button>
    </div>
  );
}
