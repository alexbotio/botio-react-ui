import React from "react"
import { Input } from "@/components/ui/input"
import { Loader2, Search, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useDebounce, useLocation, useSearchParam } from "react-use"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DataSearchInputProps {
  placeholder?: string | null
  only?: string[]
  minLength?: number
  debounceTime?: number
  className?: string
  inputClassName?: string
  onSearch?: (_value: string | undefined) => void
  onClear?: () => void
  disabled?: boolean
  autoFocus?: boolean
}

function DataSearchInput({
  placeholder = "Buscar...",
  only = [],
  minLength = 2,
  debounceTime = 500,
  className,
  inputClassName,
  onSearch,
  onClear,
  disabled = false,
  autoFocus = false
}: DataSearchInputProps) {
  const uid = React.useId()
  const [isSearching, setIsSearching] = React.useState(false)
  const search = useSearchParam("search")
  const [searchValue, setSearchValue] = React.useState(search || undefined)
  const location = useLocation()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [, cancel] = useDebounce(() => {
    const currentQuery = new URLSearchParams(location.search)
    const query = Object.fromEntries(currentQuery.entries())
    query.search = searchValue || ""

    if (!isSearching) {
      return
    }

    if (!searchValue) {
      delete query.search
    }

    router.get(window.location.pathname as string, query, {
      preserveState: true,
      replace: true,
      only,
      onFinish: () => {
        setIsSearching(false)
        onSearch?.(searchValue)
      },
    })
  }, debounceTime, [searchValue])

  const handleSearch = React.useCallback((value: string) => {
    setSearchValue(value)

    if (!value || value.length < minLength) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)
  }, [minLength])

  const handleClear = React.useCallback(() => {
    setIsSearching(true)
    setSearchValue(undefined)
    cancel()
    onClear?.()
  }, [cancel, onClear])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && searchValue) {
      handleClear()
    }
  }, [searchValue, handleClear])

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={cn("relative", className)}>
      <Label
        htmlFor={uid}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2",
          disabled && "opacity-50"
        )}
      >
        {isSearching ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="size-4" aria-hidden="true" />
        )}
      </Label>
      <Input
        ref={inputRef}
        id={uid}
        type="text"
        placeholder={placeholder || ""}
        className={cn(
          "w-full pl-8",
          inputClassName
        )}
        autoComplete="off"
        value={searchValue ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={placeholder || "Campo de búsqueda"}
        aria-busy={isSearching}
      />
      <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchValue && searchValue.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Limpiar búsqueda"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}

export { type DataSearchInputProps, DataSearchInput }
