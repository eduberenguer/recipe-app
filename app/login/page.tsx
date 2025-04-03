"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/context";
import Button from "@/components/Button";
import { showToast } from "../utils/showToast";

export default function Login() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user.email || !user.password) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    const data = await auth?.login(user);

    if (data.success) {
      router.push("/main");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Login
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md text-center"
      >
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button type="submit" backgroundColor="bg-blue-500">
          Login
        </Button>
      </form>
      <div className="mt-4 text-center">
        If you dont have an account, you can sign up here:
        <Link
          href="/register"
          className="text-blue-500 font-semibold hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
