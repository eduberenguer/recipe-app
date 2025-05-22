import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Chat from "./page";
import {
  AuthContext,
  RecipesContext,
  UserInteractionsContext,
} from "../context/context";
import { mockUserInteractionContext } from "../__mocks__/mockUseInteractionContext";
import { mockRecipesContext } from "../__mocks__/mockRecipesContext";
import { mockAuthContext } from "../__mocks__/mockAuthContext";

jest.mock("@/lib/pocketbase", () => ({
  __esModule: true,
  default: {
    collection: jest.fn(() => ({
      getFullList: jest.fn().mockResolvedValue([]),
      subscribe: jest.fn().mockResolvedValue(() => {}),
    })),
  },
}));

jest.mock("@/server/userInteractions", () => ({
  getConversationsForUser: jest
    .fn()
    .mockResolvedValue([{ id: "user123", name: "user123" }]),
  searchUsersByUsername: jest.fn().mockResolvedValue([]),
  getMessagesBetweenUsers: jest.fn().mockResolvedValue([]),
}));

describe("Chat component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const customRender = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <RecipesContext.Provider value={mockRecipesContext}>
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
            <Chat />
          </UserInteractionsContext.Provider>
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );
  };

  it("chat is render", async () => {
    customRender();

    await waitFor(() => {
      expect(screen.getByText("Chats")).toBeInTheDocument();
    });
  });

  it("select user in chat", async () => {
    customRender();

    const userButton = await screen.findByText("user123");
    fireEvent.click(userButton);

    await waitFor(() => {
      expect(screen.getByText(/messages/i)).toBeInTheDocument();
    });
  });
});
