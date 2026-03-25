# Security Audit Report - The Key Ibiza

**Date:** 2026-03-25
**Scope:** Full frontend codebase + SQL schemas + configuration
**Backend:** Empty directory (code hosted separately) - not audited
**Overall Risk Level:** MEDIUM

---

## Executive Summary

The Key Ibiza is a React (Vite) SPA deployed on Vercel with a separate backend (Vercel). The frontend handles VIP authentication via JWT tokens, Cloudinary image uploads, and integrates with Google Analytics and Google Generative AI.

**Key findings:** 18 items identified across 5 severity levels. The most critical issues are a weak CSP policy, JWT tokens stored in localStorage (XSS-exploitable), and an overly permissive Supabase RLS policy on the wishlists table.

---

## CRITICAL Findings

### 1. Overly Permissive RLS Policy on `wishlists` Table
- **File:** `wishlists-table.sql:26-33`
- **Issue:** The UPDATE policy allows **anyone** to update **any column** of any wishlist row:
  ```sql
  CREATE POLICY "Allow updating views_count" ON wishlists
    FOR UPDATE USING (true) WITH CHECK (true);
  ```
- **Impact:** An attacker can modify `villa_slugs`, `notes`, `show_prices`, `commission_percent`, `white_label`, or any other field on any wishlist — not just `views_count`.
- **Fix:** Restrict the UPDATE policy to only allow incrementing `views_count`, or use a Supabase RPC function instead:
  ```sql
  CREATE POLICY "Allow updating views_count only" ON wishlists
    FOR UPDATE USING (true)
    WITH CHECK (
      villa_slugs = OLD.villa_slugs AND
      check_in = OLD.check_in AND
      check_out = OLD.check_out AND
      share_code = OLD.share_code AND
      created_by_name = OLD.created_by_name AND
      notes = OLD.notes AND
      show_prices = OLD.show_prices
    );
  ```
  Or better: use a Supabase RPC `increment_views(share_code)` function.

### 2. CSP Policy with `unsafe-inline` and `unsafe-eval`
- **File:** `the-key-ibiza-frontend/vercel.json:475-476`
- **Issue:** The Content-Security-Policy includes `'unsafe-inline'` and `'unsafe-eval'` in `script-src`, which effectively disables XSS protection from CSP.
- **Impact:** If an XSS vector exists (e.g., via `dangerouslySetInnerHTML` or `rehypeRaw`), CSP will not block the injected script.
- **Fix:** Replace inline scripts with external files and use nonce-based CSP. Remove `'unsafe-eval'` if not required by dependencies.

---

## HIGH Findings

### 3. JWT Tokens Stored in localStorage (XSS-Exploitable)
- **Files:** `src/services/vipAuth.ts:16-17`, `src/components/VipLogin.tsx:59-66`
- **Issue:** JWT tokens are stored in `localStorage`/`sessionStorage`. Any XSS vulnerability allows token theft.
- **Impact:** Session hijacking, unauthorized access to VIP/admin features.
- **Recommendation:** Migrate to HttpOnly cookies set by the backend with `SameSite=Strict` and `Secure` flags.

### 4. Client-Side Admin Role Check (Bypassable)
- **File:** `src/services/vipAuth.ts:53-64`
- **Issue:** Admin authorization is checked by reading `vip_user` from localStorage and checking `role === 'admin'`. An attacker can modify localStorage to set `role: "admin"` and bypass frontend guards.
- **Impact:** Access to admin dashboard UI. Real impact depends on backend enforcement.
- **Recommendation:** Backend MUST enforce admin role on all admin API endpoints. Frontend checks are cosmetic only — verify backend enforces authorization.

### 5. Markdown Rendering with `rehype-raw` (XSS Vector)
- **File:** `src/components/BlogArticlePage.tsx:5,229`
- **Issue:** `rehype-raw` allows raw HTML in markdown content. If blog content comes from an untrusted or compromised source, `<script>` tags or event handlers will execute.
- **Impact:** Stored XSS if blog content is ever user-controlled or if the backend CMS is compromised.
- **Recommendation:** Add `rehype-sanitize` after `rehype-raw` to strip dangerous HTML, or use a whitelist of allowed HTML tags.

### 6. `dangerouslySetInnerHTML` for JSON-LD Schema
- **Files:** `src/components/VillaDetailPage.tsx:1174`, `src/components/YachtDetailPage.tsx:612`
- **Issue:** Schema.org JSON is injected via `dangerouslySetInnerHTML`. The JSON is built from backend data (villa names, descriptions). If that data contains a `</script>` string, it could break out of the JSON-LD block.
- **Impact:** XSS if backend data is poisoned.
- **Recommendation:** Use `textContent` assignment instead of `dangerouslySetInnerHTML`, or ensure `JSON.stringify` output is escaped for HTML context (replace `</` with `<\/`).

---

## MEDIUM Findings

### 7. Debug Console Logging in Production
- **File:** `src/services/villaService.ts:221,228,232`
- **Issue:** Token presence and API status are logged to browser console:
  ```typescript
  console.log('🔑 VIP Token found:', token ? 'YES' : 'NO');
  console.log('🔐 Sending Authorization header');
  ```
- **Impact:** Information disclosure aiding attackers in understanding auth flow.
- **Recommendation:** Remove debug logs or use a conditional logger that disables in production.

