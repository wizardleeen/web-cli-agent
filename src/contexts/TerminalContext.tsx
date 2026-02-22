import { createContext, useContext, ReactNode } from 'react'

interface TerminalContextType {
  executeCommand: (command: string) => Promise<string>
  getHistory: () => string[]
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined)

export const useTerminal = () => {
  const context = useContext(TerminalContext)
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider')
  }
  return context
}

let commandHistory: string[] = []

const simulateCommand = async (command: string): Promise<string> => {
  const [cmd, ...args] = command.trim().split(' ')
  
  switch (cmd) {
    case 'help':
      return `Available commands:
  help        - Show this help message
  ls          - List directory contents
  pwd         - Show current directory
  echo        - Echo text
  date        - Show current date
  whoami      - Show current user
  clear       - Clear terminal
  python      - Run Python code
  node        - Run JavaScript code
  cat         - Show file contents
  mkdir       - Create directory
  touch       - Create file
  rm          - Remove file/directory`
    
    case 'ls':
      return `src/
README.md
package.json
.gitignore`
    
    case 'pwd':
      return '/workspace'
    
    case 'whoami':
      return 'cli-agent'
    
    case 'date':
      return new Date().toString()
    
    case 'echo':
      return args.join(' ')
    
    case 'python':
      if (args.length === 0) {
        return 'Python 3.9.0 interactive shell\nType "exit()" to quit.\n>>> '
      }
      const pythonCode = args.join(' ')
      return `Executing Python: ${pythonCode}\n[Simulated output - would run in real environment]`
    
    case 'node':
      if (args.length === 0) {
        return 'Node.js v18.0.0 interactive shell\nType ".exit" to quit.\n> '
      }
      const jsCode = args.join(' ')
      return `Executing JavaScript: ${jsCode}\n[Simulated output - would run in real environment]`
    
    case 'cat':
      const filename = args[0]
      if (!filename) {
        return 'cat: missing file operand'
      }
      return `Contents of ${filename}:\n[File contents would be displayed here]`
    
    case 'mkdir':
      const dirname = args[0]
      if (!dirname) {
        return 'mkdir: missing operand'
      }
      return `Directory '${dirname}' created`
    
    case 'touch':
      const touchFile = args[0]
      if (!touchFile) {
        return 'touch: missing file operand'
      }
      return `File '${touchFile}' created`
    
    case 'rm':
      const rmTarget = args[0]
      if (!rmTarget) {
        return 'rm: missing operand'
      }
      return `Removed '${rmTarget}'`
    
    case 'clear':
      return '\x1b[2J\x1b[H'
    
    default:
      return `Command not found: ${cmd}\nType 'help' for available commands.`
  }
}

interface TerminalProviderProps {
  children: ReactNode
}

export const TerminalProvider = ({ children }: TerminalProviderProps) => {
  const executeCommand = async (command: string): Promise<string> => {
    commandHistory.push(command)
    return await simulateCommand(command)
  }

  const getHistory = (): string[] => {
    return [...commandHistory]
  }

  return (
    <TerminalContext.Provider value={{
      executeCommand,
      getHistory
    }}>
      {children}
    </TerminalContext.Provider>
  )
}