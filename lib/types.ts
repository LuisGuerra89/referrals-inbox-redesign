export type ReferralStatus = 'pending' | 'urgent' | 'reviewed' | 'scheduled'

export type ReferralPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Referral {
  id: string
  patientName: string
  patientId: string
  referringDoctor: string
  department: string
  subject: string
  preview: string
  status: ReferralStatus
  priority: ReferralPriority
  createdAt: Date
  isRead: boolean
  isStarred: boolean
  attachments: number
}

export type SortColumn = 'patientName' | 'referringDoctor' | 'department' | 'createdAt' | 'status' | 'priority'
export type SortOrder = 'asc' | 'desc'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FilterState {
  search: string
  status: ReferralStatus | 'all'
  sortColumn: SortColumn
  sortOrder: SortOrder
  page: number
  pageSize: number
}
