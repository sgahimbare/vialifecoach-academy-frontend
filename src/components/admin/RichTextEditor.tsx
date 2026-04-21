import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon,
  Video,
  FileText,
  Palette,
  Table,
  Eye,
  Code,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start typing...', 
  height = '400px' 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState('3');
  const [textCase, setTextCase] = useState('none');

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0'
  ];

  const fontFamilies = [
    'Times New Roman',
    'Georgia',
    'Garamond',
    'Arial',
    'Helvetica',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Courier New'
  ];

  const fontSizes = [
    { value: '1', label: '10' },
    { value: '2', label: '12' },
    { value: '3', label: '14' },
    { value: '4', label: '16' },
    { value: '5', label: '18' },
    { value: '6', label: '24' },
    { value: '7', label: '32' }
  ];

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const restoreSelection = useCallback(() => {
    if (!savedRange) return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }, [savedRange]);

  const executeCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(command, false, value);
    updateContent();
  }, [restoreSelection, updateContent]);

  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!editorRef.current) return;
    const anchorNode = selection.anchorNode;
    if (anchorNode && editorRef.current.contains(anchorNode)) {
      setSavedRange(range);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      saveSelection();
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [saveSelection]);

  const insertLink = useCallback(() => {
    if (linkUrl && linkText) {
      restoreSelection();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = linkUrl;
        link.textContent = linkText;
        link.target = '_blank';
        range.deleteContents();
        range.insertNode(link);
        updateContent();
      }
    }
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  }, [linkUrl, linkText, restoreSelection]);

  const insertImage = useCallback(() => {
    if (imageUrl) {
      restoreSelection();
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = imageAlt || 'Image';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      editorRef.current?.appendChild(img);
      updateContent();
    }
    setShowImageDialog(false);
    setImageUrl('');
    setImageAlt('');
  }, [imageUrl, imageAlt, restoreSelection]);

  const insertVideo = useCallback(() => {
    if (videoUrl) {
      restoreSelection();
      // Extract YouTube video ID if it's a YouTube URL
      const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        const iframe = document.createElement('iframe');
        iframe.width = '560';
        iframe.height = '315';
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.maxWidth = '100%';
        iframe.style.height = 'auto';
        editorRef.current?.appendChild(iframe);
      } else {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.height = 'auto';
        editorRef.current?.appendChild(video);
      }
      updateContent();
    }
    setShowVideoDialog(false);
    setVideoUrl('');
  }, [videoUrl, restoreSelection]);

  const insertTable = useCallback(() => {
    restoreSelection();
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    
    for (let i = 0; i < tableRows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < tableCols; j++) {
        const cell = row.insertCell();
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
        cell.contentEditable = 'true';
        cell.textContent = 'Cell';
      }
    }
    
    editorRef.current?.appendChild(table);
    updateContent();
    setShowTableDialog(false);
    setTableRows(3);
    setTableCols(3);
  }, [tableRows, tableCols, restoreSelection]);

  const handleColorChange = useCallback((color: string) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  }, [executeCommand]);

  const handleHighlightChange = useCallback((color: string) => {
    restoreSelection();
    document.execCommand('hiliteColor', false, color);
    document.execCommand('backColor', false, color);
    updateContent();
  }, [restoreSelection, updateContent]);

  const applyFontFamily = useCallback((family: string) => {
    setFontFamily(family);
    executeCommand('fontName', family);
  }, [executeCommand]);

  const applyFontSize = useCallback((size: string) => {
    setFontSize(size);
    executeCommand('fontSize', size);
  }, [executeCommand]);

  const transformSelection = useCallback((mode: string) => {
    restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const text = selection.toString();
    if (!text) return;

    const toSentenceCase = (value: string) => {
      const lower = value.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    };
    const toTitleCase = (value: string) =>
      value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

    let transformed = text;
    if (mode === 'lower') transformed = text.toLowerCase();
    if (mode === 'upper') transformed = text.toUpperCase();
    if (mode === 'sentence') transformed = toSentenceCase(text);
    if (mode === 'title') transformed = toTitleCase(text);

    range.deleteContents();
    range.insertNode(document.createTextNode(transformed));
    selection.removeAllRanges();
    selection.addRange(range);
    updateContent();
  }, [restoreSelection, updateContent]);

  const handleFileUpload = useCallback(async (file: File, type: 'image' | 'video') => {
    // This would integrate with your file upload API
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/v1/admin/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        if (type === 'image') {
          setImageUrl(data.url);
        } else {
          setVideoUrl(data.url);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  }, []);

  const handleToolbarMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('select') || target.closest('option') || target.closest('input')) {
      return;
    }
    event.preventDefault();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden text-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 text-gray-700" onMouseDown={handleToolbarMouseDown}>
        <div className="flex flex-wrap items-center gap-1">
          <select
            className="h-8 rounded border border-gray-300 bg-white px-2 text-xs text-gray-800"
            value={fontFamily}
            onChange={(e) => applyFontFamily(e.target.value)}
          >
            {fontFamilies.map((family) => (
              <option key={family} value={family}>{family}</option>
            ))}
          </select>
          <select
            className="h-8 rounded border border-gray-300 bg-white px-2 text-xs text-gray-800"
            value={fontSize}
            onChange={(e) => applyFontSize(e.target.value)}
          >
            {fontSizes.map((size) => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
          <select
            className="h-8 rounded border border-gray-300 bg-white px-2 text-xs text-gray-800"
            value={textCase}
            onChange={(e) => {
              setTextCase(e.target.value);
              transformSelection(e.target.value);
            }}
          >
            <option value="none">Case</option>
            <option value="lower">lowercase</option>
            <option value="upper">UPPERCASE</option>
            <option value="sentence">Sentence case</option>
            <option value="title">Title Case</option>
          </select>

          {/* Text Formatting */}
          <button
            onClick={() => executeCommand('bold')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('strikeThrough')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Strikethrough"
          >
            <span className="text-xs line-through font-semibold">S</span>
          </button>
          <button
            onClick={() => executeCommand('superscript')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Superscript"
          >
            <span className="text-xs font-semibold">x²</span>
          </button>
          <button
            onClick={() => executeCommand('subscript')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Subscript"
          >
            <span className="text-xs font-semibold">x₂</span>
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Alignment */}
          <button
            onClick={() => executeCommand('justifyLeft')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyCenter')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyRight')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Lists */}
          <button
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Insert */}
          <button
            onClick={() => setShowLinkDialog(true)}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowImageDialog(true)}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowVideoDialog(true)}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Insert Video"
          >
            <Video className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowTableDialog(true)}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Insert Table"
          >
            <Table className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Other */}
          <button
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<pre>')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 hover:bg-gray-200 rounded text-gray-700"
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
                <div className="grid grid-cols-7 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className="p-2 hover:bg-gray-200 rounded text-gray-700"
              title="Highlight Color"
            >
              <span className="text-xs font-semibold">H</span>
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
                <div className="grid grid-cols-7 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleHighlightChange(color)}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* History */}
          <button
            onClick={() => executeCommand('undo')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={() => executeCommand('redo')}
            className="p-2 hover:bg-gray-200 rounded text-gray-700"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* View Mode */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`p-2 rounded text-gray-700 ${isPreviewMode ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
            title={isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div style={{ height }}>
        {isPreviewMode ? (
          <div className="p-4 overflow-y-auto h-full bg-white">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 overflow-y-auto h-full bg-white focus:outline-none"
            style={{ minHeight: height }}
            onInput={updateContent}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onBlur={saveSelection}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <input
              type="text"
              placeholder="Link URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <input
              type="text"
              placeholder="Link Text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={insertLink}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
            <input
              type="url"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <input
              type="text"
              placeholder="Alt Text (optional)"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <div className="text-center text-sm text-gray-600 mb-4">OR</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={insertImage}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
              <button
                onClick={() => setShowImageDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Dialog */}
      {showVideoDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Video</h3>
            <input
              type="url"
              placeholder="YouTube URL or Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-3"
            />
            <div className="text-center text-sm text-gray-600 mb-4">OR</div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={insertVideo}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
              <button
                onClick={() => setShowVideoDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Dialog */}
      {showTableDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Table</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={insertTable}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
              <button
                onClick={() => setShowTableDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
