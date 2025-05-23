// Simple encryption/decryption functions
// In a real app, you would use a proper encryption library
export function encryptData(data: string): string {
  // This is a very basic mock encryption - not secure for production
  try {
    return btoa(data)
  } catch (error) {
    console.error("Encryption error:", error)
    return data
  }
}

export function decryptData(encryptedData: string): string {
  // This is a very basic mock decryption - not secure for production
  try {
    return atob(encryptedData)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

export function preventScreenCapture() {
  // This is a more comprehensive version for screenshot prevention

  // Prevent right-click
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    return false
  })

  // Prevent keyboard shortcuts for screenshots
  document.addEventListener("keydown", (e) => {
    // Prevent Print Screen
    if (e.key === "PrintScreen") {
      e.preventDefault()
      return false
    }

    // Prevent Ctrl+P (Print)
    if (e.ctrlKey && e.key === "p") {
      e.preventDefault()
      return false
    }

    // Prevent Ctrl+Shift+S (Save As)
    if (e.ctrlKey && e.shiftKey && e.key === "s") {
      e.preventDefault()
      return false
    }

    // Prevent Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === "i") {
      e.preventDefault()
      return false
    }

    // Prevent F12 (Developer Tools)
    if (e.key === "F12") {
      e.preventDefault()
      return false
    }

    return true
  })

  // Add CSS to prevent selection
  const style = document.createElement("style")
  style.textContent = `
    .prevent-select {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    body {
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `
  document.head.appendChild(style)

  // Add class to sensitive elements
  document.querySelectorAll(".card-details, .card-display").forEach((el) => {
    el.classList.add("prevent-select")
  })

  // Detect and prevent screen capture API
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia = () =>
      new Promise((_, reject) => {
        reject(new Error("Screen capture is disabled for security reasons."))
      })
  }
}
