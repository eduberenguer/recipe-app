import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Chat from "./page";
import { AuthContext, UserInteractionsContext } from "../context/context";
import { mockUserInteractionContext } from "../__mocks__/mockUseInteractionContext";
import { mockAuthContext } from "../__mocks__/mockAuthContext";

jest.mock("@/lib/pocketbase", () => ({
  __esModule: true,
  default: {
    collection: jest.fn(() => ({
      getFullList: jest.fn().mockResolvedValue([]),
      subscribe: jest.fn().mockResolvedValue(() => {}),
      unsubscribe: jest.fn(),
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
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuthContext}>
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
            <Chat />
          </UserInteractionsContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>,
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
      expect(screen.getAllByText(/messages/i).length).toBe(2);
    });
  });
});
