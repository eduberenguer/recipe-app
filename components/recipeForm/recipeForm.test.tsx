import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import RecipeForm from "./recipeForm";
import { customToast } from "@/app/utils/showToast";
import { AuthContext, RecipesContext } from "@/app/context/context";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@/app/utils/showToast", () => ({
  customToast: jest.fn(),
}));

const mockAuthValue = {
  user: { id: "123", name: "Test User" },
  isAuthenticated: true,
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
};

const mockRecipesValue = {
  stateAllRecipes: [],
  stateRecipe: null,
  createRecipe: jest.fn(),
  retrieveRecipesList: jest.fn(),
  deleteRecipe: jest.fn(),
  retrieveRecipe: jest.fn(),
  retrieveRecipesByFilterName: jest.fn(),
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
    const { container } = render(<RecipeForm />);

    const fileInput = container.querySelector(
      'input[type="file"]'
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
    render(<RecipeForm />);

    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getByRole("combobox");

    fireEvent.change(ingredientInput, { target: { value: "Tomato" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitySelect, { target: { value: "kg" } });

    expect(ingredientInput).toHaveValue("Tomato");
    expect(quantityInput).toHaveValue("2");
    expect(unitySelect).toHaveValue("kg");
  });

  it("should add/delete ingredient to the list when clicking the add button/delete ingredient", () => {
    render(<RecipeForm />);

    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getByRole("combobox");
    const addButton = screen.getByText("+");

    fireEvent.change(ingredientInput, { target: { value: "Tomato" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitySelect, { target: { value: "kg" } });

    fireEvent.click(addButton);

    const ingredientItem = screen.getByText("2 kg Tomato");
    expect(ingredientItem).toBeInTheDocument();

    const deleteButton = screen.getByText("X");
    fireEvent.click(deleteButton);

    expect(ingredientItem).not.toBeInTheDocument();
  });

  it("should toast message when fill in all ingredient fields", async () => {
    render(<RecipeForm />);

    const addButton = screen.getByText("+");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Please fill in all ingredient fields",
        "warning"
      );
    });
  });

  it("should toast message please enter a title when title is empty", async () => {
    render(<RecipeForm />);

    const servingsInput = screen.getByPlaceholderText("Servings");
    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getByRole("combobox");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const saveButton = screen.getByText("Save Recipe");

    fireEvent.change(ingredientInput, { target: { value: "Tomato" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitySelect, { target: { value: "kg" } });

    fireEvent.change(servingsInput, { target: { value: 2 } });
    fireEvent.change(descriptionInput, {
      target: { value: "Recipe description....." },
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Please enter a title",
        "warning"
      );
    });
  });

  it("should toast message please enter a number of servings when servings is empty", async () => {
    render(<RecipeForm />);

    const titleInput = screen.getByPlaceholderText("Recipe title");
    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getByRole("combobox");
    const descriptioInput = screen.getByPlaceholderText("Description");
    const saveButton = screen.getByText("Save Recipe");

    fireEvent.change(titleInput, { target: { value: "Lasagna" } });
    fireEvent.change(ingredientInput, { target: { value: "Tomato" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitySelect, { target: { value: "kg" } });
    fireEvent.change(descriptioInput, {
      target: { value: "Recipe description....." },
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Please enter a number of servings",
        "warning"
      );
    });
  });

  it("should ok when all ingredients are add", async () => {
    mockRecipesValue.createRecipe.mockResolvedValue({ id: "recipe123" });

    render(
      <AuthContext.Provider value={mockAuthValue}>
        <RecipesContext.Provider value={mockRecipesValue}>
          <RecipeForm />
        </RecipesContext.Provider>
      </AuthContext.Provider>
    );

    const titleInput = screen.getByPlaceholderText("Recipe title");
    const servingsInput = screen.getByPlaceholderText("Servings");
    const ingredientInput = screen.getByPlaceholderText("Ingredient");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const unitySelect = screen.getByRole("combobox");
    const descriptioInput = screen.getByPlaceholderText("Description");
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

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Recipe created successfully",
        "success"
      );
    });
  });

  it("should toast message please enter at least one ingredient", async () => {
    render(<RecipeForm />);

    const titleInput = screen.getByPlaceholderText("Recipe title");
    const servingsInput = screen.getByPlaceholderText("Servings");
    const descriptioInput = screen.getByPlaceholderText("Description");
    const saveButton = screen.getByText("Save Recipe");

    fireEvent.change(titleInput, { target: { value: "Lasagna" } });
    fireEvent.change(servingsInput, { target: { value: 2 } });
    fireEvent.change(descriptioInput, {
      target: { value: "Recipe description....." },
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(customToast).toHaveBeenCalledWith(
        "Please enter at least one ingredient",
        "warning"
      );
    });
  });
});
