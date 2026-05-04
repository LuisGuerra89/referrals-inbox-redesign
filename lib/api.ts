import type { Referral, FilterState, PaginatedResponse, SortColumn, SortOrder } from './types'
import { mockReferrals } from './mock-data'

// Simulates server-side filtering, sorting, and pagination
// In production, this would be an API call to your ASP.NET backend
export async function fetchReferrals(filters: FilterState): Promise<PaginatedResponse<Referral>> {
  // Simulate network latency (300-600ms)
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300))

  let filtered = [...mockReferrals]

  // Filter by search (case-insensitive - simulates PostgreSQL ILIKE)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(r =>
      r.patientName.toLowerCase().includes(searchLower) ||
      r.referringDoctor.toLowerCase().includes(searchLower) ||
      r.department.toLowerCase().includes(searchLower) ||
      r.subject.toLowerCase().includes(searchLower) ||
      r.id.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter(r => r.status === filters.status)
  }

  // Sort (simulates ORDER BY in SQL)
  filtered = sortReferrals(filtered, filters.sortColumn, filters.sortOrder)

  // Calculate pagination (simulates Skip/Take in Entity Framework)
  const total = filtered.length
  const totalPages = Math.ceil(total / filters.pageSize)
  const startIndex = (filters.page - 1) * filters.pageSize
  const data = filtered.slice(startIndex, startIndex + filters.pageSize)

  return {
    data,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages
  }
}

function sortReferrals(referrals: Referral[], column: SortColumn, order: SortOrder): Referral[] {
  return referrals.sort((a, b) => {
    let comparison = 0

    switch (column) {
      case 'patientName':
        comparison = a.patientName.localeCompare(b.patientName)
        break
      case 'referringDoctor':
        comparison = a.referringDoctor.localeCompare(b.referringDoctor)
        break
      case 'department':
        comparison = a.department.localeCompare(b.department)
        break
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'status': {
        const statusOrder = { urgent: 0, pending: 1, reviewed: 2, scheduled: 3 }
        comparison = statusOrder[a.status] - statusOrder[b.status]
        break
      }
      case 'priority': {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      }
    }

    return order === 'asc' ? comparison : -comparison
  })
}

// Simulates updating a referral's read status
export async function markAsRead(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100))
  const referral = mockReferrals.find(r => r.id === id)
  if (referral) {
    referral.isRead = true
  }
}

// Simulates toggling star status
export async function toggleStar(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100))
  const referral = mockReferrals.find(r => r.id === id)
  if (referral) {
    referral.isStarred = !referral.isStarred
    return referral.isStarred
  }
  return false
}

// Simulates updating referral status
export async function updateStatus(id: string, status: 'reviewed' | 'scheduled' | 'pending' | 'urgent'): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 150))
  const referral = mockReferrals.find(r => r.id === id)
  if (referral) {
    referral.status = status
  }
}

// Simulates archiving referrals
export async function archiveReferrals(ids: string[]): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200))
  // In real app, this would move referrals to archive
  console.log('[v0] Archived referrals:', ids)
}

// Simulates deleting referrals
export async function deleteReferrals(ids: string[]): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200))
  // In real app, this would soft delete referrals
  ids.forEach(id => {
    const index = mockReferrals.findIndex(r => r.id === id)
    if (index !== -1) {
      mockReferrals.splice(index, 1)
    }
  })
}
