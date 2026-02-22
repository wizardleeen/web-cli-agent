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
    name: 'examples',
    type: 'directory',
    path: '/examples',
    children: [
      {
        name: 'hello.py',
        type: 'file',
        path: '/examples/hello.py',
        content: '# Python Hello World - Real Execution!\nprint("🐍 Hello from Python!")\n\n# This actually runs in your browser using Pyodide\ndef greet(name):\n    """Greet someone with a personalized message"""\n    return f"Hello, {name}! Welcome to real Python execution in the browser."\n\n# Try this in the terminal: python examples/hello.py\nif __name__ == "__main__":\n    print(greet("Developer"))\n    \n    # Demo some Python features\n    numbers = [1, 2, 3, 4, 5]\n    squares = [x**2 for x in numbers]\n    print(f"Original numbers: {numbers}")\n    print(f"Squared numbers: {squares}")\n    \n    # Try asking the AI assistant about this code!\n    print("\\n💡 Tip: Ask the AI assistant to explain this code or suggest improvements!")'
      },
      {
        name: 'calculator.js',
        type: 'file',
        path: '/examples/calculator.js',
        content: '// JavaScript Calculator - Real Execution!\nconsole.log("🚀 JavaScript Calculator Demo");\n\n// This runs with QuickJS engine in your browser\nclass Calculator {\n    add(a, b) { return a + b; }\n    subtract(a, b) { return a - b; }\n    multiply(a, b) { return a * b; }\n    divide(a, b) {\n        if (b === 0) throw new Error("Division by zero!");\n        return a / b;\n    }\n}\n\n// Demo usage - try running: node examples/calculator.js\nconst calc = new Calculator();\n\nconsole.log("➕ Addition: 15 + 25 =", calc.add(15, 25));\nconsole.log("➖ Subtraction: 50 - 12 =", calc.subtract(50, 12));\nconsole.log("✖️  Multiplication: 8 × 7 =", calc.multiply(8, 7));\nconsole.log("➗ Division: 100 ÷ 4 =", calc.divide(100, 4));\n\n// Test error handling\ntry {\n    calc.divide(10, 0);\n} catch (error) {\n    console.error("❌ Error caught:", error.message);\n}\n\nconsole.log("\\n💡 Try modifying this code and running it again!");'
      }
    ]
  },
  {
    name: 'my_project',
    type: 'directory',
    path: '/my_project',
    children: [
      {
        name: 'main.py',
        type: 'file',
        path: '/my_project/main.py',
        content: '#!/usr/bin/env python3\n"""\nYour Python Project Template\n\nThis template provides a starting point for your Python projects.\nThe code actually executes in your browser!\n"""\n\ndef main():\n    """Main function - customize this for your needs"""\n    print("🎉 Welcome to your Python project!")\n    print("This code is running with real Python execution!")\n    \n    # Example: Working with data\n    data = [1, 2, 3, 4, 5]\n    result = sum(data)\n    average = result / len(data)\n    \n    print(f"Data: {data}")\n    print(f"Sum: {result}")\n    print(f"Average: {average}")\n    \n    # TODO: Add your code here\n    print("\\n💡 Ideas for your project:")\n    print("- Data analysis with lists and dictionaries")\n    print("- Mathematical calculations")\n    print("- Text processing")\n    print("- Algorithm implementations")\n    \n    return "Project completed successfully!"\n\nif __name__ == "__main__":\n    result = main()\n    print(f"\\n✅ {result}")'
      },
      {
        name: 'app.js',
        type: 'file',
        path: '/my_project/app.js',
        content: '/**\n * Your JavaScript Project Template\n * \n * This template provides a starting point for your JavaScript projects.\n * The code actually executes using QuickJS engine!\n */\n\nconsole.log("🎉 Welcome to your JavaScript project!");\nconsole.log("This code is running with real JavaScript execution!");\n\n// Example: Working with modern JavaScript features\nclass ProjectManager {\n    constructor(name) {\n        this.name = name;\n        this.tasks = [];\n    }\n    \n    addTask(task) {\n        this.tasks.push({\n            id: Date.now(),\n            description: task,\n            completed: false\n        });\n        console.log(`✅ Added task: ${task}`);\n    }\n    \n    listTasks() {\n        console.log(`\\n📋 Tasks for ${this.name}:`);\n        this.tasks.forEach((task, index) => {\n            const status = task.completed ? "✅" : "⏳";\n            console.log(`  ${index + 1}. ${status} ${task.description}`);\n        });\n    }\n    \n    completeTask(index) {\n        if (this.tasks[index]) {\n            this.tasks[index].completed = true;\n            console.log(`🎯 Completed: ${this.tasks[index].description}`);\n        }\n    }\n}\n\n// Demo usage\nconst project = new ProjectManager("My Awesome Project");\n\nproject.addTask("Set up project structure");\nproject.addTask("Write core functionality");\nproject.addTask("Add error handling");\nproject.addTask("Test the application");\n\nproject.listTasks();\nproject.completeTask(0);\nproject.listTasks();\n\nconsole.log("\\n💡 Try modifying this code:");\nconsole.log("- Add new methods to the ProjectManager class");\nconsole.log("- Implement task filtering or searching");\nconsole.log("- Add validation and error handling");\nconsole.log("- Ask the AI assistant for improvement suggestions!");'
      }
    ]
  },
  {
    name: 'README.md',
    type: 'file',
    path: '/README.md',
    content: '# CLI Coding Agent - Real Code Execution\n\n🎉 **Welcome to your powerful web-based development environment!**\n\nThis isn\'t just another code editor - this is a **real coding environment** that executes Python and JavaScript directly in your browser!\n\n## 🚀 What Makes This Special\n\n### Real Code Execution\n- **Python**: Powered by Pyodide (full CPython in WebAssembly)\n- **JavaScript**: Powered by QuickJS (fast ES2020 engine)\n- **No Server Required**: Everything runs locally in your browser\n- **Package Support**: Install and use Python packages\n- **Interactive Output**: See results in real-time\n\n### AI-Powered Assistant\n- **Code Explanations**: Understand any piece of code\n- **Debugging Help**: Find and fix errors automatically\n- **Optimization Tips**: Improve your code performance\n- **Learning Support**: Get programming concepts explained\n- **Smart Suggestions**: Context-aware code recommendations\n\n### Professional Development Tools\n- **Monaco Editor**: Full VS Code editor experience\n- **File System**: Create, edit, and manage files\n- **Terminal**: Complete command-line interface\n- **Split View**: Code and terminal side-by-side\n- **Auto-Save**: Never lose your work\n\n## 🎯 Quick Start Guide\n\n### 1. Explore the Examples\nStart with the `examples/` folder:\n- `hello.py` - Python basics with real execution\n- `calculator.js` - JavaScript class example\n\n### 2. Run Code in Terminal\n```bash\n# Python execution\npython examples/hello.py\npython "print(\'Hello World!\')"\n\n# JavaScript execution\nnode examples/calculator.js\nnode "console.log(\'Hello World!\')"\n\n# File operations\nls                    # List files\ncat examples/hello.py # View file contents\nmkdir new_folder      # Create directory\ntouch new_file.py     # Create file\n```\n\n### 3. Ask the AI Assistant\nClick the **AI Assistant** button to get help with:\n- Code explanations\n- Bug fixes\n- Optimization suggestions\n- Learning new concepts\n\n### 4. Start Your Project\nUse the `my_project/` folder to build your own applications!\n\n## 💡 Pro Tips\n\n- **Split View**: Use the split view to see code and terminal together\n- **AI Integration**: Select code and ask the AI to explain it\n- **Real Execution**: All code actually runs - no simulation!\n- **Package Installation**: Use `pip install` for Python packages\n- **Auto-Complete**: The editor provides intelligent suggestions\n\n## 🛠️ Available Commands\n\n```bash\n# File Management\nls [path]             # List directory contents\npwd                   # Show current directory\ncat <file>            # Display file contents\nmkdir <name>          # Create directory\ntouch <file>          # Create empty file\nrm <file>             # Delete file\n\n# Code Execution\npython <file>         # Run Python file\nnode <file>           # Run JavaScript file\npython "<code>"       # Execute Python code directly\nnode "<code>"         # Execute JavaScript code directly\n\n# AI Assistant\nai "<question>"       # Ask AI anything\nexplain <file>        # Get code explanation\n\n# System\nhelp                  # Show all commands\nclear                 # Clear terminal\ndate                  # Show current date\n```\n\n## 🌟 Example Projects You Can Build\n\n- **Data Analysis**: Process and visualize data with Python\n- **Web Scraping**: Extract information from websites\n- **Algorithms**: Implement sorting, searching, and graph algorithms\n- **Games**: Create text-based games and puzzles\n- **Utilities**: Build helpful tools and calculators\n- **Learning**: Practice programming concepts with immediate feedback\n\n## 🔒 Privacy & Security\n\n- ✅ All code runs locally in your browser\n- ✅ No data sent to external servers\n- ✅ Files stored in browser storage\n- ✅ Secure WebAssembly sandboxing\n- ✅ No tracking or analytics\n\n---\n\n**Ready to start coding?** 🚀\n\n1. Open a file from the examples\n2. Click "Run" or use the terminal\n3. See your code execute in real-time\n4. Ask the AI assistant for help anytime!\n\nHappy coding! 🎉'
  }
]

interface FileSystemProviderProps {
  children: ReactNode
}

export const FileSystemProvider = ({ children }: FileSystemProviderProps) => {
  const [fileTree, setFileTree] = useState<FileNode[]>(defaultFileTree)
  const [currentFile, setCurrentFile] = useState<string | null>('/examples/hello.py')

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
      
      // If adding to root
      if (dirPath === '/') {
        return [
          ...prevTree,
          {
            name: fileName,
            type: 'file',
            path,
            content
          }
        ]
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
      
      // If adding to root
      if (parentPath === '/') {
        return [
          ...prevTree,
          {
            name: dirName,
            type: 'directory',
            path,
            children: []
          }
        ]
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