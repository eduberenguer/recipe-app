import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "../context/context";
import Favourites from "./page";
import { mockRecipeWithIdv1 } from "../__mocks__/recipe.mock";
import { retrieveFavourites } from "@/server/userInteractions";
import { removeRecipeApi } from "@/lib/api/userInteractions";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    return <img src={src || ""} alt={alt || ""} {...rest} />;
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/server/userInteractions", () => ({
  retrieveFavourites: jest.fn(),
}));

jest.mock("@/lib/api/userInteractions");

describe("Favourites component", () => {
  const mockAuthContext = {
    user: { id: "user123", name: "Test User" },
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockCookie = (
    authUser: { id: string; name: string } | null = {
      id: "user123",
      name: "Test User",
    },
  ) => {
    const { cookies } = jest.requireMock("next/headers");
    (cookies as jest.Mock).mockResolvedValue({
      get: () => (authUser ? { value: JSON.stringify(authUser) } : undefined),
    });
  };

  const customRender = async () => {
    const ui = await Favourites();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuthContext}>
          {ui}
        </AuthContext.Provider>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookie();
    (retrieveFavourites as jest.Mock).mockResolvedValue([]);
    (removeRecipeApi as jest.Mock).mockResolvedValue(undefined);
  });

  it("should read the userId from the authUser cookie and call retrieveFavourites", async () => {
    await customRender();

    expect(retrieveFavourites).toHaveBeenCalledWith("user123");
  });

  it("should render the title and the favourite recipes", async () => {
    (retrieveFavourites as jest.Mock).mockResolvedValue([mockRecipeWithIdv1]);

    await customRender();

    expect(screen.getByText("My favourites recipes")).toBeInTheDocument();
    expect(screen.getByText("Pasta Carbonara")).toBeInTheDocument();
  });

  it("should render 'No recipes available' when there is no authUser cookie", async () => {
    mockCookie(null);

    await customRender();

    expect(retrieveFavourites).not.toHaveBeenCalled();
    expect(screen.getByText("No recipes available")).toBeInTheDocument();
  });

  it("should call removeRecipeApi when toggling a favourite", async () => {
    (retrieveFavourites as jest.Mock).mockResolvedValue([mockRecipeWithIdv1]);

    await customRender();

    const favouriteButton = screen.getByRole("button", {
      name: "Toggle favourite",
    });

    fireEvent.click(favouriteButton);

    await waitFor(() => {
      expect(removeRecipeApi).toHaveBeenCalledWith({
        userId: "user123",
        recipeId: mockRecipeWithIdv1.id,
      });
    });
  });
});
