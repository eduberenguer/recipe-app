import { fireEvent, render, screen } from "@testing-library/react";
import RecipesTable from "./recipesTableDesktop";
import { mockRecipeWithIdv1 } from "@/app/__mocks__/recipe.mock";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Recipe table desktop component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const customRender = (
    mockDeleteRecipe: jest.Mock,
    mockToggleVisibleRecipe: jest.Mock = jest.fn()
  ) => {
    return render(
      <RecipesTable
        recipes={[mockRecipeWithIdv1]}
        deleteRecipe={mockDeleteRecipe}
        toggleVisibleRecipe={mockToggleVisibleRecipe}
      />
    );
  };

  it("Recipes table desktop is render", () => {
    customRender(jest.fn());

    const recipeTitle = screen.getByText("Pasta Carbonara");

    expect(recipeTitle).toBeInTheDocument();
  });

  it("DeleteRecipe work", () => {
    const mockDeleteRecipe = jest.fn();
    customRender(mockDeleteRecipe);

    const deleteRecipeButton = screen.getAllByRole("button");
    fireEvent.click(deleteRecipeButton[1]);

    expect(mockDeleteRecipe).toHaveBeenCalledWith(mockRecipeWithIdv1.id);
    expect(mockDeleteRecipe).toHaveBeenCalledTimes(1);
  });
});
