'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Star, 
  Reply, 
  Forward, 
  MoreHorizontal,
  Paperclip,
  User,
  Building2,
  Calendar,
  FileText
} from 'lucide-react'
import type { Referral } from '@/lib/types'
import { formatDate } from '@/lib/date-utils'

interface DetailPanelProps {
  referral: Referral | null
  onClose: () => void
  onStarToggle: (id: string) => void
}

const statusColors = {
  pending: 'bg-status-pending/20 text-status-pending border-status-pending/30',
  urgent: 'bg-status-urgent/20 text-status-urgent border-status-urgent/30',
  reviewed: 'bg-status-reviewed/20 text-status-reviewed border-status-reviewed/30',
  scheduled: 'bg-status-scheduled/20 text-status-scheduled border-status-scheduled/30',
}

const priorityColors = {
  low: 'text-muted-foreground',
  medium: 'text-foreground',
  high: 'text-status-pending',
  critical: 'text-status-urgent font-medium'
}

export function DetailPanel({ referral, onClose, onStarToggle }: DetailPanelProps) {
  if (!referral) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full bg-card border-l border-border text-muted-foreground">
        <FileText className="size-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Select a referral</p>
        <p className="text-sm">Click on a referral to view details</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Button>
          <Badge variant="outline" className={statusColors[referral.status]}>
            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onStarToggle(referral.id)}
          >
            <Star className={`size-5 ${referral.isStarred ? 'fill-status-pending text-status-pending' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Reply className="size-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Forward className="size-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Subject */}
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {referral.subject}
        </h2>

        {/* Meta info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <User className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Patient:</span>
            <span className="font-medium">{referral.patientName}</span>
            <span className="text-muted-foreground">({referral.patientId})</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <User className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Referring Doctor:</span>
            <span className="font-medium">{referral.referringDoctor}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Department:</span>
            <span className="font-medium">{referral.department}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Received:</span>
            <span>{formatDate(referral.createdAt)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="size-4 shrink-0" />
            <span className="text-muted-foreground">Priority:</span>
            <span className={priorityColors[referral.priority]}>
              {referral.priority.charAt(0).toUpperCase() + referral.priority.slice(1)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Body */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">
            {referral.preview}
          </p>
          <p className="text-foreground leading-relaxed mt-4">
            This referral has been received and is awaiting review. Please assess the patient&apos;s condition 
            and provide your recommendations at your earliest convenience.
          </p>
          <p className="text-foreground leading-relaxed mt-4">
            The patient&apos;s medical history and relevant test results are attached for your reference. 
            If you require any additional information, please contact the referring physician directly.
          </p>
        </div>

        {/* Attachments */}
        {referral.attachments > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Paperclip className="size-4" />
              Attachments ({referral.attachments})
            </h3>
            <div className="space-y-2">
              {Array.from({ length: referral.attachments }).map((_, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <FileText className="size-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {i === 0 ? 'Medical_History.pdf' : i === 1 ? 'Lab_Results.pdf' : `Document_${i + 1}.pdf`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF • {Math.floor(Math.random() * 500 + 100)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Button className="flex-1">
            Mark as Reviewed
          </Button>
          <Button variant="outline" className="flex-1">
            Schedule Appointment
          </Button>
        </div>
      </div>
    </div>
  )
}
