"use client";

import { useEffect, useState, useContext } from "react";
import {
  getConversationsForUser,
  searchUsersByUsername,
} from "@/server/userInteractions";
import { User, UserWithName } from "@/types/auth";
import { AuthContext, AuthContextType } from "@/app/context/context";
import ChatInput from "./chatInput";

interface ChatSidebarProps {
  onSelectUser: (userId: string) => void;
  selectedUserId: string | null;
  handlerShowChatInput: (show: boolean) => void;
  refreshChatsTrigger: number;
  setRefreshChatsTrigger: (value: number) => void;
}

function getUnreadCount(userId: string) {
  if (userId.endsWith("1")) return 2;
  return 0;
}

export default function ChatSidebar({
  onSelectUser,
  selectedUserId,
  handlerShowChatInput,
  refreshChatsTrigger,
  setRefreshChatsTrigger,
}: ChatSidebarProps) {
  const contextAuth = useContext<AuthContextType | null>(AuthContext);
  const [conversations, setConversations] = useState<User[]>([]);
  const [showNewConversation, setShowNewConversation] =
    useState<boolean>(false);
  const [selectedNewUser, setSelectedNewUser] = useState<UserWithName | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserWithName[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!contextAuth?.user?.id) return;
      try {
        const users = await getConversationsForUser(contextAuth?.user?.id);
        setConversations(users);
      } catch (error) {
        console.error("Error loading conversations", error);
      }
    };
    fetchConversations();
  }, [contextAuth?.user?.id, refreshChatsTrigger]);

  const handleNewConversation = (): void => {
    setShowNewConversation(!showNewConversation);
    setSearchQuery("");
    setSelectedNewUser(null);
    setSearchResults([]);
    handlerShowChatInput(true);
  };

  const handleSearchChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = await searchUsersByUsername(query);
    setSearchResults(results);
  };

  const handleSelectSearchResult = (user: UserWithName): void => {
    setSelectedNewUser(user);
    setSearchQuery(user.name);
    setSearchResults([]);
    handlerShowChatInput(false);
  };

  return (
    <aside className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 w-full max-w-xs flex flex-col gap-6 animate-fadein">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Chats
        </h2>
        <button
          onClick={handleNewConversation}
          className={`py-2 px-4 rounded-full font-bold shadow transition text-white text-base ${
            showNewConversation
              ? "bg-[#6366F1] hover:bg-[#6366F1]/90"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {showNewConversation ? "Close" : "New chat"}
        </button>
      </div>
      {showNewConversation && (
        <div className="flex flex-col gap-3 animate-fadein">
          <input
            type="text"
            placeholder="Search user by name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1] text-base placeholder-gray-400 transition"
          />
          {searchResults.length > 0 && (
            <ul className="space-y-2">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectSearchResult(user)}
                  className="cursor-pointer hover:bg-[#6366F1]/10 p-2 rounded-lg text-gray-800 font-medium transition"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <ul className="space-y-2 flex-1">
        {!showNewConversation &&
          conversations.map((user) => {
            const isActive = user.id === selectedUserId;
            const unread = getUnreadCount(user.id);
            return (
              <li
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className={`cursor-pointer p-3 rounded-xl font-semibold flex items-center gap-2 transition relative ${
                  isActive
                    ? "bg-[#6366F1]/10 text-[#6366F1] shadow scale-105"
                    : "hover:bg-gray-100 text-gray-800"
                } animate-fadein`}
                style={{ transition: "transform 0.15s" }}
              >
                <span className="w-8 h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name}
                {unread > 0 && (
                  <span className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold animate-bounce">
                    {unread}
                  </span>
                )}
              </li>
            );
          })}
      </ul>
      {selectedNewUser && contextAuth?.user?.id && (
        <div className="mt-4 animate-fadein">
          <p className="text-sm text-gray-700 mb-2">
            Sending message to: <strong>{selectedNewUser.name}</strong>
          </p>
          <ChatInput
            toUserId={selectedNewUser.id}
            fromUserId={contextAuth?.user?.id}
            onMessageSent={() => {
              setShowNewConversation(false);
              setSelectedNewUser(null);
              setRefreshChatsTrigger(Date.now());
              onSelectUser(selectedNewUser.id);
              handlerShowChatInput(true);
            }}
            isAi={false}
            isLoading={false}
            firstMessage={true}
          />
        </div>
      )}
    </aside>
  );
}
