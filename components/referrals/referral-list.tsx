'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  Paperclip, 
  ChevronUp, 
  ChevronDown,
  Archive,
  Trash2,
  Tag,
  MoreHorizontal
} from 'lucide-react'
import type { Referral, SortColumn, SortOrder } from '@/lib/types'
import { formatDistanceToNow } from '@/lib/date-utils'

interface ReferralListProps {
  referrals: Referral[]
  selectedIds: Set<string>
  onSelectChange: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onStarToggle: (id: string) => void
  onReferralClick: (referral: Referral) => void
  sortColumn: SortColumn
  sortOrder: SortOrder
  onSort: (column: SortColumn) => void
  isLoading: boolean
}

const statusColors = {
  pending: 'bg-status-pending/20 text-status-pending border-status-pending/30',
  urgent: 'bg-status-urgent/20 text-status-urgent border-status-urgent/30',
  reviewed: 'bg-status-reviewed/20 text-status-reviewed border-status-reviewed/30',
  scheduled: 'bg-status-scheduled/20 text-status-scheduled border-status-scheduled/30',
}

const priorityLabels = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
  critical: 'Critical'
}

function SortIndicator({ column, currentColumn, order }: { 
  column: SortColumn
  currentColumn: SortColumn
  order: SortOrder
}) {
  if (column !== currentColumn) {
    return <ChevronUp className="size-4 opacity-0 group-hover:opacity-30" />
  }
  return order === 'asc' 
    ? <ChevronUp className="size-4 text-primary" />
    : <ChevronDown className="size-4 text-primary" />
}

export function ReferralList({
  referrals,
  selectedIds,
  onSelectChange,
  onSelectAll,
  onStarToggle,
  onReferralClick,
  sortColumn,
  sortOrder,
  onSort,
  isLoading
}: ReferralListProps) {
  const allSelected = referrals.length > 0 && selectedIds.size === referrals.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < referrals.length

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card px-4 py-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          aria-label="Select all"
          className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
        />
        
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-1 ml-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Archive className="size-4" />
              <span className="hidden sm:inline ml-1">Archive</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Trash2 className="size-4" />
              <span className="hidden sm:inline ml-1">Delete</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Tag className="size-4" />
              <span className="hidden sm:inline ml-1">Label</span>
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 ml-2 text-xs text-muted-foreground">
            <button
              onClick={() => onSort('createdAt')}
              className="group flex items-center gap-1 px-2 py-1 hover:bg-secondary rounded transition-colors"
            >
              Date
              <SortIndicator column="createdAt" currentColumn={sortColumn} order={sortOrder} />
            </button>
            <button
              onClick={() => onSort('patientName')}
              className="group flex items-center gap-1 px-2 py-1 hover:bg-secondary rounded transition-colors"
            >
              Patient
              <SortIndicator column="patientName" currentColumn={sortColumn} order={sortOrder} />
            </button>
            <button
              onClick={() => onSort('department')}
              className="group flex items-center gap-1 px-2 py-1 hover:bg-secondary rounded transition-colors hidden sm:flex"
            >
              Dept
              <SortIndicator column="department" currentColumn={sortColumn} order={sortOrder} />
            </button>
            <button
              onClick={() => onSort('priority')}
              className="group flex items-center gap-1 px-2 py-1 hover:bg-secondary rounded transition-colors"
            >
              Priority
              <SortIndicator column="priority" currentColumn={sortColumn} order={sortOrder} />
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <p className="text-lg font-medium">No referrals found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {referrals.map((referral) => (
              <ReferralRow
                key={referral.id}
                referral={referral}
                isSelected={selectedIds.has(referral.id)}
                onSelectChange={onSelectChange}
                onStarToggle={onStarToggle}
                onClick={() => onReferralClick(referral)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReferralRow({
  referral,
  isSelected,
  onSelectChange,
  onStarToggle,
  onClick
}: {
  referral: Referral
  isSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  onStarToggle: (id: string) => void
  onClick: () => void
}) {
  return (
    <div
      className={`
        group flex items-start gap-2 px-4 py-3 cursor-pointer transition-colors
        ${isSelected ? 'bg-primary/5' : 'hover:bg-secondary/50'}
        ${!referral.isRead ? 'bg-card' : ''}
      `}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div 
        className="pt-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectChange(referral.id, checked as boolean)}
          aria-label={`Select ${referral.patientName}`}
        />
      </div>

      {/* Star */}
      <button
        className="pt-0.5 text-muted-foreground hover:text-status-pending transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          onStarToggle(referral.id)
        }}
        aria-label={referral.isStarred ? 'Unstar' : 'Star'}
      >
        <Star 
          className={`size-5 ${referral.isStarred ? 'fill-status-pending text-status-pending' : ''}`} 
        />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {/* Patient name */}
          <span className={`font-medium truncate ${!referral.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
            {referral.patientName}
          </span>
          
          {/* Priority badge for high/critical */}
          {(referral.priority === 'high' || referral.priority === 'critical') && (
            <Badge 
              variant="outline" 
              className={`text-[10px] px-1.5 py-0 ${
                referral.priority === 'critical' ? 'border-status-urgent text-status-urgent' : 'border-status-pending text-status-pending'
              }`}
            >
              {priorityLabels[referral.priority]}
            </Badge>
          )}
        </div>

        {/* Subject line */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-sm truncate ${!referral.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            {referral.subject}
          </span>
        </div>

        {/* Preview */}
        <p className="text-sm text-muted-foreground truncate">
          {referral.preview}
        </p>

        {/* Tags row */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <Badge 
            variant="outline" 
            className={`text-[10px] ${statusColors[referral.status]}`}
          >
            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {referral.department}
          </span>
          <span className="text-xs text-muted-foreground">
            • {referral.referringDoctor}
          </span>
        </div>
      </div>

      {/* Right side info */}
      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
        <span className={!referral.isRead ? 'font-medium text-foreground' : ''}>
          {formatDistanceToNow(referral.createdAt)}
        </span>
        {referral.attachments > 0 && (
          <div className="flex items-center gap-1">
            <Paperclip className="size-3" />
            <span>{referral.attachments}</span>
          </div>
        )}
      </div>
    </div>
  )
}
