"use client"; // Ensures it runs only on the client side

import { useMemo } from "react";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";

export const useEditorConfig = ({
  namespace,
  initialValue,
  editable,
}: {
  namespace: string;
  initialValue?: string;
  editable: boolean;
}) => {
  const editorConfig = useMemo(
    () => ({
      namespace,
      onError(error: unknown) {
        console.error(error);
      },
      nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode],
      theme: {
        link: "text-blue-500 hover:underline cursor-pointer",
        list: {
          listitem: "pl-2",
          nested: {
            listitem: "pl-2",
          },
          ol: "list-decimal ml-8",
          ul: "list-disc ml-8",
        },
      },
      editorState: !!initialValue ? initialValue : undefined,
      editable,
    }),
    [namespace, initialValue, editable],
  );

  return editorConfig;
};
