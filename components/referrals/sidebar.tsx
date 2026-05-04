'use client'

import { Button } from '@/components/ui/button'
import { 
  Inbox, 
  Star, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  FileText,
  X
} from 'lucide-react'
import type { ReferralStatus } from '@/lib/types'

interface SidebarProps {
  selectedStatus: ReferralStatus | 'all'
  onStatusChange: (status: ReferralStatus | 'all') => void
  counts: {
    all: number
    pending: number
    urgent: number
    reviewed: number
    scheduled: number
  }
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { status: 'all' as const, label: 'All Referrals', icon: Inbox, key: 'all' },
  { status: 'urgent' as const, label: 'Urgent', icon: AlertTriangle, key: 'urgent' },
  { status: 'pending' as const, label: 'Pending Review', icon: Clock, key: 'pending' },
  { status: 'reviewed' as const, label: 'Reviewed', icon: CheckCircle, key: 'reviewed' },
  { status: 'scheduled' as const, label: 'Scheduled', icon: Calendar, key: 'scheduled' },
]

export function Sidebar({ 
  selectedStatus, 
  onStatusChange, 
  counts,
  isOpen,
  onClose
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border 
        transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <span className="font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = selectedStatus === item.status
            const count = counts[item.key as keyof typeof counts]
            
            return (
              <Button
                key={item.status}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`
                  w-full justify-start gap-3 font-normal
                  ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-muted-foreground hover:text-foreground'}
                `}
                onClick={() => {
                  onStatusChange(item.status)
                  onClose()
                }}
              >
                <Icon className={`size-5 ${item.status === 'urgent' ? 'text-status-urgent' : ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  {count}
                </span>
              </Button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FileText className="size-4" />
            <span>Referrals Demo v1.0</span>
          </div>
        </div>
      </aside>
    </>
  )
}
