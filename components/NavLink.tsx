"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  if (pathname === href) return null;

  return (
    <Link
      href={href}
      className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200"
    >
      {children}
    </Link>
  );
}
