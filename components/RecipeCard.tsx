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
}) {
  return (
    <div
      key={recipe.id}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 w-full max-w-[370px]"
    >
      <div className="relative w-full aspect-square">
        <Link href={`/details/${recipe.id}`}>
          <Image
            src={photoSrc(recipe.id ?? "", (recipe.photo as string) ?? "")}
            alt={recipe.title ?? "Recipe image"}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            draggable={false}
          />
        </Link>

        {user?.id &&
          checkOwnerRecipe(user.id ?? "", recipe.owner ?? "") &&
          isFromMain && (
            <Button
              onClick={() => recipe.id && deleteRecipe(recipe.id)}
              className="absolute top-3 right-3 border border-gray-300 shadow-sm text-gray-600 hover:bg-red-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition-colors"
              role="button"
              aria-label="Delete recipe"
            >
              X
            </Button>
          )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {recipe.title}
          </h3>
          {user?.id && (
            <button
              aria-label="Toggle favourite"
              className={`transition-transform duration-200 hover:cursor-pointer ${
                isFavourite ? "text-red-500" : "text-gray-400"
              } hover:scale-110`}
              onClick={() =>
                user?.id &&
                recipe.id &&
                toggleFavourite(user.id, recipe.id ?? "")
              }
            >
              {isFavourite ? (
                <BsEggFried size={26} />
              ) : (
                <TbEggCracked size={26} />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          {recipe.rating && recipe.rating.count > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <ForkRating rating={recipe.rating.average} />
                <span className="text-sm text-gray-600">
                  ({recipe.rating.count})
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No ratings</p>
          )}
        </div>
      </div>
    </div>
  );
}
