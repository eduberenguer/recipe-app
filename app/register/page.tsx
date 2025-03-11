"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthContext } from "../context/context";

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
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign up
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
