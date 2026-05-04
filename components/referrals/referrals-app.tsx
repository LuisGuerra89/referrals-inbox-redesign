'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { ReferralList } from './referral-list'
import { DetailPanel } from './detail-panel'
import { Pagination } from './pagination'
import { fetchReferrals, toggleStar, markAsRead } from '@/lib/api'
import type { Referral, FilterState, SortColumn, ReferralStatus, PaginatedResponse } from '@/lib/types'

const DEFAULT_PAGE_SIZE = 15

export function ReferralsApp() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse URL params for initial state
  const getInitialState = useCallback((): FilterState => ({
    search: searchParams.get('q') || '',
    status: (searchParams.get('status') as ReferralStatus | 'all') || 'all',
    sortColumn: (searchParams.get('sort') as SortColumn) || 'createdAt',
    sortOrder: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    page: parseInt(searchParams.get('page') || '1', 10),
    pageSize: DEFAULT_PAGE_SIZE
  }), [searchParams])

  // State
  const [filters, setFilters] = useState<FilterState>(getInitialState)
  const [data, setData] = useState<PaginatedResponse<Referral> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    urgent: 0,
    reviewed: 0,
    scheduled: 0
  })

  // Update URL when filters change (using history.pushState for bookmarkable URLs)
  const updateUrl = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.search) params.set('q', newFilters.search)
    if (newFilters.status !== 'all') params.set('status', newFilters.status)
    if (newFilters.sortColumn !== 'createdAt') params.set('sort', newFilters.sortColumn)
    if (newFilters.sortOrder !== 'desc') params.set('order', newFilters.sortOrder)
    if (newFilters.page > 1) params.set('page', String(newFilters.page))

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    window.history.pushState(null, '', newUrl)
  }, [pathname])

  // Fetch data
  const loadData = useCallback(async (currentFilters: FilterState, updateCounts = false) => {
    setIsLoading(true)
    try {
      const result = await fetchReferrals(currentFilters)
      setData(result)

      // Update counts (fetch all statuses to get accurate counts)
      if (updateCounts) {
        const [allResult, pendingResult, urgentResult, reviewedResult, scheduledResult] = await Promise.all([
          fetchReferrals({ ...currentFilters, status: 'all', search: '', page: 1, pageSize: 1000 }),
          fetchReferrals({ ...currentFilters, status: 'pending', search: '', page: 1, pageSize: 1000 }),
          fetchReferrals({ ...currentFilters, status: 'urgent', search: '', page: 1, pageSize: 1000 }),
          fetchReferrals({ ...currentFilters, status: 'reviewed', search: '', page: 1, pageSize: 1000 }),
          fetchReferrals({ ...currentFilters, status: 'scheduled', search: '', page: 1, pageSize: 1000 }),
        ])
        setCounts({
          all: allResult.total,
          pending: pendingResult.total,
          urgent: urgentResult.total,
          reviewed: reviewedResult.total,
          scheduled: scheduledResult.total
        })
      }
    } catch (error) {
      console.error('[v0] Failed to fetch referrals:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadData(filters, true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Reload when filters change
  useEffect(() => {
    loadData(filters)
    updateUrl(filters)
  }, [filters, loadData, updateUrl])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const newFilters = getInitialState()
      setFilters(newFilters)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [getInitialState])

  // Filter handlers
  const handleSearchChange = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
    setSelectedReferral(null)
  }, [])

  const handleStatusChange = useCallback((status: ReferralStatus | 'all') => {
    setFilters(prev => ({ ...prev, status, page: 1 }))
    setSelectedReferral(null)
  }, [])

  const handleSort = useCallback((column: SortColumn) => {
    setFilters(prev => ({
      ...prev,
      sortColumn: column,
      sortOrder: prev.sortColumn === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
    setSelectedReferral(null)
  }, [])

  const handleRefresh = useCallback(() => {
    loadData(filters, true)
  }, [filters, loadData])

  // Selection handlers
  const handleSelectChange = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked && data) {
      setSelectedIds(new Set(data.data.map(r => r.id)))
    } else {
      setSelectedIds(new Set())
    }
  }, [data])

  // Star toggle
  const handleStarToggle = useCallback(async (id: string) => {
    await toggleStar(id)
    // Update local data
    setData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        data: prev.data.map(r => 
          r.id === id ? { ...r, isStarred: !r.isStarred } : r
        )
      }
    })
    // Update selected referral if it's the one being toggled
    setSelectedReferral(prev => 
      prev?.id === id ? { ...prev, isStarred: !prev.isStarred } : prev
    )
  }, [])

  // Referral click
  const handleReferralClick = useCallback(async (referral: Referral) => {
    setSelectedReferral(referral)
    
    if (!referral.isRead) {
      await markAsRead(referral.id)
      setData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          data: prev.data.map(r => 
            r.id === referral.id ? { ...r, isRead: true } : r
          )
        }
      })
    }
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedStatus={filters.status}
          onStatusChange={handleStatusChange}
          counts={counts}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex flex-1 overflow-hidden">
          {/* List panel */}
          <div className={`
            flex flex-col flex-1 min-w-0 bg-card
            ${selectedReferral ? 'hidden lg:flex lg:w-1/2 xl:w-2/5' : ''}
          `}>
            <ReferralList
              referrals={data?.data || []}
              selectedIds={selectedIds}
              onSelectChange={handleSelectChange}
              onSelectAll={handleSelectAll}
              onStarToggle={handleStarToggle}
              onReferralClick={handleReferralClick}
              sortColumn={filters.sortColumn}
              sortOrder={filters.sortOrder}
              onSort={handleSort}
              isLoading={isLoading}
            />
            
            {data && data.totalPages > 0 && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                pageSize={data.pageSize}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Detail panel */}
          <div className={`
            ${selectedReferral ? 'flex w-full lg:w-1/2 xl:w-3/5' : 'hidden lg:flex lg:w-1/2 xl:w-3/5'}
          `}>
            <DetailPanel
              referral={selectedReferral}
              onClose={() => setSelectedReferral(null)}
              onStarToggle={handleStarToggle}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
