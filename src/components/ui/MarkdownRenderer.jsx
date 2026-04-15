import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

/**
 * Reusable markdown renderer with healthcare-friendly typography.
 *
 * Props:
 *  children   – markdown string
 *  className  – optional extra classes on the wrapper
 */
export const MarkdownRenderer = memo(function MarkdownRenderer({ children, className }) {
  if (!children) return null

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        // Headings
        'prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-4 prose-headings:mb-1',
        // Paragraphs
        'prose-p:text-foreground prose-p:leading-relaxed prose-p:my-1',
        // Lists
        'prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5',
        'prose-ul:list-disc prose-ol:list-decimal prose-li:text-foreground',
        // Bold / Strong
        'prose-strong:font-semibold prose-strong:text-foreground',
        // Code inline
        'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:text-xs prose-code:font-mono',
        // Horizontal rules
        'prose-hr:border-border prose-hr:my-3',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:text-muted-foreground',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
})
