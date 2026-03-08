# Phase 8: Deploy to Vercel

Read CLAUDE-CODE-MASTER-PROMPT.md and execute Phase 8 precisely.

## Quick Reference

### vercel.json
Create if not exists:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{ "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }]
}
```

### Pre-Deploy Checks
1. Run `npm run build` — fix ALL errors
2. Verify no secrets in dist/ output
3. Verify .env.production has correct Supabase URL + key
4. Test the build locally: `npx vite preview`

### Deployment
- ASK RYAN to connect the GitHub repo to Vercel
- ASK RYAN to set environment variables in Vercel dashboard:
  - VITE_SUPABASE_URL
  - VITE_SB_PUBLISHABLE_KEY
  - VITE_APP_NAME
  - VITE_POSTHOG_KEY (if Phase 7 done)
  - VITE_POSTHOG_HOST (if Phase 7 done)

## Rules
- Never hardcode any API keys
- Commit when done: "chore: add Vercel deployment config"
