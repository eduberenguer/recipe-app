import { render, screen } from "@testing-library/react";
import { useParams } from "next/navigation";

import Details from "./page";
import { RecipesContext } from "@/app/context/context";
import { Unity } from "@/types";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Details component", () => {
  const mockRecipesContext = {
    stateAllRecipes: [],
    stateRecipe: {
      id: "recipe123",
      owner: "user123",
      title: "Test Recipe",
      servings: 4,
      ingredients: [
        {
          name: "potatoes",
          quantity: 123,
          unity: "gr" as Unity,
        },
      ],
      photo: "test-photo.jpg",
      description: "This is a test recipe description.",
    },
    createRecipe: jest.fn(),
    retrieveRecipesList: jest.fn(),
    deleteRecipe: jest.fn(),
    retrieveRecipe: jest.fn(),
    retrieveRecipesByFilterName: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "recipe123" });
  });
  it("should render the details of the recipe", () => {
    render(
      <RecipesContext.Provider value={mockRecipesContext}>
        <Details />
      </RecipesContext.Provider>
    );

    const recipeImage = screen.getByAltText("Test Recipe");

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test recipe description.")
    ).toBeInTheDocument();

    expect(screen.getByAltText("Test Recipe")).toBeInTheDocument();
    expect(recipeImage).toHaveAttribute(
      "src",
      "undefined/recipe123/test-photo.jpg"
    );

    expect(screen.getByText("potatoes:")).toBeInTheDocument();
    expect(screen.getByText("123 gr")).toBeInTheDocument();
  });

  it("should render Loading... when starRecipe is null", () => {
    render(
      <RecipesContext.Provider
        value={{ ...mockRecipesContext, stateRecipe: null }}
      >
        <Details />
      </RecipesContext.Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
