# Web CLI Coding Agent

A web-based CLI coding agent similar to Claude Code, featuring:

## Features

- 🖥️ **Interactive Terminal** - Full-featured web terminal with command history and shortcuts
- 📝 **Code Editor** - Monaco Editor with syntax highlighting for multiple languages
- 📁 **File System** - Virtual file system with create, edit, delete operations
- 🔄 **Split View** - Terminal and editor side-by-side or separate views
- ⚡ **Code Execution** - Simulated Python, Node.js, and shell command execution
- 🎨 **GitHub Dark Theme** - Professional dark theme matching GitHub's design

## Technologies

- **Frontend**: React 18 + TypeScript
- **Terminal**: XTerm.js with addons
- **Editor**: Monaco Editor (VS Code editor)
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Font**: Fira Code with ligatures

## Available Commands

- `help` - Show available commands
- `ls` - List directory contents
- `pwd` - Show current directory
- `cat <file>` - Display file contents
- `echo <text>` - Echo text
- `python <code>` - Execute Python code
- `node <code>` - Execute JavaScript code
- `mkdir <dir>` - Create directory
- `touch <file>` - Create file
- `rm <file>` - Remove file
- `clear` - Clear terminal
- `date` - Show current date
- `whoami` - Show current user

## View Modes

- **Terminal Only** - Focus on command-line interface
- **Editor Only** - Focus on code editing
- **Split View** - Editor on top, terminal on bottom

## File Support

Syntax highlighting for:
- JavaScript/TypeScript
- Python
- HTML/CSS
- JSON/YAML
- Markdown
- Shell scripts
- SQL
- And more...

## Getting Started

1. Select files from the left sidebar to edit
2. Use the terminal to run commands
3. Switch between view modes using the header buttons
4. Create new files and directories using the + button

This is a web-based development environment perfect for quick prototyping, learning, and coding experiments!