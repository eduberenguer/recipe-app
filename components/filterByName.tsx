import { RecipesContext, RecipesContextType } from "@/app/context/context";
import { useContext, useState, useEffect } from "react";

type FilterByNameProps = {
  className?: string;
};

export default function FilterByName({ className }: FilterByNameProps) {
  const contextRecipes = useContext<RecipesContextType | null>(RecipesContext);
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
        className={className}
        placeholder="Search by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </form>
  );
}
