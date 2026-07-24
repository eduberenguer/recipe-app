import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Main from "./page";
import { AuthContext } from "../context/context";
import checkOwnerRecipe from "../utils/checkOwnerRecipe";
import { mockAuthContext } from "../__mocks__/mockAuthContext";
import { mockRecipeWithIdv2 } from "../__mocks__/recipe.mock";
import {
  retrieveAllRecipesApi,
  retrieveRecipeIngredientsApi,
  deleteRecipeApi,
} from "@/lib/api/recipes";
import {
  retrieveFavouritesApi,
  addFavouriteRecipeApi,
  removeRecipeApi,
  retrieveCommentCountByRecipeIdApi,
} from "@/lib/api/userInteractions";

jest.mock("../utils/checkOwnerRecipe", () => jest.fn());

jest.mock("@/lib/api/recipes");
jest.mock("@/lib/api/userInteractions");

jest.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean },
  ) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

describe("Main component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (retrieveAllRecipesApi as jest.Mock).mockResolvedValue(mockRecipeWithIdv2);
    (retrieveRecipeIngredientsApi as jest.Mock).mockResolvedValue([]);
    (retrieveFavouritesApi as jest.Mock).mockResolvedValue([]);
    (retrieveCommentCountByRecipeIdApi as jest.Mock).mockResolvedValue(0);
    (deleteRecipeApi as jest.Mock).mockResolvedValue("recipe123");
    (addFavouriteRecipeApi as jest.Mock).mockResolvedValue(undefined);
    (removeRecipeApi as jest.Mock).mockResolvedValue(undefined);
  });

  const customRender = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuthContext}>
          <Main />
        </AuthContext.Provider>
      </QueryClientProvider>,
    );
  };

  it("main is render", async () => {
    customRender();

    const titlePage = await screen.findByText("Recipe Explorer");

    expect(titlePage).toBeInTheDocument();
  });

  it("should call retrieveAllRecipesApi on mount", async () => {
    customRender();

    await waitFor(() => {
      expect(retrieveAllRecipesApi).toHaveBeenCalled();
    });
  });

  it("should render all recipes from the map", async () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(true);

    customRender();

    const recipeImage = await screen.findByAltText("Test Recipe");

    expect(recipeImage).toBeInTheDocument();
    expect(screen.getByAltText("Test Recipe 2")).toBeInTheDocument();

    const deleteButton = screen.getAllByRole("button", {
      name: "Delete recipe",
    });
    expect(deleteButton[0]).toBeInTheDocument();

    fireEvent.click(deleteButton[0]);

    await waitFor(() => {
      expect(deleteRecipeApi).toHaveBeenCalledWith("recipe123");
    });
  });

  it("should not render delete button when user is not the owner", async () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(false);

    customRender();

    await screen.findByAltText("Test Recipe");

    const deleteButtons = screen.queryAllByRole("button", { name: /x/i });
    expect(deleteButtons).toHaveLength(0);
  });

  it("should no recipes available", async () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(false);
    (retrieveAllRecipesApi as jest.Mock).mockResolvedValue([]);

    customRender();

    const loadingText = await screen.findByText("No recipes available");

    expect(loadingText).toBeInTheDocument();
  });

  it("shoud work toggleFavourite", async () => {
    (checkOwnerRecipe as jest.Mock).mockReturnValue(true);

    customRender();

    const buttonToggleFavourite = await screen.findAllByRole("button", {
      name: "Toggle favourite",
    });

    fireEvent.click(buttonToggleFavourite[0]);

    await waitFor(() => {
      expect(addFavouriteRecipeApi).toHaveBeenCalled();
    });
  });
});
