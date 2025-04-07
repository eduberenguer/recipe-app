import { render } from "@testing-library/react";
import RootLayout from "../layout";
import { useRouter } from "next/navigation";

jest.mock("nextjs-toast-notify");
jest.mock("pocketbase");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("next/head", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

describe("Layout", () => {
  it("renders the layout correctly", () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: "/",
      query: {},
      push: jest.fn(),
      replace: jest.fn(),
      asPath: "/",
    });

    const { getByText } = render(
      <RootLayout>
        <h1>Test</h1>
      </RootLayout>
    );

    expect(getByText(/Test/i)).toBeInTheDocument();
  });
});
