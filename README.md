# SpectrumCheck

A free screening tool to help individuals, families, and educators identify signs of Asperger's Syndrome / Autism Spectrum Disorder (ASD).

Built with Next.js 15, Supabase, and Tailwind CSS. Deployed on Vercel.

---

## Features

- Multi-question ASD/Asperger's screening assessment
- Respondent types: self, parent, educator
- Domain-based scoring with visual charts
- Tiered result classification
- Secure per-user data with Supabase Auth + Row-Level Security
- Print-friendly results page

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth & Database | Supabase (PostgreSQL + SSR Auth) |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/niamh8/spectrumcheck.git
cd spectrumcheck
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Both values are found in your Supabase project under **Settings → API**.

### 3. Set up the database

Run the SQL in [`src/lib/supabase/schema.sql`](src/lib/supabase/schema.sql) in the Supabase SQL editor. This creates the `profiles`, `assessments`, `responses`, and `results` tables with Row-Level Security policies.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Home / landing
│   ├── auth/
│   │   ├── login/             # Login page
│   │   └── signup/            # Sign-up page
│   ├── dashboard/             # User dashboard (protected)
│   ├── assessment/
│   │   ├── new/               # Start a new assessment (protected)
│   │   └── [id]/              # Continue an assessment (protected)
│   └── results/[id]/          # View results (protected)
├── components/                # Shared UI components
├── lib/
│   ├── questions.ts           # Assessment question definitions
│   ├── scoring.ts             # Domain scoring logic
│   └── supabase/              # Supabase client, server, and schema
├── types/                     # Shared TypeScript types
└── middleware.ts              # Auth-based route protection
```

## Deployment

The app is deployed via [Vercel](https://vercel.com). Add the environment variables from step 2 in your Vercel project settings under **Settings → Environment Variables**.

## License

Copyright © 2026 St John Lynch & Co. Ltd. All rights reserved.
