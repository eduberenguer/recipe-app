import { Message } from "@/types/userInteractions";

export const mockSendMessage: Partial<Message> = {
  fromUserId: "user123",
  toUserId: "user456",
  content: "hello world",
};
