"use client";
import { AuthContext, RecipesContext } from "@/app/context/context";
import { useContext, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../Button";
import { Unity } from "@/types/recipes";
import { unityOptions } from "./unityOptions";
import { customToast } from "@/app/utils/showToast";

export default function RecipeForm() {
  const contextUser = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [recipe, setRecipe] = useState<{
    title: string;
    servings: number | string;
    ingredients: { name: string; quantity: string; unity: Unity }[];
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
    unity: "" as Unity,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateRecipes("photo", file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const updateRecipes = (field: string, value: unknown) => {
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
    if (
      ingredients.name === "" ||
      ingredients.quantity === "" ||
      !ingredients.unity
    ) {
      customToast("Please fill in all ingredient fields", "warning");
      return;
    }

    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredients],
    }));
    setIngredients((prev) => ({
      ...prev,
      name: "",
      quantity: "",
      unity: "gr",
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
      customToast("Please enter a title", "warning");
      return;
    }

    if (recipe.servings === "" || recipe.servings === 0) {
      customToast("Please enter a number of servings", "warning");
      return;
    }

    if (recipe.ingredients.length === 0) {
      customToast("Please enter at least one ingredient", "warning");
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

    if (newRecipe) customToast("Recipe created successfully", "success");
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

    router.push("/main");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Recipe Form
      </h2>
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
            <div>
              <Image
                src={previewImage}
                width={100}
                height={100}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
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
          placeholder="Description"
          value={recipe.description}
          onChange={(e) => updateRecipes("description", e.target.value)}
          rows={7}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />

        {recipe.ingredients.length > 0 && (
          <div className="space-y-2 mt-4">
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-1"
                >
                  {ingredient.quantity} {ingredient.unity} {ingredient.name}
                  <Button
                    type="button"
                    onClick={() => deleteIngredient(ingredient.name)}
                    backgroundColor="bg-red-500"
                  >
                    X
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          backgroundColor={
            !ingredients.quantity.length ? "bg-gray-500" : "bg-green-500"
          }
        >
          Save Recipe
        </Button>
      </form>
    </div>
  );
}
