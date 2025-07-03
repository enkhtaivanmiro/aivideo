"use client"

import { useEffect, useState, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial, Box, Text } from "@react-three/drei"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, Play, Zap, Brain, Sparkles } from "lucide-react"

function ParticleField() {
  const ref = useRef(null)
  const { viewport } = useThree()
  const particlesPosition = new Float32Array(5000 * 3)

  for (let i = 0; i < 5000; i++) {
    particlesPosition[i * 3] = (Math.random() - 0.5) * (viewport.width * 2)
    particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * (viewport.height * 2)
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
    }
  })

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00ff00" size={0.005} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  )
}

function FloatingCubes() {
  const cubes = useRef(null)

  useFrame((state) => {
    if (cubes.current) {
      cubes.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      cubes.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={cubes}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Box key={i} position={[Math.sin(i * 0.5) * 8, Math.cos(i * 0.3) * 6, Math.sin(i * 0.2) * 10]} scale={0.3}>
          <meshStandardMaterial color="#00ff00" transparent opacity={0.3} wireframe />
        </Box>
      ))}
    </group>
  )
}

function Preloader() {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="preloader">
      <div className="preloader-content">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="loading-spinner"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="loading-text"
        >
          Initializing AI System...
        </motion.p>
      </div>
    </motion.div>
  )
}

function VideoGallery({ videos }) {
  return (
    <section className="video-gallery-section">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="video-gallery-container"
      >
        <h2 className="video-gallery-title">AI Generated Content</h2>
        <div className="video-grid">
          {videos.map((video, index) => (
            <motion.div
              key={video.key || index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="video-card"
            >
              <div className="video-card-inner">
                <div className="video-thumbnail">
                  <video
                    src={video.url}
                    className="video-preview"
                    width={250}
                    height={140}
                    muted
                    loop
                    autoPlay
                    playsInline
                    poster="/placeholder.svg?height=140&width=250"
                  />
                </div>
                <div className="video-info">
                  <h3 className="video-title">
                    {video.key?.split("/").pop()?.replace(/\.[^/.]+$/, "") || `AI Video #${index + 1}`}
                  </h3>
                  <p className="video-description">
                    {video.status ? video.status.toUpperCase() : "Pending Review"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default function HomePage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const containerRef = useRef(null)

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -500])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos")
        if (!res.ok) throw new Error("Failed to fetch videos")
        const data = await res.json()
        setVideos(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div ref={containerRef} className="main-container">
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>

      <div className="canvas-background">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} />
          <ParticleField />
          <FloatingCubes />
        </Canvas>
      </div>

      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="header"
      >
        <motion.h1 whileHover={{ scale: 1.1, textShadow: "0 0 20px #00ff00" }} className="logo">
          AI.CONTENT
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00ff0050" }}
          whileTap={{ scale: 0.95 }}
          className="header-button"
        >
          Холбогдох
        </motion.button>
      </motion.header>

      <motion.section style={{ y: y1, opacity }} className="hero-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-content"
        >
          <motion.h1
            className="hero-title"
            animate={{
              textShadow: ["0 0 20px #00ff00", "0 0 40px #00ff00", "0 0 20px #00ff00"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Хиймэл оюун ухаан
            <br />
            <span className="hero-subtitle">урласан контент</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="hero-description"
          >
            Контентыг хурдан хугацаанд зардал багатайгаар
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="cta-buttons"
        >
          <Link href="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px #00ff0080",
                backgroundColor: "#00ff0020",
              }}
              whileTap={{ scale: 0.95 }}
              className="cta-button-primary"
            >
              Бүртгүүлэх
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px #00ff0080",
              }}
              whileTap={{ scale: 0.95 }}
              className="cta-button-secondary"
            >
              Нэвтрэх
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="ai-logos"
        >
          {[
            { icon: Brain, label: "Neural AI" },
            { icon: Zap, label: "Fast Gen" },
            { icon: Sparkles, label: "Creative AI" },
          ].map((item, index) => (
            <motion.div key={index} whileHover={{ scale: 1.1, y: -5 }} className="ai-logo-item">
              <item.icon className="ai-logo-icon" />
              <span className="ai-logo-text">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="scroll-indicator"
        >
          <ChevronDown className="scroll-icon" />
        </motion.div>
      </motion.section>

      <motion.section style={{ y: y2 }} className="features-section">
        <div className="features-container">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="features-title"
          >
            AI Powered Features
          </motion.h2>

          <div className="features-grid">
            {[
              {
                title: "Video Generation",
                description: "Create stunning videos with AI",
                icon: Play,
              },
              {
                title: "Smart Editing",
                description: "Automated content optimization",
                icon: Zap,
              },
              {
                title: "Neural Processing",
                description: "Advanced AI algorithms",
                icon: Brain,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="feature-card"
              >
                <feature.icon className="feature-icon" />
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <VideoGallery videos={videos} />

      <footer className="footer">
        <div className="footer-content">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="footer-title">
            Powered by Advanced AI
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="footer-text"
          >
            © 2025 Multimedia Entertainment LLC. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  )
}
