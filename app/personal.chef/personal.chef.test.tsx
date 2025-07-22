import { render, screen } from "@testing-library/react";

import PersonalChef from "./page";
import { mockAuthContext } from "../__mocks__/mockAuthContext";
import { mockRecipesContext } from "../__mocks__/mockRecipesContext";
import { mockUserInteractionContext } from "../__mocks__/mockUseInteractionContext";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import { mockRecipeWithIdv2 } from "../__mocks__/recipe.mock";

describe("PersonalChef component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRecipesContext.stateAllRecipes =
      mockRecipeWithIdv2 as typeof mockRecipesContext.stateAllRecipes;
  });

  const customRender = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
            <PersonalChef />
          </UserInteractionsContext.Provider>
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );
  };

  it("PersonalChef component is render", () => {
    customRender();

    const titlePage = screen.getByText("My Personal Chef 🤖");

    expect(titlePage).toBeInTheDocument();
  });

  it("should render with no AuthContext", () => {
    render(
      <AuthContext.Provider value={null}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
            <PersonalChef />
          </UserInteractionsContext.Provider>
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText("My Personal Chef 🤖")).toBeInTheDocument();
  });
});
