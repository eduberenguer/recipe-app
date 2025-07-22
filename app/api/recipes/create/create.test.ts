import { POST } from "./route";
import { createRecipe } from "@/server/recipes";
import { mockRecipeWithIdv1 } from "@/app/__mocks__/recipe.mock";

jest.mock("@/server/recipes", () => ({
  createRecipe: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, { status = 200 } = {}) => ({
      json: async () => data,
      status,
    })),
  },
}));

function createFakeFormDataRequest(data: Record<string, string>): Request {
  return {
    formData: async () =>
      ({
        get: (key: string) => data[key],
        entries: () => Object.entries(data)[Symbol.iterator](),
      } as unknown),
  } as unknown as Request;
}

describe("POST /api/recipes/create", () => {
  it("should return success and call create", async () => {
    const fakeRequest = createFakeFormDataRequest({
      title: "Test Recipe",
      ingredients: JSON.stringify([{ name: "Salt", quantity: "1 tsp" }]),
    });

    (createRecipe as jest.Mock).mockResolvedValue({
      ...mockRecipeWithIdv1,
      success: true,
    });

    const response = await POST(fakeRequest);

    expect(createRecipe).toHaveBeenCalledWith({
      title: "Test Recipe",
      ingredients: [{ name: "Salt", quantity: "1 tsp" }],
    });

    expect(response.status).toBe(200);
  });

  it("should return 400 ", async () => {
    const fakeRequest = createFakeFormDataRequest({
      title: "Test Recipe",
      ingredients: JSON.stringify([{ name: "Salt", quantity: "1 tsp" }]),
    });

    (createRecipe as jest.Mock).mockResolvedValue({
      error: "Unknown error",
      success: false,
    });

    const response = await POST(fakeRequest);

    expect(createRecipe).toHaveBeenCalledWith({
      title: "Test Recipe",
      ingredients: [{ name: "Salt", quantity: "1 tsp" }],
    });

    expect(response.status).toBe(400);
  });

  it("should return 500 and unknown error", async () => {
    const fakeRequest = createFakeFormDataRequest({
      title: "Test Recipe",
      ingredients: JSON.stringify([{ name: "Salt", quantity: "1 tsp" }]),
    });

    (createRecipe as jest.Mock).mockRejectedValue({
      error: "Unknown error",
      success: false,
    });

    const response = await POST(fakeRequest);

    expect(createRecipe).toHaveBeenCalledWith({
      title: "Test Recipe",
      ingredients: [{ name: "Salt", quantity: "1 tsp" }],
    });

    expect(response.status).toBe(500);
  });
});
