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

    const res = await fetch('/api/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: videoFile.name,
        contentType: videoFile.type,
      }),
    })

    const { url } = await res.json()

    // Step 2: Upload file to S3
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': videoFile.type,
      },
      body: videoFile,
    })

    const s3Url = url.split('?')[0] // Public URL to use

    alert('Upload complete: ' + s3Url)

    // (Optional) Store metadata in DB here if needed

    setUploading(false)
    setPrompt('')
    setVideoFile(null)
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
