import { Terminal as TerminalIcon, Code, Split, Play, Save } from 'lucide-react'

interface HeaderProps {
  viewMode: 'terminal' | 'editor' | 'split'
  onViewModeChange: (mode: 'terminal' | 'editor' | 'split') => void
}

export const Header = ({ viewMode, onViewModeChange }: HeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-purple-400">
            CLI Coding Agent
          </h1>
          <div className="text-sm text-gray-400">
            Web-based development environment
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('terminal')}
              className={`flex items-center px-3 py-1 rounded text-sm ${
                viewMode === 'terminal'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <TerminalIcon className="w-4 h-4 mr-1" />
              Terminal
            </button>
            <button
              onClick={() => onViewModeChange('editor')}
              className={`flex items-center px-3 py-1 rounded text-sm ${
                viewMode === 'editor'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 mr-1" />
              Editor
            </button>
            <button
              onClick={() => onViewModeChange('split')}
              className={`flex items-center px-3 py-1 rounded text-sm ${
                viewMode === 'split'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Split className="w-4 h-4 mr-1" />
              Split
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 ml-4">
            <button className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
              <Play className="w-4 h-4 mr-1" />
              Run
            </button>
            <button className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}