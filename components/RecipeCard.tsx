import Link from "next/link";
import Image from "next/image";
import checkOwnerRecipe from "@/app/utils/check.owner.recipe";
import photoSrc from "@/app/utils/photoSrc";
import Button from "@/components/Button";
import { Recipe } from "@/types/recipes/index";
import { AuthUser } from "@/app/hooks/useAuth";

import { TbEggCracked } from "react-icons/tb";
import { BsEggFried } from "react-icons/bs";

export default function RecipeCard({
  recipe,
  user,
  deleteRecipe,
  toggleFavourite,
  isFavourite,
  isFromMain,
}: {
  recipe: Recipe;
  user: Partial<AuthUser> | null | undefined;
  deleteRecipe: (recipeId: string) => void;
  toggleFavourite: (userId: string, recipeId: string) => Promise<void>;
  isFavourite?: boolean;
  isFromMain?: boolean;
}) {
  return (
    <div
      key={recipe.id}
      className="bg-white shadow-lg rounded-lg overflow-hidden w-[420px] h-[350px] mx-auto transition-transform duration-200 hover:scale-105 flex flex-col justify-between"
    >
      <div className="relative w-full">
        <p
          className={`absolute top-2 left-2 cursor-pointer ${
            isFavourite ? "text-red-500" : "text-gray-500"
          }`}
          style={{
            fontSize: "30px",
            transition: "color 0.3s ease-in-out",
          }}
          onClick={() => user?.id && toggleFavourite(user.id, recipe.id)}
        >
          {isFavourite ? <BsEggFried size={30} /> : <TbEggCracked size={30} />}
        </p>
        <Link href={`/details/${recipe.id}`}>
          <Image
            src={photoSrc(recipe.id, recipe.photo as string)}
            alt={recipe.title}
            width={420}
            height={250}
            className="w-full h-64 object-cover rounded-t-md"
          />
        </Link>
        {user?.id && checkOwnerRecipe(user.id, recipe.owner) && isFromMain && (
          <Button
            onClick={() => deleteRecipe(recipe.id)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
            role="button"
          >
            X
          </Button>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
        <p className="text-gray-600 text-sm">{`${recipe.servings} servings`}</p>
      </div>
    </div>
  );
}
