import { createSupabaseServer } from "@/lib/supabaseServer";

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { error: dbError } = await supabase.from("users").insert([
    {
      id: data.user?.id, // ID generado por Supabase Auth
      email: data.user?.email,
      name: name,
    },
  ]);

  if (dbError) {
    return { error: dbError.message };
  }
  return { message: "Usuario registrado con éxito" };
}
