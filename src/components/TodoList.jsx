import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Search, Check, Star, Sun, Moon, Edit2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useTheme } from './ThemeProvider'
import { toast, Toaster } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function TodoList() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [newTask, setNewTask] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortCriteria, setSortCriteria] = useState('title')
  const [filterCompleted, setFilterCompleted] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false) // Manage dialog open state
  const { theme, setTheme } = useTheme()

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(prevTasks => [...prevTasks, { 
        id: Date.now().toString(), 
        title: newTask, 
        completed: false, 
        priority: newTaskPriority 
      }])
      setNewTask('')
      setNewTaskPriority('medium')
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed }
        if (updatedTask.completed) {
          toast.success('Task completed!', {
            icon: '🎉',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          })
        }
        return updatedTask
      }
      return task
    }))
  }

  const editTask = (task) => {
    setEditingTask({ ...task })
    setDialogOpen(true) // Open the dialog when editing
  }

  const updateTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task))
      setEditingTask(null)
      setDialogOpen(false) // Close the dialog after updating the task
    }
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCompletion = 
        filterCompleted === 'all' ? true :
        filterCompleted === 'completed' ? task.completed :
        !task.completed
      return matchesSearch && matchesCompletion
    })
    .sort((a, b) => {
      if (sortCriteria === 'title') return a.title.localeCompare(b.title)
      if (sortCriteria === 'priority') {
        const priorityOrder = { low: 0, medium: 1, high: 2 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortCriteria === 'completed') return Number(b.completed) - Number(a.completed)
      return 0
    })

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-4">
      <Toaster position="bottom-center" />
      <Card className="max-w-2xl mx-auto mt-10 border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold">Todo List</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-auto"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="mb-4 flex flex-row items-center gap-2">
            <Input
              type="text"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-grow"
            />
            <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-grow min-w-[200px]">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tasks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortCriteria} onValueChange={setSortCriteria}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCompleted} onValueChange={setFilterCompleted}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <AnimatePresence>
              {filteredAndSortedTasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-muted p-3 rounded-lg mb-2"
                >
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleComplete(task.id)}
                      className={`mr-2 ${task.completed ? 'text-green-500' : 'text-muted-foreground'}`}
                    >
                      <Check className="h-5 w-5" />
                      <span className="sr-only">{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</span>
                    </Button>
                    <span className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      task.priority === 'low' ? 'text-blue-500' :
                      task.priority === 'medium' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {task.priority}
                    </span>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => editTask(task)}>
                          <Edit2 className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-2">
                          <Input
                            value={editingTask?.title || ''}
                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          />
                          <Select
                            value={editingTask?.priority || 'medium'}
                            onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={updateTask}>Update</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
