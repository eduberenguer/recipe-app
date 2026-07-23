import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./page";
import { mockAuthContext } from "../__mocks__/mockAuthContext";
import { mockRecipeWithIdv2 } from "../__mocks__/recipe.mock";
import { AuthContext } from "../context/context";
import { useIsMobile } from "../hooks/useIsMobile";
import { retrieveRecipesByUserIdApi } from "@/lib/api/recipes";
import { retrieveFavouritesApi } from "@/lib/api/userInteractions";

jest.mock("../hooks/useIsMobile", () => ({
  useIsMobile: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/api/recipes");
jest.mock("@/lib/api/userInteractions");

describe("Main component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (retrieveRecipesByUserIdApi as jest.Mock).mockResolvedValue(
      mockRecipeWithIdv2,
    );
    (retrieveFavouritesApi as jest.Mock).mockResolvedValue([]);
  });

  const customRender = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuthContext}>
          <Dashboard />
        </AuthContext.Provider>
      </QueryClientProvider>,
    );
  };

  it("Dashboard is render", () => {
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
