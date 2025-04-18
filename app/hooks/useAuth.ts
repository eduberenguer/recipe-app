import { useState } from "react";

import pb from "@/lib/pocketbase";
import { loginUserApi, registerUserApi } from "@/lib/api/users";

import { User } from "@/types/auth";
import { customToast } from "../utils/showToast";

export type AuthUser = Pick<User, "id" | "created" | "name" | "email"> & {
  token: string;
  isAuthenticated: boolean;
};

export function useAuth() {
  const [user, setUser] = useState<Partial<AuthUser> | null>(
    pb.authStore.model
  );

  async function register(userData: Partial<User>) {
    try {
      const newUser = await registerUserApi(userData);

      return newUser;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      customToast(errorMessage, "error");
    }
  }

  async function login(
    user: Partial<User>,
    retrieveFavouritesList?: (id: string) => void
  ) {
    try {
      const data = await loginUserApi(user);
      if (data.success) {
        setUser({
          id: data.user.id,
          created: data.user.created,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
          isAuthenticated: data.isAuthenticated,
        });

        if (retrieveFavouritesList) {
          retrieveFavouritesList(data.user.id);
        }

        return data;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? "Invalid email or password."
          : "An unknown error occurred.";
      customToast(errorMessage, "error");
    }
  }

  async function logout() {
    pb.authStore.clear();
    setUser(null);
  }

  return {
    user,
    register,
    login,
    logout,
  };
}
