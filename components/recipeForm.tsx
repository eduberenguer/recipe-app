"use client";
import { AuthContext, RecipesContext } from "@/app/context/context";
import { useContext, useState, useRef } from "react";
import Button from "./Button";

export default function RecipeForm() {
  const contextUser = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const [recipe, setRecipe] = useState<{
    title: string;
    servings: number | string;
    ingredients: { name: string; quantity: string }[];
    photo: File | null;
    description?: string;
  }>({
    title: "",
    servings: "",
    ingredients: [],
    photo: null as File | null,
    description: "",
  });

  const [ingredients, setIngredients] = useState({
    name: "",
    quantity: "",
  });

  const updateRecipes = (field: string, value: unknown) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const updateIngredient = (key: "name" | "quantity", value: string) => {
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
      name: "",
      quantity: "",
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

    if (recipe.title === "") {
      setError("Please enter a title");
      return;
    }

    if (recipe.servings === "" || recipe.servings === 0) {
      setError("Please enter a number of servings");
      return;
    }

    if (recipe.ingredients.length === 0) {
      setError("Please enter at least one ingredient");
      return;
    }

    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("servings", recipe.servings.toString());
    formData.append("owner", contextUser?.user?.id || "");
    formData.append("ingredients", JSON.stringify(recipe.ingredients));
    formData.append("description", recipe.description || "");

    if (recipe.photo) {
      formData.append("photo", recipe.photo);
    }

    const newRecipe = await contextRecipes?.createRecipe(formData);

    if (newRecipe)
      setRecipe({
        title: "",
        servings: "",
        ingredients: [],
        photo: null as File | null,
        description: "",
      });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError(null);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Recipe Form
      </h2>
      <form className="space-y-4 text-center">
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
          placeholder="Number of servings"
          value={recipe.servings}
          name="servings"
          onChange={(e) =>
            updateRecipes(
              "servings",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-4">
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
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button onClick={addIngredient} backgroundColor="bg-blue-500">
          Add Ingredient
        </Button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => updateRecipes("photo", e.target.files?.[0] || null)}
          className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer"
        />
        <textarea
          placeholder="Description"
          value={recipe.description}
          onChange={(e) => updateRecipes("description", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />

        {recipe.ingredients.length > 0 && (
          <div className="space-y-2 mt-4">
            {recipe.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <span>
                  {ingredient.name} - {ingredient.quantity}
                </span>
                <Button
                  type="button"
                  onClick={() => deleteIngredient(ingredient.name)}
                  backgroundColor="bg-red-500"
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          backgroundColor="bg-green-500"
        >
          Save Recipe
        </Button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
