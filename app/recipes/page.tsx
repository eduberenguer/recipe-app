import Link from "next/link";
import Image from "next/image";
import { retrieveAllRecipes } from "@/server/recipes";
import photoSrc from "@/app/utils/photoSrc";
import NavLink from "@/components/NavLink";

// SSG + ISR: no "use client" here, this whole page runs on the server.
// The HTML is generated once and reused for every visitor; "revalidate"
// tells Next.js to regenerate it in the background at most every 60
// seconds, so new recipes/ratings eventually show up without a full
// rebuild.
export const revalidate = 60;

// This is a public preview, not the full catalog: logged-in users get
// redirected to "/main" by the middleware, where they can filter recipes
// and use favourites/ratings/comments.
const PREVIEW_COUNT = 6;

export default async function RecipesCatalog() {
  const recipes = (await retrieveAllRecipes()).slice(0, PREVIEW_COUNT);

  return (
    <main className="bg-gray-100 min-h-screen font-sans px-4 md:px-16 py-12">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
        A taste of what you&apos;ll find
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
        Sign in to rate, comment and save your favourite recipes.{" "}
        <NavLink href="/login">Get started</NavLink>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/details/${recipe.id}`}
            className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden block"
          >
            <div className="relative w-full h-48">
              <Image
                src={photoSrc(recipe.id ?? "", (recipe.photo as string) ?? "")}
                alt={recipe.title ?? "Recipe photo"}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {recipe.title}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {recipe.difficulty} · {recipe.duration} min
              </p>
              <p className="text-sm text-yellow-600">
                ⭐ {recipe.rating?.average ?? 0} ({recipe.rating?.count ?? 0})
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
