'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    fetchTasks()
  }, [session, status, router])

  const fetchTasks = async () => {
    try {
      const url = filter === 'all' ? '/api/tasks' : `/api/tasks?completed=${filter === 'completed'}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAdded = () => {
    fetchTasks()
  }

  const handleTaskUpdated = () => {
    fetchTasks()
  }

  const handleTaskDeleted = () => {
    fetchTasks()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tasks</h1>

        <TaskForm onTaskAdded={handleTaskAdded} />

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks found. Add your first task above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            ))
          )}
        </div>
    </div>
  )
}
