import { User } from "@/types/auth";

export async function registerUserApi(user: Partial<User>) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error desconocido");
  }

  return res.json();
}

export async function loginUserApi(user: Partial<User>) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => {});
    throw new Error(errorData.error || "Failed to authenticate");
  }

  return res.json();
}
