import { usePage } from "@inertiajs/react"
import React from "react"
import { toast } from "sonner"

const FlashToast = () => {
  const { flash } = usePage<{ flash: { success: string, error: string } }>().props

  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  return null
}

export default React.memo(FlashToast)
