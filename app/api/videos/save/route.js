import { connectToDB } from '@/lib/mongodb'
import Video from '@/models/Video'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { title, videoKey } = await req.json()

    if (!title || !videoKey) {
      return NextResponse.json({ message: 'Missing title or videoKey' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('idToken')?.value || cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.decode(token)
    const userId = decoded?.sub

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    await connectToDB()
    const video = new Video({ userId, title, videoKey })
    await video.save()

    return NextResponse.json({ message: 'Saved to DB', video })
  } catch (err) {
    console.error('Save DB error:', err)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}
