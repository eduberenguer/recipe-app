"use client";
import { AuthContext, RecipesContext } from "@/app/context/context";
import { useContext, useState } from "react";

export default function RecipeForm() {
  const contextUser = useContext(AuthContext);
  const contextRecipes = useContext(RecipesContext);

  const [recipe, setRecipe] = useState<{
    title: string;
    tupperware: number;
    ingredients: { name: string; quantity: string }[];
    photo: File | null;
  }>({
    title: "",
    tupperware: 0,
    ingredients: [],
    photo: null as File | null,
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

    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("tupperware", recipe.tupperware.toString());
    formData.append("owner", contextUser?.user?.id || "");
    formData.append("ingredients", JSON.stringify(recipe.ingredients));

    if (recipe.photo) {
      formData.append("photo", recipe.photo);
    }

    const newRecipe = await contextRecipes?.createRecipe(formData);

    if (newRecipe)
      setRecipe({
        title: "",
        tupperware: 0,
        ingredients: [],
        photo: null as File | null,
      });
  };

  return (
    <div>
      Recipes Form
      <form>
        <input
          type="text"
          placeholder="Recipe title"
          value={recipe.title}
          onChange={(e) => updateRecipes("title", e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Numbers of tuperwares"
          value={recipe.tupperware}
          name="tupperwares"
          onChange={(e) => updateRecipes("tupperware", Number(e.target.value))}
          required
        />

        <input
          type="text"
          placeholder="Ingredient"
          value={ingredients.name}
          onChange={(e) => updateIngredient("name", e.target.value)}
          required
        />
        <input
          type="text"
          placeholder=""
          value={ingredients.quantity}
          onChange={(e) => updateIngredient("quantity", e.target.value)}
          required
        />
        <button onClick={addIngredient}>Add ingredient</button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => updateRecipes("photo", e.target.files?.[0] || null)}
        />
      </form>
      {recipe.ingredients.map((ingredients, key) => {
        return (
          <div key={key}>
            <div>
              <p>{ingredients.name}</p>
              <p>{ingredients.quantity}</p>
              <p onClick={() => deleteIngredient(ingredients.name)}>X</p>
            </div>
          </div>
        );
      })}
      <button type="submit" onClick={(e) => handleSubmit(e)}>
        Save recipe
      </button>
    </div>
  );
}
