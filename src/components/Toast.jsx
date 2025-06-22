"use client"

import { useState, useEffect } from "react"

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300)
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle text-green-600"
      case "error":
        return "fas fa-exclamation-circle text-red-600"
      case "warning":
        return "fas fa-exclamation-triangle text-yellow-600"
      default:
        return "fas fa-info-circle text-brand-medium-blue"
    }
  }

  return (
    <div className={`toast ${isClosing ? "closing" : ""}`}>
      <div className="flex items-center p-4 bg-white rounded-lg shadow-lg border-l-4 border-brand-medium-blue">
        <i className={`${getIcon()} mr-3`}></i>
        <div>
          <h4 className="font-medium">Welcome to BusTrack</h4>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <button onClick={handleClose} className="ml-4 text-gray-400 hover:text-gray-600">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default Toast
