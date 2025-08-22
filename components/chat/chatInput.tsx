"use client";

import { useState, useContext } from "react";
import {
  UserInteractionsContext,
  UserInteractionsContextType,
} from "@/app/context/context";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  toUserId: string;
  fromUserId: string;
  onMessageSent?: () => void;
  isAi: boolean;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  firstMessage?: boolean;
}

export default function ChatInput({
  toUserId,
  fromUserId,
  onMessageSent,
  isAi = false,
  isLoading = false,
  setIsLoading = () => {},
  firstMessage = false,
}: ChatInputProps) {
  const contextUseInteractions = useContext<UserInteractionsContextType | null>(
    UserInteractionsContext
  );
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!toUserId || !fromUserId || !message.trim()) return;

    try {
      setMessage("");
      onMessageSent?.();

      if (isAi) {
        setIsLoading(true);
        await contextUseInteractions?.sendMessageAi(message);
        setIsLoading(false);
        return;
      }

      await contextUseInteractions?.sendMessage(fromUserId, toUserId, message);
    } catch (error: unknown) {
      setStatus((error as Error).message || "Error sending message");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-3xl flex flex-col gap-2 animate-fadein border border-gray-100"
      style={{ position: "static" }}
    >
      <div className="flex flex-row gap-3 items-center">
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-2 resize-none text-base focus:outline-none focus:ring-2 focus:ring-[#6366F1] placeholder-gray-400 transition ${
            firstMessage ? "h-8 text-sm p-2" : "h-20 text-base p-4"
          }`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 bg-[#6366F1] text-white font-bold rounded-full shadow transition duration-200 ml-2 ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#6366F1]/90 cursor-pointer scale-105"
          } ${
            firstMessage
              ? "py-1 px-4 text-sm min-h-0"
              : "py-3 px-8 text-base min-h-[3rem]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />{" "}
              <span className="animate-pulse">Cooking...</span>
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>
      {status && (
        <p className="text-sm text-red-500 italic text-center">{status}</p>
      )}
    </form>
  );
}
