import type { Referral, ReferralStatus, ReferralPriority } from './types'

const patientNames = [
  'James Wilson', 'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim',
  'Lisa Thompson', 'Robert Garcia', 'Jennifer Lee', 'William Brown', 'Maria Martinez',
  'Christopher Davis', 'Amanda White', 'Daniel Harris', 'Michelle Clark', 'Matthew Lewis',
  'Ashley Walker', 'Joshua Hall', 'Stephanie Allen', 'Andrew Young', 'Nicole King',
  'Ryan Wright', 'Elizabeth Scott', 'Justin Green', 'Rachel Adams', 'Brandon Baker',
  'Megan Nelson', 'Kevin Hill', 'Samantha Moore', 'Tyler Jackson', 'Lauren Martin'
]

const doctors = [
  'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones',
  'Dr. Miller', 'Dr. Davis', 'Dr. Wilson', 'Dr. Taylor', 'Dr. Anderson',
  'Dr. Thomas', 'Dr. Moore', 'Dr. Jackson', 'Dr. White', 'Dr. Harris'
]

const departments = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Gastroenterology',
  'Pulmonology', 'Endocrinology', 'Rheumatology', 'Nephrology', 'Dermatology'
]

const subjects = [
  'Urgent Consultation Required',
  'Follow-up Appointment Needed',
  'Initial Assessment Request',
  'Second Opinion Requested',
  'Post-Surgery Evaluation',
  'Diagnostic Test Results Review',
  'Treatment Plan Discussion',
  'Medication Adjustment Needed',
  'Specialist Referral',
  'Emergency Consultation'
]

const previews = [
  'Patient presenting with persistent symptoms that require specialist evaluation. Previous treatments have shown limited efficacy...',
  'Requesting urgent review of recent diagnostic imaging results. Abnormalities detected that may require immediate intervention...',
  'Follow-up consultation needed to assess treatment progress. Patient reports improvement but still experiencing intermittent...',
  'New patient referral for comprehensive evaluation. Medical history includes multiple comorbidities that require careful...',
  'Post-operative assessment required. Patient recovering well but some concerns about healing progress...',
  'Laboratory results indicate potential abnormalities. Requesting specialist interpretation and recommendations for...',
  'Patient experiencing new symptoms since last visit. Changes in condition may require adjustment to current treatment...',
  'Chronic condition management review. Patient has been stable but recent developments suggest need for reassessment...',
  'Pre-surgical consultation for planned procedure. Patient has complex medical history requiring careful preoperative...',
  'Urgent evaluation needed for acute presentation. Symptoms developed rapidly over the past 48 hours...'
]

const statuses: ReferralStatus[] = ['pending', 'urgent', 'reviewed', 'scheduled']
const priorities: ReferralPriority[] = ['low', 'medium', 'high', 'critical']

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateReferral(index: number): Referral {
  const createdAt = new Date()
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))
  createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

  const status = randomElement(statuses)
  const priority = status === 'urgent' ? randomElement(['high', 'critical'] as ReferralPriority[]) : randomElement(priorities)

  return {
    id: `REF-${String(1000 + index).padStart(5, '0')}`,
    patientName: randomElement(patientNames),
    patientId: `PAT-${String(Math.floor(Math.random() * 90000) + 10000)}`,
    referringDoctor: randomElement(doctors),
    department: randomElement(departments),
    subject: randomElement(subjects),
    preview: randomElement(previews),
    status,
    priority,
    createdAt,
    isRead: Math.random() > 0.4,
    isStarred: Math.random() > 0.8,
    attachments: Math.floor(Math.random() * 4)
  }
}

// Generate 150 mock referrals
export const mockReferrals: Referral[] = Array.from({ length: 150 }, (_, i) => generateReferral(i))
