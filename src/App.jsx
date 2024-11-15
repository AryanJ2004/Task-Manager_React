import React from 'react'
import TodoList from './components/TodoList'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <TodoList />
      </div>
    </ThemeProvider>
  )
}

export default App