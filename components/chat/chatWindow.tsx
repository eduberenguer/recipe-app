"use client";

import { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    let unsubscribed = false;

    if (isAi) {
      setMessages([
        {
          id: "init-ai-msg",
          content:
            "Hi! I'm your personal chef. What ingredients do you have, and how many people are you cooking for?",
          fromUserId: "ai",
          fromUserName: "ChefGPT",
          created: new Date(),
        },
      ]);
      return;
    }

    const fetchMessagesAndSubscribe = async (): Promise<
      (() => void) | undefined
    > => {
      if (!user?.id || !selectedUserId) return;

      const records = await getMessagesBetweenUsers(user.id, selectedUserId);

      const mapped = records.map((r) => ({
        id: r.id,
        content: r.content,
        fromUserId: r.from,
        fromUserName: r.expand?.from?.name ?? r.from,
        created: r.created,
      }));

      if (!unsubscribed) setMessages(mapped);

      const unsubscribe = await pb
        .collection("messages")
        .subscribe("*", async (e) => {
          if (e.action !== "create") return;

          const msg = e.record;
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

  const generateNewRecipe = async (): Promise<void> => {
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
    } catch (error) {
      console.error("Error saving recipe", error);
      customToast("Recipe could not be saved", "error");
    }
  };

  return (
    <div className="flex flex-col flex-1 max-h-[600px] p-6 bg-neutral-50 rounded-2xl border border-neutral-200 overflow-auto">
      <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
        {isAi ? "My Personal Chef 🤖" : "Messages"}
      </h2>

      <div className="flex flex-col gap-3 mb-6">
        {messages.length === 0 && !isAi && (
          <p className="text-center text-neutral-400 italic">No messages yet</p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.fromUserId === user?.id;
          return (
            <div
              key={msg.id}
              className={`rounded-lg px-4 py-3 text-sm max-w-[75%] ${
                isOwn
                  ? "self-end bg-blue-500 text-white"
                  : "self-start bg-neutral-200 text-neutral-900"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs">{msg.fromUserName}</span>
                <time
                  className="text-xs text-neutral-500 ml-3"
                  title={new Date(msg.created).toLocaleString()}
                >
                  {new Date(msg.created).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          );
        })}
      </div>

      {contextUseInteractions?.aiRecipe && pathname === "/personal.chef" && (
        <div className="flex flex-col md:flex-row gap-6 bg-white border border-neutral-200 p-5 rounded-xl">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              {contextUseInteractions.aiRecipe.title}
            </h3>
            <p className="text-neutral-600 font-medium mb-2">
              Servings: {contextUseInteractions.aiRecipe.servings}
            </p>
            <ul className="list-disc list-inside text-neutral-700 mb-4">
              {contextUseInteractions.aiRecipe.ingredients?.map((ing, i) => (
                <li key={i}>
                  {ing.name} — {ing.quantity} {ing.unity}
                </li>
              ))}
            </ul>
            <p className="text-neutral-700 whitespace-pre-line">
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
                className="rounded-xl border border-neutral-300"
              />
            )}
            {isLoading ? (
              <p className="text-blue-600 font-medium animate-pulse">
                Generating new recipe...
              </p>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={generateNewRecipe}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Other recipe
                </button>
                <button
                  onClick={saveRecipe}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
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
