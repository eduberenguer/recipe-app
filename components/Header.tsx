"use client";
import { useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { AuthContext } from "../app/context/context";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useContext(AuthContext);

  function logout() {
    auth?.logout();
    router.push("/login");
  }

  return (
    <header>
      <h1>
        <Link href="/">Logo</Link>
      </h1>
      {auth?.user && pathname !== "/main" && <Link href="/main">Main</Link>}
      {auth?.user && pathname !== "/create-recipes" && (
        <Link href="/create-recipes">Create recipe</Link>
      )}
      {auth?.user && pathname !== "/profile" && (
        <Link href="/profile">Profile</Link>
      )}
      {auth?.user && <button onClick={logout}>Logout</button>}
    </header>
  );
}
