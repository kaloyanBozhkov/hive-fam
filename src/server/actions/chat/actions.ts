"use server";

import { isAdminOrAbove } from "@/server/auth/roleGates";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  eventId: string,
  content: string,
  approved = false,
  sentByStaff = false,
) {
  try {
    // Create a new message in the database (not approved by default)
    const newMessage = await db.chat_messages.create({
      data: {
        content,
        is_approved: approved,
        event_id: eventId,
        sent_by_staff: sentByStaff,
      },
    });

    // // Revalidate the chat page path to update the SSR content
    // revalidatePath(`/chat/${eventId}`);

    return newMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw new Error("Failed to send message");
  }
}

export type SentMessage = Awaited<ReturnType<typeof sendMessage>>;

export const approveMessage = async (messageId: string) => {
  try {
    await isAdminOrAbove();

    await db.chat_messages.update({
      where: { id: messageId },
      data: { is_approved: true },
    });
  } catch (error) {
    console.error("Error approving message:", error);
    throw new Error("Failed to approve message");
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    await isAdminOrAbove();

    await db.chat_messages.update({
      where: { id: messageId },
      data: { is_deleted: true },
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    throw new Error("Failed to delete message");
  }
};

export const upvoteMessage = async (messageId: string) => {
  try {
    await db.chat_messages.update({
      where: { id: messageId },
      data: { likes: { increment: 1 } },
    });
  } catch (error) {
    console.error("Error upvoting message:", error);
    throw new Error("Failed to upvote message");
  }
};
