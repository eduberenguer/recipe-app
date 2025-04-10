import { render, screen } from "@testing-library/react";
import LayoutWrapper from "../app.layout";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LayoutWrapper", () => {
  it("renders the layout and children correctly", () => {
    render(
      <LayoutWrapper>
        <p>Test Child</p>
      </LayoutWrapper>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
