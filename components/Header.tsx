"use client";
import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthContext } from "../app/context/context";

export default function Header() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  function logout() {
    auth?.logout();
    router.push("/login");
  }

  return (
    <header>
      <h1>
        <Link href="/">Header</Link>
      </h1>
      {auth?.user && <Link href="/create-recipes">Create recipe</Link>}
      {auth?.user && <Link href="/profile">Profile</Link>}
      {auth?.user && <button onClick={logout}>Logout</button>}
    </header>
  );
}
