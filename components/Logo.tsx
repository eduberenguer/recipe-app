import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center">
      <Image
        src="/images/logo.png"
        alt="Fried Egg Logo"
        width={50}
        height={50}
        className="rounded-lg"
      />
    </div>
  );
}
