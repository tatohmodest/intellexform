# Intellex Early Access Platform

A full Next.js 14 registration platform for Intellex - with dynamic PDF invoice generation, curriculum guide, and animated registration flow.

## What's included

- **Landing page** (`/`) - Early access hero, stats, program showcase, and CTA
- **Registration page** (`/register`) - Full animated form with validation
- **Dynamic Invoice PDF** - Auto-filled with the registrant's form data, program, and payment details
- **Curriculum PDF** - 8-page program guide covering all programs, pricing, learning modes, and enrollment steps
- **11 programs** pre-configured (6 full programs + 5 modules)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Hook Form + Zod (form validation)
- @react-pdf/renderer (PDF generation)
- Lucide React (icons)

## Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
npm start
```

## Customization

### Update payment details
Edit `components/InvoicePDF.tsx` - search for the payment section (lines with MTN/Orange).

### Change program prices or content
Edit `lib/programs.ts` - all programs, prices, curricula, and registration fees are here.

### Update contact info / WhatsApp
Search for `650318856` or `wa.me` across the codebase to update the WhatsApp number.

### Change registration fee
In `lib/programs.ts`, update `registrationFee` for each program:
- Full programs: currently `10000` XAF
- Module programs: currently `5000` XAF

## File Structure

```
intellex-early-access/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── globals.css         # Global styles, fonts, Tailwind
│   ├── page.tsx            # Landing page (/)
│   └── register/
│       └── page.tsx        # Registration page (/register)
├── components/
│   ├── RegistrationForm.tsx    # Full form with program/mode selection
│   ├── InvoicePDF.tsx          # Invoice PDF document (react-pdf)
│   └── CurriculumPDF.tsx       # 8-page curriculum guide (react-pdf)
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   └── programs.ts         # All program data + learning modes
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## Notes

- The PDF generation happens entirely on the client side (no server required).
- `@react-pdf/renderer` is imported dynamically with `ssr: false` to avoid SSR issues with Next.js.
- All payment details (MTN: 674435138, Orange: 686705607, MODESTE TATOH) are embedded in the invoice PDF automatically.
- The WhatsApp link in the success view sends users directly to `+237 650318856`.

## Deploying

Deploy to [Vercel](https://vercel.com) in one command:
```bash
npx vercel
```

Or push to GitHub and connect to Vercel - it auto-detects Next.js.
