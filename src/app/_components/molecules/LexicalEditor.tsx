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
      nodes: [LinkNode, AutoLinkNode],
      theme: {
        link: "text-blue-500 underline hover:text-blue-700",
      },
      editorState: initialValue,
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

  return (
    <div className="mb-2 flex gap-2 border-b pb-2">
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="rounded border p-1"
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="rounded border p-1"
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="rounded border p-1"
      >
        Underline
      </button>
      <button type="button" onClick={insertLink} className="rounded border p-1">
        Link
      </button>
    </div>
  );
};
