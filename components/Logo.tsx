import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center mb-6">
      <Image
        src="/images/logo_1.avif"
        alt="Fried Egg Logo"
        width={80}
        height={80}
        className="rounded-lg"
        priority
      />
    </div>
  );
}
