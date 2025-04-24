import { fireEvent, render, screen } from "@testing-library/react";

import RatingForm from "../RatingForm";

describe("RatingForm component", () => {
  it("should render the component", () => {
    render(
      <RatingForm
        recipeId="test-recipe-id"
        handleAddRating={(recipeId, rating) => {}}
      />
    );

    const rateTitle = screen.getByLabelText("Rate this recipe:");
    expect(rateTitle).toBeInTheDocument();
  });

  it("should call handleAddRating with correct arguments", () => {
    const mockHandleAddRating = jest.fn();

    render(
      <RatingForm
        recipeId="test-recipe-id"
        handleAddRating={mockHandleAddRating}
      />
    );

    const input = screen.getByLabelText("Rate this recipe:");
    const submitButton = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "4" } });
    fireEvent.click(submitButton);

    expect(mockHandleAddRating).toHaveBeenCalledWith("test-recipe-id", 4);
  });
});
