"use server";
import pb from "@/lib/pocketbase";
import { ApiResponseLogin, AuthServerResponse, User } from "@/types/auth";

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthServerResponse> {
  const data = {
    password,
    passwordConfirm: password,
    email,
    name,
  };

  try {
    const userRecord = await pb.collection("users").create(data);

    const user: User = {
      id: userRecord.id,
      email: userRecord.email ?? userRecord.emailVisibility,
      name: userRecord.name,
      created: userRecord.created,
      updated: userRecord.updated ?? "",
    };

    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Ocurrió un error desconocido" };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<ApiResponseLogin | AuthServerResponse> {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    const user: User = {
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name,
      created: authData.record.created,
      updated: authData.record.updated ?? "",
    };

    return {
      success: true,
      user,
      token: authData.token,
      isAuthenticated: pb.authStore.isValid,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something wrong" };
  }
}
