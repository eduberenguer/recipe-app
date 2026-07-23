import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateRecipes from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe("Create recipe component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Create recipe is render", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CreateRecipes />
      </QueryClientProvider>,
    );

    const titleCreateRecipe = screen.getByText("Recipe Form");

    expect(titleCreateRecipe).toBeInTheDocument();
  });
});
