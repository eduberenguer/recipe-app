import { render, screen } from "@testing-library/react";

import NavLink from "../NavLink";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Layout component", () => {
  const usePathname = jest.requireMock("next/navigation").usePathname;

  it("should render the NavLink and children", () => {
    render(
      <NavLink href="/test">
        <p>Test Child</p>
      </NavLink>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("should not render anything when pathname is equal to href", () => {
    usePathname.mockReturnValue("/test");

    const { container } = render(
      <NavLink href="/test">
        <p>Test Child</p>
      </NavLink>
    );

    expect(container.firstChild).toBeNull();
  });
});
