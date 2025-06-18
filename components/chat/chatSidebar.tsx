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
    <div className="bg-white p-4 shadow-lg rounded-md overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Chats</h2>
        <button
          onClick={handleNewConversation}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 hover:cursor-pointer"
        >
          {showNewConversation ? "X" : "New chat"}
        </button>
      </div>

      {showNewConversation && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search user by name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {searchResults.length > 0 && (
            <ul className="space-y-2">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectSearchResult(user)}
                  className="cursor-pointer hover:bg-blue-100 p-2 rounded-md"
                >
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <ul className="space-y-2">
        {!showNewConversation &&
          conversations.map((user) => {
            const isActive = user.id === selectedUserId;
            return (
              <li
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className={`cursor-pointer p-2 rounded-md ${
                  isActive ? "bg-blue-200 font-semibold" : "hover:bg-blue-100"
                }`}
              >
                {user.name}
              </li>
            );
          })}
      </ul>

      {selectedNewUser && contextAuth?.user?.id && (
        <div className="mt-4">
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
          />
        </div>
      )}
    </div>
  );
}
