import React, { useState } from 'react'
import { FileSystem } from './components/FileSystem'
import { Terminal } from './components/Terminal'
import { CodeEditor } from './components/CodeEditor'
import { Header } from './components/Header'
import { FileSystemProvider } from './contexts/FileSystemContext'
import { TerminalProvider } from './contexts/TerminalContext'

type ViewMode = 'terminal' | 'editor' | 'split'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('terminal')
  const [currentFile, setCurrentFile] = useState<string | null>(null)

  return (
    <FileSystemProvider>
      <TerminalProvider>
        <div className="h-screen bg-gray-900 text-white flex flex-col">
          <Header viewMode={viewMode} onViewModeChange={setViewMode} />
          
          <div className="flex-1 flex overflow-hidden">
            {/* File System Panel */}
            <div className="w-64 bg-gray-800 border-r border-gray-700">
              <FileSystem onFileSelect={setCurrentFile} />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {viewMode === 'terminal' && (
                <div className="flex-1">
                  <Terminal />
                </div>
              )}
              
              {viewMode === 'editor' && (
                <div className="flex-1">
                  <CodeEditor currentFile={currentFile} />
                </div>
              )}
              
              {viewMode === 'split' && (
                <>
                  <div className="flex-1 border-b border-gray-700">
                    <CodeEditor currentFile={currentFile} />
                  </div>
                  <div className="h-80">
                    <Terminal />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </TerminalProvider>
    </FileSystemProvider>
  )
}

export default App