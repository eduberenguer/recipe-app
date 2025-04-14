"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../app/context/context";

import Logo from "./Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import { Menu, X } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logout() {
    auth?.logout();
    setIsMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="relative flex justify-between items-center text-stone-500 h-max p-4">
      <h1>
        <Link href={auth?.user ? "/main" : "/"}>
          <Logo />
        </Link>
      </h1>
      {auth?.user && (
        <>
          <nav className="hidden md:flex gap-4 items-center">
            <DesktopNav logout={logout} />
          </nav>
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <MobileNav
            logout={logout}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </>
      )}
    </header>
  );
}
