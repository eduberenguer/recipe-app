"use client";

import { AuthContext } from "@/app/context/context";
import { getMessagesBetweenUsers } from "@/server/userInteractions";
import { Message } from "@/types/userInteractions";
import { useContext, useEffect, useState } from "react";

interface ChatWindowProps {
  selectedUserId: string;
}

export default function ChatWindow({ selectedUserId }: ChatWindowProps) {
  const contextAuth = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (contextAuth?.user?.id) {
          const records = await getMessagesBetweenUsers(
            contextAuth.user.id,
            selectedUserId
          );
          const mappedMessages = records.map((record) => ({
            content: record.content,
            from: record.from,
            id: record.id,
          }));
          setMessages(mappedMessages);
        } else {
          console.error("User ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedUserId) {
      fetchMessages();
    }
  }, [selectedUserId]);

  return (
    <div className="flex-1 h-120 p-4 bg-white rounded-md shadow-lg overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-3 rounded-lg border-2 border-gray-200 shadow-sm"
          >
            <div className="font-semibold text-sm text-gray-700">
              {message.from}
            </div>
            <div className="mt-1">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
