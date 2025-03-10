"use server";
import pb from "@/lib/pocketbase";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const data = {
    password,
    passwordConfirm: password,
    email,
    name,
  };

  try {
    const user = await pb.collection("users").create(data);

    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Ocurrió un error desconocido" };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    return {
      success: true,
      user: authData.record,
      token: authData.token,
      isAuthenticated: pb.authStore.isValid,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Ocurrió un error desconocido" };
  }
}
