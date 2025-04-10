"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  backgroundColor?: string;
}

export default function Button({
  children,
  className,
  backgroundColor = "bg-red-600",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 cursor-pointer ${backgroundColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
