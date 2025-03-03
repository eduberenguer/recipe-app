import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/login">Iniciar sesión</Link>
      <Link href="/register">Registrarse</Link>
      <Link href="/profile">Perfil</Link>
    </div>
  );
}
