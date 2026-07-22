import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import pb from "@/lib/pocketbase";
import { loginUserApi, registerUserApi } from "@/lib/api/users";

import { ApiResponseLogin, User } from "@/types/auth";
import { customToast } from "../utils/showToast";

export type AuthUser = Pick<User, "id" | "created" | "name" | "email"> & {
  token: string;
  isAuthenticated: boolean;
};

export function useAuth() {
  // Start as null on both server and first client render (SSR of this
  // Client Component has no access to cookies), then hydrate from the
  // "authUser" cookie after mount to avoid a hydration mismatch.
  const [user, setUser] = useState<Partial<AuthUser> | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function register(
    userData: Partial<User>
  ): Promise<ApiResponseLogin | undefined> {
    try {
      const newUser = await registerUserApi(userData);

      return newUser;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      customToast(errorMessage, "error");
      return undefined;
    }
  }

  async function login(
    user: Partial<User>,
    retrieveFavouritesList?: (id: string) => void
  ): Promise<ApiResponseLogin | undefined> {
    try {
      const data = await loginUserApi(user);
      if (data.success) {
        const authUser = {
          id: data.user.id,
          created: data.user.created,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
          isAuthenticated: data.isAuthenticated,
        };

        setUser(authUser);

        Cookies.set("authUser", JSON.stringify(authUser), { expires: 7 });

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
      return undefined;
    }
  }

  async function logout(): Promise<void> {
    pb.authStore.clear();
    setUser(null);
    Cookies.remove("authUser");
    sessionStorage.clear();
  }

  return {
    user,
    register,
    login,
    logout,
  };
}
