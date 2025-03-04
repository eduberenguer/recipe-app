import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/login">Login</Link>
      <Link href="/register">Signup</Link>
    </div>
  );
}
