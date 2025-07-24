"use client";

import { useContext, useEffect, useState } from "react";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import { RecipeWithRating } from "@/types/recipes";
import { useRouter } from "next/navigation";
import RecipesTableDesktop from "./RecipesTableDesktop/recipesTableDesktop";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Visible", value: "visible" },
  { label: "Hidden", value: "hidden" },
  { label: "Sort by name", value: "alpha" },
];

export default function Dashboard() {
  const router = useRouter();
  const contextAuth = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const contextUserInteractions = useContext(UserInteractionsContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (contextAuth?.user?.id && contextRecipes) {
      contextRecipes.retrieveRecipesByUserId(contextAuth.user.id);
    }
  }, [contextAuth?.user?.id]);

  const recipes =
    (contextRecipes?.stateUserRecipes as RecipeWithRating[]) || [];
  const favouritesIds =
    (contextUserInteractions?.favouritesRecipes as RecipeWithRating[]) || [];

  const filteredRecipes = recipes
    .filter((recipe) => {
      if (filter === "visible" && !recipe.isVisible) return false;
      if (filter === "hidden" && recipe.isVisible) return false;
      if (search && !recipe.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (filter === "alpha") return a.title.localeCompare(b.title);
      if (filter === "recent") return 0;
      return 0;
    });

  return (
    <main className="bg-gray-50 min-h-screen overflow-y-auto py-10 px-2 font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-fadein">
        <header className="sticky top-0 z-20 flex flex-col gap-4 px-8 py-6 bg-white rounded-3xl shadow-xl">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-500">
                {contextAuth?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {contextAuth?.user?.name || "User"}
                </div>
                <div className="text-sm text-gray-500">Your recipes</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-semibold transition cursor-pointer"
                onClick={() => router.push("/create.recipes")}
              >
                <span className="text-xl">＋</span>
                New recipe
              </button>
              <button
                className="relative bg-white border border-gray-200 rounded-full p-2 hover:bg-indigo-50 transition"
                onClick={() => router.push("/favourites")}
              >
                <span className="text-xl text-indigo-500 cursor-pointer">
                  ♥
                </span>
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {favouritesIds.length}
                </span>
              </button>
              <button
                className="relative bg-white border border-gray-200 rounded-full p-2 hover:bg-indigo-50 transition"
                onClick={() => {}}
                title="settings"
              >
                <span className="text-xl cursor-pointer">⚙️</span>
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {FILTERS.map((fav) => (
              <button
                key={fav.value}
                className={`px-4 py-1 rounded-full text-sm font-medium transition border cursor-pointer ${
                  filter === fav.value
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-50"
                }`}
                onClick={() => setFilter(fav.value)}
              >
                {fav.label}
              </button>
            ))}
          </div>
        </header>
        <div className="flex-1 w-full p-2">
          <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
            <RecipesTableDesktop
              recipes={filteredRecipes}
              toggleVisibleRecipe={
                contextRecipes?.toggleVisibleRecipe || (() => Promise.resolve())
              }
              deleteRecipe={
                contextRecipes?.deleteRecipe || (() => Promise.resolve())
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
