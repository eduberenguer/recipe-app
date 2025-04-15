import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

import Register from "./page";
import { AuthContext } from "../context/context";
import { customToast } from "../utils/showToast";

jest.mock("../utils/showToast", () => ({
  customToast: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const renderRegister = (
  contextValue = {
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  }
) => {
  render(
    <AuthContext.Provider value={contextValue}>
      <Register />
    </AuthContext.Provider>
  );
};

describe("Register component", () => {
  const mockRegister = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("Register is render", () => {
    renderRegister({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
    });

    const titlePage = screen.getByRole("heading");

    expect(titlePage).toBeInTheDocument();
  });

  it("should show an error if fields are empty", () => {
    renderRegister({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
    });

    const submitButton = screen.getByRole("button", { name: /Sign Up/i });
    fireEvent.click(submitButton);

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should error because password must be at least 6 characters long", async () => {
    renderRegister({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
    });

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatPassword = screen.getByPlaceholderText("Repeat password");
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "12312" } });
    fireEvent.change(repeatPassword, {
      target: { value: "12312" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Password must be at least 6 characters long.",
        "error"
      );
    });
  });

  it("should error because passwords do not match.", async () => {
    renderRegister({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
    });

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatPassword = screen.getByPlaceholderText("Repeat password");
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123123" } });
    fireEvent.change(repeatPassword, {
      target: { value: "otherPassword" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Passwords do not match. Please try again.",
        "error"
      );
    });
  });

  it("should register and redirect to login", async () => {
    renderRegister({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
    });
    mockRegister.mockResolvedValue({ success: true });

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const repeatPassword = screen.getByPlaceholderText("Repeat password");
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123123" } });
    fireEvent.change(repeatPassword, {
      target: { value: "123123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockRegister).toHaveBeenCalledWith({
        name: "John",
        email: "test@mail.com",
        password: "123123",
        repeatPassword: "123123",
      });

      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
