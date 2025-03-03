import Link from "next/link";

export default function Header() {
  return (
    <header>
      <h1>
        <Link href="/">Header</Link>
      </h1>
      <Link href="/profile">Profile</Link>
    </header>
  );
}
