import { render, screen } from "@testing-library/react";

import NavLink from "../NavLink";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Layout component", () => {
  it("should render the NavLink and children", () => {
    render(
      <NavLink href="/test">
        <p>Test Child</p>
      </NavLink>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
