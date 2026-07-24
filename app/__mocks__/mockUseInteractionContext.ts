import { UserInteractionsContextType } from "../context/context";

export const mockUserInteractionContext: UserInteractionsContextType = {
  sendMessage: jest.fn(),
  sendMessageAi: jest.fn(),
  aiRecipe: null,
  setAiRecipe: jest.fn(),
};
