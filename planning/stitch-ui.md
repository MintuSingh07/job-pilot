Design a clean, professional web application called "JobPilot" — an AI-powered LinkedIn job application automation tool. Use a minimal SaaS aesthetic: white backgrounds, subtle gray borders, one accent color (indigo #6366F1), Inter font. No gradients, no heavy shadows. Flat and modern.

---

PAGE 1 — Landing Page (first screen user sees)

Layout: Full-width, vertically centered hero section. Max-width 720px content block, centered horizontally.

Elements:
- Top navigation bar: "JobPilot" logo in indigo on the left. "Get Started" outlined indigo button on the right. Thin bottom border separating nav from hero.
- Hero section (center of page):
  - Small pill badge above headline: gray background, text "AI-Powered Job Automation" in indigo, 20px border radius
  - Main headline (large, 48px, weight 500): "Apply to 80 jobs while you sleep." in dark gray #111827
  - Subheadline below (18px, weight 400, #6B7280): "JobPilot reads your resume, finds matching LinkedIn Easy Apply jobs, tailors your resume for each one, and auto-submits — all autonomously."
  - Three feature pills in a row below subheadline (small cards with thin border, rounded 8px, white background):
    - "Resume parsed by AI"
    - "ATS score 80+ guaranteed"
    - "Auto applies while you work"
  - Primary CTA button below: large full-width (max 320px) indigo button "Start Applying →" 44px height, rounded 8px
  - Below button: small gray text "No account needed · Runs locally · Free to use"
- Bottom of hero: a subtle horizontal divider, then three stat numbers in a row:
  - "80+" with label "Jobs applied per session"
  - "3 weeks" with label "Max job post age"
  - "80+" with label "Minimum ATS score"
  Each stat: number in large indigo, label in small gray below

DESIGN NOTES for PAGE 1:
- No images, no illustrations, no icons in hero — pure typography and minimal shapes
- Lots of white space above and below headline
- The three feature pills should sit in a single row on desktop
- The page should feel like a premium indie SaaS tool — think Linear, Vercel, Railway

---

PAGE 2 — Resume Upload

Layout: Centered single-column, max-width 560px, vertically centered on page.

Elements:
- Top: back arrow link "← Back" in gray
- "JobPilot" logo centered, small, in indigo
- Section heading: "Upload your resume" (20px, weight 500) centered
- Subtext below heading: "We'll parse it locally and use it to find and apply to matching jobs." in gray, centered
- Large drag-and-drop zone (dashed border #E5E7EB, rounded 12px, light gray background #F9FAFB, height 200px):
  - Simple document line icon (24px, gray)
  - Text "Drop your resume here" (14px, weight 500, dark)
  - Subtext "PDF or DOCX only · Max 5MB" in gray (12px)
  - On hover: dashed border turns indigo, background stays light gray
- Below dropzone: "or browse files" text link in indigo, centered
- After file selected state:
  - The dropzone collapses and is replaced by a file pill: white card, thin border, rounded 8px, padding 12px 16px
  - Left: document icon in indigo
  - Center: filename in dark text, file size in gray below
  - Right: green checkmark circle icon
  - Below pill: small gray "X Remove file" link
- Primary CTA at bottom: full-width "Parse & Continue →" indigo button, 44px, appears only after file is selected
- Bottom note: "Your resume stays on your device." in small gray centered text

DESIGN NOTES for PAGE 2:
- This page is only about the resume — LinkedIn connection is handled separately on Page 3 (conditionally)
- Keep it focused and minimal — one job, one button
- The CTA appears as soon as a valid file is selected; do not wait for anything else

---

PAGE 3 — Connect LinkedIn (Conditional — shown only if no stored credentials exist)

Layout: Centered single-column, max-width 480px, vertically centered on page.

This page appears between Resume Upload and Job Search only when no LinkedIn session or credentials are stored locally. If credentials already exist (session cookie or encrypted creds in the database), this page is skipped entirely and the user goes straight to Page 4.

Elements:
- Top: back arrow link "← Back" in gray
- "JobPilot" logo centered, small, in indigo
- Lock icon (24px, indigo, centered) above the heading — simple outline lock, Heroicons style
- Section heading: "Connect your LinkedIn" (20px, weight 500) centered
- Subtext below heading: "Required to search and apply to jobs on your behalf. Credentials are encrypted locally and never leave your device." in gray (13px), centered, max-width 380px
- Form section:
  - Email input: full-width, placeholder "LinkedIn email", 36px height, thin border #E5E7EB, indigo focus ring
  - Password input: full-width, placeholder "LinkedIn password", 36px height, same styling, with a show/hide password toggle icon on the right (eye icon, gray)
  - Spacing of 12px between inputs
- Primary CTA: full-width "Connect & Continue →" indigo button, 44px height, rounded 8px, appears below the inputs
- Below button: small gray text "We log in once, save an encrypted session, and never ask again."
- Thin divider below that
- Small text below divider: "Already connected?" in gray, with a "Skip →" text link in indigo next to it — this lets power users bypass if they know credentials are saved
- Bottom of page: security note row — small lock icon + text "256-bit encrypted · Stored locally · Never transmitted" in gray 12px, centered

Connected state (after successful connect — replaces form):
- Green checkmark circle icon (24px, centered)
- Text "Connected" in green (#16A34A), 16px, weight 500, centered
- Masked email below: "j***@gmail.com" in gray, 13px, centered
- Gray "Disconnect" text link below masked email
- After a 1.5 second delay, automatically advance to Page 4

DESIGN NOTES for PAGE 3:
- This page only renders if GET /api/auth/linkedin/status returns { connected: false }
- If connected: true, the router skips directly from /upload to /search — Page 3 never mounts
- The "Skip →" link calls the same status check and proceeds if connected; shows an error toast if not
- Error state: if login fails, show a red inline error below the button: "Couldn't connect. Check your credentials and try again." — do not clear the form
- No third-party OAuth, no redirects — this is a local credential store flow only
- The page should feel secure and trustworthy — use the lock icon, the encryption note, and the "never transmitted" line to reassure the user

---

PAGE 4 — Job Search in Progress (automation running screen)

Layout: Centered single-column, max-width 640px, vertically centered on page.

This page shows the illusion of the AI actively working. It should feel alive and real-time.

Elements:
- Top: "JobPilot" logo small centered in indigo
- Status heading: "Finding and applying to jobs..." (18px, weight 500, dark) centered
- Subtext: "Do not close this tab. This may take 20–40 minutes." in amber #D97706, centered, 13px
- Large terminal-style box (dark background #111827, rounded 12px, width 100%, height 340px, overflow hidden):
  - Top bar of terminal: three circles (red, amber, green) on left like a mac window, text "jobpilot — live log" in gray center
  - Scrollable text area inside: monospace font, 13px, lines of text appear one by one from bottom, scrolling upward like a live log
  - Text lines animate in sequentially with a blinking cursor at the end of the latest line
  - Line colors: white for general logs, green (#4ADE80) for success lines, amber (#FCD34D) for processing lines, red (#F87171) for skipped lines
  - Example lines that animate in one by one (cycle through these in a loop for the illusion):
    - [white] "Loaded session cookies for linkedin.com"
    - [white] "Searching: Python Developer · Easy Apply · Last 3 weeks"
    - [amber] "Scraping job listings... scrolling page 1"
    - [white] "Found: Senior Python Dev at Stripe · Match score: 87"
    - [amber] "Tailoring resume for Stripe role..."
    - [green] "ATS score: 83 · Threshold met"
    - [green] "Applied to Senior Python Dev at Stripe ✓"
    - [white] "Found: Backend Engineer at Notion · Match score: 72"
    - [amber] "Tailoring resume for Notion role..."
    - [amber] "ATS score: 74 · Retrying tailor (attempt 2)..."
    - [green] "ATS score: 81 · Threshold met"
    - [green] "Applied to Backend Engineer at Notion ✓"
    - [red] "Found: Java Developer at TCS · Match score: 41 · Skipped"
    - [white] "Found: Full Stack Engineer at Razorpay · Match score: 91"
    - [amber] "Tailoring resume for Razorpay role..."
    - [green] "ATS score: 88 · Threshold met"
    - [green] "Applied to Full Stack Engineer at Razorpay ✓"
  - After the last line plays, loop back from the beginning with a slight pause
  - Always show a blinking cursor underscore _ at the end of the latest line
- Below terminal box: four small inline stat chips in a single row, each chip is a white card with thin border, rounded 8px, padding 8px 16px:
  - "Scanned: 0" — updates live
  - "Shortlisted: 0" — updates live
  - "Tailored: 0" — updates live
  - "Applied: 0" — updates live (number animates up as jobs get applied)
- Below stat chips: a thin indigo progress bar (full width, 4px height, rounded) that slowly fills from left to right over the session duration
- At very bottom: "Stop & View Results" outlined red button, centered

DESIGN NOTES for PAGE 4:
- The terminal box is the hero element of this page — make it prominent
- The text lines should appear with a subtle typewriter effect, not all at once
- The stat chips update numbers with a smooth count-up animation
- The overall feeling should be: "something powerful is happening"

---

PAGE 5 — Results / Completion Screen

Layout: Centered single-column, max-width 600px, vertically centered on page.

This page shows after the job hunt session completes or user clicks Stop.

Elements:
- Top: "JobPilot" logo small centered in indigo
- Large success indicator: a simple circle with a checkmark inside, indigo border, indigo checkmark, 64px diameter — no fill, just stroke
- Main heading: "Session Complete" (24px, weight 500, dark) centered
- Subtext: "Here's what JobPilot did in this session." in gray, centered
- Four large stat cards in a 2x2 grid (white, thin border, rounded 8px, padding 24px):
  - Top left: number in 36px indigo bold, label in gray below — "Jobs Scanned"
  - Top right: number in 36px indigo bold — "Shortlisted"
  - Bottom left: number in 36px indigo bold — "Resumes Tailored"
  - Bottom right: number in 36px green bold (#16A34A) — "Successfully Applied"
- Below grid: a horizontal summary bar (gray background, rounded 8px, padding 16px):
  - Text: "Average ATS Score: 84 · Session Duration: 38 min · Platform: LinkedIn Easy Apply"
  - All in gray, 13px, separated by · dots
- Applied Jobs List section below summary bar:
  - Section heading "Jobs Applied To" (14px, weight 500) left-aligned
  - Scrollable list (max height 280px) of applied job rows, each row:
    - Left: job title (14px dark) + company name in gray below (12px)
    - Right: ATS score pill (green background, green dark text, e.g. "ATS 86") + "View ↗" link in indigo
    - Thin border between rows
    - Alternating very light gray background on every other row
- Two buttons at bottom side by side:
  - "Download CSV" outlined indigo button
  - "Start New Session" solid indigo button
- Very bottom: small gray text "Applications were submitted via LinkedIn Easy Apply. JobPilot does not guarantee responses from employers."

DESIGN NOTES for PAGE 5:
- The "Successfully Applied" number should be in green to celebrate the outcome
- The applied jobs list should feel like a clean receipt of work done
- Keep the page calm and summary-focused — the work is done, just show results clearly

---

CONDITIONAL ROUTING LOGIC (implement in React Router / App.jsx)

The LinkedIn Connect page (Page 3 / route /connect) is conditional:

On navigation from /upload to the next step:
1. Call GET /api/auth/linkedin/status
2. If { connected: true } → navigate directly to /search (skip /connect entirely)
3. If { connected: false } → navigate to /connect first, then /search after successful connection

This check happens client-side in a route guard or in the UploadPage's onSubmit handler after the resume is parsed successfully.

The /connect route should also guard itself: if a user navigates to /connect directly and credentials are already stored, redirect immediately to /search.

Route table:
/ → LandingPage
/upload → UploadPage
/connect → LinkedInConnectPage (conditional, skipped if already connected)
/search → SearchPage
/results → ResultsPage

---

DESIGN SYSTEM RULES for all pages:
- Font: Inter, weights 400 and 500 only
- Primary color: Indigo #6366F1
- Success: #16A34A green
- Warning: #D97706 amber
- Error/Danger: #DC2626 red
- Terminal green: #4ADE80
- Terminal amber: #FCD34D
- Terminal red: #F87171
- Background: #FFFFFF white
- Surface cards: #F9FAFB with border #E5E7EB
- Terminal background: #111827
- Text primary: #111827
- Text secondary: #6B7280
- Border radius: 8px for cards, 6px for buttons and inputs, 20px for pills/badges, 12px for terminal box
- All buttons: 36–44px height, no heavy shadows
- Inputs: 36px height, thin border #E5E7EB, indigo focus ring on focus
- No gradients anywhere
- Spacing: 8px grid system
- Icons: simple line icons, Heroicons style, 20–24px
- Animations: subtle only — typewriter text, count-up numbers, smooth progress bar fill, blinking cursor
