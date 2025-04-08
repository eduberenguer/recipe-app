import request from "supertest";
import { createServer } from "http";

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      if (req.method === "POST") {
        const body = await new Promise<string>((resolve) => {
          let data = "";
          req.on("data", (chunk) => (data += chunk));
          req.on("end", () => resolve(data));
        });

        const request = new Request("http://localhost/api/auth/login", {
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
        });

        const result = await POST(request);
        res.statusCode = result.status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(await result.json()));
      }
    });
  });

  afterAll(() => {
    server.close();
  });

  it("should return 201 and success response when loginUser succeeds", async () => {
    const mockResponse = { success: true, token: "mockToken" };
    (loginUser as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(server)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123");
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockResponse);
    expect(loginUser).toHaveBeenCalledTimes(1);
  });

  it("should return 400 when email or password wrong", async () => {
    const mockResponse = { success: false };
    (loginUser as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(server)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongPassword" });

    expect(loginUser).toHaveBeenCalledWith("test@example.com", "wrongPassword");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(mockResponse);
    expect(loginUser).toHaveBeenCalledTimes(1);
  });

  it("should return 500 when something wrong", async () => {
    const mockResponse = { success: false, error: "Something wrong" };
    (loginUser as jest.Mock).mockRejectedValue(mockResponse);

    const response = await request(server)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(mockResponse);
    expect(loginUser).toHaveBeenCalledTimes(1);
  });
});
