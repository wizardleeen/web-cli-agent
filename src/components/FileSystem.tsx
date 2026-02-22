import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react'
import { useFileSystem, FileNode } from '../contexts/FileSystemContext'

interface FileSystemProps {
  onFileSelect: (filePath: string) => void
}

interface FileTreeItemProps {
  node: FileNode
  depth: number
  onFileSelect: (filePath: string) => void
  expandedDirs: Set<string>
  setExpandedDirs: React.Dispatch<React.SetStateAction<Set<string>>>
}

const FileTreeItem = ({
  node,
  depth,
  onFileSelect,
  expandedDirs,
  setExpandedDirs
}: FileTreeItemProps) => {
  const { deleteFile } = useFileSystem()
  const isExpanded = expandedDirs.has(node.path)

  const handleToggle = () => {
    if (node.type === 'directory') {
      setExpandedDirs(prev => {
        const newSet = new Set(prev)
        if (isExpanded) {
          newSet.delete(node.path)
        } else {
          newSet.add(node.path)
        }
        return newSet
      })
    } else {
      onFileSelect(node.path)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete ${node.name}?`)) {
      deleteFile(node.path)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer group`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {node.type === 'directory' && (
          <div className="w-4 h-4 mr-1">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        )}
        
        <div className="w-4 h-4 mr-2">
          {node.type === 'directory' ? (
            isExpanded ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />
          ) : (
            <File className="w-4 h-4 text-gray-400" />
          )}
        </div>
        
        <span className="flex-1 text-sm">{node.name}</span>
        
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      
      {node.type === 'directory' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
              expandedDirs={expandedDirs}
              setExpandedDirs={setExpandedDirs}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const FileSystem = ({ onFileSelect }: FileSystemProps) => {
  const { fileTree, createFile, createDirectory } = useFileSystem()
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['/src']))
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<'file' | 'directory'>('file')

  const handleCreateNew = () => {
    if (newFileName.trim()) {
      const path = `/${newFileName.trim()}`
      if (newFileType === 'file') {
        createFile(path)
      } else {
        createDirectory(path)
      }
      setNewFileName('')
      setShowNewFileDialog(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">FILES</h2>
        <button
          onClick={() => setShowNewFileDialog(true)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {showNewFileDialog && (
        <div className="p-3 bg-gray-750 border-b border-gray-700">
          <div className="mb-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="fileType"
                checked={newFileType === 'file'}
                onChange={() => setNewFileType('file')}
              />
              <span>File</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="fileType"
                checked={newFileType === 'directory'}
                onChange={() => setNewFileType('directory')}
              />
              <span>Directory</span>
            </label>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder={`${newFileType} name`}
              className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateNew()}
            />
            <button
              onClick={handleCreateNew}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
            >
              Create
            </button>
            <button
              onClick={() => setShowNewFileDialog(false)}
              className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {fileTree.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={0}
            onFileSelect={onFileSelect}
            expandedDirs={expandedDirs}
            setExpandedDirs={setExpandedDirs}
          />
        ))}
      </div>
    </div>
  )
}