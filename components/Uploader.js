"use client";

import { useState } from "react";
import styles from "../styles/Uploader.module.css";

export default function Uploader() {
  const [prompt, setPrompt] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !prompt) return alert("Missing prompt or video.");

    setUploading(true);

    try {
      // STEP 1: Get a presigned URL
      const presignRes = await fetch("/api/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalFilename: videoFile.name,
          contentType: videoFile.type,
        }),
      });

      const presignData = await presignRes.json();
      if (!presignData.url || !presignData.key) {
        throw new Error("Presign failed: " + presignData.message);
      }

      // STEP 2: Upload to S3
      await fetch(presignData.url, {
        method: "PUT",
        headers: {
          "Content-Type": videoFile.type,
        },
        body: videoFile,
      });

      // STEP 3: Save metadata in DB
      const saveRes = await fetch("/api/videos/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt,
          videoKey: presignData.key,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error("DB save failed: " + saveData.message);
      }

      alert("Upload complete and saved to DB!");
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      setPrompt("");
      setVideoFile(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setVideoFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Title Input */}
      <div className={styles.inputGroup}>
        <label htmlFor="prompt" className={styles.label}>
          Video Title / Prompt
        </label>
        <input
          id="prompt"
          type="text"
          placeholder="Enter a descriptive title for your video..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          className={styles.textInput}
        />
      </div>

      {/* File Upload Area */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Video File</label>

        {!videoFile ? (
          <div
            className={`${styles.fileUploadArea} ${dragActive ? styles.fileUploadAreaActive : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              required
              className={styles.fileInput}
            />
            <div className={styles.uploadIcon}>
              <img src="/upload.svg" alt="Upload" width="24" height="24" />
            </div>
            <div>
              <p className={styles.uploadText}>
                Drop your video here, or <span className={styles.browseText}>browse</span>
              </p>
              <p className={styles.uploadSubtext}>Supports MP4, MOV, AVI and other video formats</p>
            </div>
          </div>
        ) : (
          <div className={styles.filePreview}>
            <div className={styles.filePreviewContent}>
              <div className={styles.fileInfo}>
                <div className={styles.fileIcon}>
                  <img src="/file.svg" alt="File" width="20" height="20" />
                </div>
                <div>
                  <p className={styles.fileName}>{videoFile.name}</p>
                  <p className={styles.fileSize}>{formatFileSize(videoFile.size)}</p>
                </div>
              </div>
              <button type="button" onClick={removeFile} className={styles.removeButton}>
                <img src="/x.svg" alt="Remove" width="20" height="20" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || !videoFile || !prompt}
        className={styles.submitButton}
      >
        {uploading ? (
          <>
            <img src="/loader.svg" alt="Loading" width="20" height="20" className={styles.spinner} />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <img src="/upload.svg" alt="Upload" width="20" height="20" />
            <span>Upload to S3</span>
          </>
        )}
      </button>

      {uploading && (
        <div className={styles.uploadingIndicator}>
          <div className={styles.uploadingContent}>
            <img src="/loader.svg" alt="Loading" width="20" height="20" className={styles.spinner} />
            <div>
              <p className={styles.uploadingTitle}>Uploading your video...</p>
              <p className={styles.uploadingSubtext}>Please don&apos;t close this page</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
