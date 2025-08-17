"use client";
import { AuthContext, RecipesContext } from "@/app/context/context";
import { useContext, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../Button";
import {
  Allergen,
  ALLERGENS,
  ALLERGEN_ICONS,
  Unity,
  Difficulty,
} from "@/types/recipes";
import { unityOptions } from "./unityOptions";
import { customToast } from "@/app/utils/showToast";

import { initialStateForm, initialStateIngredient } from "./initialStateForm";
import { isFormValid } from "./isFormValid";
import CustomSpinner from "../CustomSpinner";

export default function RecipeForm() {
  const contextUser = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [recipe, setRecipe] = useState<{
    title: string;
    servings: number | string;
    ingredients: { name: string; quantity: string; unity: Unity }[];
    allergens: Allergen[];
    photo: File | null;
    description?: string;
    duration?: number;
    difficulty?: Difficulty;
  }>({
    ...initialStateForm,
  });

  const [ingredients, setIngredients] = useState({
    ...initialStateIngredient,
  });

  const MAX_SIZE_MB = 1;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
      customToast("File size exceeds 1MB", "warning");
      e.target.value = "";
      return;
    }

    updateRecipes("photo", file);
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const updateRecipes = (field: string, value: unknown) => {
    if (field === "allergens") {
      setRecipe((prev) => ({
        ...prev,
        allergens: value as Allergen[],
      }));
      return;
    }
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const updateIngredient = (
    key: "name" | "quantity" | "unity",
    value: string
  ) => {
    setIngredients((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredients],
    }));
    setIngredients((prev) => ({
      ...prev,
      ...initialStateIngredient,
    }));
  };

  const deleteIngredient = (ingredient: string) => {
    const ingredientsList = recipe.ingredients;

    const newIngredientsList = ingredientsList.filter(
      (ingredients) => ingredient !== ingredients.name
    );

    setRecipe((prev) => ({
      ...prev,
      ingredients: newIngredientsList,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("servings", recipe.servings.toString());
    formData.append("owner", contextUser?.user?.id || "");
    formData.append("allergens", JSON.stringify(recipe.allergens));
    formData.append("duration", (recipe.duration || 0).toString());
    formData.append("difficulty", recipe.difficulty || "easy");
    const normalizedIngredients = recipe.ingredients.map((ing) => ({
      name: ing.name.trim().toLowerCase(),
      quantity: ing.quantity,
      unity: ing.unity,
    }));
    formData.append("ingredients", JSON.stringify(normalizedIngredients));
    formData.append("description", recipe.description || "");

    if (recipe.photo) {
      formData.append("photo", recipe.photo);
    }

    const newRecipe = await contextRecipes?.createRecipe(formData);

    setLoading(false);

    if (newRecipe) {
      customToast("Recipe created successfully", "success");
      setRecipe({
        ...initialStateForm,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.push("/main");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Recipe Form</h2>
        <Button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          backgroundColor={
            isFormValid({ recipe }) ? "bg-green-500" : "bg-gray-300"
          }
          disabled={
            !isFormValid({
              recipe: { ...recipe, difficulty: recipe.difficulty || "easy" },
            })
          }
        >
          Save Recipe
        </Button>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-opacity-30 z-50 flex items-center justify-center">
          <CustomSpinner message={"Creating recipe..."} />
        </div>
      )}
      <form className="space-y-4 text-center">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Recipe title"
            value={recipe.title}
            onChange={(e) => updateRecipes("title", e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Servings"
            value={recipe.servings}
            name="servings"
            onChange={(e) =>
              updateRecipes(
                "servings",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            required
            className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center mt-4 justify-center gap-4">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="flex-1 p-3 border border-gray-300 rounded-lg cursor-pointer hidden"
          />
          <label
            htmlFor="fileInput"
            className="block w-full p-3 border border-gray-300 rounded-lg text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
          >
            {recipe.photo ? recipe.photo.name : "Select an image"}
          </label>
          {previewImage && (
            <div className="w-40 h-30 flex items-center justify-center rounded-lg shadow-md overflow-hidden bg-gray-100">
              <Image
                src={previewImage}
                width={100}
                height={100}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={recipe.duration || ""}
            onChange={(e) =>
              updateRecipes(
                "duration",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            required
            className="w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={recipe.difficulty || ""}
            onChange={(e) =>
              updateRecipes("difficulty", e.target.value as Difficulty)
            }
            className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled className="text-gray-500">
              Select difficulty
            </option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ingredient"
            value={ingredients.name}
            onChange={(e) => updateIngredient("name", e.target.value)}
            required
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Quantity"
            value={ingredients.quantity}
            onChange={(e) => updateIngredient("quantity", e.target.value)}
            required
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={ingredients.unity}
            onChange={(e) => updateIngredient("unity", e.target.value)}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Choose a unity
            </option>
            {Object.entries(unityOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={addIngredient}
            backgroundColor="bg-blue-500"
          >
            +
          </Button>
        </div>
        <textarea
          placeholder="Description for numbered steps..."
          value={recipe.description}
          onChange={(e) => updateRecipes("description", e.target.value)}
          rows={7}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />

        <div className="mt-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Allergens
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {ALLERGENS.map((allergen) => (
              <div
                key={allergen}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  recipe.allergens.includes(allergen)
                    ? "bg-green-100 border-green-300"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                } border-2 rounded-lg p-2 flex flex-col items-center gap-1`}
                onClick={() =>
                  updateRecipes(
                    "allergens",
                    recipe.allergens.includes(allergen)
                      ? recipe.allergens.filter((a) => a !== allergen)
                      : [...recipe.allergens, allergen]
                  )
                }
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={recipe.allergens.includes(allergen)}
                  onChange={() => {}}
                />
                <span className="text-sm">{ALLERGEN_ICONS[allergen].icon}</span>
                <span className="text-xs font-medium text-gray-700 capitalize">
                  {allergen}
                </span>
              </div>
            ))}
          </div>
        </div>

        {recipe.ingredients.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 text-center text-gray-800 font-bold">
              Ingredients added:
            </h3>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-sm cursor-pointer"
                >
                  <span className="text-blue-700 font-medium">
                    {ingredient.quantity} {ingredient.unity} {ingredient.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteIngredient(ingredient.name)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
