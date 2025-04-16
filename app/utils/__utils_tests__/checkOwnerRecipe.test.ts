import checkOwnerRecipe from "../checkOwnerRecipe";

describe("Check owner Recipe test", () => {
  it("shoud return true when ownerId and recipeOwner have same value", () => {
    const returnTrue = checkOwnerRecipe("user123", "user123");

    expect(returnTrue).toBeTruthy();
  });

  it("shoud return false when ownerId and recipeOwner not have same value", () => {
    const returnFalse = checkOwnerRecipe("user123", "other123");

    expect(returnFalse).toBeFalsy();
  });
});
