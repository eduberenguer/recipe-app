"use client";

import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export default function NavLink({
  href,
  children,
  className,
  isActive,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`relative text-gray-800 font-semibold tracking-wide py-2 px-4 transition duration-200 cursor-pointer
        after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-1 after:w-0 after:h-0.5 after:bg-indigo-500 after:rounded-full after:transition-all after:duration-300
        hover:after:w-3/4 hover:after:opacity-100 
        ${
          className?.includes("active")
            ? "after:w-3/4 after:opacity-100 text-indigo-700"
            : "after:opacity-0"
        }
        ${className || ""}
        ${isActive ? "text-indigo-700" : ""}`}
    >
      {children}
    </Link>
  );
}
