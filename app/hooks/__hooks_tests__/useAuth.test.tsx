import { AuthContext } from "@/app/context/context";
import { useAuth } from "../useAuth";
import { mockAuthContext } from "@/app/__mocks__/mockAuthContext";
import { act, renderHook } from "@testing-library/react";
import { loginUserApi, registerUserApi } from "@/lib/api/users";

jest.mock("@/lib/api/users", () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
}));

import { showToast } from "nextjs-toast-notify";
import { customToast } from "@/app/utils/showToast";
import pb from "@/lib/pocketbase";

jest.mock("nextjs-toast-notify", () => ({
  showToast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("@/lib/pocketbase", () => ({
  __esModule: true,
  default: {
    authStore: {
      model: null,
      clear: jest.fn(),
    },
  },
}));

describe("Custom toast test", () => {
  it("calls showToast.warning with correct args", () => {
    customToast("This is a test", "warning", 4000);

    expect(showToast.warning).toHaveBeenCalledWith("This is a test", {
      duration: 4000,
      progress: true,
      position: "bottom-right",
      transition: "bounceIn",
      icon: "",
    });
  });
});

describe("useUser test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );

  it("should create a new user", async () => {
    (registerUserApi as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const userData = {
        name: "John",
        email: "john@example.com",
        password: "password123",
      };

      await result.current.register(userData);
    });

    expect(registerUserApi).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John",
        email: "john@example.com",
      })
    );

    expect(result.current.user).toEqual(null);
  });

  it("should login", async () => {
    const mockUserResponse = {
      success: true,
      user: {
        id: "1",
        name: "John",
        email: "john@example.com",
        created: "2023-01-01T00:00:00Z",
      },
      isAuthenticated: true,
      token: "fake-token",
    };

    (loginUserApi as jest.Mock).mockResolvedValue(mockUserResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const userData = {
        email: "john@example.com",
        password: "123123",
      };

      await result.current.login(userData);
    });

    expect(loginUserApi).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "123123",
    });

    expect(result.current.user).toEqual({
      id: "1",
      created: "2023-01-01T00:00:00Z",
      name: "John",
      email: "john@example.com",
      token: "fake-token",
      isAuthenticated: true,
    });
  });

  it("should logout and clear user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(pb.authStore.clear).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });
});
