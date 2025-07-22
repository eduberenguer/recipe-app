import { POST } from "./route";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, { status = 200 } = {}) => ({
      status,
      json: async () => data,
    }),
  },
}));

describe("POST /api/auth/logout", () => {
  it("should return 200 and success message", async () => {
    const response = await POST();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({ success: true, message: "Logged out" });
  });
});
