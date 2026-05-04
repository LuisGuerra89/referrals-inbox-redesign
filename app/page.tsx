import { Suspense } from 'react'
import { ReferralsApp } from '@/components/referrals/referrals-app'

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReferralsApp />
    </Suspense>
  )
}

function LoadingState() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading referrals...</p>
      </div>
    </div>
  )
}
