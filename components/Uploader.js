'use client'

import { useState } from 'react'
import styles from '../styles/Uploader.module.css'

export default function Uploader() {
  const [prompt, setPrompt] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile || !prompt) return alert('Missing prompt or video.')

    setUploading(true)

    try {
      // STEP 1: Get a presigned URL
      const presignRes = await fetch('/api/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalFilename: videoFile.name,
          contentType: videoFile.type,
        }),
      })

      const presignData = await presignRes.json()
      if (!presignData.url || !presignData.key) {
        throw new Error('Presign failed: ' + presignData.message)
      }

      // STEP 2: Upload to S3
      await fetch(presignData.url, {
        method: 'PUT',
        headers: {
          'Content-Type': videoFile.type,
        },
        body: videoFile,
      })

      // STEP 3: Save metadata in DB
      const saveRes = await fetch('/api/videos/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prompt,
          videoKey: presignData.key,
        }),
      })

      const saveData = await saveRes.json()
      if (!saveRes.ok) {
        throw new Error('DB save failed: ' + saveData.message)
      }

      alert('Upload complete and saved to DB!')
    } catch (err) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      setPrompt('')
      setVideoFile(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Prompt/title"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
        required
      />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload to S3'}
      </button>
    </form>
  )
}
