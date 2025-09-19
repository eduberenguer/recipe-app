"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext, AuthContextType } from "../app/context/context";
import Logo from "./Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import { Menu, X } from "lucide-react";
import Button from "./Button";

export default function Header() {
  const router = useRouter();
  const auth = useContext<AuthContextType | null>(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logout(): void {
    auth?.logout();
    setIsMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8">
        <Link href={auth?.user ? "/main" : "/"} className="flex items-center">
          <Logo />
        </Link>
        {auth?.user && (
          <>
            <nav className="hidden md:flex flex-1 justify-center">
              <DesktopNav logout={logout} />
            </nav>

            <div className="flex items-center md:hidden">
              <Button
                backgroundColor="bg-[#6366F1] text-white"
                hoverColor="hover:bg-[#6366F1]/90"
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </Button>
            </div>

            <MobileNav
              logout={logout}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          </>
        )}
      </div>
    </header>
  );
}
