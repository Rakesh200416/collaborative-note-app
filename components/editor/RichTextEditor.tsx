'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { FontFamily } from '@tiptap/extension-font-family';

import { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Palette,
  Type,
  Table as TableIcon,
  Type as TypeIcon,
} from 'lucide-react';

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Start typing...',
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Table.configure({
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full',
        },
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        lastColumnResizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily.extend({
        addKeyboardShortcuts() {
          return {}
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    onFocus,
    onBlur,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {editable && (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            size="sm"
            variant={editor.isActive('bold') ? 'solid' : 'light'}
            isIconOnly
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('italic') ? 'solid' : 'light'}
            isIconOnly
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('underline') ? 'solid' : 'light'}
            isIconOnly
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('strike') ? 'solid' : 'light'}
            isIconOnly
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
          <Button
            size="sm"
            variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'light'}
            isIconOnly
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="Heading 1"
          >
            <Heading1 size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'light'}
            isIconOnly
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="Heading 2"
          >
            <Heading2 size={16} />
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
          <Button
            size="sm"
            variant={editor.isActive('bulletList') ? 'solid' : 'light'}
            isIconOnly
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('orderedList') ? 'solid' : 'light'}
            isIconOnly
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive('codeBlock') ? 'solid' : 'light'}
            isIconOnly
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Code size={16} />
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
          <input
            type="color"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            title="Text Color"
          />
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() =>
              editor.chain().focus().unsetColor().run()
            }
            title="Remove Color"
          >
            <Palette size={16} />
          </Button>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
          <select
            value={editor.getAttributes('textStyle').fontFamily || ''}
            onChange={(event) =>
              editor.chain().focus().setFontFamily(event.target.value).run()
            }
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            title="Font Family"
          >
            <option value="">Default</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Impact">Impact</option>
          </select>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => {
              const rows = parseInt(prompt('Number of rows:', '2') || '2');
              const cols = parseInt(prompt('Number of columns:', '2') || '2');
              editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
            }}
            title="Insert Table"
          >
            <TableIcon size={16} />
          </Button>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().addRowAfter().run()}
            title="Add Row"
            disabled={!editor.can().addRowAfter()}
          >
            <ListOrdered size={16} />
          </Button>
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => editor.chain().focus().deleteRow().run()}
            title="Delete Row"
            disabled={!editor.can().deleteRow()}
          >
            <Strikethrough size={16} />
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
