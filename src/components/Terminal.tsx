import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { useTerminal } from '../contexts/TerminalContext'
import 'xterm/css/xterm.css'

export const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [currentInput, setCurrentInput] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const { executeCommand } = useTerminal()

  const PROMPT = '\x1b[35mCLI-Agent\x1b[0m:\x1b[36m/workspace\x1b[0m$ '

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize XTerm
    const terminal = new XTerm({
      theme: {
        background: '#0d1117',
        foreground: '#f0f6fc',
        cursor: '#f0f6fc',
        black: '#484f58',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d4dd',
        brightWhite: '#f0f6fc'
      },
      fontFamily: 'Fira Code, Monaco, Cascadia Code, Ubuntu Mono, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      allowTransparency: true
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)
    
    terminal.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = terminal
    fitAddonRef.current = fitAddon

    // Welcome message
    terminal.writeln('\x1b[32mWelcome to CLI Coding Agent!\x1b[0m')
    terminal.writeln('Type \'help\' to see available commands.\n')
    terminal.write(PROMPT)

    // Handle input
    terminal.onData((data) => {
      const code = data.charCodeAt(0)
      
      if (code === 13) { // Enter
        handleCommand()
      } else if (code === 127) { // Backspace
        handleBackspace()
      } else if (code === 27) { // Escape sequence
        if (data === '\x1b[A') { // Up arrow
          handleHistoryUp()
        } else if (data === '\x1b[B') { // Down arrow
          handleHistoryDown()
        } else if (data === '\x1b[C') { // Right arrow
          handleCursorRight()
        } else if (data === '\x1b[D') { // Left arrow
          handleCursorLeft()
        }
      } else if (code >= 32) { // Printable characters
        handleInput(data)
      }
    })

    // Resize handler
    const handleResize = () => {
      fitAddon.fit()
    }
    
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [])

  const handleInput = (data: string) => {
    const newInput = currentInput.slice(0, cursorPosition) + data + currentInput.slice(cursorPosition)
    setCurrentInput(newInput)
    setCursorPosition(cursorPosition + 1)
    
    // Update terminal display
    xtermRef.current?.write(data)
    
    // Move cursor if needed
    if (cursorPosition < currentInput.length) {
      const remaining = currentInput.slice(cursorPosition)
      xtermRef.current?.write(remaining)
      for (let i = 0; i < remaining.length; i++) {
        xtermRef.current?.write('\x1b[D')
      }
    }
  }

  const handleBackspace = () => {
    if (cursorPosition > 0) {
      const newInput = currentInput.slice(0, cursorPosition - 1) + currentInput.slice(cursorPosition)
      setCurrentInput(newInput)
      setCursorPosition(cursorPosition - 1)
      
      xtermRef.current?.write('\x1b[D')
      xtermRef.current?.write(' ')
      xtermRef.current?.write('\x1b[D')
      
      // Redraw the rest of the line
      const remaining = newInput.slice(cursorPosition - 1)
      xtermRef.current?.write(remaining + ' ')
      for (let i = 0; i <= remaining.length; i++) {
        xtermRef.current?.write('\x1b[D')
      }
    }
  }

  const handleCommand = async () => {
    xtermRef.current?.writeln('')
    
    if (currentInput.trim()) {
      // Add to history
      const newHistory = [...commandHistory, currentInput]
      setCommandHistory(newHistory)
      setHistoryIndex(-1)
      
      try {
        const result = await executeCommand(currentInput)
        if (result === '\x1b[2J\x1b[H') {
          // Clear command
          xtermRef.current?.clear()
        } else {
          xtermRef.current?.writeln(result)
        }
      } catch (error) {
        xtermRef.current?.writeln(`\x1b[31mError: ${error}\x1b[0m`)
      }
    }
    
    setCurrentInput('')
    setCursorPosition(0)
    xtermRef.current?.write(PROMPT)
  }

  const handleHistoryUp = () => {
    if (commandHistory.length > 0) {
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      const command = commandHistory[newIndex]
      
      // Clear current line
      clearCurrentLine()
      
      setCurrentInput(command)
      setCursorPosition(command.length)
      setHistoryIndex(newIndex)
      xtermRef.current?.write(command)
    }
  }

  const handleHistoryDown = () => {
    if (historyIndex >= 0) {
      const newIndex = historyIndex + 1
      let command = ''
      
      if (newIndex < commandHistory.length) {
        command = commandHistory[newIndex]
      } else {
        setHistoryIndex(-1)
      }
      
      // Clear current line
      clearCurrentLine()
      
      setCurrentInput(command)
      setCursorPosition(command.length)
      if (newIndex < commandHistory.length) {
        setHistoryIndex(newIndex)
      }
      xtermRef.current?.write(command)
    }
  }

  const handleCursorLeft = () => {
    if (cursorPosition > 0) {
      setCursorPosition(cursorPosition - 1)
      xtermRef.current?.write('\x1b[D')
    }
  }

  const handleCursorRight = () => {
    if (cursorPosition < currentInput.length) {
      setCursorPosition(cursorPosition + 1)
      xtermRef.current?.write('\x1b[C')
    }
  }

  const clearCurrentLine = () => {
    // Move to beginning of input
    for (let i = 0; i < cursorPosition; i++) {
      xtermRef.current?.write('\x1b[D')
    }
    
    // Clear to end of line
    xtermRef.current?.write('\x1b[K')
  }

  return (
    <div className="h-full bg-terminal-bg">
      <div
        ref={terminalRef}
        className="h-full w-full p-4"
      />
    </div>
  )
}