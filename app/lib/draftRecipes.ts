import { Recipe } from "@/types/recipes";

export const draftRecipes: Recipe[] = [
  {
    id: "draft1",
    title: "Spaghetti Carbonara",
    photo:
      "https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyYm9uYXJhfGVufDB8fDB8fHwy",
    ingredients: [
      { name: "Spaghetti", quantity: 200, unity: "gr" },
      { name: "Eggs", quantity: 2, unity: "unit" },
      { name: "Parmesan", quantity: 50, unity: "gr" },
      { name: "Pancetta", quantity: 100, unity: "gr" },
      { name: "Black Pepper", quantity: 1, unity: "unit" },
    ],
    servings: 2,
    description:
      "Cook pasta. Mix eggs and cheese. Fry pancetta. Combine all with pasta. Serve hot.",
    owner: "",
    favouritesCounter: 0,
    views: 0,
    isVisible: true,
    allergens: ["egg"],
    created: new Date(),
    duration: 30,
    difficulty: "medium",
  },
  {
    id: "draft2",
    title: "Chicken Tacos",
    photo:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGFjb3N8ZW58MHx8MHx8fDI%3D",
    ingredients: [
      { name: "Tortillas", quantity: 3, unity: "unit" },
      { name: "Chicken", quantity: 200, unity: "gr" },
      { name: "Avocado", quantity: 1, unity: "unit" },
      { name: "Lime", quantity: 1, unity: "unit" },
      { name: "Cilantro", quantity: 10, unity: "gr" },
    ],
    servings: 3,
    description:
      "Cook chicken. Warm tortillas. Fill with ingredients. Serve with lime.",
    owner: "",
    favouritesCounter: 0,
    views: 0,
    isVisible: true,
    allergens: ["gluten"],
    created: new Date(),
    duration: 25,
    difficulty: "medium",
  },
  {
    id: "draft3",
    title: "Vegetable Stir Fry",
    photo:
      "https://images.unsplash.com/photo-1593967858208-67ddb5b4c406?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VmVnZXRhYmxlJTIwU3RpciUyMEZyeXxlbnwwfHwwfHx8Mg%3D%3D",
    ingredients: [
      { name: "Broccoli", quantity: 100, unity: "gr" },
      { name: "Carrots", quantity: 50, unity: "gr" },
      { name: "Bell Peppers", quantity: 50, unity: "gr" },
      { name: "Soy Sauce", quantity: 2, unity: "unit" },
      { name: "Rice", quantity: 150, unity: "gr" },
    ],
    servings: 2,
    description: "Stir fry vegetables. Add soy sauce. Serve with rice.",
    owner: "",
    favouritesCounter: 0,
    views: 0,
    isVisible: true,
    allergens: ["soy"],
    created: new Date(),
    duration: 20,
    difficulty: "easy",
  },
];
