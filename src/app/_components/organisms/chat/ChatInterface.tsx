"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  approveMessage,
  deleteMessage,
  sendMessage,
  type SentMessage,
} from "@/server/actions/chat/actions";
import Ably from "ably";
import type { chat_messages } from "@prisma/client";
import { Button } from "../../shadcn/Button.shadcn";
import Group from "../../layouts/Group.layout";
import { Crown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Switch } from "../../shadcn/Switch.shadcn";
import { Card, CardContent, CardHeader } from "../../shadcn/Card.shadcn";

interface ChatInterfaceProps {
  eventId: string;
  initialMessages: chat_messages[];
  canApproveMessages?: boolean;
}

export default function ChatInterface({
  eventId,
  initialMessages,
  canApproveMessages = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<chat_messages[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [translatedMessages, setTranslatedMessages] = useState(
    getTranslatedMessagesFlag(),
  );

  // Using RealtimeChannel from our declaration file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ablyRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Ably client
    const ably = new Ably.Realtime({
      authUrl: "/api/ably/token",
    });

    ablyRef.current = ably;

    // Connect to the event-specific channel
    const channel = ably.channels.get(eventId);
    channelRef.current = channel;

    // Subscribe to new messages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel
      .subscribe("message", (message) => {
        try {
          const chatMessage = message.data as SentMessage;
          if (chatMessage?.id && chatMessage?.content) {
            setMessages((prev) => [...prev, chatMessage]);
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      })
      .catch((error) => {
        console.error("Error subscribing to messages:", error);
      });

    // Subscribe to approved tmp messages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel
      .subscribe("approveTmp", (message) => {
        try {
          const messageId = message.data as string;
          if (messageId) {
            setMessages((prev) =>
              prev.reduce((acc, msg) => {
                if (msg.id !== messageId) return [...acc, msg];
                return [
                  ...acc,
                  {
                    ...msg,
                    is_approved: true,
                  },
                ];
              }, [] as chat_messages[]),
            );
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      })
      .catch((error) => {
        console.error("Error subscribing to messages:", error);
      });

    // Subscribe to approved tmp messages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel
      .subscribe("deleteTmp", (message) => {
        try {
          const messageId = message.data as string;
          if (messageId) {
            setMessages((prev) =>
              prev.reduce((acc, msg) => {
                if (msg.id !== messageId) return [...acc, msg];
                return [
                  ...acc,
                  {
                    ...msg,
                    is_deleted: true,
                  },
                ];
              }, [] as chat_messages[]),
            );
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      })
      .catch((error) => {
        console.error("Error subscribing to messages:", error);
      });

    return () => {
      // Clean up subscriptions
      channel.unsubscribe();
      ably.close();
    };
  }, [eventId]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Send message to server and save to database
      const savedMessage = await sendMessage(
        eventId,
        newMessage,
        canApproveMessages,
        canApproveMessages, // sent by staff
      );
      addSentMessageId(savedMessage.id);

      // Publish to Ably channel
      if (channelRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void channelRef.current.publish("message", savedMessage);
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveMessage = async (messageId: string) => {
    try {
      // save in db so new joiners or refreshers see it
      await approveMessage(messageId);

      if (channelRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void channelRef.current.publish("approveTmp", messageId);
      }
    } catch (error) {
      console.error("Error approving message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);

      if (channelRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void channelRef.current.publish("deleteTmp", messageId);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const isHiddenSystemMessage = (message: chat_messages) => {
    return message.content.includes(APPROVED_MESSAGE_CONTENT);
  };

  const isSentByDevice = (message: chat_messages) => {
    return getSentMessageIds().includes(message.id);
  };

  const isVisibleMessage = (message: chat_messages) => {
    return (
      !message.is_deleted &&
      !isHiddenSystemMessage(message) &&
      (message.is_approved || isSentByDevice(message) || canApproveMessages)
    );
  };

  const visibleMessages = messages.filter((message) =>
    isVisibleMessage(message),
  );

  const handleToggleTranslation = () => {
    const newValue = !translatedMessages;
    setTranslatedMessages(newValue);
    toggleTranslation(newValue);

    // Force Google Translate to reprocess the page
    if (typeof window !== "undefined" && window.location) {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex h-[70vh] flex-col rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="flex-1 overflow-y-auto p-4">
          {visibleMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No messages yet. Be the first to send one!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                if (!isVisibleMessage(message)) return null;
                const isApproved = message.is_approved;

                let content: ReactNode = message.content;
                if (!isApproved && !canApproveMessages) {
                  if (!isSentByDevice(message)) return null;

                  content = (
                    <>
                      <p className="mb-1 text-sm">
                        <i>Note: message is awaiting approval</i>
                      </p>
                      <p>{message.content}</p>
                    </>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={twMerge(
                      "rounded-lg bg-gray-100 p-3",
                      message.sent_by_staff ? "bg-pink-100" : "",
                      translatedMessages ? "" : "notranslate",
                    )}
                  >
                    <Group className="relative gap-2">
                      {message.sent_by_staff && (
                        <Group className="mt-1 items-center gap-1">
                          <Crown className="h-4 w-4" />
                          Staff <Crown className="h-4 w-4" />:
                        </Group>
                      )}
                      {content && <div className="mt-1">{content}</div>}
                      {canApproveMessages && !isApproved && (
                        <Group className="absolute right-0 top-0 gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveMessage(message.id)}
                            className="ml-auto"
                          >
                            ✔️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this message?",
                                )
                              ) {
                                void handleDeleteMessage(message.id);
                              }
                            }}
                            className="ml-auto"
                          >
                            ❌
                          </Button>
                        </Group>
                      )}
                    </Group>
                    <div className="notranslate mt-1 text-xs text-gray-600/50">
                      {message.created_at.toLocaleString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: false,
                      })}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="notranslate flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !newMessage.trim()}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-lg font-bold">Chat Settings</h2>
        </CardHeader>
        <CardContent>
          <Group className="justify-between gap-2">
            <p>Translate messages:</p>
            <Switch
              id="translate-messages"
              checked={translatedMessages}
              onCheckedChange={handleToggleTranslation}
            />
          </Group>
        </CardContent>
      </Card>
    </>
  );
}

const getSentMessageIds = () => {
  const messageIds = localStorage.getItem("messageIds");
  return messageIds ? (JSON.parse(messageIds) as string[]) : [];
};

const addSentMessageId = (messageId: string) => {
  const messageIds = getSentMessageIds();
  localStorage.setItem(
    "messageIds",
    JSON.stringify([...messageIds, messageId]),
  );
};

const APPROVED_MESSAGE_CONTENT = "~APPROVED~";

const toggleTranslation = (state: boolean) => {
  localStorage.setItem("translatedMessages", state.toString());
};

const getTranslatedMessagesFlag = () => {
  return localStorage.getItem("translatedMessages") === "true";
};
