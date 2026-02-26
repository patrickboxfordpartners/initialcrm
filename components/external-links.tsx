"use client"

import { useEffect } from "react"

export function ExternalLinks() {
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("/") || href.startsWith("?")) return
      e.preventDefault()
      window.open(href, "_blank", "noopener,noreferrer")
    }
    document.addEventListener("click", handle)
    return () => document.removeEventListener("click", handle)
  }, [])

  return null
}
