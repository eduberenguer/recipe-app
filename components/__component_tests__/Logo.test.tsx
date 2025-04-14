import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Logo from "../Logo";

describe("Logo component", () => {
  it("has the correct class names", () => {
    render(<Logo />);
    const logoContainer = screen.getByRole("img");
    expect(logoContainer).toHaveClass("rounded-lg");
  });
});
