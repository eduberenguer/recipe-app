"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/context";
import Button from "@/components/Button";
import Link from "next/link";
import { customToast } from "../utils/showToast";

export default function Register() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      customToast("Please fill in all fields.", "error");
      return;
    }

    if (form.password.length < 6) {
      customToast("Password must be at least 6 characters long.", "error");
      return;
    }

    if (form.password !== form.repeatPassword) {
      customToast("Passwords do not match. Please try again.", "error");
      return;
    }

    const data = await auth?.register(form);

    if (data.success) {
      router.push("/login");
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      <form
        onSubmit={handleRegister}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Repeat password"
          value={form.repeatPassword}
          onChange={(e) => setForm({ ...form, repeatPassword: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-center">
          <Button type="submit" backgroundColor="bg-green-500">
            Sign Up
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="text-blue-500 font-semibold hover:underline"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
