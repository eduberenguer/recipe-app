import request from "supertest";
import { createServer } from "http";

import { POST } from "./route";
import { sendMessage } from "@/server/userInteractions";
import { mockSendMessage } from "@/app/__mocks__/mockSendMessage";

jest.mock("@/server/userInteractions", () => ({
  sendMessage: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options = {}) => {
      const { status = 200 } = options;
      return {
        json: async () => data,
        status,
      };
    }),
  },
}));

describe("POST /api/userInteractions/sendMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url || "", "http://localhost");

      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk as Buffer);
      }

      const body = Buffer.concat(chunks).toString();
      const request = new Request(url.toString(), {
        method: req.method,
        body,
        headers: req.headers as HeadersInit,
      });

      const result = await POST(request);

      res.statusCode = result.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(await result.json()));
    });
    server.listen(0);
  });
  afterAll(() => {
    server.close();
  });

  it("should return 200 and send message", async () => {
    const mockResponse = "message sent successfully";
    (sendMessage as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(server)
      .post("/api/userInteractions/sendMessage/")
      .send(mockSendMessage)
      .set("Content-Type", "application/json");

    expect(sendMessage).toHaveBeenCalledWith(
      mockSendMessage.fromUserId,
      mockSendMessage.toUserId,
      mockSendMessage.content
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: mockResponse,
    });
  });
});
