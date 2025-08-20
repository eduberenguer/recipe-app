"use client";

import { useContext, useEffect, useRef, useState } from "react";
import pb from "@/lib/pocketbase";
import Image from "next/image";
import {
  AuthContext,
  AuthContextType,
  RecipesContext,
  RecipesContextType,
  UserInteractionsContext,
  UserInteractionsContextType,
} from "@/app/context/context";
import { getMessagesBetweenUsers } from "@/server/userInteractions";
import { MessageWithSenderName } from "@/types/userInteractions";
import { urlToFile } from "@/app/utils/urlToFile";
import { customToast } from "@/app/utils/showToast";
import { usePathname } from "next/navigation";
import { initialMessageAi } from "@/app/__mocks__/mockInitialMessageAi";
import { ALLERGEN_ICONS } from "@/types/recipes";

interface ChatWindowProps {
  selectedUserId: string;
  isAi: boolean;
  isLoading: boolean;
  setIsLoading?: (loading: boolean) => void;
}

export default function ChatWindow({
  selectedUserId,
  isAi = false,
  isLoading = false,
  setIsLoading = () => {},
}: ChatWindowProps) {
  const { user } = useContext<AuthContextType | null>(AuthContext) || {};
  const { createRecipe } =
    useContext<RecipesContextType | null>(RecipesContext) || {};
  const contextUseInteractions = useContext<UserInteractionsContextType | null>(
    UserInteractionsContext
  );
  const [messages, setMessages] = useState<MessageWithSenderName[]>([]);
  const pathname = usePathname();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let unsubscribed = false;

    if (isAi) {
      setMessages([initialMessageAi]);
      return;
    }

    const fetchMessagesAndSubscribe = async (): Promise<
      (() => void) | undefined
    > => {
      if (!user?.id || !selectedUserId) return;

      const records = await getMessagesBetweenUsers(user.id, selectedUserId);

      const mapped = records.map((record) => ({
        id: record.id,
        content: record.content,
        fromUserId: record.from,
        fromUserName: record.expand?.from?.name ?? record.from,
        created: record.created,
      }));

      if (!unsubscribed) setMessages(mapped);

      const unsubscribe = await pb
        .collection("messages")
        .subscribe("*", async (event) => {
          if (event.action !== "create") return;

          const msg = event.record;
          const relevant =
            (msg.from === user.id && msg.to === selectedUserId) ||
            (msg.from === selectedUserId && msg.to === user.id);

          if (relevant) {
            try {
              const full = await pb
                .collection("messages")
                .getOne(msg.id, { expand: "from" });

              setMessages((prev) => {
                if (prev.some((m) => m.id === full.id)) return prev;
                return [
                  ...prev,
                  {
                    id: full.id,
                    content: full.content,
                    fromUserId: full.from,
                    fromUserName: full.expand?.from?.name ?? full.from,
                    created: full.created,
                  },
                ];
              });
            } catch (err) {
              console.error("Expand failed", err);
            }
          }
        });

      return unsubscribe;
    };

    let unsub: (() => void) | undefined;
    fetchMessagesAndSubscribe().then((u) => (unsub = u));

    return () => {
      unsubscribed = true;
      unsub?.();
      pb.collection("messages").unsubscribe("*");
    };
  }, [selectedUserId, user?.id, isAi]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const generateNewRecipe = async (): Promise<void> => {
    contextUseInteractions?.setAiRecipe(null);

    if (!user?.id) return;
    try {
      setIsLoading(true);
      const ingList = contextUseInteractions?.aiRecipe?.ingredients
        .map((i) => `${i.quantity} ${i.unity} of ${i.name}`)
        .join(", ");
      await contextUseInteractions?.sendMessageAi(
        `${ingList} for ${contextUseInteractions?.aiRecipe?.servings} servings`
      );
    } catch (error) {
      console.error("Generate recipe error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipe = async (): Promise<void> => {
    const recipe = contextUseInteractions?.aiRecipe;
    if (!user?.id || !recipe) return;

    try {
      const form = new FormData();
      form.append("title", recipe.title);
      form.append("description", recipe.description);
      form.append("servings", recipe.servings.toString());
      form.append("owner", user.id);
      form.append("ingredients", JSON.stringify(recipe.ingredients));
      form.append("allergens", JSON.stringify(recipe.allergens));
      form.append("duration", recipe.duration.toString());
      form.append("difficulty", recipe.difficulty || "easy");
      if (recipe.photo) {
        if (
          typeof recipe.photo === "string" &&
          recipe.photo.startsWith("http")
        ) {
          const file = await urlToFile(
            recipe.photo,
            "recipe.jpg",
            "image/jpeg"
          );
          form.append("photo", file);
        } else {
          form.append("photo", recipe.photo);
        }
      }

      await createRecipe?.(form);
      customToast("Recipe created successfully", "success");

      contextUseInteractions?.setAiRecipe(null);
    } catch (error) {
      console.error("Error saving recipe", error);
      customToast("Recipe could not be saved", "error");
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 bg-white border border-neutral-100 animate-fadein max-h-full overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
        {isAi ? "My Personal Chef 🤖" : "Messages"}
      </h2>
      <div className="flex flex-col gap-4 mb-8 max-h-[300px]">
        {messages.length === 0 && !isAi && (
          <p className="text-center text-neutral-400 italic">No messages yet</p>
        )}
        {messages.map((msg, idx) => {
          const isOwn = msg.fromUserId === user?.id;
          const isChef = msg.fromUserId === "ai";
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${
                isOwn ? "justify-end" : "justify-start"
              } animate-fadein`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div
                className={`rounded-2xl p-5 py-3 text-base max-w-[75%] shadow-sm transition-all duration-200 ${
                  isOwn
                    ? "bg-gray-300 text-gray-900 self-end"
                    : isChef
                    ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
                    : "bg-gray-100 text-gray-900 self-start"
                }`}
              >
                <div className="flex items-center justify-between mb-1 ">
                  <span className="font-semibold text-xs">
                    {msg.fromUserName}
                  </span>
                  <time
                    className="text-xs text-gray-400 ml-3"
                    title={new Date(msg.created).toLocaleString()}
                  >
                    {new Date(msg.created).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    - {new Date(msg.created).toLocaleDateString()}
                  </time>
                </div>
                <p className="whitespace-pre-line leading-relaxed">
                  {msg.content}
                </p>
              </div>
              <div ref={bottomRef} />
            </div>
          );
        })}
      </div>
      {contextUseInteractions?.aiRecipe && pathname === "/personal.chef" && (
        <div className="flex flex-col md:flex-row gap-8 bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl animate-fadein">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-900 mb-2">
              {contextUseInteractions.aiRecipe.title}
            </h3>
            <p className="text-yellow-800 font-medium mb-2">
              Servings: {contextUseInteractions.aiRecipe.servings}
            </p>
            <p className="text-yellow-800 font-medium mb-2">
              Duration: {contextUseInteractions.aiRecipe.duration}m
            </p>
            <p className="text-yellow-800 font-medium mb-2">
              Difficulty: {contextUseInteractions.aiRecipe.difficulty}
            </p>
            <ul className="list-disc list-inside text-yellow-900 mb-4">
              {contextUseInteractions.aiRecipe.ingredients?.map((ing, i) => (
                <li key={i}>
                  {ing.name} — {ing.quantity} {ing.unity}
                </li>
              ))}
            </ul>
            <p className="text-yellow-900 whitespace-pre-line">
              {contextUseInteractions.aiRecipe.description}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 w-72">
            {contextUseInteractions.aiRecipe.photo && (
              <Image
                src={contextUseInteractions.aiRecipe.photo}
                alt="Recipe"
                width={280}
                height={280}
                className="rounded-xl border border-yellow-300 shadow"
              />
            )}
            <div className="flex flex-col gap-2">
              <p className="text-yellow-900 font-medium mb-2 flex flex-row gap-2 items-center">
                Allergens:
                {contextUseInteractions.aiRecipe.allergens.map(
                  (allergen, index) => (
                    <div
                      key={index}
                      className="relative group/allergen cursor-pointer"
                      title={ALLERGEN_ICONS[allergen].title}
                    >
                      <span className="text-lg">
                        {ALLERGEN_ICONS[allergen].icon}
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/allergen:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30 pointer-events-none">
                        {allergen}
                      </div>
                    </div>
                  )
                )}
              </p>
            </div>
            {isLoading ? (
              <p className="text-pink-600 font-medium animate-pulse">
                Generating new recipe...
              </p>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={generateNewRecipe}
                  className="w-full bg-[#6366F1] text-white py-2 px-4 rounded-lg hover:bg-[#6366F1]/90 transition font-semibold shadow cursor-pointer"
                >
                  Other recipe
                </button>
                <button
                  onClick={saveRecipe}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition font-semibold shadow cursor-pointer"
                >
                  Save recipe
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
