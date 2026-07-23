import { fireEvent, render, screen } from "@testing-library/react";

import FilterByName from "../FilterByName";

describe("Filter by name component", () => {
  it("should render the component", () => {
    render(<FilterByName filter="" onFilterChange={() => {}} />);

    const inputElement = screen.getByPlaceholderText("Search by name");
    expect(inputElement).toBeInTheDocument();

    const textbox = screen.getByRole("textbox");
    expect(textbox).toBeInTheDocument();
  });

  it("should call onFilterChange when the input changes", () => {
    const onFilterChange = jest.fn();

    render(<FilterByName filter="" onFilterChange={onFilterChange} />);

    const inputElement = screen.getByPlaceholderText("Search by name");

    fireEvent.change(inputElement, { target: { value: "Pasta" } });

    expect(onFilterChange).toHaveBeenCalledWith("Pasta");
  });

  it("should reflect the filter prop as the input value", () => {
    render(<FilterByName filter="Pasta" onFilterChange={() => {}} />);

    const inputElement = screen.getByPlaceholderText("Search by name");
    expect(inputElement).toHaveValue("Pasta");
  });
});
