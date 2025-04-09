import { render, screen } from "@testing-library/react";

import Layout from "../Layout";

jest.mock("../Header", () => {
  const MockHeader = () => <header>Mocked Header</header>;
  MockHeader.displayName = "MockHeader";
  return MockHeader;
});

describe("Layout component", () => {
  it("should render the Header and children", () => {
    render(
      <Layout>
        <p>Test Child</p>
      </Layout>
    );

    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
