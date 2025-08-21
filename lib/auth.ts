import pb from "./pocketbase";

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  try {
    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name,
    });
    return user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
}
