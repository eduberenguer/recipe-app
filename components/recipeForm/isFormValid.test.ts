import { isFormValid } from "./isFormValid";

describe("isFormValid test", () => {
  it("should ok if all fields ara ok", () => {
    const result = isFormValid({
      recipe: {
        title: "Pasta Carbonara",
        servings: 4,
        ingredients: [
          {
            name: "Pasta",
            quantity: "500",
            unity: "gr",
          },
        ],
        photo: new File([""], "recipe_photo.jpg"),
        description: "Recipe description",
      },
    });
    expect(result).toEqual(true);
  });
});
