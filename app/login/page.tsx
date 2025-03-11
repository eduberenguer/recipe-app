"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/context";

export default function Login() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = await auth?.login(user);

    if (data.success) {
      router.push("/profile");
    } else {
      console.log(data.error);
    }
  };

  return (
    <div>
      <Link href="/login">Login</Link>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      <div>
        Si no tienes cuenta, puedes registrarte aquí:
        <Link href="/register">registrarse</Link>
      </div>
    </div>
  );
}
