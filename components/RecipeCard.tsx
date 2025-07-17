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
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-[370px] cursor-pointer group">
      <div className="relative w-full aspect-square overflow-hidden">
        <Link href={`/details/${recipe.id}`}>
          <Image
            src={photoSrc(recipe.id ?? "", (recipe.photo as string) ?? "")}
            alt={recipe.title ?? "Recipe image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            draggable={false}
            style={{ borderRadius: "1.5rem 1.5rem 0 0" }}
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
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {recipe.title}
          </h3>
          {user?.id && (
            <button
              aria-label="Toggle favourite"
              className="transition-transform duration-200 hover:scale-125"
              onClick={() =>
                user?.id &&
                recipe.id &&
                toggleFavourite(user.id, recipe.id ?? "")
              }
            >
              {isFavourite ? (
                <BsEggFried
                  size={30}
                  color="#FFD600"
                  style={{ filter: "drop-shadow(0 0 2px #fff)" }}
                />
              ) : (
                <TbEggCracked size={30} color="#d1d5db" />
              )}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          {recipe.rating && recipe.rating.count > 0 ? (
            <div className="flex items-center gap-2">
              <ForkRating rating={recipe.rating.average} />
              <span className="text-sm text-gray-600">
                ({recipe.rating.count})
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No ratings</p>
          )}
        </div>
      </div>
    </div>
  );
}
