"use client";
import CustomCarousel from "@/components/CustomCarousel";
import NavLink from "@/components/NavLink";
import Image from "next/image";
import { Utensils, Flame, Leaf, Cake } from "lucide-react";
import { draftRecipes } from "./lib/draftRecipes";
import { Recipe } from "@/types/recipes";
import { useEffect, useState } from "react";

export default function Home() {
  const [showDraftRecipes, setShowDrafRecipes] = useState<Partial<Recipe[]>>();

  useEffect(() => {
    setShowDrafRecipes(draftRecipes);
  }, []);

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
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome to the Recipe App
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover a variety of recipes, explore new cuisines, and get inspired
          in the kitchen. Start your culinary journey here.
        </p>
        <NavLink href="/login">Get started</NavLink>
      </section>
      <section className="bg-white py-12 px-4 md:px-16">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Explore Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <Utensils size={32} className="text-green-600 mb-2" />
            <span className="text-gray-700 font-medium">Quick Meals</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <Flame size={32} className="text-red-500 mb-2" />
            <span className="text-gray-700 font-medium">Spicy Dishes</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <Leaf size={32} className="text-green-500 mb-2" />
            <span className="text-gray-700 font-medium">Vegetarian</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <Cake size={32} className="text-pink-400 mb-2" />
            <span className="text-gray-700 font-medium">Desserts</span>
          </div>
        </div>
      </section>
      <section className="py-12 px-4 md:px-16">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Featured Recipes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {showDraftRecipes?.map((recipe) => (
            <div
              key={recipe?.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-3"
            >
              <div>
                <Image
                  src={typeof recipe?.photo === "string" ? recipe.photo : ""}
                  alt={recipe?.title ?? "Recipe image"}
                  width={500}
                  height={300}
                  className="w-full h-52 object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {recipe?.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
