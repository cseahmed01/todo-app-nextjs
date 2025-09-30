'use client'

import { useState } from 'react'

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '')
  const [loading, setLoading] = useState(false)

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      })

      if (response.ok) {
        onTaskUpdated()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description: description || null,
          dueDate: dueDate || null
        })
      })

      if (response.ok) {
        setEditing(false)
        onTaskUpdated()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onTaskDeleted()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${task.completed ? 'border-green-500' : 'border-indigo-500'}`}>
      {editing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleComplete}
                disabled={loading}
                className={`px-3 py-1 rounded-md text-sm ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
              >
                {task.completed ? 'Completed' : 'Pending'}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-gray-600 mt-2">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-sm text-gray-500 mt-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}