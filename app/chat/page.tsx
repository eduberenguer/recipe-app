"use client";
import { useState, useContext } from "react";
import ChatInput from "@/components/chat/chatInput";
import ChatSidebar from "@/components/chat/chatSidebar";
import ChatWindow from "@/components/chat/chatWindow";
import { AuthContext } from "@/app/context/context";

export default function Chat() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showChatInput, setChatInput] = useState<boolean>(true);
  const contextAuth = useContext(AuthContext);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handlerShowChatInput = (show: boolean) => {
    setChatInput(show);
  };

  return (
    <div className="flex">
      <div className="w-1/3 bg-white p-4 overflow-y-auto rounded-l-lg">
        <ChatSidebar
          onSelectUser={handleSelectUser}
          handlerShowChatInput={handlerShowChatInput}
        />
      </div>
      {selectedUserId && contextAuth?.user?.id && (
        <div className="flex flex-col flex-1 bg-gray-50">
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            <ChatWindow selectedUserId={selectedUserId} />
          </div>
          <div className="p-4 bg-white border-t flex-shrink-0">
            {showChatInput && (
              <ChatInput
                fromUserId={contextAuth.user.id}
                toUserId={selectedUserId}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
