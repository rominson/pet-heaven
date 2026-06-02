"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  phase: number
  life: number
}

const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0)

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    let isVisible = true

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w
      canvas!.height = h
    }

    function initParticles() {
      const count = w < 768 ? 25 : 50
      const colors = [
        "255, 248, 240",
        "255, 235, 215",
        "232, 196, 160",
        "255, 220, 200",
        "248, 232, 212",
      ]
      const p: Particle[] = []
      for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        p.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 3.5 + 1,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: -Math.random() * 0.25 - 0.05,
          opacity: Math.random() * 0.4 + 0.2,
          phase: Math.random() * Math.PI * 2,
          life: Math.random() * 100 + 50,
        })
        ;(p[i] as any).color = color
      }
      particlesRef.current = p
    }

    function drawParticles() {
      ctx!.clearRect(0, 0, w, h)
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Vertical oscillation
        const drift = Math.sin(p.phase) * 0.3
        p.x += p.speedX + drift * 0.02
        p.y += p.speedY
        p.phase += 0.005

        // Fade in/out gently
        const pulse = 0.6 + 0.4 * Math.sin(p.phase * 0.5)

        // Reset particle when it goes out of bounds
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
          p.life = Math.random() * 100 + 50
        }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10

        // Draw glow dot
        const alpha = p.opacity * pulse
        const color = (p as any).color ?? "232, 196, 160"
        const glowSize = p.size * 3.5

        // Outer glow
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${color}, ${alpha * 0.15})`
        ctx!.fill()

        // Mid glow
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${color}, ${alpha * 0.3})`
        ctx!.fill()

        // Core
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 248, 240, ${alpha * 0.8})`
        ctx!.fill()

        // Bright center
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()
      }
    }

    function animate() {
      if (isVisible) {
        drawParticles()
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    initParticles()
    animate()

    const handleResize = () => {
      resize()
      initParticles()
    }

    const handleVisibility = () => {
      isVisible = !document.hidden
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  // Mouse glow handler
  useEffect(() => {
    if (isTouchDevice) return

    const glow = glowRef.current
    if (!glow) return

    let raf = 0
    let mx = -1000
    let my = -1000

    function updateGlow() {
      glow!.style.setProperty("--mouse-x", `${mx}px`)
      glow!.style.setProperty("--mouse-y", `${my}px`)
    }

    function onMove(e: MouseEvent) {
      mx = e.clientX
      my = e.clientY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateGlow)
    }

    function onLeave() {
      mx = -1000
      my = -1000
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateGlow)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <>
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Mouse-following warm glow */}
      {!isTouchDevice && (
        <div
          ref={glowRef}
          className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            zIndex: 0,
            opacity: 0.5,
            background:
              "radial-gradient(600px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(212, 165, 116, 0.18), rgba(232, 196, 160, 0.08) 40%, transparent 60%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  )
}
