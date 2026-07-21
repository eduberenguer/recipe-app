import { cookies } from "next/headers";
import { retrieveFavourites } from "@/server/userInteractions";
import FavouritesList from "./FavouritesList";

// SSR: reads the "authUser" cookie on every request, so this page can never
// be prerendered once (SSG) — Next.js marks it "ƒ (Dynamic)" because it
// depends on cookies(), which only exist per-request.
export default async function Favourites() {
  const authCookie = (await cookies()).get("authUser");
  const authUser = authCookie ? JSON.parse(authCookie.value) : null;

  const favouriteRecipes = authUser?.id
    ? await retrieveFavourites(authUser.id)
    : [];

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
          My favourites recipes
        </h2>
      </header>
      <FavouritesList initialRecipes={favouriteRecipes} userId={authUser?.id} />
    </div>
  );
}
