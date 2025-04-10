import { screen, fireEvent, render } from "@testing-library/react";

import { AuthContext } from "@/app/context/context";
import Header from "../Header";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("Header component", () => {
  const mockLogout = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    const useRouter = jest.requireMock("next/navigation").useRouter;
    useRouter.mockReturnValue({ push: mockPush });
  });

  it("should render the Header and children", () => {
    render(
      <AuthContext.Provider
        value={{
          user: { name: "Test User" },
          logout: mockLogout,
          register: jest.fn(),
          login: jest.fn(),
        }}
      >
        <Header />
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("should toggle isMenuOpen state when the menu button is clicked", () => {
    const mockLogout = jest.fn();

    render(
      <AuthContext.Provider
        value={{
          user: { name: "Test User" },
          logout: mockLogout,
          register: jest.fn(),
          login: jest.fn(),
        }}
      >
        <Header />
      </AuthContext.Provider>
    );

    const menuButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(menuButton);

    const profileButton = screen.getByRole("button", { name: "Profile" });
    expect(profileButton).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(
      screen.queryByRole("button", { name: "Profile" })
    ).not.toBeInTheDocument();
  });

  it("should not throw an error when auth is undefined", () => {
    render(
      <AuthContext.Provider value={null}>
        <Header />
      </AuthContext.Provider>
    );

    const logoutButton = screen.queryByRole("button", { name: /logout/i });
    expect(logoutButton).not.toBeInTheDocument();
  });
});
