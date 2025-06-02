"use client";

import { useContext } from "react";
import { AuthContext } from "../context/context";
import ChatInput from "@/components/chat/chatInput";
import ChatWindow from "@/components/chat/chatWindow";

export default function PersonalChef() {
  const aiUserId = "ai";
  const contextAuth = useContext(AuthContext);
  const currentUserId = contextAuth?.user?.id ?? "";

  return (
    <div>
      <ChatWindow selectedUserId={aiUserId} isAi={true} />
      <ChatInput toUserId={aiUserId} fromUserId={currentUserId} isAi={true} />
    </div>
  );
}
