import { customToast } from "../showToast";
import { showToast } from "nextjs-toast-notify";

jest.mock("nextjs-toast-notify", () => ({
  showToast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

describe("Custom toast test", () => {
  it("calls showToast.warning with correct args", () => {
    customToast("This is a test", "warning", 4000);

    expect(showToast.warning).toHaveBeenCalledWith("This is a test", {
      duration: 4000,
      progress: true,
      position: "bottom-right",
      transition: "bounceIn",
      icon: "",
    });
  });
});
