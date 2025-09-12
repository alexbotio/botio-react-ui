import { useState } from "react"

interface UsePasswordReturn {
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
  generatePassword: (length?: number, specialCharacter?: string) => string
}

export default function usePassword(): UsePasswordReturn {
  const [showPassword, setShowPassword] = useState(false)

  function generatePassword(length: number = 12, specialCharacter: string = "!@#$%^&*()_+-=[]{}|;:,.<>?") {
    const charset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789${specialCharacter}`
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  return {
    showPassword,
    setShowPassword,
    generatePassword,
  }
}
