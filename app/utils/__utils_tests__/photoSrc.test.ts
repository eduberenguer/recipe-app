const POCKETBASE_URL = "https://example.com/photos";
process.env.NEXT_PUBLIC_PHOTO_URL = POCKETBASE_URL;

import photoSrc from "@/app/utils/photoSrc";

describe("photoSrc function", () => {
  const POCKETBASE_URL = "https://example.com/photos";

  beforeAll(() => {
    process.env.NEXT_PUBLIC_PHOTO_URL = POCKETBASE_URL;
  });

  it("should generate the correct URL for a given recipe ID and photo", () => {
    const recipeId = "recipe123";
    const photoRecipe = "photo.jpg";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}/${recipeId}/${photoRecipe}`);
  });

  it("should handle empty recipeId gracefully", () => {
    const recipeId = "";
    const photoRecipe = "photo.jpg";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}/${recipeId}/${photoRecipe}`);
  });

  it("should handle empty photoRecipe gracefully", () => {
    const recipeId = "recipe123";
    const photoRecipe = "";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}/${recipeId}/`);
  });

  it("should handle both recipeId and photoRecipe as empty", () => {
    const recipeId = "";
    const photoRecipe = "";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}//`);
  });
});

describe("photoSrc function", () => {
  const POCKETBASE_URL = "https://example.com/photos";

  beforeAll(() => {
    process.env.NEXT_PUBLIC_PHOTO_URL = POCKETBASE_URL;
  });

  it("should generate the correct URL for a given recipe ID and photo", () => {
    const recipeId = "recipe123";
    const photoRecipe = "photo.jpg";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}/${recipeId}/${photoRecipe}`);
  });

  it("should handle empty recipeId gracefully", () => {
    const recipeId = "";
    const photoRecipe = "photo.jpg";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}/${recipeId}/${photoRecipe}`);
  });

  it("should handle empty photoRecipe gracefully", () => {
    const recipeId = "recipe123";
    const photoRecipe = "";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}/${recipeId}/`);
  });

  it("should handle both recipeId and photoRecipe as empty", () => {
    const recipeId = "";
    const photoRecipe = "";

    const result = photoSrc(recipeId, photoRecipe);

    expect(result).toBe(`${POCKETBASE_URL}//`);
  });
});
