"use client"; // Ensures it runs only on the client side

import React, { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $isRangeSelection,
  $getSelection,
  FORMAT_TEXT_COMMAND,
  type EditorState,
  TextNode,
} from "lexical";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import {
  AutoLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND,
  $isLinkNode,
} from "@lexical/link";
import ErrorBoundary from "./ErrorBoundary";
import { twMerge } from "tailwind-merge";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

const LexicalEditor = ({
  onChanged,
  initialValue,
  namespace = "DefaultNameEditor",
  editable = true,
  className,
}: {
  onChanged?: (editorState: string) => void;
  initialValue?: string;
  namespace?: string;
  editable: boolean;
  className?: string;
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

  // Handle editor content change
  const onChange = (editorState: EditorState) => {
    if (editable) onChanged?.(JSON.stringify(editorState));
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ErrorBoundary onError={console.warn}>
        <>
          {editable && <Toolbar />}
          <RichTextPlugin
            ErrorBoundary={ErrorBoundary}
            contentEditable={
              <ContentEditable
                className={twMerge(
                  "min-h-[150px] rounded p-2",
                  editable ? "border" : "",
                  className,
                )}
              />
            }
            placeholder={
              editable ? (
                <p className="text-gray-400">Type something...</p>
              ) : null
            }
          />
          <LinkPlugin />
          <ListPlugin />
          {editable && <HistoryPlugin />}
          {editable && <OnChangePlugin onChange={onChange} />}
        </>
      </ErrorBoundary>
    </LexicalComposer>
  );
};

export default LexicalEditor;

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const insertLink = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = selection.getNodes()[0];
        const parent = node?.getParent();
        const currentUrl = $isLinkNode(parent) ? parent.getURL() : "";
        const url = prompt("Enter the link URL:", currentUrl);
        if (!url) return;
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    });
  };

  const insertOrderedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const insertUnorderedList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const removeList = () => {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  };

  return (
    <div className="mb-2 flex gap-2 border-b pb-2">
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Italic
      </button>
      {/* <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Underline
      </button> */}
      <button
        type="button"
        onClick={insertLink}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Link
      </button>
      <button
        type="button"
        onClick={insertOrderedList}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ordered List
      </button>
      <button
        type="button"
        onClick={insertUnorderedList}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Unordered List
      </button>
      <button
        type="button"
        onClick={removeList}
        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Remove List
      </button>
    </div>
  );
};
