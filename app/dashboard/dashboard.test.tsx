import { render, screen } from "@testing-library/react";
import Dashboard from "./page";
import { mockAuthContext } from "../__mocks__/mockAuthContext";
import { mockRecipesContext } from "../__mocks__/mockRecipesContext";
import { mockRecipeWithIdv2 } from "../__mocks__/recipe.mock";
import { AuthContext, RecipesContext } from "../context/context";
import { useIsMobile } from "../hooks/useIsMobile";

jest.mock("../hooks/useIsMobile", () => ({
  useIsMobile: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Main component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const customRender = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <Dashboard />
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );
  };

  it("Dashboard is render", () => {
    mockRecipesContext.stateAllRecipes = mockRecipeWithIdv2;
    mockAuthContext.user = { id: "test-id", name: "John" };

    customRender();

    const title = screen.getByText("John");

    expect(title).toBeInTheDocument();
  });

  it("renders mobile layout", () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);
    mockAuthContext.user = { id: "user123", name: "Maria" };

    customRender();

    const heading = screen.getByText("Maria");
    expect(heading).toBeInTheDocument();
  });

  it("renders desktop layout", () => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
    mockAuthContext.user = { id: "user123", name: "Peter" };

    customRender();

    const heading = screen.getByText("Peter");
    expect(heading).toBeInTheDocument();
    expect(screen.getByTestId("recipes-table-desktop")).toBeInTheDocument();
  });
});
