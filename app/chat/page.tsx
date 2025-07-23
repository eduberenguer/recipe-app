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
    <main className="bg-gray-50 flex items-center justify-center py-10 px-2 font-sans">
      <div className="w-full max-w-6xl flex gap-8 animate-fadein max-h-full">
        <ChatSidebar
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUserId}
          handlerShowChatInput={handlerShowChatInput}
          refreshChatsTrigger={refreshChatsTrigger}
          setRefreshChatsTrigger={setRefreshChatsTrigger}
        />
        <div className="flex flex-col flex-1 bg-white rounded-3xl shadow-xl overflow-hidden animate-fadein">
          <div className="flex-1 p-8 min-h-[400px] max-h-[600px] h-[500px] w-full flex flex-col justify-center">
            {selectedUserId && contextAuth?.user?.id ? (
              <ChatWindow
                selectedUserId={selectedUserId}
                isAi={false}
                isLoading={false}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 text-xl font-semibold">
                <span className="text-5xl mb-2">💬</span>
                Select a chat to start messaging
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-100 bg-white">
            {selectedUserId && contextAuth?.user?.id && showChatInput && (
              <ChatInput
                fromUserId={contextAuth.user.id}
                toUserId={selectedUserId}
                isAi={false}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
