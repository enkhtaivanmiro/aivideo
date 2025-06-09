"use client";
import { useState } from "react";
import styles from "../styles/Uploader.module.css";

export default function Uploader() {
  const [prompt, setPrompt] = useState("");
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt || !video) {
      alert("Please provide a prompt and select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("video", video);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Upload successful");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button type="submit" className={styles.submitBtn}>Upload</button>
      </form>
    </div>
  );
}
