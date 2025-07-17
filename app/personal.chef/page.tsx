"use client";

import { useContext, useState } from "react";
import { AuthContext, AuthContextType } from "../context/context";
import ChatInput from "@/components/chat/chatInput";
import ChatWindow from "@/components/chat/chatWindow";

export default function PersonalChef() {
  const aiUserId = "ai";
  const contextAuth = useContext<AuthContextType | null>(AuthContext);
  const currentUserId = contextAuth?.user?.id ?? "";
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center py-10 px-2 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col gap-6 animate-fadein">
        <div className="flex-1 flex flex-col gap-4">
          <ChatWindow
            selectedUserId={aiUserId}
            isAi={true}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <ChatInput
            toUserId={aiUserId}
            fromUserId={currentUserId}
            isAi={true}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </main>
  );
}
