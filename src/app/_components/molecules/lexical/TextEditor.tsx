"use client";
import "@mantine/tiptap/styles.css";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { BubbleMenu, Editor, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { MantineProvider } from "@mantine/core";
import { twMerge } from "tailwind-merge";
import { useCallback } from "react";
import { isValidURL } from "@/utils/common";
import { Link2 } from "lucide-react";

const onLinkClick = (editor: Editor | null) => {
  const currentLink = editor?.getAttributes("link").href || "";
  const url = prompt("Enter the link URL:", currentLink);
  if (url) {
    if (isValidURL(url)) {
      editor?.chain().focus().setLink({ href: url }).run();
    } else {
      alert("Please enter a valid URL.");
    }
  } else {
    editor?.chain().focus().unsetLink().run();
  }
};

const CustomLinkButton = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    onLinkClick(editor);
  }, [editor]);

  return (
    <button type="button" onClick={setLink}>
      <Link2 className="h-4 w-4" />
    </button>
  );
};

export default function TextEditor({
  content,
  onChanged,
  className,
}: {
  content: string;
  onChanged: (content: string) => void;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChanged(editor.getHTML().replaceAll("<p></p>", "<p><br/></p>"));
    },
  });

  return (
    <div
      className={twMerge(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "[&_[contenteditable='true']]:mt-4 [&_[contenteditable='true']]:min-h-[80px] [&_button:hover]:bg-gray-200 [&_button]:mx-[1px] [&_button]:rounded-sm [&_button]:bg-gray-100 [&_button]:p-1",
        "[&_a:hover]:text-blue-600 [&_a]:text-blue-500",
        "[&_button]:shadow-md",
        className,
      )}
    >
      <MantineProvider>
        <RichTextEditor editor={editor} mih={100} variant="subtle">
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <CustomLinkButton editor={editor} />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <CustomLinkButton editor={editor} />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>
      </MantineProvider>
    </div>
  );
}
