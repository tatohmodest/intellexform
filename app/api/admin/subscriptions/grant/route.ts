import { NextRequest, NextResponse } from 'next/server'
import { assertAdmin } from '@/lib/adminAuth'
import { getDb } from '@/lib/repo'
import { activateCertSubscription } from '@/lib/learn/certSubscription'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Admin-only
  try {
    if (!assertAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const userId = typeof body.userId === 'string' ? body.userId.trim() : ''
    const plan = body.plan === 'yearly' ? 'yearly' : 'monthly'
    const priceXAF = typeof body.priceXAF === 'number' ? Math.max(0, Math.round(body.priceXAF)) : undefined
    const transactionId = typeof body.transactionId === 'string' ? body.transactionId.trim() : undefined

    if (!userId && !email) {
      return NextResponse.json({ error: 'userId or email required' }, { status: 400 })
    }

    // Resolve learner lbId from Mongo learners collection when only email provided
    let resolvedUserId = userId || ''
    if (!resolvedUserId && email) {
      try {
        const db = await getDb()
        const learner = await db.collection('learners').findOne({ email }, { projection: { lbId: 1 } })
        if (learner && learner.lbId) {
          resolvedUserId = String(learner.lbId)
        }
      } catch (err) {
        console.error('admin/subscriptions/grant: lookup learner failed', err)
      }
    }

    if (!resolvedUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Activate cert subscription
    try {
      const sub = await activateCertSubscription({
        userId: resolvedUserId,
        plan: plan as 'monthly' | 'yearly',
        priceXAF: priceXAF ?? 0,
        transactionId: transactionId ?? null,
      })

      return NextResponse.json({ ok: true, subscription: sub })
    } catch (err) {
      console.error('admin/subscriptions/grant: activate failed', err)
      return NextResponse.json({ error: 'Could not activate subscription' }, { status: 500 })
    }
  } catch (err) {
    console.error('admin/subscriptions/grant unexpected', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
