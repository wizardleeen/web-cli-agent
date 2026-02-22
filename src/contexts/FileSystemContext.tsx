import { createContext, useContext, useState, ReactNode } from 'react'

export interface FileNode {
  name: string
  type: 'file' | 'directory'
  path: string
  content?: string
  children?: FileNode[]
}

interface FileSystemContextType {
  fileTree: FileNode[]
  currentFile: string | null
  getFileContent: (path: string) => string | null
  setFileContent: (path: string, content: string) => void
  createFile: (path: string, content?: string) => void
  createDirectory: (path: string) => void
  deleteFile: (path: string) => void
  setCurrentFile: (path: string | null) => void
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export const useFileSystem = () => {
  const context = useContext(FileSystemContext)
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider')
  }
  return context
}

const defaultFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'directory',
    path: '/src',
    children: [
      {
        name: 'main.py',
        type: 'file',
        path: '/src/main.py',
        content: 'print("Hello, World!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nif __name__ == "__main__":\n    print(greet("CLI Agent"))'
      },
      {
        name: 'utils.js',
        type: 'file',
        path: '/src/utils.js',
        content: 'function add(a, b) {\n    return a + b;\n}\n\nfunction multiply(a, b) {\n    return a * b;\n}\n\nmodule.exports = { add, multiply };'
      }
    ]
  },
  {
    name: 'README.md',
    type: 'file',
    path: '/README.md',
    content: '# CLI Coding Agent\n\nA web-based coding environment with terminal interface.\n\n## Features\n\n- Interactive terminal\n- Code editor with syntax highlighting\n- File system management\n- Code execution simulation\n- AI assistance ready'
  },
  {
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "description": "A sample project",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  }\n}'
  }
]

interface FileSystemProviderProps {
  children: ReactNode
}

export const FileSystemProvider = ({ children }: FileSystemProviderProps) => {
  const [fileTree, setFileTree] = useState<FileNode[]>(defaultFileTree)
  const [currentFile, setCurrentFile] = useState<string | null>(null)

  const findNode = (path: string, nodes: FileNode[] = fileTree): FileNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node
      if (node.children) {
        const found = findNode(path, node.children)
        if (found) return found
      }
    }
    return null
  }

  const getFileContent = (path: string): string | null => {
    const node = findNode(path)
    return node?.content || null
  }

  const setFileContent = (path: string, content: string): void => {
    setFileTree(prevTree => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === path) {
            return { ...node, content }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }
      return updateNode(prevTree)
    })
  }

  const createFile = (path: string, content = ''): void => {
    const pathParts = path.split('/')
    const fileName = pathParts.pop()!
    const dirPath = pathParts.join('/') || '/'

    setFileTree(prevTree => {
      const addToDir = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === dirPath && node.type === 'directory') {
            return {
              ...node,
              children: [
                ...(node.children || []),
                {
                  name: fileName,
                  type: 'file',
                  path,
                  content
                }
              ]
            }
          }
          if (node.children) {
            return { ...node, children: addToDir(node.children) }
          }
          return node
        })
      }
      return addToDir(prevTree)
    })
  }

  const createDirectory = (path: string): void => {
    const pathParts = path.split('/')
    const dirName = pathParts.pop()!
    const parentPath = pathParts.join('/') || '/'

    setFileTree(prevTree => {
      const addToDir = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === parentPath && node.type === 'directory') {
            return {
              ...node,
              children: [
                ...(node.children || []),
                {
                  name: dirName,
                  type: 'directory',
                  path,
                  children: []
                }
              ]
            }
          }
          if (node.children) {
            return { ...node, children: addToDir(node.children) }
          }
          return node
        })
      }
      return addToDir(prevTree)
    })
  }

  const deleteFile = (path: string): void => {
    setFileTree(prevTree => {
      const removeNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.filter(node => {
          if (node.path === path) return false
          if (node.children) {
            node.children = removeNode(node.children)
          }
          return true
        })
      }
      return removeNode(prevTree)
    })
    if (currentFile === path) {
      setCurrentFile(null)
    }
  }

  return (
    <FileSystemContext.Provider value={{
      fileTree,
      currentFile,
      getFileContent,
      setFileContent,
      createFile,
      createDirectory,
      deleteFile,
      setCurrentFile
    }}>
      {children}
    </FileSystemContext.Provider>
  )
}