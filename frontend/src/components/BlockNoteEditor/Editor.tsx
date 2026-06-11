"use client";

import { useState, useEffect } from "react";
import { PartialBlock, Block } from "@blocknote/core";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";

interface EditorProps {
  initialContent?: Block[];
  initialMarkdown?: string;
  onChange?: (blocks: Block[]) => void;
  editable?: boolean;
}

function EditorCore({ initialContent, onChange, editable }: { initialContent?: PartialBlock[], onChange?: (blocks: Block[]) => void, editable: boolean }) {
  const { useCreateBlockNote } = require("@blocknote/react");
  const { BlockNoteView } = require("@blocknote/shadcn");

  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  // Expose blocksToMarkdown method
  (editor as any).blocksToMarkdownLossy = async (blocks: Block[]) => {
    try {
      return await editor.blocksToMarkdownLossy(blocks);
    } catch (error) {
      console.error('❌ EDITOR: Failed to convert blocks to markdown:', error);
      return '';
    }
  };

  // Keep a stable ref to onChange so we don't re-subscribe on every render
  const onChangeRef = require("react").useRef(onChange);
  require("react").useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  require("react").useEffect(() => {
    const handleChange = () => {
      if (onChangeRef.current) {
        onChangeRef.current(editor.document);
      }
    };
    const unsubscribe = editor.onChange(handleChange);
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [editor]);

  return <BlockNoteView editor={editor} editable={editable} theme="light" />;
}

export default function Editor({ initialContent, initialMarkdown, onChange, editable = true }: EditorProps) {
  const [parsedBlocks, setParsedBlocks] = useState<PartialBlock[] | undefined>(undefined);
  const [isParsing, setIsParsing] = useState(!!initialMarkdown);

  useEffect(() => {
    if (initialMarkdown) {
      let isMounted = true;
      async function parse() {
        try {
          const { BlockNoteEditor } = await import("@blocknote/core");
          const tempEditor = BlockNoteEditor.create();
          const blocks = await tempEditor.tryParseMarkdownToBlocks(initialMarkdown);
          if (isMounted) {
            setParsedBlocks(blocks);
            setIsParsing(false);
          }
        } catch (err) {
          console.error("Failed to parse markdown:", err);
          if (isMounted) setIsParsing(false);
        }
      }
      parse();
      return () => { isMounted = false; };
    }
  }, [initialMarkdown]);

  if (isParsing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading summary...</span>
      </div>
    );
  }

  return <EditorCore 
    initialContent={parsedBlocks || (initialContent as PartialBlock[] | undefined)} 
    onChange={onChange} 
    editable={editable} 
  />;
}
