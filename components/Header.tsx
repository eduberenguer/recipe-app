"use client";
import { useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "../app/context/context";

import Button from "./Button";
import NavLink from "./NavLink";
import Logo from "./Logo";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useContext(AuthContext);

  function logout() {
    auth?.logout();
    router.push("/login");
  }

  return (
    <header className="flex justify-between items-center text-stone-500 h-max p-4">
      <h1>
        {auth?.user ? (
          <Link href="/main">
            <Logo />
          </Link>
        ) : (
          <Link href="/">
            <Logo />
          </Link>
        )}
      </h1>
      {auth?.user && (
        <div className="flex gap-4">
          {pathname !== "/main" && <NavLink href="/main">Recipes</NavLink>}
          {pathname !== "/create-recipes" && (
            <NavLink href="/create-recipes">Create recipe</NavLink>
          )}
          {pathname !== "/profile" && (
            <NavLink href="/profile">Profile</NavLink>
          )}
          <Button onClick={logout} backgroundColor="bg-red-500">
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
