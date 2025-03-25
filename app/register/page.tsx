"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/context";
import Button from "@/components/Button";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const data = await auth?.register(form);

    setMessage(data.success ? "Sign up successfully" : data.error);

    if (data.success) {
      setForm({ name: "", email: "", password: "" });

      setTimeout(() => {
        setMessage("");
      }, 3000);

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
        <div className="flex justify-center">
          <Button type="submit" backgroundColor="bg-green-500">
            Sign Up
          </Button>
        </div>
      </form>

      {message && <p className="text-center mt-4 text-red-500">{message}</p>}

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
