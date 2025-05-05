"use client";

import { AuthContext } from "@/app/context/context";
import pb from "@/lib/pocketbase";
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
    let unsubscribed = false;

    const fetchMessagesAndSubscribe = async () => {
      try {
        if (!contextAuth?.user?.id || !selectedUserId) return;

        const records = await getMessagesBetweenUsers(
          contextAuth.user.id,
          selectedUserId
        );

        const mappedMessages = records.map((record) => ({
          content: record.content,
          from: record.from,
          id: record.id,
        }));

        if (!unsubscribed) setMessages(mappedMessages);

        const unsubscribe = await pb
          .collection("messages")
          .subscribe("*", (e) => {
            if (e.action === "create") {
              const msgData = e.record;
              const isRelevant =
                (msgData.from === contextAuth.user?.id &&
                  msgData.to === selectedUserId) ||
                (msgData.from === selectedUserId &&
                  msgData.to === contextAuth.user?.id);

              if (isRelevant) {
                setMessages((prev) => {
                  const exists = prev.some((msg) => msg.id === msgData.id);
                  if (exists) return prev;
                  return [
                    ...prev,
                    {
                      id: msgData.id,
                      content: msgData.content,
                      from: msgData.from,
                    },
                  ];
                });
              }
            }
          });

        return unsubscribe;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    let unsubscribeFunc: (() => void) | undefined;

    fetchMessagesAndSubscribe().then((unsubscribe) => {
      unsubscribeFunc = unsubscribe;
    });

    return () => {
      unsubscribed = true;
      if (unsubscribeFunc) unsubscribeFunc();
      else pb.collection("messages").unsubscribe("*");
    };
  }, [selectedUserId, contextAuth?.user?.id]);

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
