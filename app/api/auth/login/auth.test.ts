import { POST } from "./route";
import { loginUser } from "@/server/auth";

jest.mock("@/server/auth");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, { status }) => ({
      json: async () => data,
      status,
    })),
  },
}));

describe("POST /api/auth/login", () => {
  it("should return 201 and success response when loginUser succeeds", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
      }),
    } as unknown as Request;

    const mockResponse = { success: true, token: "mockToken" };
    (loginUser as jest.Mock).mockResolvedValue(mockResponse);

    const response = await POST(mockRequest);
    const jsonResponse = await response.json();

    expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123");
    expect(response.status).toBe(201);
    expect(jsonResponse).toEqual(mockResponse);
  });

  it("should return 400 and error response when loginUser fails", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "wrongPassword",
      }),
    } as unknown as Request;

    const mockResponse = { success: false, error: "Invalid credentials" };
    (loginUser as jest.Mock).mockResolvedValue(mockResponse);

    const response = await POST(mockRequest);
    const jsonResponse = await response.json();

    expect(loginUser).toHaveBeenCalledWith("test@example.com", "wrongPassword");
    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual(mockResponse);
  });

  it("should return 500 and error response when an exception is thrown", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "password123",
      }),
    } as unknown as Request;

    (loginUser as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    const response = await POST(mockRequest);
    const jsonResponse = await response.json();

    expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123");
    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      success: false,
      error: "Unexpected error",
    });
  });
});
