import { render, screen } from "@testing-library/react";

import CustomCarousel from "../CustomCarousel";

jest.mock("react-multi-carousel", () => {
  const MockCarousel = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-carousel">{children}</div>
  );
  MockCarousel.displayName = "MockCarousel";
  return MockCarousel;
});

describe("Custom Carousel component", () => {
  it("should render the component", () => {
    render(<CustomCarousel></CustomCarousel>);

    expect(screen.getByAltText("1")).toBeInTheDocument();
    expect(screen.getByAltText("2")).toBeInTheDocument();
    expect(screen.getByAltText("3")).toBeInTheDocument();
    expect(screen.getByAltText("4")).toBeInTheDocument();
    expect(screen.getByAltText("5")).toBeInTheDocument();
  });
});
