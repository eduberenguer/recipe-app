"use client";
import { useContext, useState } from "react";
import { AuthContext, AuthContextType } from "../context/context";

import FilterByName from "@/components/FilterByName";
import CustomSpinner from "@/components/CustomSpinner";
import RecipeCard from "@/components/RecipeCard";
import FilterByIngredients from "@/components/FilterByIngredients";
import { RiFridgeFill } from "react-icons/ri";
import { Allergen } from "@/types/recipes";
import FilterByAllergens from "@/components/FilterByAllergens";
import {
  useRecipeIngredientsQuery,
  useRecipesQuery,
  useDeleteRecipeMutation,
} from "@/app/queries/recipes";
import {
  useAddFavouriteMutation,
  useFavouritesQuery,
  useRemoveFavouriteMutation,
} from "@/app/queries/userInteractions";

export default function Main() {
  const contextAuth = useContext<AuthContextType | null>(AuthContext);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [activeAllergens, setActiveAllergens] = useState<Allergen[]>([]);

  const { data: recipes, isLoading } = useRecipesQuery({
    name: nameFilter,
    ingredients: selectedIngredients,
  });
  const { data: ingredients } = useRecipeIngredientsQuery();
  const { data: favouritesRecipes } = useFavouritesQuery(contextAuth?.user?.id);
  const addFavouriteMutation = useAddFavouriteMutation();
  const removeFavouriteMutation = useRemoveFavouriteMutation();
  const deleteRecipeMutation = useDeleteRecipeMutation();

  async function toggleFavourite(recipeId: string): Promise<void> {
    if (!contextAuth?.user?.id) return;

    const isFav = (favouritesRecipes ?? []).some((fav) => fav.id === recipeId);

    if (isFav) {
      await removeFavouriteMutation.mutateAsync({
        userId: contextAuth.user.id,
        recipeId,
      });
    } else {
      await addFavouriteMutation.mutateAsync({
        userId: contextAuth.user.id,
        recipeId,
      });
    }
  }

  if (isLoading || !contextAuth) {
    return <CustomSpinner message={"Loading recipes..."} />;
  }

  function filterByAllergen(newAllergen: Allergen) {
    setActiveAllergens((current) =>
      current.includes(newAllergen)
        ? current.filter((allergen) => allergen !== newAllergen)
        : [...current, newAllergen],
    );
  }

  const visibleRecipes = (recipes ?? []).filter(
    (recipe) =>
      activeAllergens.length === 0 ||
      !recipe.allergens.some((allergen) => activeAllergens.includes(allergen)),
  );

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <header className="sticky top-26 z-20 bg-white/90 backdrop-blur shadow-sm px-8 py-3 flex flex-col items-center gap-2 mb-10">
        <div className="w-full flex justify-center items-center gap-5">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1 flex justify-around gap-2">
            <span role="img" aria-label="logo">
              🍽️
            </span>{" "}
            Recipe Explorer
          </h1>
          <div className="bg-white border border-gray-200 rounded-full px-6 py-2 shadow-lg flex items-center gap-3 w-full max-w-md transition">
            <FilterByName
              filter={nameFilter}
              onFilterChange={setNameFilter}
              className="flex-1 text-lg font-semibold placeholder-gray-400 p-2 focus:outline-none"
            />
          </div>
          <div>
            <button
              className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-600 transition cursor-pointer"
              onClick={() => setShowFilter(true)}
            >
              <RiFridgeFill className="w-5 h-5" />
              What I have in the fridge
            </button>
          </div>
        </div>
        <FilterByAllergens
          filterByAllergen={filterByAllergen}
          activeAllergens={activeAllergens}
        />
        <div className="fixed inset-0 z-50 flex pointer-events-none">
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              showFilter
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setShowFilter(false)}
          />
          <aside
            className={`relative ml-auto w-full max-w-md min-h-screen h-full bg-white rounded-l-3xl shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-in-out ${
              showFilter
                ? "translate-x-0 pointer-events-auto"
                : "translate-x-full pointer-events-none"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Ingredients from available recipes
              </h2>
              <button
                onClick={() => setShowFilter(false)}
                className="text-gray-400 hover:text-gray-700 text-3xl font-bold transition cursor-pointer"
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 flex flex-col">
              <FilterByIngredients
                ingredients={ingredients ?? []}
                selectedIngredients={selectedIngredients}
                setSelectedIngredients={setSelectedIngredients}
                onReset={() => setShowFilter(false)}
              />
            </div>
          </aside>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 pb-10 flex justify-center">
        <div className="flex justify-center items-center flex-wrap gap-10">
          {visibleRecipes.length > 0 ? (
            visibleRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl rounded-2xl bg-white shadow-md overflow-hidden flex flex-col cursor-pointer animate-fadein"
              >
                <RecipeCard
                  recipe={recipe}
                  user={contextAuth.user}
                  deleteRecipe={(recipeId) =>
                    deleteRecipeMutation.mutate(recipeId)
                  }
                  toggleFavourite={() => toggleFavourite(recipe.id)}
                  isFavourite={(favouritesRecipes ?? []).some(
                    (fav) => fav.id === recipe.id,
                  )}
                  isFromMain={true}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400 text-xl font-semibold">
              <span className="text-5xl mb-2">😕</span>
              No recipes available
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
