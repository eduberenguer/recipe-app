"use client";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "./context/context";

export default function Home() {
  const useAuth = useContext(AuthContext);

  return (
    <div>
      {useAuth?.user ? (
        <div>
          <h2>Welcome {useAuth.user.name}</h2>
        </div>
      ) : (
        <div>
          <h2>Welcome to the app</h2>
          <Link href="/login">Login</Link>
          <Link href="/register">Signup</Link>
        </div>
      )}
    </div>
  );
}
