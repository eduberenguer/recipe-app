import { render, screen } from "@testing-library/react";
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
    render(<CreateRecipes />);

    const titleCreateRecipe = screen.getByText("Recipe Form");

    expect(titleCreateRecipe).toBeInTheDocument();
  });
});
