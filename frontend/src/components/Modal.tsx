import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, size = 'max-w-lg', children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`card relative z-10 max-h-[90vh] w-full ${size} overflow-y-auto p-6 shadow-2xl`}>
        {title && <h2 className="mb-5 text-lg font-semibold text-white">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
