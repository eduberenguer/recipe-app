"use client";
import { useState } from "react";
import { sendMessageAiApi, sendMessageApi } from "@/lib/api/userInteractions";
import { RecipeChefAI } from "@/types/recipes";
import { BaseMessage } from "@/types/userInteractions";
import { fetchPexelsImageUrlApi } from "@/lib/api/images";

export function useUserInteractions() {
  const [aiRecipe, setAiRecipe] = useState<RecipeChefAI | null>(null);

  async function sendMessage(
    fromUserId: string,
    toUserId: string,
    content: string,
  ): Promise<BaseMessage> {
    const sendMessage = await sendMessageApi(fromUserId, toUserId, content);

    return sendMessage;
  }

  async function sendMessageAi(content: string): Promise<void> {
    const sendMessage = await sendMessageAiApi(content);
    const aiRecipe =
      typeof sendMessage === "string" ? JSON.parse(sendMessage) : sendMessage;

    let photoUrl = aiRecipe.photo;
    if (
      !photoUrl ||
      typeof photoUrl !== "string" ||
      !photoUrl.startsWith("http")
    ) {
      const firstIngredient = aiRecipe.ingredients?.[0]?.name || "food";
      photoUrl = await fetchPexelsImageUrlApi(firstIngredient);
    }

    aiRecipe.photo =
      photoUrl || "https://via.placeholder.com/320x240?text=No+Image";

    setAiRecipe(aiRecipe);
  }

  return {
    sendMessage,
    sendMessageAi,
    aiRecipe,
    setAiRecipe,
  };
}
