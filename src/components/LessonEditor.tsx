import React, { useState, useEffect, useRef } from 'react';
import { Save, Eye, EyeOff, Type, Bold, Italic, Underline, List, ListOrdered, Link, Image, Code, Palette } from 'lucide-react';

interface LessonEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  initialContent = '',
  onSave,
  readOnly = false,
  placeholder = 'Start writing your lesson content here...'
}) => {
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showFormatting, setShowFormatting] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCountValue = words.length;
    setWordCount(wordCountValue);
    
    // Average reading time: 200 words per minute
    const readingTimeMinutes = Math.ceil(wordCountValue / 200);
    setReadingTime(readingTimeMinutes);
  }, [content]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSave && !readOnly) {
        onSave(content);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [content, onSave, readOnly]);

  const formatText = (format: string) => {
    let formattedContent = content;
    
    switch (format) {
      case 'bold':
        formattedContent = `**${content}**`;
        setIsBold(true);
        setIsItalic(false);
        setIsUnderline(false);
        break;
      case 'italic':
        formattedContent = `*${content}*`;
        setIsBold(false);
        setIsItalic(true);
        setIsUnderline(false);
        break;
      case 'underline':
        formattedContent = `<u>${content}</u>`;
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(true);
        break;
      case 'clear':
        formattedContent = content.replace(/\*\*(.*?)\*\*/g, '$1')
                         .replace(/\*(.*?)\*/g, '$1')
                         .replace(/<u>(.*?)<\/u>/g, '$1');
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
        break;
      default:
        break;
    }
    
    setContent(formattedContent);
  };

  const insertText = (text: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      
      // Restore cursor position
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = start + text.length;
          editorRef.current.selectionEnd = start + text.length;
          editorRef.current.focus();
        }
      }, 0);
    }
  };

  const getPreviewContent = () => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/\n/g, '<br>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {readOnly ? 'Lesson Content' : 'Edit Lesson Content'}
          </h3>
          
          <div className="flex items-center gap-4">
            {/* Word Count and Reading Time */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Type className="h-4 w-4" />
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            
            {/* Formatting Controls */}
            {!readOnly && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFormatting(!showFormatting)}
                  className={`p-2 rounded ${showFormatting ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                  title="Toggle formatting toolbar"
                >
                  <Palette className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {/* Preview Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded ${showPreview ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'}`}
                title="Toggle preview"
              >
                {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Save Button */}
            {onSave && !readOnly && (
              <button
                onClick={() => onSave(content)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Content
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Formatting Toolbar */}
      {showFormatting && !readOnly && (
        <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 mr-2">Formatting:</span>
            
            <button
              onClick={() => formatText('bold')}
              className={`p-2 rounded ${isBold ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => formatText('italic')}
              className={`p-2 rounded ${isItalic ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => formatText('underline')}
              className={`p-2 rounded ${isUnderline ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => formatText('clear')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Clear formatting"
            >
              <Type className="h-4 w-4" />
            </button>
          </div>
          
          {/* Quick Insert Tools */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Insert:</span>
            
            <button
              onClick={() => insertText('### ')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Insert heading"
            >
              <Type className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => insertText('## ')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Insert subheading"
            >
              <Type className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => insertText('\n- ')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Insert bullet list"
            >
              <List className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => insertText('\n1. ')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Insert numbered list"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => insertText('\n> ')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Insert quote"
            >
              <Type className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => insertText('[link text](url)')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Insert link"
            >
              <Link className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => insertText('`code`')}
              className="p-2 rounded text-gray-600 hover:text-gray-900"
              title="Insert code block"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor/Preview Content */}
      <div className="p-6">
        {showPreview ? (
          /* Preview Mode */
          <div className="prose max-w-none">
            <div 
              className="bg-gray-50 border border-gray-200 rounded p-4 mb-4"
              dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
            />
            <div className="text-sm text-gray-600 text-center">
              Preview Mode - Formatted content will appear as students see it
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Content will be auto-saved
                </span>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setContent('')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
                
                <button
                  onClick={() => navigator.clipboard.writeText(content)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
            
            {/* Main Editor */}
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#000000'
              }}
              disabled={readOnly}
            />
            
            {/* Enhanced Visibility Controls */}
            <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                Enhanced Visibility Mode
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showFormatting}
                    onChange={(e) => setShowFormatting(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show formatting toolbar</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Live preview</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonEditor;
