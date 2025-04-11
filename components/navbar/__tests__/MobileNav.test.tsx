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

  it("should render all buttons and handle navigation correctly", () => {
    render(
      <MobileNav
        isMenuOpen={true}
        setIsMenuOpen={mockSetIsMenuOpen}
        logout={mockLogout}
      />
    );

    const recipesButton = screen.getByText("Recipes");
    const createRecipeButton = screen.getByText("Create Recipe");
    const profileButton = screen.getByText("Profile");
    const logoutButton = screen.getByText("Logout");

    expect(recipesButton).toBeInTheDocument();
    expect(createRecipeButton).toBeInTheDocument();
    expect(profileButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(recipesButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
    expect(mockRouterPush).toHaveBeenCalledWith("/main");

    fireEvent.click(createRecipeButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
    expect(mockRouterPush).toHaveBeenCalledWith("/create-recipes");

    fireEvent.click(profileButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
    expect(mockRouterPush).toHaveBeenCalledWith("/profile");

    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockSetIsMenuOpen).toHaveBeenCalledWith(false);
  });

  it("should no render nav when isMenuOpen is false", () => {
    render(
      <MobileNav
        isMenuOpen={false}
        setIsMenuOpen={mockSetIsMenuOpen}
        logout={mockLogout}
      />
    );
    const recipesButton = screen.queryByText("Recipes");

    expect(recipesButton).not.toBeInTheDocument();
  });
});
