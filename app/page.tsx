"use client";
import CustomCarousel from "@/components/CustomCarousel";
import NavLink from "@/components/NavLink";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen font-sans">
      <header className="relative">
        <CustomCarousel />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-4xl font-bold">
          <h1>Discover Delicious Recipes</h1>
        </div>
      </header>
      <section className="py-16 px-4 md:px-16 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome to the Recipe App
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover a variety of recipes, explore new cuisines, and get inspired
          in the kitchen. Start your culinary journey here.
        </p>
        <NavLink href="login">Get started</NavLink>
      </section>
    </main>
  );
}
