# API Keys & Signups Needed

You don't need all of these on day one — sign up as each phase requires it. Listed in the order you'll actually need them.

## Needed from Phase 0 (now)
| Service | Why | Cost to start |
|---|---|---|
| GitHub | Version control, CI/CD trigger | Free |
| Vercel | Frontend hosting | Free tier to start |

## Needed from Phase 9 (Backend Foundation)
| Service | Why | Cost to start |
|---|---|---|
| Neon or Supabase | Managed PostgreSQL | Free tier to start |
| Upstash | Managed Redis | Free tier to start |
| Railway or Render | Backend hosting | Free/low-cost tier to start |

Generate your own values for these — not signups, just random secrets:
- `JWT_ACCESS_SECRET` — long random string (e.g., `openssl rand -base64 64`)
- `JWT_REFRESH_SECRET` — a different long random string

## Needed from Phase 10–11 (Courses & Payments)
| Service | Why | Cost to start |
|---|---|---|
| Cloudflare (R2 + CDN/DDoS) | File storage + CDN | Free tier to start |
| Stripe | Payments (test mode is free) | Free to start, fees only on real transactions |
| Bunny Stream or Mux | Video hosting/streaming | Pay-as-you-go, low cost at small scale |

**Stripe setup note**: create the account, get your test-mode publishable + secret keys first, build and test the whole payment flow in test mode, only switch to live keys right before launch.

## Needed from Phase 14 (Hardening & Launch)
| Service | Why | Cost to start |
|---|---|---|
| Sentry | Error monitoring | Free tier to start |
| Domain registrar (Namecheap/GoDaddy/Cloudflare Registrar) | Your actual domain name | ~£10-15/year |
| Email service (Resend, Postmark, or SES) | Transactional emails — verification, password reset, receipts | Free tier to start |

## Where Keys Live
- Local development: `.env.local` (never committed — already in `.gitignore` by default in Next.js)
- Production: set directly in Vercel/Railway dashboard environment variable settings, never in code
- Always keep an `.env.example` file in the repo with the variable names but placeholder/dummy values, so anyone (including a new teammate) knows what's needed without seeing real secrets

## Suggested Signup Order
1. GitHub (day one)
2. Vercel (day one)
3. Neon/Supabase + Upstash (start of Phase 9)
4. Cloudflare (start of Phase 10)
5. Stripe — test mode (start of Phase 11)
6. Bunny Stream/Mux (start of Phase 11, when real video upload is needed)
7. Sentry + domain + email service (start of Phase 14, just before launch)
