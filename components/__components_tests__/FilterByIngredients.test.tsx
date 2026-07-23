import { fireEvent, render, screen } from "@testing-library/react";

import FilterByIngredients from "../FilterByIngredients";

describe("Filter by ingredients component", () => {
  it("should render the component", () => {
    render(
      <FilterByIngredients
        ingredients={[]}
        selectedIngredients={[]}
        setSelectedIngredients={() => {}}
        onReset={() => {}}
      />,
    );

    const buttonElement = screen.getByText("Clear filters");
    expect(buttonElement).toBeInTheDocument();
  });

  it("should call onReset when clear filters button is clicked", () => {
    const onReset = jest.fn();

    render(
      <FilterByIngredients
        ingredients={[]}
        selectedIngredients={[]}
        setSelectedIngredients={() => {}}
        onReset={onReset}
      />,
    );

    const clearFiltersButton = screen.getByText("Clear filters");
    fireEvent.click(clearFiltersButton);

    expect(onReset).toHaveBeenCalled();
  });

  it("should call setSelectedIngredients when an ingredient is clicked", () => {
    const setSelectedIngredients = jest.fn();
    const ingredients = ["ingredient1", "ingredient2", "ingredient3"];
    const selectedIngredients: string[] = [];

    render(
      <FilterByIngredients
        ingredients={ingredients}
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
        onReset={() => {}}
      />,
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
      <FilterByIngredients
        ingredients={ingredients}
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
        onReset={() => {}}
      />,
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
      <FilterByIngredients
        ingredients={ingredients}
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
        onReset={() => {}}
      />,
    );

    const clearFiltersButton = screen.getByText("Clear filters");
    fireEvent.click(clearFiltersButton);

    expect(setSelectedIngredients).toHaveBeenCalledWith([]);
  });

  it("should setSearch when input is changed", () => {
    render(
      <FilterByIngredients
        ingredients={[]}
        selectedIngredients={[]}
        setSelectedIngredients={() => {}}
        onReset={() => {}}
      />,
    );

    const inputElement = screen.getByPlaceholderText("Search ingredient...");
    fireEvent.change(inputElement, { target: { value: "ingredient1" } });

    expect(inputElement).toHaveValue("ingredient1");
  });
});
