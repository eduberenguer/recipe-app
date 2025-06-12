"use client";
import { useState, useContext } from "react";
import ChatInput from "@/components/chat/chatInput";
import ChatSidebar from "@/components/chat/chatSidebar";
import ChatWindow from "@/components/chat/chatWindow";
import { AuthContext, AuthContextType } from "@/app/context/context";

export default function Chat() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showChatInput, setChatInput] = useState<boolean>(true);
  const [refreshChatsTrigger, setRefreshChatsTrigger] = useState<number>(0);
  const contextAuth = useContext<AuthContextType | null>(AuthContext);

  const handleSelectUser = (userId: string): void => {
    setSelectedUserId(userId);
  };

  const handlerShowChatInput = (show: boolean): void => {
    setChatInput(show);
  };

  return (
    <div className="flex">
      <div className="w-1/3 bg-white p-4 overflow-y-auto rounded-l-lg">
        <ChatSidebar
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUserId}
          handlerShowChatInput={handlerShowChatInput}
          refreshChatsTrigger={refreshChatsTrigger}
          setRefreshChatsTrigger={setRefreshChatsTrigger}
        />
      </div>
      {selectedUserId && contextAuth?.user?.id && (
        <div className="flex flex-col flex-1 bg-gray-50">
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            <ChatWindow
              selectedUserId={selectedUserId}
              isAi={false}
              isLoading={false}
            />
          </div>
          <div className="p-4 bg-white border-t flex-shrink-0">
            {showChatInput && (
              <ChatInput
                fromUserId={contextAuth.user.id}
                toUserId={selectedUserId}
                isAi={false}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
