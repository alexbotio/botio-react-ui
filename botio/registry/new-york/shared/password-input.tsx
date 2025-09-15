"use client"

import * as React from "react";
import { Eye, EyeOff, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import usePassword from "@/hooks/use-password"

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  withGenerate?: boolean
  onGenerate?: (_password: string) => void
}

function PasswordInput({ withGenerate = false, onGenerate, ...props }: PasswordInputProps) {
  const { showPassword, setShowPassword, generatePassword } = usePassword()

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <div className="absolute inset-y-0.5 right-0.5 ps-1 bg-background rounded-e-md">
        {withGenerate && (
          <Button
            className="size-8 mr-1"
            type="button"
            variant="ghost"
            onClick={() => {
              onGenerate?.(generatePassword())
            }}
          >
            <Shuffle />
          </Button>
        )}
        <Button
          className="size-8"
          type="button"
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </div>
  )
}

export { PasswordInput }
