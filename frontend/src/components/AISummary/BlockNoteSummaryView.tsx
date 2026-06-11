"use client";

import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Summary, SummaryDataResponse, SummaryFormat, BlockNoteBlock } from '@/types';
import { AISummary } from './index';
import { Block } from '@blocknote/core';

// Dynamically import BlockNote Editor ONLY for blocknote JSON format
const BlockNoteEditor = dynamic(() => import('../BlockNoteEditor/Editor'), { ssr: false });

interface BlockNoteSummaryViewProps {
  summaryData: SummaryDataResponse | Summary | null;
  onSave?: (data: { markdown?: string; summary_json?: BlockNoteBlock[] }) => void;
  onSummaryChange?: (summary: Summary) => void;
  status?: 'idle' | 'processing' | 'summarizing' | 'regenerating' | 'completed' | 'error';
  error?: string | null;
  onRegenerateSummary?: () => void;
  meeting?: {
    id: string;
    title: string;
    created_at: string;
  };
  onDirtyChange?: (isDirty: boolean) => void;
}

export interface BlockNoteSummaryViewRef {
  saveSummary: () => Promise<void>;
  getMarkdown: () => Promise<string>;
  isDirty: boolean;
}

// Format detection helper
function detectSummaryFormat(data: any): { format: SummaryFormat; data: any } {
  if (!data) {
    return { format: 'legacy', data: null };
  }

  // Priority 1: BlockNote format (has summary_json)
  if (data.summary_json && Array.isArray(data.summary_json)) {
    return { format: 'blocknote', data };
  }

  // Priority 2: Markdown format
  if (data.markdown && typeof data.markdown === 'string') {
    return { format: 'markdown', data };
  }

  // Priority 3: Legacy JSON
  const hasLegacyStructure = data.MeetingName || Object.keys(data).some(key =>
    typeof data[key] === 'object' && data[key]?.title && data[key]?.blocks
  );

  if (hasLegacyStructure) {
    return { format: 'legacy', data };
  }

  return { format: 'legacy', data: null };
}

export const BlockNoteSummaryView = forwardRef<BlockNoteSummaryViewRef, BlockNoteSummaryViewProps>((
  { summaryData, onSave, onSummaryChange, status = 'idle', error = null, onRegenerateSummary, meeting, onDirtyChange },
  ref
) => {
  const { format, data } = detectSummaryFormat(summaryData);
  const [isDirty, setIsDirty] = useState(false);
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>([]);
  const [editedMarkdown, setEditedMarkdown] = useState<string | null>(null);
  const isContentLoaded = useRef(false);

  const handleEditorChange = useCallback((blocks: Block[]) => {
    if (isContentLoaded.current) {
      setCurrentBlocks(blocks);
      setIsDirty(true);
      if (onDirtyChange) onDirtyChange(true);
    }
  }, [onDirtyChange]);

  const handleSave = useCallback(async () => {
    if (!onSave || !isDirty) return;
    try {
      if (format === 'markdown') {
        const md = editedMarkdown ?? data?.markdown ?? '';
        onSave({ markdown: md });
      } else {
        onSave({
          markdown: '',
          summary_json: currentBlocks as unknown as BlockNoteBlock[]
        });
      }
      setIsDirty(false);
      if (onDirtyChange) onDirtyChange(false);
    } catch (err) {
      console.error('❌ Save failed:', err);
    }
  }, [onSave, isDirty, format, editedMarkdown, data, currentBlocks, onDirtyChange]);

  useImperativeHandle(ref, () => ({
    saveSummary: handleSave,
    getMarkdown: async () => {
      if (format === 'markdown') {
        return editedMarkdown ?? data?.markdown ?? '';
      }
      if (format === 'blocknote' && data?.markdown) {
        return data.markdown;
      }
      return '';
    },
    isDirty
  }), [handleSave, isDirty, format, editedMarkdown, data, currentBlocks]);

  // ── LEGACY FORMAT ──────────────────────────────────────────────────────────
  if (format === 'legacy') {
    return (
      <AISummary
        summary={summaryData as Summary}
        status={status}
        error={error}
        onSummaryChange={onSummaryChange || (() => {})}
        onRegenerateSummary={onRegenerateSummary || (() => {})}
        meeting={meeting}
      />
    );
  }

  // ── BLOCKNOTE JSON FORMAT ──────────────────────────────────────────────────
  if (format === 'blocknote') {
    return (
      <div className="flex flex-col w-full">
        <BlockNoteEditor
          initialContent={data.summary_json}
          onChange={(blocks) => {
            isContentLoaded.current = true;
            handleEditorChange(blocks);
          }}
          editable={true}
        />
      </div>
    );
  }

  // ── MARKDOWN FORMAT — rendered with react-markdown, no ProseMirror ─────────
  if (format === 'markdown') {
    const markdownText = editedMarkdown ?? data?.markdown ?? '';

    return (
      <div className="flex flex-col w-full">
        <div className="prose prose-sm max-w-none p-6 w-full markdown-summary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownText}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  return null;
});

BlockNoteSummaryView.displayName = 'BlockNoteSummaryView';
