import React, { useEffect, useState } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { useFileSystem } from '../contexts/FileSystemContext'

interface CodeEditorProps {
  currentFile: string | null
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ currentFile }) => {
  const { getFileContent, setFileContent } = useFileSystem()
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('plaintext')

  useEffect(() => {
    if (currentFile) {
      const fileContent = getFileContent(currentFile) || ''
      setContent(fileContent)
      
      // Determine language from file extension
      const extension = currentFile.split('.').pop()?.toLowerCase()
      switch (extension) {
        case 'js':
        case 'jsx':
          setLanguage('javascript')
          break
        case 'ts':
        case 'tsx':
          setLanguage('typescript')
          break
        case 'py':
          setLanguage('python')
          break
        case 'html':
          setLanguage('html')
          break
        case 'css':
          setLanguage('css')
          break
        case 'json':
          setLanguage('json')
          break
        case 'md':
          setLanguage('markdown')
          break
        case 'yaml':
        case 'yml':
          setLanguage('yaml')
          break
        case 'xml':
          setLanguage('xml')
          break
        case 'sql':
          setLanguage('sql')
          break
        case 'sh':
        case 'bash':
          setLanguage('shell')
          break
        default:
          setLanguage('plaintext')
      }
    } else {
      setContent('')
      setLanguage('plaintext')
    }
  }, [currentFile, getFileContent])

  const handleChange = (value: string | undefined) => {
    const newContent = value || ''
    setContent(newContent)
    if (currentFile) {
      setFileContent(currentFile, newContent)
    }
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    // Set Monaco theme
    monaco.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'f0f6fc' },
        { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'operator', foreground: 'ff7b72' },
        { token: 'function', foreground: 'd2a8ff' }
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#f0f6fc',
        'editor.lineHighlightBackground': '#161b22',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d42',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#f0f6fc',
        'editorCursor.foreground': '#f0f6fc'
      }
    })
    
    monaco.editor.setTheme('github-dark')
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Fira Code, Monaco, Cascadia Code, Ubuntu Mono, monospace',
      fontLigatures: true,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      minimap: { enabled: true },
      automaticLayout: true,
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: true
    })
  }

  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <div className="text-xl mb-2">No file selected</div>
          <div className="text-sm">Select a file from the file explorer to start editing</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* File Tab */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-white">
            {currentFile.split('/').pop()}
          </div>
          <div className="text-xs text-gray-400">
            {currentFile}
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={{
            theme: 'github-dark'
          }}
        />
      </div>
    </div>
  )
}