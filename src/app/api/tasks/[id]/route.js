import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '../../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(params.id),
        userId: parseInt(session.user.id)
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, completed, dueDate } = await request.json()

    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(params.id),
        userId: parseInt(session.user.id)
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(params.id) },
      data: {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        completed: completed !== undefined ? completed : task.completed,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(params.id),
        userId: parseInt(session.user.id)
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}