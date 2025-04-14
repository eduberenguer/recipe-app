import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Button from "../Button";

describe("Button component", () => {
  it("renders the button", () => {
    render(<Button>Click</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("render correct text in button", () => {
    render(<Button>Click</Button>);

    expect(screen.getByText("Click"));
  });
});
