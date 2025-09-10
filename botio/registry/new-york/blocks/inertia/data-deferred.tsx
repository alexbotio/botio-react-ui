import React from "react"
import { Deferred } from "@inertiajs/react"
import { Loader2 } from "lucide-react"

type DataDeferredProps = Omit<React.ComponentProps<typeof Deferred>, "fallback"> & {
    fallback?: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
}

function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-md p-4">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm">Cargando datos...</p>
    </div>
  )
}

export default function DataDeferred({ ...props }: DataDeferredProps) {
  return <Deferred fallback={props.fallback ?? <Loading />} {...props} />
}
