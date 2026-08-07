# Security Audit Report — The Key Ibiza

**Date:** 2026-03-24
**Scope:** Frontend codebase + HTTP headers + dependencies

---

## 1. HTTP Security Headers ✅ GOOD

The production site (`thekey-ibiza.com`) has **excellent** security headers:

| Header | Value | Status |
|--------|-------|--------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ Strong |
| `Content-Security-Policy` | Detailed policy with explicit allowlists | ✅ Present |
| `X-Content-Type-Options` | `nosniff` | ✅ Present |
| `X-Frame-Options` | `SAMEORIGIN` | ✅ Present |
| `X-XSS-Protection` | `1; mode=block` | ✅ Present |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ Present |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` | ✅ Present |
| `X-DNS-Prefetch-Control` | `off` | ✅ Present |
| `X-Permitted-Cross-Domain-Policies` | `none` | ✅ Present |

### CSP Notes
- `script-src` includes `'unsafe-inline'` and `'unsafe-eval'` — typical for SPAs but could be tightened with nonces/hashes in the future.
- `access-control-allow-origin: *` is broad but acceptable for a public-facing site serving static assets.

---

## 2. API Keys in Source Code ⚠️ MEDIUM RISK

**Finding:** `VITE_GEMINI_API_KEY` is loaded via `import.meta.env.VITE_GEMINI_API_KEY` in `src/services/gemini.ts:6`.

- **Risk:** Any `VITE_*` environment variable is embedded in the client-side JavaScript bundle at build time and **visible to all users** via browser DevTools.
- **Impact:** The Gemini API key can be extracted and abused (quota exhaustion, cost escalation).
- **Recommendation:** Move the Gemini API call to the backend (`the-key-ibiza-backend`) and proxy requests through a server-side endpoint. The frontend should call your own backend, never the Gemini API directly.

**No hardcoded keys found** (no `AIza*`, `sk-*`, or other raw secrets in source). ✅

---

## 3. `.env` Files in Git History ✅ CLEAN

- No `.env` files have ever been committed to git history.
- Both `.gitignore` files correctly exclude `.env`, `.env.local`, and `.env.*.local`.

---

## 4. Source Maps ✅ CLEAN

- No `sourcemap` or `sourceMap` configuration found in `vite.config.ts`.
- Vite defaults to **no source maps in production builds**, so source code is not exposed.

---

## 5. Dependency Vulnerabilities ✅ CLEAN

```
npm audit: found 0 vulnerabilities
```

---

## 6. Client-Side Auth — Admin Role Check ⚠️ MEDIUM RISK

**Finding:** `vipAuth.isAdmin()` in `src/services/vipAuth.ts:53-63` checks the `role` field from **client-side localStorage/sessionStorage**.

- **Risk:** A user can modify `vip_user` in localStorage to set `"role": "admin"` and gain access to admin UI components (AdminDashboard, InstagramCreator, etc.).
- **Mitigation already in place:** The AdminDashboard makes API calls with `Authorization: Bearer <token>`, so the **backend** should validate the token and role server-side. The client-side check is only for UI gating.
- **Recommendation:** Confirm that ALL admin API endpoints on the backend validate the JWT token's role claim server-side. The frontend check alone is insufficient.

---

## 7. `dangerouslySetInnerHTML` Usage ✅ LOW RISK

Two usages found, both for **Schema.org JSON-LD** structured data:
- `VillaDetailPage.tsx:1145` — `villaSchemaJson`
- `YachtDetailPage.tsx:612` — `yachtSchemaJson`

These inject `application/ld+json` script tags for SEO. As long as the JSON is built from trusted backend data (not user input), this is safe. This is the standard React pattern for JSON-LD.

---

## 8. Verbose Console Logging ⚠️ LOW RISK

**Finding:** `src/services/villaService.ts` contains multiple `console.log` statements that leak internal details:
- Line 221: `'🔑 VIP Token found:', token ? 'YES' : 'NO'`
- Line 228: `'🔐 Sending Authorization header'`
- Line 232: `'📡 Villas API response status:'`
- Line 243/247/256/296: Various internal data counts

**Risk:** Assists attackers in understanding the authentication flow and API structure.
**Recommendation:** Remove or gate these behind a `DEBUG` flag for production builds.

---

## Summary

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | HTTP Security Headers | — | ✅ Excellent |
| 2 | Gemini API key exposed client-side | ⚠️ Medium | Needs backend proxy |
| 3 | `.env` in git history | — | ✅ Clean |
| 4 | Source maps | — | ✅ Not exposed |
| 5 | Dependency vulnerabilities | — | ✅ None |
| 6 | Client-side admin role check | ⚠️ Medium | Verify backend enforcement |
| 7 | `dangerouslySetInnerHTML` | — | ✅ Safe usage |
| 8 | Verbose console logging in production | ⚠️ Low | Should clean up |
