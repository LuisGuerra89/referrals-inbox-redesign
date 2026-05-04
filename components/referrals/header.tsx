'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, RefreshCw, Settings, Menu, HelpCircle, Bell } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useEffect, useState } from 'react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  isLoading: boolean
  onMenuToggle: () => void
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  onRefresh, 
  isLoading,
  onMenuToggle 
}: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [debouncedSearch] = useDebounce(localSearch, 400) // 400ms debounce

  // Update parent when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  // Sync local state when external searchQuery changes (e.g., from URL)
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">BH</span>
          </div>
          <span className="hidden text-lg font-semibold text-foreground sm:inline">
            Bloomsbury Health
          </span>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search referrals by patient, doctor, department, or ID..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="h-10 pl-10 pr-4 bg-secondary/50 border-transparent focus-visible:border-primary focus-visible:bg-card"
        />
        {localSearch !== debouncedSearch && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`size-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          <HelpCircle className="size-5" />
          <span className="sr-only">Help</span>
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          <Settings className="size-5" />
          <span className="sr-only">Settings</span>
        </Button>

        <div className="ml-2 flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <span className="text-sm font-medium">AC</span>
        </div>
      </div>
    </header>
  )
}
