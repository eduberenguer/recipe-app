import { fireEvent, render, screen } from "@testing-library/react";

import FilterByIngredients from "../FilterByIngredients";
import { RecipesContext } from "@/app/context/context";
import { mockContextRecipes } from "@/app/__mocks__/mockContextRecipes";

describe("Filter by ingredients component", () => {
  it("should render the component", () => {
    render(
      <RecipesContext.Provider value={mockContextRecipes}>
        <FilterByIngredients
          ingredients={[]}
          selectedIngredients={[]}
          setSelectedIngredients={() => {}}
          onReset={() => {}}
          contextRecipes={mockContextRecipes}
        />
      </RecipesContext.Provider>
    );

    const buttonElement = screen.getByText("Clear filters");
    expect(buttonElement).toBeInTheDocument();
  });

  it("should call onReset when clear filters button is clicked", () => {
    const onReset = jest.fn();

    render(
      <RecipesContext.Provider value={mockContextRecipes}>
        <FilterByIngredients
          ingredients={[]}
          selectedIngredients={[]}
          setSelectedIngredients={() => {}}
          onReset={onReset}
          contextRecipes={mockContextRecipes}
        />
      </RecipesContext.Provider>
    );
  });

  it("should call setSelectedIngredients when an ingredient is clicked", () => {
    const setSelectedIngredients = jest.fn();
    const ingredients = ["ingredient1", "ingredient2", "ingredient3"];
    const selectedIngredients: string[] = [];

    render(
      <RecipesContext.Provider value={mockContextRecipes}>
        <FilterByIngredients
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          onReset={() => {}}
          contextRecipes={mockContextRecipes}
        />
      </RecipesContext.Provider>
    );

    const ingredientButton = screen.getByText("ingredient1");
    fireEvent.click(ingredientButton);

    expect(setSelectedIngredients).toHaveBeenCalledWith(["ingredient1"]);
  });

  it("should call setSelectedIngredients when an ingredient is clicked and is already selected", () => {
    const setSelectedIngredients = jest.fn();
    const ingredients = ["ingredient1", "ingredient2", "ingredient3"];
    const selectedIngredients: string[] = ["ingredient1"];

    render(
      <RecipesContext.Provider value={mockContextRecipes}>
        <FilterByIngredients
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          onReset={() => {}}
          contextRecipes={mockContextRecipes}
        />
      </RecipesContext.Provider>
    );

    const ingredientButton = screen.getByText("ingredient1");
    fireEvent.click(ingredientButton);

    expect(setSelectedIngredients).toHaveBeenCalledWith([]);
  });

  it("should reset all filters when clear filters button is clicked", () => {
    const setSelectedIngredients = jest.fn();
    const ingredients = ["ingredient1", "ingredient2", "ingredient3"];
    const selectedIngredients: string[] = ["ingredient1"];

    render(
      <RecipesContext.Provider value={mockContextRecipes}>
        <FilterByIngredients
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          onReset={() => {}}
          contextRecipes={mockContextRecipes}
        />
      </RecipesContext.Provider>
    );

    const clearFiltersButton = screen.getByText("Clear filters");
    fireEvent.click(clearFiltersButton);

    expect(setSelectedIngredients).toHaveBeenCalledWith([]);
  });

  it("should setSearch when input is changed", () => {
    render(
      <RecipesContext.Provider value={mockContextRecipes}>
        <FilterByIngredients
          ingredients={[]}
          selectedIngredients={[]}
          setSelectedIngredients={() => {}}
          onReset={() => {}}
          contextRecipes={mockContextRecipes}
        />
      </RecipesContext.Provider>
    );

    const inputElement = screen.getByPlaceholderText("Search ingredient...");
    fireEvent.change(inputElement, { target: { value: "ingredient1" } });

    expect(inputElement).toHaveValue("ingredient1");
  });

  it("should call retrieveRecipesList when clear filters button is clicked", () => {
    const retrieveRecipesList = jest.fn();
    const mockContext = { ...mockContextRecipes, retrieveRecipesList };

    render(
      <RecipesContext.Provider value={mockContext}>
        <FilterByIngredients
          ingredients={[]}
          selectedIngredients={[]}
          setSelectedIngredients={() => {}}
          onReset={() => {}}
          contextRecipes={mockContext}
        />
      </RecipesContext.Provider>
    );

    const clearFiltersButton = screen.getByText("Clear filters");
    fireEvent.click(clearFiltersButton);

    expect(retrieveRecipesList).toHaveBeenCalled();
  });
});
