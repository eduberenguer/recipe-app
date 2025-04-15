"use client";

import { useRouter, usePathname } from "next/navigation";

type Props = {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  logout: () => void;
};

export default function MobileNav({
  isMenuOpen,
  setIsMenuOpen,
  logout,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <div
      aria-hidden={!isMenuOpen}
      data-testid="mobile-nav"
      className={`
        transition-all duration-300 ease-in-out transform origin-top
        ${
          isMenuOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }
        bg-white shadow-md w-full absolute top-full left-0 z-50
        flex flex-col items-start p-4 gap-2
      `}
    >
      {pathname !== "/main" && (
        <button
          onClick={() => handleNav("/main")}
          className="text-lg font-medium"
        >
          Recipes
        </button>
      )}
      {pathname !== "/create.recipes" && (
        <button
          onClick={() => handleNav("/create-recipes")}
          className="text-lg font-medium"
        >
          Create Recipe
        </button>
      )}
      {pathname !== "/favourites" && (
        <button
          onClick={() => handleNav("/favourites")}
          className="text-lg font-medium"
        >
          Favourites
        </button>
      )}
      {pathname !== "/dashboard" && (
        <button
          onClick={() => handleNav("/dashboard")}
          className="text-lg font-medium"
        >
          Dashboard
        </button>
      )}
      <button
        onClick={() => {
          logout();
          setIsMenuOpen(false);
        }}
        className="text-red-500 text-lg font-medium hover:underline mt-2"
      >
        Logout
      </button>
    </div>
  );
}
