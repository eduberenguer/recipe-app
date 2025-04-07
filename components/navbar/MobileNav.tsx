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

  if (!isMenuOpen) return null;

  return (
    <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start gap-3 p-6 z-50 md:hidden">
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
      {pathname !== "/profile" && (
        <button
          onClick={() => handleNav("/profile")}
          className="text-lg font-medium"
        >
          Profile
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