### 8. Cloudinary Upload Without Client-Side Validation
- **File:** `src/components/VillaDetailPage.tsx:2060-2078`
- **Issue:** Images are uploaded to Cloudinary without client-side validation of file type, size, or dimensions. Security relies entirely on the Cloudinary upload preset configuration.
- **Recommendation:** Add client-side checks (file type, max size ~5MB) and verify the `the-key-feedback` upload preset has:
  - Folder restriction (`feedback` only)
  - File type restriction (images only)
  - File size limit

### 9. No CSRF Protection Visible
- **Issue:** No CSRF tokens are sent with state-changing requests (login, wishlist creation, feedback submission).
- **Impact:** An attacker could forge requests from a victim's browser.
- **Recommendation:** Backend should implement CSRF tokens or use `SameSite` cookies. For APIs using `Authorization` headers with fetch, CSRF risk is lower (not auto-attached by browsers), but login forms are still vulnerable.

### 10. Missing `.env.*.local` in Root `.gitignore`
- **File:** `.gitignore`
- **Issue:** The root `.gitignore` only lists `.env`. It does NOT cover `.env.local`, `.env.production`, `.env.development`, etc. The frontend has its own `.gitignore` with better coverage, but the root is incomplete.
- **Recommendation:** Add to root `.gitignore`:
  ```
  .env*
  !.env.example
  ```

### 11. SQL Files with Schema Details in Repository
- **Files:** `add-commission-column.sql`, `add-vip-level.sql`, `villa-can-palm-insert.sql`, `wishlists-table.sql`
- **Issue:** SQL migration files reveal full database schema, column names, RLS policies, and sample data. This aids attackers in crafting targeted attacks.
- **Recommendation:** Consider moving SQL files to a private repository or removing them after execution.

---

## LOW Findings

### 12. Hardcoded Backend URL
- **18+ files** use the pattern:
  ```typescript
  const BACKEND_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://the-key-ibiza-backend.vercel.app';
  ```
- **Issue:** Backend URL is hardcoded in every component instead of a centralized config. Not a direct vulnerability but increases maintenance risk.
- **Recommendation:** Centralize to a single config/env variable.

### 13. Google Generative AI API Connected
- **File:** `package.json` — `@google/genai: ^1.34.0`
- **CSP:** `connect-src` allows `generativelanguage.googleapis.com`
- **Issue:** The frontend connects to Google Generative AI. The API key handling must be verified — it should NOT be in client-side code.
- **Recommendation:** Verify the API key is only used server-side or proxied through the backend.

### 14. Cloudinary Cloud Name Exposed
- **Files:** `src/components/VillaDetailPage.tsx:2061`, `src/utils/cloudinaryUrl.ts:4`
- **Value:** `drxf80sho`
- **Risk:** LOW — intentionally public by Cloudinary design. Upload preset restrictions are the actual security layer.

### 15. No Rate Limiting Visible (Frontend Side)
- **Issue:** Login form, feedback form, and wishlist creation have no rate limiting on the frontend.
- **Recommendation:** Backend should implement rate limiting on:
  - `/vip/login` (brute force protection)
  - Wishlist creation endpoints
  - Feedback submission

---

## Positive Findings (What's Done Well)

| Area | Status | Details |
|------|--------|---------|
| HTTPS everywhere | PASS | All API calls and external resources use HTTPS |
| Security headers | GOOD | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy all configured |
| No `eval()` usage | PASS | No dynamic code execution found |
| No secrets in repo | PASS | No API keys, passwords, or tokens committed |
| `.env` in `.gitignore` | PASS | Environment files excluded from git |
| No SQL injection risk | PASS | Frontend uses Supabase client, no raw SQL |
| Permissions-Policy | PASS | Camera, microphone restricted |
| HSTS preload | PASS | `max-age=63072000; includeSubDomains; preload` |

---

## Priority Remediation Plan

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P0 | Fix wishlists RLS UPDATE policy | 30 min | Prevents data tampering |
| P0 | Remove `unsafe-eval` from CSP | 1-2h | Hardens XSS protection |
| P1 | Add `rehype-sanitize` to blog markdown | 30 min | Prevents stored XSS |
| P1 | Replace `dangerouslySetInnerHTML` with `textContent` for schemas | 30 min | Prevents reflected XSS |
| P1 | Verify backend enforces admin role | 1h | Prevents privilege escalation |
| P2 | Migrate JWT to HttpOnly cookies | 4-8h | Prevents token theft via XSS |
| P2 | Add Cloudinary upload validation | 1h | Prevents abuse |
| P2 | Remove console.log debug statements | 30 min | Reduces info disclosure |
| P3 | Improve root .gitignore | 5 min | Prevents accidental secret commits |
| P3 | Centralize BACKEND_URL config | 1h | Reduces maintenance risk |
| P3 | Verify Google AI API key handling | 30 min | Prevents key exposure |

---

## Scope Limitations

- **Backend not audited:** The `the-key-ibiza-backend` directory is empty in this repo. Backend security (authentication, authorization, input validation, rate limiting, SQL injection, etc.) was NOT reviewed.
- **Infrastructure not audited:** Vercel deployment settings, Supabase configuration, Cloudinary dashboard settings not reviewed.
- **Dependency vulnerabilities:** `npm audit` was not run (no `node_modules` installed). Should be run as part of CI/CD.
