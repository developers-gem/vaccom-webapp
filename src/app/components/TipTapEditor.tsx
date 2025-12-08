"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Convert HTML → clean text with bullets
function extractPlainText(editor: any) {
  if (!editor) return "";
  const html = editor.getHTML();

  let output = html;

  // Each <li> → bullet + newline
  output = output.replace(/<li>(.*?)<\/li>/gi, (_match: string, content: string) => `• ${content}\n`);

  // Each <p> → newline
  output = output.replace(/<p>(.*?)<\/p>/gi, (_match: string, content: string) => `${content}\n`);

  // Remove UL tags and leftover HTML
  output = output.replace(/<\/?ul>/gi, "\n");
  output = output.replace(/<\/?[^>]+(>|$)/g, "");

  // Collapse multiple line breaks to single
  output = output.replace(/\n{2,}/g, "\n");

  return output.trim();
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true, // optional, keeps formatting inside lists
        },
      }),
      Placeholder.configure({
        placeholder: "Write description here...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const text = extractPlainText(editor);
      onChange(text);
    },
  editorProps: {
  handleKeyDown(view, event) {
    const { state, dispatch } = view;
    const { selection } = state;
    const { $from } = selection;
    const node = $from.node($from.depth);

    if (event.key === "Enter" && node.type.name === "listItem") {
      event.preventDefault();

      // Use TipTap commands via view.state.tr
      const { schema } = state;
      const tr = state.tr;

      const listItemType = schema.nodes.listItem;
      if (!listItemType) return false;

      // Split the list item
      const split = tr.split($from.pos);
      dispatch(split.scrollIntoView());

      return true;
    }

    return false;
  },
},


  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md p-3 bg-white">
      {/* Toolbar */}
      <div className="flex gap-3 mb-3 border-b pb-2">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </button>

        <button
          className="px-2 py-1 border rounded"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
}
