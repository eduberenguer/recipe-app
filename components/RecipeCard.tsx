import Link from "next/link";
import Image from "next/image";
import checkOwnerRecipe from "@/app/utils/checkOwnerRecipe";
import photoSrc from "@/app/utils/photoSrc";
import { RecipeWithRating } from "@/types/recipes";
import { AuthUser } from "@/app/hooks/useAuth";
import ForkRating from "@/components/ForkRating";
import { MdDeleteForever } from "react-icons/md";

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
    <div className="bg-white rounded-3xl transition-all duration-300 w-full max-w-[370px] h-[450px] flex flex-col overflow-hidden">
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden flex items-center justify-center">
        <Link href={`/details/${recipe.id}`}>
          <Image
            src={photoSrc(recipe.id ?? "", (recipe.photo as string) ?? "")}
            alt={recipe.title ?? "Recipe image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            draggable={false}
            style={{ borderRadius: "1.5rem 1.5rem 0 0" }}
            sizes="(max-width: 600px) 100vw, 370px"
          />
        </Link>
        {user?.id &&
          checkOwnerRecipe(user.id ?? "", recipe.owner ?? "") &&
          isFromMain && (
            <button
              onClick={() => recipe.id && deleteRecipe(recipe.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-9 h-9 flex items-center justify-center p-0 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-red-600 cursor-pointer"
              role="button"
              aria-label="Delete recipe"
              title="Delete recipe"
              type="button"
            >
              <MdDeleteForever size={22} />
            </button>
          )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 justify-between">
          <Link href={`/details/${recipe.id}`} className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:underline">
              {recipe.title}
            </h3>
          </Link>
          {user?.id && (
            <button
              aria-label="Toggle favourite"
              className="transition-transform duration-200 hover:scale-125 cursor-pointer"
              onClick={() =>
                user?.id &&
                recipe.id &&
                toggleFavourite(user.id, recipe.id ?? "")
              }
            >
              {isFavourite ? (
                <span className="text-xl text-indigo-500">♥</span>
              ) : (
                <span className="text-xl text-gray-400">♥</span>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          {recipe.rating && recipe.rating.count > 0 ? (
            <>
              <ForkRating rating={recipe.rating.average} />
              <span className="text-sm text-gray-600">
                ({recipe.rating.count})
              </span>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No ratings</p>
          )}
        </div>
        <div className="text-gray-500 text-sm line-clamp-2 flex-1 min-h-[48px] pb-1">
          {recipe.description || "No description."}
        </div>
      </div>
    </div>
  );
}
