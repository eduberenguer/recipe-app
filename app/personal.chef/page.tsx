"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../context/context";
import ChatInput from "@/components/chat/chatInput";
import ChatWindow from "@/components/chat/chatWindow";

export default function PersonalChef() {
  const aiUserId = "ai";
  const contextAuth = useContext(AuthContext);
  const currentUserId = contextAuth?.user?.id ?? "";
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
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
  );
}
