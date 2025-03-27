import { RecipesContext } from "@/app/context/context";
import { useContext, useState, useEffect } from "react";

export default function FilterByName() {
  const contextRecipes = useContext(RecipesContext);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (filter.length === 0) {
      contextRecipes?.retrieveRecipesList();
    }

    if (filter.length > 0) {
      contextRecipes?.retrieveRecipesByFilterName(filter);
    }
  }, [filter]);

  return (
    <form className="flex flex-row">
      <input
        type="text"
        className="border border-gray-300 rounded-md p-2"
        placeholder="Search by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </form>
  );
}
