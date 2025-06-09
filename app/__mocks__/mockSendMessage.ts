import { BaseMessage } from "@/types/userInteractions";

export const mockSendMessage: Partial<BaseMessage> = {
  fromUserId: "user123",
  toUserId: "user456",
  content: "hello world",
};
