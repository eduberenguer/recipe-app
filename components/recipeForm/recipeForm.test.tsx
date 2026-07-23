import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";

import RecipeForm from "./recipeForm";
import { customToast } from "@/app/utils/showToast";
import { AuthContext } from "@/app/context/context";
import { createNewRecipesApi } from "@/lib/api/recipes";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@/app/utils/showToast", () => ({
  customToast: jest.fn(),
}));

jest.mock("./isFormValid", () => ({
  isFormValid: () => true,
}));

jest.mock("@/lib/api/recipes");

const mockAuthValue = {
  user: { id: "123", name: "Test User" },
  isAuthenticated: true,
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
};

const renderWithProviders = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthValue}>{ui}</AuthContext.Provider>
    </QueryClientProvider>,
  );
};

describe("RecipeForm component", () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/mock");
  });

  afterAll(() => {
    global.URL.createObjectURL = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("recipeForm is render", () => {
    const { container } = renderWithProviders(<RecipeForm />);

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const label = screen.getByText("example.png");
    expect(label).toBeInTheDocument();

    const previewImage = screen.getByAltText("Preview");
    expect(previewImage).toBeInTheDocument();
    expect(previewImage).toHaveAttribute("src", "blob:http://localhost/mock");
  });

  it("should update ingredients state when inputs change", () => {
    renderWithProviders(<RecipeForm />);

    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getAllByRole("combobox")[1];

    fireEvent.change(ingredientInput, { target: { value: "Tomato" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitySelect, { target: { value: "kg" } });

    expect(ingredientInput).toHaveValue("Tomato");
    expect(quantityInput).toHaveValue("2");
    expect(unitySelect).toHaveValue("kg");
  });

  it("should add/delete ingredient to the list when clicking the add button/delete ingredient", () => {
    renderWithProviders(<RecipeForm />);

    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getAllByRole("combobox")[1];
    const addButton = screen.getByText("+");

    fireEvent.change(ingredientInput, { target: { value: "Tomato" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitySelect, { target: { value: "kg" } });

    fireEvent.click(addButton);

    const ingredientItem = screen.getByText("2 kg Tomato");
    expect(ingredientItem).toBeInTheDocument();

    const deleteButton = screen.getByText("×");
    fireEvent.click(deleteButton);

    expect(ingredientItem).not.toBeInTheDocument();
  });

  it("should ok when all ingredients are add", async () => {
    (createNewRecipesApi as jest.Mock).mockResolvedValue({ id: "recipe123" });

    renderWithProviders(<RecipeForm />);

    const titleInput = screen.getByPlaceholderText("Recipe title");
    const servingsInput = screen.getByPlaceholderText("Servings");
    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getAllByRole("combobox")[1];
    const descriptioInput = screen.getByPlaceholderText(
      "Description for numbered steps...",
    );
    const addButton = screen.getByText("+");
    const saveButton = screen.getByText("Save Recipe");

    fireEvent.change(titleInput, { target: { value: "Lasagna" } });
    fireEvent.change(servingsInput, { target: { value: 2 } });
    fireEvent.change(ingredientInput, { target: { value: "Tomato" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitySelect, { target: { value: "kg" } });
    fireEvent.change(descriptioInput, {
      target: { value: "Recipe description....." },
    });

    fireEvent.click(addButton);
    fireEvent.click(saveButton);

    expect(saveButton).not.toBeDisabled();

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Recipe created successfully",
        "success",
      );
    });
  });
});
