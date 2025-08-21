import Link from "next/link";
import Image from "next/image";
import checkOwnerRecipe from "@/app/utils/checkOwnerRecipe";
import photoSrc from "@/app/utils/photoSrc";
import { RecipeWithRating, ALLERGEN_ICONS } from "@/types/recipes";
import { AuthUser } from "@/app/hooks/useAuth";
import ForkRating from "@/components/ForkRating";
import { MdDeleteForever } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import {
  UserInteractionsContext,
  UserInteractionsContextType,
} from "@/app/context/context";

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
  const contextUserInteraction = useContext<UserInteractionsContextType | null>(
    UserInteractionsContext
  );
  const [commentCount, setCommentCount] = useState<number | null>(null);

  useEffect(() => {
    if (recipe.id) {
      const fetchCommentCount = async () => {
        try {
          const count =
            await contextUserInteraction?.retrieveCommentCountByRecipeId(
              recipe?.id ?? ""
            );
          setCommentCount(count ?? 0);
        } catch {
          setCommentCount(0);
        }
      };
      fetchCommentCount();
    }
  }, [recipe.id]);

  return (
    <div className="bg-white rounded-3xl transition-all duration-300 w-full max-w-[270px] h-[450px] flex flex-col overflow-hidden">
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden flex items-center justify-center group">
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
        {recipe.allergens && recipe.allergens.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            {recipe.allergens.map((allergen, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-full p-2 shadow-md border border-gray-200 cursor-pointer group/allergen relative"
              >
                <span className="text-lg">{ALLERGEN_ICONS[allergen].icon}</span>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/allergen:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30 pointer-events-none">
                  {allergen}
                </div>
              </div>
            ))}
          </div>
        )}
        {user?.id &&
          checkOwnerRecipe(user.id ?? "", recipe.owner ?? "") &&
          isFromMain && (
            <button
              onClick={() => recipe.id && deleteRecipe(recipe.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-9 h-9 flex items-center justify-center p-0 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-red-600 cursor-pointer z-10"
              role="button"
              aria-label="Delete recipe"
              title="Delete recipe"
              type="button"
            >
              <MdDeleteForever size={22} />
            </button>
          )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1 justify-between">
          <Link href={`/details/${recipe.id}`} className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:underline">
              {recipe.title}
            </h3>
            <span className="text-sm text-gray-500">
              {recipe.expand?.owner?.name}
            </span>
          </Link>
          {user?.id && (
            <button
              aria-label="Toggle favourite"
              className="transition-transform duration-200 hover:scale-125 cursor-pointer border border-gray-200 rounded-full px-2 py-1"
              onClick={() =>
                user?.id &&
                recipe.id &&
                toggleFavourite(user.id, recipe.id ?? "")
              }
            >
              {isFavourite ? (
                <span className="text-xl text-indigo-500 cursor-pointer">
                  ♥
                </span>
              ) : (
                <span className="text-xl text-gray-400 cursor-pointer">♥</span>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center text-yellow-400 justify-between">
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
          <div className="relative flex items-center border border-gray-200 rounded-full px-2 py-1">
            <span className="text-lg">💬</span>
            <span className="absolute -top-2 -right-2 bg-[#6366F1] text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-sm">
              {commentCount}
            </span>
          </div>
        </div>
        <div className="text-gray-500 text-sm line-clamp-2 flex-1 min-h-[48px] pb-1">
          {recipe.description || "No description."}
        </div>
      </div>
    </div>
  );
}
