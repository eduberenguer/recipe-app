import { render, screen, waitFor } from "@testing-library/react";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Details from "./page";
import { mockRecipeWithIdv1 } from "@/app/__mocks__/recipe.mock";
import { retrieveRecipeByIdApi } from "@/lib/api/recipes";
import {
  retrieveRecipeRatingsApi,
  checkUserHasRatedApi,
} from "@/lib/api/userInteractions";

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

jest.mock("@/lib/api/recipes");
jest.mock("@/lib/api/userInteractions");

describe("Details component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ recipeId: "recipe123" });
    (retrieveRecipeRatingsApi as jest.Mock).mockResolvedValue({
      average: 0,
      count: 0,
    });
    (checkUserHasRatedApi as jest.Mock).mockResolvedValue({
      alreadyRated: false,
    });
  });

  const customRender = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Details />
      </QueryClientProvider>,
    );
  };

  it("should render the details of the recipe", async () => {
    (retrieveRecipeByIdApi as jest.Mock).mockResolvedValue(mockRecipeWithIdv1);

    customRender();

    await waitFor(() => {
      expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
      expect(
        screen.getByText("A classic Italian pasta dish."),
      ).toBeInTheDocument();

      expect(screen.getByText("Pasta:")).toBeInTheDocument();
      expect(screen.getByText("500 gr")).toBeInTheDocument();
    });
  });

  it("should render Loading... when recipe is not loaded yet", async () => {
    (retrieveRecipeByIdApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    customRender();
    await waitFor(() => {
      expect(screen.getByText("Loading recipe details...")).toBeInTheDocument();
    });
  });

  it("should call retrieveRecipeByIdApi with the recipeId from the params", async () => {
    (retrieveRecipeByIdApi as jest.Mock).mockResolvedValue(mockRecipeWithIdv1);

    customRender();

    await waitFor(() => {
      expect(retrieveRecipeByIdApi).toHaveBeenCalledWith("recipe123");
    });
  });
});
