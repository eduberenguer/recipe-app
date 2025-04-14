import { render, screen } from "@testing-library/react";
import Home from "../page";
import "@testing-library/jest-dom";

describe("Home page", () => {
  it("renders the title correctly", () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to the Recipe App/i)).toBeInTheDocument();
  });
});
