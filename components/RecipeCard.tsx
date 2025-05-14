import Link from "next/link";
import Image from "next/image";
import checkOwnerRecipe from "@/app/utils/checkOwnerRecipe";
import photoSrc from "@/app/utils/photoSrc";
import Button from "@/components/Button";
import { RecipeWithRating } from "@/types/recipes";
import { AuthUser } from "@/app/hooks/useAuth";

import { TbEggCracked } from "react-icons/tb";
import { BsEggFried } from "react-icons/bs";
import ForkRating from "@/components/ForkRating";

export default function RecipeCard({
  recipe,
  user,
  deleteRecipe,
  toggleFavourite,
  isFavourite,
  isFromMain,
}: {
  recipe: Partial<RecipeWithRating>;
  user: Partial<AuthUser> | null | undefined;
  deleteRecipe: (recipeId: string) => void;
  toggleFavourite: (userId: string, recipeId: string) => Promise<void>;
  isFavourite?: boolean;
  isFromMain?: boolean;
  retrieveRecipeRating: (recipeId: string) => Promise<null | {
    average: number;
    count: number;
  }>;
}) {
  return (
    <div
      key={recipe.id}
      className="bg-white shadow-md rounded-2xl overflow-hidden w-[100%] max-w-[400px] transition hover:shadow-xl flex flex-col"
    >
      <div className="relative w-full">
        {" "}
        <h3 className="text-xl font-semibold text-gray-900 ml-4 p-3">
          {recipe.title}
        </h3>
        <div className="relative w-full aspect-square">
          <Link href={`/details/${recipe.id}`}>
            <Image
              src={photoSrc(recipe.id ?? "", (recipe.photo as string) ?? "")}
              alt={recipe.title ?? "Recipe image"}
              fill
              className="object-cover"
            />
          </Link>
        </div>
        {user?.id &&
          checkOwnerRecipe(user.id ?? "", recipe.owner ?? "") &&
          isFromMain && (
            <Button
              onClick={() => recipe.id && deleteRecipe(recipe.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
              role="button"
            >
              X
            </Button>
          )}
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div className="flex justify-between items-center p-2">
          <div className="flex flex-row gap-2 items-center">
            {recipe.rating && recipe.rating.count > 0 ? (
              <>
                <ForkRating rating={recipe.rating.average} />
                <p className="text-sm text-gray-700">
                  ({recipe.rating.count} ratings)
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">No ratings</p>
            )}
          </div>
          {user?.id && (
            <button
              aria-label="Toggle favourite"
              className={`cursor-pointer ${
                isFavourite ? "text-red-500" : "text-gray-500"
              }`}
              onClick={() =>
                user?.id &&
                recipe.id &&
                toggleFavourite(user.id, recipe.id ?? "")
              }
            >
              {isFavourite ? (
                <BsEggFried
                  size={38}
                  className="transition-all duration-300 hover:scale-125"
                />
              ) : (
                <TbEggCracked
                  size={38}
                  className="transition-all duration-300 hover:scale-125"
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
