'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminSubscriptions() {
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [priceXAF, setPriceXAF] = useState<number | undefined>(undefined)
  const [transactionId, setTransactionId] = useState<string | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setResult(null)
    if (!email && !userId) {
      setError('Provide an email or a userId')
      return
    }

    setBusy(true)
    try {
      const body: Record<string, unknown> = { plan }
      if (email) body.email = email.trim().toLowerCase()
      if (userId) body.userId = userId.trim()
      if (typeof priceXAF === 'number') body.priceXAF = Math.max(0, Math.round(priceXAF))
      if (transactionId) body.transactionId = transactionId.trim()

      const res = await fetch('/api/admin/subscriptions/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to grant subscription')
        setBusy(false)
        return
      }
      setResult(data.subscription || data)
      setEmail('')
      setUserId('')
      setPriceXAF(undefined)
      setTransactionId(undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wrap">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Grant subscription</h1>
          <p className="mt-1 text-sm text-[#5b6778]">Give a learner immediate Intellex access (monthly or yearly).</p>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 max-w-xl">
        <div className="mb-3">
          <label className="text-xs font-semibold text-[#5b6778]">Learner email</label>
          <input className="form-input mt-1 w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
          <div className="text-xs text-[#9aa7b2] mt-1">Or provide userId below. Email lookup requires the learner to exist in the MongoDB learners collection.</div>
        </div>

        <div className="mb-3">
          <label className="text-xs font-semibold text-[#5b6778]">Learner userId (lbId)</label>
          <input className="form-input mt-1 w-full" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="lb_..." />
        </div>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#5b6778]">Plan</label>
            <select className="form-input mt-1 w-full" value={plan} onChange={(e) => setPlan(e.target.value as any)}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#5b6778]">Price (XAF, optional)</label>
            <input type="number" className="form-input mt-1 w-full" value={priceXAF ?? ''} onChange={(e) => setPriceXAF(e.target.value ? Number(e.target.value) : undefined)} placeholder="1999" />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-[#5b6778]">Transaction ID (optional)</label>
          <input className="form-input mt-1 w-full" value={transactionId ?? ''} onChange={(e) => setTransactionId(e.target.value)} placeholder="optional transaction id" />
        </div>

        {error ? <div className="mb-3 rounded px-3 py-2 text-sm text-red-600" style={{ background: 'rgba(220,38,38,0.06)' }}>{error}</div> : null}
        {result ? (
          <div className="mb-3 rounded px-3 py-2 text-sm" style={{ background: 'rgba(0,179,105,0.06)', color: '#007a4f' }}>
            Subscription granted — ends at: {(result.endsAt && new Date(result.endsAt).toLocaleString()) || 'unknown'}
            <div className="mt-1 text-xs text-[#5b6778]">Subscription id: {result.id || ''}</div>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : null} {busy ? 'Granting…' : 'Grant subscription'}
          </button>
          <button type="button" className="btn" onClick={() => { setEmail(''); setUserId(''); setPriceXAF(undefined); setTransactionId(undefined); setError(null); setResult(null); }}>
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}
