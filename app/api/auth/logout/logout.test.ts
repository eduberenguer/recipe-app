import request from "supertest";
import { createServer } from "http";
import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      if (req.method === "POST") {
        const result = await POST();
        res.statusCode = result ? 200 : 204;
        res.end();
      }
    });
  });

  it("should return null when logout", async () => {
    const response = await request(server).post("/api/auth/logout");
    expect(response.status).toBe(204);
  });
});
