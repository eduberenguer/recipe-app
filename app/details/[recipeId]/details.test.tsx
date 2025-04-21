import { render, screen, waitFor } from "@testing-library/react";
import { useParams } from "next/navigation";

import Details from "./page";
import { RecipesContext } from "@/app/context/context";
import { mockRecipesContext } from "@/app/__mocks__/mockRecipesContext";
import { mockRecipeWithIdv1 } from "@/app/__mocks__/recipe.mock";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(() => ({ recipeId: "abc123" })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Details component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ recipeId: "recipe123" });
  });

  const customRender = () => {
    return render(
      <RecipesContext.Provider value={mockRecipesContext}>
        <Details />
      </RecipesContext.Provider>
    );
  };

  it("should render the details of the recipe", async () => {
    mockRecipesContext.stateRecipe = mockRecipeWithIdv1;

    customRender();

    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
      expect(
        screen.getByText("A classic Italian pasta dish.")
      ).toBeInTheDocument();

      expect(screen.getByText("Pasta:")).toBeInTheDocument();
      expect(screen.getByText("500 gr")).toBeInTheDocument();
    });
  });

  it("should render Loading... when starRecipe is null", async () => {
    mockRecipesContext.stateRecipe = {};

    customRender();
    await waitFor(() => {
      expect(screen.getByText("Loading recipe details...")).toBeInTheDocument();
    });
  });

  it("should call clearStateRecipe when component mounts", async () => {
    const mockClearStateRecipe = jest.fn();
    mockRecipesContext.clearStateRecipe = mockClearStateRecipe;

    customRender();

    await waitFor(() => {
      expect(mockClearStateRecipe).toHaveBeenCalled();
    });
  });
});
