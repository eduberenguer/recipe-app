import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

import Login from "./page";
import { AuthContext } from "../context/context";
import { customToast } from "../utils/showToast";

jest.mock("../utils/showToast", () => ({
  customToast: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const renderLogin = (
  contextValue = {
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }
) => {
  render(
    <AuthContext.Provider value={contextValue}>
      <Login />
    </AuthContext.Provider>
  );
};

describe("Login component", () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("Login is render", () => {
    renderLogin();

    const titlePage = screen.getByRole("heading");

    expect(titlePage).toBeInTheDocument();
  });

  it("should show an error if fields are empty", () => {
    renderLogin({
      user: null,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
    });

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should call login and redirect on successful login", async () => {
    renderLogin({
      user: null,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
    });

    mockLogin.mockResolvedValue({ success: true });

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123123" } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@mail.com",
      password: "123123",
    });

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith("Login successfully", "success");
      expect(mockPush).toHaveBeenCalledWith("/main");
    });
  });

  it("should login error", async () => {
    renderLogin({
      user: null,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
    });

    mockLogin.mockRejectedValue(new Error("Login failed"));

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123123" } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@mail.com",
      password: "123123",
    });
    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "An error occurred. Please try again.",
        "error"
      );
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
