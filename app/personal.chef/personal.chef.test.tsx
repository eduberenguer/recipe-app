import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PersonalChef from "./page";
import { mockAuthContext } from "../__mocks__/mockAuthContext";
import { mockUserInteractionContext } from "../__mocks__/mockUseInteractionContext";
import { AuthContext, UserInteractionsContext } from "../context/context";

describe("PersonalChef component", () => {
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
            <PersonalChef />
          </UserInteractionsContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>,
    );
  };

  it("PersonalChef component is render", () => {
    customRender();

    const titlePage = screen.getByText("My Personal Chef 🤖");

    expect(titlePage).toBeInTheDocument();
  });

  it("should render with no AuthContext", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={null}>
          <UserInteractionsContext.Provider value={mockUserInteractionContext}>
            <PersonalChef />
          </UserInteractionsContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>,
    );

    expect(screen.getByText("My Personal Chef 🤖")).toBeInTheDocument();
  });
});
