export const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case "easy":
      return "text-green-700 bg-green-50 shadow-sm";
    case "medium":
      return "text-yellow-700 bg-yellow-50 shadow-sm";
    case "hard":
      return "text-red-700 bg-red-50 shadow-sm";
    default:
      return "text-gray-600 bg-gray-50 shadow-sm";
  }
};
