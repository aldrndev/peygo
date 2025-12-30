"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { INDONESIAN_BANKS } from "@/lib/constants/banks"

interface BankComboboxProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function BankCombobox({
  value,
  onValueChange,
  placeholder = "Pilih Bank...",
}: BankComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filteredBanks = React.useMemo(() => {
    if (!search) return INDONESIAN_BANKS
    const q = search.toLowerCase()
    return INDONESIAN_BANKS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)
    )
  }, [search])

  const selectedBank = INDONESIAN_BANKS.find((b) => b.name === value)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="w-full justify-between h-12 font-normal bg-background px-3"
      >
        <div className="flex items-center gap-2 truncate">
          <Landmark className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {selectedBank?.name || placeholder}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {open && (
        <div className="absolute top-[calc(100%+4px)] h-48 overflow-y-auto left-0 w-full z-50 rounded-lg border bg-popover text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95">
          <div className="flex flex-col h-full max-h-[300px]">
            <div className="p-2 border-b bg-background sticky top-0 z-10 rounded-t-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                  placeholder="Cari bank..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 bg-popover rounded-b-lg">
              {filteredBanks.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Bank tidak ditemukan.
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      type="button"
                      onClick={() => {
                        onValueChange(bank.name)
                        setOpen(false)
                        setSearch("")
                      }}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                        value === bank.name && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className={cn("mr-2 flex h-4 w-4 items-center justify-center shrink-0", 
                        value === bank.name ? "opacity-100" : "opacity-0"
                      )}>
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="truncate">{bank.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
