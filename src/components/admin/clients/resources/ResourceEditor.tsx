'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useCallback, useState } from 'react';
import TurndownService from 'turndown';
import Showdown from 'showdown';
import {
    Bold,
    Italic,
    UnderlineIcon,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Link as LinkIcon,
    Highlighter,
    Eye,
    EyeOff,
    Save,
    Loader2,
    Check,
} from 'lucide-react';

// ─── Markdown <-> HTML conversion ────────────────────────

const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
});

// Preserve <mark> tags as raw HTML in markdown
turndownService.addRule('highlight', {
    filter: 'mark',
    replacement: (_content, node) => {
        const el = node as HTMLElement;
        const style = el.getAttribute('style') || '';
        return `<mark style="${style}">${_content}</mark>`;
    },
});

const showdownConverter = new Showdown.Converter({
    simpleLineBreaks: true,
    strikethrough: true,
    tables: true,
});

function markdownToHtml(md: string): string {
    return showdownConverter.makeHtml(md);
}

function htmlToMarkdown(html: string): string {
    return turndownService.turndown(html);
}

// ─── Toolbar Button ──────────────────────────────────────

function ToolbarBtn({
    active,
    onClick,
    children,
    title,
}: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`
                p-1.5 rounded-md transition-all duration-150
                ${active
                    ? 'bg-flo-orange/20 text-flo-orange'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
                }
            `}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-5 bg-white/[0.08] mx-1" />;
}

// ─── Toolbar ─────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor }) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    }, [editor]);

    const iconSize = 'w-4 h-4';

    return (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02] flex-wrap">
            {/* Headings */}
            <ToolbarBtn
                active={editor.isActive('heading', { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
            >
                <Heading1 className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn
                active={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Heading 2"
            >
                <Heading2 className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn
                active={editor.isActive('heading', { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Heading 3"
            >
                <Heading3 className={iconSize} />
            </ToolbarBtn>

            <ToolbarDivider />

            {/* Inline formatting */}
            <ToolbarBtn
                active={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
            >
                <Bold className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn
                active={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
            >
                <Italic className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn
                active={editor.isActive('underline')}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
            >
                <UnderlineIcon className={iconSize} />
            </ToolbarBtn>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarBtn
                active={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
            >
                <List className={iconSize} />
            </ToolbarBtn>
            <ToolbarBtn
                active={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered List"
            >
                <ListOrdered className={iconSize} />
            </ToolbarBtn>

            <ToolbarDivider />

            {/* Link */}
            <ToolbarBtn
                active={editor.isActive('link')}
                onClick={setLink}
                title="Link"
            >
                <LinkIcon className={iconSize} />
            </ToolbarBtn>

            {/* Highlight */}
            <ToolbarBtn
                active={editor.isActive('highlight')}
                onClick={() => editor.chain().focus().toggleHighlight({ color: '#F1592D40' }).run()}
                title="Highlight (FLO Orange)"
            >
                <Highlighter className={iconSize} />
            </ToolbarBtn>
        </div>
    );
}

// ─── Editor Props ────────────────────────────────────────

interface ResourceEditorProps {
    markdown: string;
    onSave: (md: string) => Promise<void>;
    saving: boolean;
    lastSaved: string | null;
}

export default function ResourceEditor({
    markdown,
    onSave,
    saving,
    lastSaved,
}: ResourceEditorProps) {
    const [preview, setPreview] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedContentRef = useRef(markdown);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                blockquote: false,
                codeBlock: false,
                code: false,
                horizontalRule: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-flo-orange underline cursor-pointer',
                },
            }),
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    style: 'background: #F1592D40; border-radius: 2px; padding: 0 2px;',
                },
            }),
            Placeholder.configure({
                placeholder: 'Start writing…',
            }),
        ],
        content: markdownToHtml(markdown),
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[400px] px-5 py-4',
            },
        },
        onUpdate: ({ editor: ed }) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                const md = htmlToMarkdown(ed.getHTML());
                if (md !== lastSavedContentRef.current) {
                    lastSavedContentRef.current = md;
                    onSave(md);
                }
            }, 1000);
        },
    });

    // Sync content when markdown prop changes (doc type switch)
    const prevMarkdownRef = useRef(markdown);
    useEffect(() => {
        if (editor && markdown !== prevMarkdownRef.current) {
            prevMarkdownRef.current = markdown;
            lastSavedContentRef.current = markdown;
            editor.commands.setContent(markdownToHtml(markdown));
        }
    }, [editor, markdown]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const handleManualSave = useCallback(() => {
        if (!editor) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const md = htmlToMarkdown(editor.getHTML());
        lastSavedContentRef.current = md;
        onSave(md);
    }, [editor, onSave]);

    const formatTime = (iso: string) => {
        try {
            return new Date(iso).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return '';
        }
    };

    if (!editor) return null;

    return (
        <div className="flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* Toolbar + actions bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06]">
                <Toolbar editor={editor} />
                <div className="flex items-center gap-3 px-4">
                    {/* Preview toggle */}
                    <button
                        type="button"
                        onClick={() => setPreview(!preview)}
                        title={preview ? 'Edit mode' : 'Preview'}
                        className="p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                    >
                        {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {/* Manual save */}
                    <button
                        type="button"
                        onClick={handleManualSave}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                            bg-flo-orange/10 text-flo-orange text-xs font-semibold
                            hover:bg-flo-orange/20 transition-all disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" />
                        Save
                    </button>
                </div>
            </div>

            {/* Editor / Preview */}
            {preview ? (
                <div
                    className="prose prose-invert prose-sm max-w-none px-5 py-4 min-h-[400px]"
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
            ) : (
                <EditorContent editor={editor} />
            )}
        </div>
    );
}
