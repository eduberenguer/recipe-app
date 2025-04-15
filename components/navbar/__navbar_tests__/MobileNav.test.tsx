import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import MobileNav from "../MobileNav";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("MobileNav component", () => {
  const mockSetIsMenuOpen = jest.fn();
  const mockRouterPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it("should render all buttons and handle navigation correctly", async () => {
    render(
      <MobileNav
        isMenuOpen={true}
        setIsMenuOpen={mockSetIsMenuOpen}
        logout={mockLogout}
      />
    );

    const recipesButton = screen.getByText("Recipes");
    const createRecipeButton = screen.getByText("Create Recipe");
    const dashboardButton = screen.getByText("Dashboard");
    const logoutButton = screen.getByText("Logout");

    expect(recipesButton).toBeInTheDocument();
    expect(createRecipeButton).toBeInTheDocument();
    expect(dashboardButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(recipesButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
    expect(mockRouterPush).toHaveBeenCalledWith("/main");

    fireEvent.click(createRecipeButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
    expect(mockRouterPush).toHaveBeenCalledWith("/create-recipes");

    fireEvent.click(dashboardButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
    expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");

    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
  });

  it("should not render nav when isMenuOpen is false", () => {
    render(
      <MobileNav
        isMenuOpen={false}
        setIsMenuOpen={mockSetIsMenuOpen}
        logout={mockLogout}
      />
    );
    const nav = screen.getByTestId("mobile-nav");
    expect(nav).toHaveClass("opacity-0");
    expect(nav).toHaveClass("scale-y-0");
    expect(nav).toHaveAttribute("aria-hidden", "true");
  });
});
