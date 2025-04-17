import { renderHook } from "@testing-library/react";
import { useIsMobile } from "../useIsMobile";

describe("UseIsMobile test", () => {
  beforeEach(() => {
    window.innerWidth = 1024;
  });

  it("should return false when window width is greater than 768", () => {
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("should return true when window width is less than 768", () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });
});
