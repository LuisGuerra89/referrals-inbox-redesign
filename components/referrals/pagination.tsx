'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  isLoading
}: PaginationProps) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
      <div className="text-sm text-muted-foreground">
        {total > 0 ? (
          <span>
            Showing <span className="font-medium text-foreground">{start}</span> to{' '}
            <span className="font-medium text-foreground">{end}</span> of{' '}
            <span className="font-medium text-foreground">{total}</span> referrals
          </span>
        ) : (
          <span>No referrals</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        <div className="flex items-center gap-1">
          {generatePageNumbers(page, totalPages).map((pageNum, idx) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'ghost'}
                size="sm"
                className="w-9"
                onClick={() => onPageChange(pageNum as number)}
                disabled={isLoading}
              >
                {pageNum}
              </Button>
            )
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  
  // Always show first page
  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  // Show pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }

  if (current < total - 2) {
    pages.push('...')
  }

  // Always show last page
  if (!pages.includes(total)) {
    pages.push(total)
  }

  return pages
}
