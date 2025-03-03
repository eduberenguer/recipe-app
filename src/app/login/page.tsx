import Link from "next/link";

export default function Login() {
  return (
    <div>
      <Link href="/login">Login</Link>
      <div>
        Si no tienes cuenta, puedes registrarte aquí:
        <Link href="/register">registrarse</Link>
      </div>
    </div>
  );
}
