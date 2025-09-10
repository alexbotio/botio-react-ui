import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { LoaderCircleIcon } from "lucide-react"
import { useLockBodyScroll, useToggle } from "react-use"

interface LoadingScreenProps {
  loading: boolean
  message?: string
  spinnerColor?: string
  backgroundColor?: string
}

export default function LoadingScreen({
  loading,
  message = "Cargando...",
  spinnerColor = "text-primary",
  backgroundColor = "bg-white/90",
}: LoadingScreenProps) {
    const [show, setShow] = useState(false)
  const [locked, toggleLocked] = useToggle(false)

  useLockBodyScroll(locked);

  useEffect(() => {
    toggleLocked(loading)
    const timeout = setTimeout(() => {
      setShow(loading)
    }, 300)
    return () => {
      toggleLocked(false)
      clearTimeout(timeout)
    }
  }, [loading, toggleLocked])

  if (!show) {
    return null
  }

  return createPortal(
    <div
      role="alert"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "fixed top-0 left-0 h-screen w-full",
        backgroundColor,
        "flex flex-col items-center justify-center gap-3",
        "backdrop-blur-sm",
        locked && "animate-in fade-in duration-100",
        !locked && "animate-out fade-out zoom-out duration-300"
      )}
      style={{ zIndex: 9999 }}
    >
      <LoaderCircleIcon className={cn("animate-spin", spinnerColor)} size={32} />
      <p className="text-lg font-medium">{message}</p>
    </div>,
    document.body
  )
}
