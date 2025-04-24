import { fireEvent, render, screen } from "@testing-library/react";

import FilterByName from "../FilterByName";
import { RecipesContext } from "@/app/context/context";

describe("Filter by name component", () => {
  it("should render the component", () => {
    render(<FilterByName />);

    const inputElement = screen.getByPlaceholderText("Search by name");
    expect(inputElement).toBeInTheDocument();

    const textbox = screen.getByRole("textbox");
    expect(textbox).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: "Pasta" } });
    expect(inputElement).toHaveValue("Pasta");
  });

  it("should call retrieveRecipesList when input is cleared", () => {
    const mockRetrieveRecipesByFilterName = jest.fn();
    const mockRetrieveRecipesList = jest.fn();

    render(
      <RecipesContext.Provider
        value={{
          stateAllRecipes: [],
          stateRecipe: {},
          createRecipe: jest.fn(),
          retrieveRecipesList: mockRetrieveRecipesList,
          deleteRecipe: jest.fn(),
          retrieveRecipe: jest.fn(),
          retrieveRecipesByFilterName: mockRetrieveRecipesByFilterName,
          stateUserRecipes: [],
          retrieveRecipesByUserId: jest.fn(),
          clearStateRecipe: jest.fn(),
        }}
      >
        <FilterByName />
      </RecipesContext.Provider>
    );

    const inputElement = screen.getByPlaceholderText("Search by name");

    fireEvent.change(inputElement, { target: { value: "Pasta" } });
    fireEvent.change(inputElement, { target: { value: "" } });

    expect(mockRetrieveRecipesList).toHaveBeenCalled();
    expect(mockRetrieveRecipesByFilterName).toHaveBeenCalled();
  });
});
