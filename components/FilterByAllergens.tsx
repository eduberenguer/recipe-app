import { Allergen, ALLERGEN_ICONS, ALLERGENS } from "@/types/recipes";

export default function FilterByAllergens({
  filterByAllergen,
  activeAllergens,
}: {
  filterByAllergen: (Allergen: Allergen) => void;
  activeAllergens: Allergen[];
}) {
  return (
    <div className="flex items-center gap-2 mt-2">
      {ALLERGENS.map((allergen) => (
        <div
          key={allergen}
          className={`flex items-center gap-2 cursor-pointer rounded-full px-4 py-2 transition-all duration-200 ${
            activeAllergens.includes(allergen)
              ? "bg-red-100 border-2 border-red-300 text-red-700 shadow-md"
              : "hover:bg-gray-100"
          }`}
          onClick={() => filterByAllergen(allergen)}
        >
          <span className="text-lg">{ALLERGEN_ICONS[allergen].icon}</span>
          <span className="font-medium">{allergen}</span>
          {activeAllergens.includes(allergen) && (
            <span className="text-red-500 text-sm">✕</span>
          )}
        </div>
      ))}
    </div>
  );
}
