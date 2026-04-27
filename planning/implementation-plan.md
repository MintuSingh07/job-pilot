# JobPilot — Step-by-Step Build Guide

---

## Before You Start — One-Time Setup (30 min before the clock starts)

Do this the night before so you don't waste sprint time on installations.

**Install these on your machine:**
- Node.js (v18+) — for the React frontend
- Python 3.11 — for FastAPI backend
- Redis — `sudo apt install redis-server` on Linux or Homebrew on Mac
- Git — initialize a repo so you can checkpoint your progress

**Create accounts if you don't have them:**
- Gemini API — get your API key from aistudio.google.com
- Google Stitch — for UI generation
- Antigravity — your vibe coding environment

**Create one folder called `jobpilot/` with two subfolders: `frontend/` and `backend/`.**
Every file you create lives inside one of these two. Never mix them.

---

## Hour 1 — Generate UI in Stitch + Frontend Shell

### Step 1: Generate all 4 pages in Google Stitch (45 min)

Open Google Stitch. Paste the full UI prompt. Generate all 4 pages one by one.

For each page follow this exact sequence:
1. Paste the prompt for that specific page section
2. Let Stitch generate the design
3. Review it — check the layout matches what was described
4. If something looks wrong, describe the fix in plain English ("make the button full width")
5. Once happy, export as React + Tailwind code
6. Copy the exported code into the corresponding file in `frontend/src/pages/`

**Page to file mapping:**

| Stitch Page | File |
|---|---|
| Landing Page | `src/pages/LandingPage.jsx` |
| Resume Upload | `src/pages/UploadPage.jsx` |
| Job Search in Progress | `src/pages/SearchPage.jsx` |
| Results / Completion | `src/pages/ResultsPage.jsx` |

### Step 2: Scaffold the React app (15 min)

Open Antigravity. Tell it:

> "Initialize a new Vite React app in the frontend folder. Install Tailwind CSS,
> shadcn/ui, axios, socket.io-client, and react-router-dom. Set up the folder
> structure with pages, components, hooks, and lib folders."

Once done, paste the Stitch-generated files into their folders.

Then tell Antigravity:

> "Set up React Router in App.jsx with routes for / (LandingPage), /upload
> (UploadPage), /search (SearchPage), and /results (ResultsPage).
> Import each page component."

**Checkpoint:** `npm run dev` launches. You can click between all 4 pages.
They show placeholder data — that is fine for now.

---

## Hour 2 — Backend Foundation + Resume Upload

### Step 3: Set up FastAPI project (20 min)

Tell Antigravity:

> "In the backend folder, create a FastAPI project. Install fastapi, uvicorn,
> python-multipart, python-socketio, PyMuPDF, python-docx, spacy, sqlalchemy,
> cryptography, celery, redis, and google-generativeai. Also run:
> `python -m spacy download en_core_web_sm` and `playwright install chromium`.
> Create this folder structure: routers/, services/, models/, and tmp/resumes/."

Then tell it:

> "Create main.py that starts a FastAPI app with CORS allowing localhost:5173,
> mounts python-socketio, and includes routers for resume, auth, and jobs."

Then tell it:

> "Create main.py that starts a FastAPI app with CORS allowing localhost:5173,
> mounts python-socketio, and includes routers for resume, auth, and jobs.
> Define global variables to store the session state:
> `resume_data = {}` (to store parsed skills and raw text),
> `jobs_list = []` (to store found jobs and their status: scraped, tailored, etc.)."

### Step 4: Make resume upload work (40 min)

**Backend first.** Tell Antigravity:

> "In routers/resume.py, create a POST endpoint at /api/resume/upload.
> It should accept a file upload, validate it is PDF or DOCX, save it to
> tmp/resumes/ as base-resume with the original extension, then call the
> parse function and store the result in the global `resume_data`.
> Return the parsed data as JSON."

Then tell it:

> "In services/resume_parser.py, write a function that takes a file path,
> extracts all text using PyMuPDF for PDFs and python-docx for DOCX files,
> then uses regex and spaCy to extract name, email, phone number,
> years of experience, and a skills list. Always store the complete raw text —
> it will be needed for every Gemini API call later. Never discard it."

**Frontend second.** Tell Antigravity:

> "In UploadPage.jsx, wire up the drag-and-drop zone so when the user selects
> a file it shows the file pill (filename, size, green checkmark). After the
> file is selected, slide in the Connect LinkedIn section below. Only show the
> 'Parse & Start →' button once both the file is selected AND LinkedIn is
> connected. On click, send the file to http://localhost:8000/api/resume/upload
> using axios. On success, navigate to /search."

**Checkpoint:** Drop your own resume. The terminal shows correct name, email,
and skills extracted. SQLite has a resume_profile row with raw_text filled in.

> **Warning:** If raw_text is empty or missing, fix it before moving on.
> Every Gemini API call in Hours 5–7 depends entirely on this field.

---

## Hour 3 — LinkedIn Credential Storage

### Step 5: Encrypt and store LinkedIn credentials (30 min)

Tell Antigravity:

> "In services/credential_store.py, write three functions.
> First: generate a Fernet encryption key derived from the machine's hardware
> UUID — this means the key is unique per device and never stored anywhere.
> Second: an encrypt-and-save function that takes email and password,
> encrypts both, and stores them in the platform_creds SQLite table.
> Third: a retrieve function that re-derives the key from the UUID,
> decrypts, and returns the credentials."

> **Why this matters:** If someone steals your database file, they cannot
> read the passwords. The Fernet key exists only in memory, derived fresh
> from the hardware each time.

### Step 6: Build the Connect LinkedIn flow (30 min)

Tell Antigravity:

> "In routers/auth.py, create two endpoints.
> POST /api/auth/linkedin/connect accepts email and password, encrypts them
> using credential_store, saves to the database, then triggers the Playwright
> login flow and returns success or failure.
> GET /api/auth/linkedin/status checks if tmp/linkedin_session.json exists
> and returns connected true or false."

Tell Antigravity:

> "In services/linkedin_auth.py, write an async function that launches a
> Playwright Chromium browser with playwright-stealth applied, navigates to
> linkedin.com/login, fills in email and password, clicks sign in, waits for
> the URL to contain /feed which confirms login succeeded, then saves all
> browser cookies to tmp/linkedin_session.json."

**Frontend.** Tell Antigravity:

> "In UploadPage.jsx, when the user clicks Save & Connect call
> POST /api/auth/linkedin/connect. Show a loading spinner during the request.
> On success replace the form with a green Connected badge showing the masked
> email and a gray Disconnect link. Only reveal the 'Parse & Start →' button
> once both conditions are met: file selected AND LinkedIn connected."

### Step 7: Session reuse (15 min)

Tell Antigravity:

> "Update the Playwright login function so it first checks if
> tmp/linkedin_session.json exists. If it does, load those cookies into a
> new browser context and navigate to linkedin.com/feed. If the feed loads
> successfully, return success immediately without touching the login form.
> Only run the full login flow if no session file exists or if the feed
> fails to load with the saved cookies."

**Checkpoint:** Connect LinkedIn once. Stop both servers. Restart them.
Hit GET /api/auth/linkedin/status — it should return connected without
opening a browser window or logging in again.

---

## Hour 4 — Job Discovery via OpenRouter (Perplexity)

### Step 8: Build the OpenRouter Searcher (60 min)

Instead of slow scraping, we use Perplexity to find direct LinkedIn URLs.

Tell Antigravity:

> "In services/job_searcher.py, write an async function that takes the user's
> top 3 skills and location. Call the OpenRouter API using model
> `perplexity/llama-3-sonar-large-32k-online`. The prompt should say:
> 'Find 20 live LinkedIn job postings for [SKILLS] in [LOCATION].
> Return only a JSON array of objects with: title, company, location,
> and job_url (must start with linkedin.com/jobs/view/).'
> Store these in the SQLite jobs table with status set to scraped.
> Emit a job_found socket event for each URL discovered."

Then tell it:

> "In services/linkedin_scraper.py, write a function that takes a LinkedIn
> job URL, navigates there using Playwright (with session cookies), and
> extracts the full job description text. This is much faster than the
> old way because we go directly to the page. Update the job record
> with the JD text."

**Frontend.** Tell Antigravity:

> "In SearchPage.jsx, ensure the terminal logs reflect the search progress.
> Show 'Searching LinkedIn via OpenRouter...' and then list the job titles
> as they are found and their details extracted."

**Checkpoint:** Click Start. Within 1 minute, you should see 10+ LinkedIn
jobs appearing in the terminal. No more waiting for scrolls!

---

## Hour 5 — Gemini JD Matching

### Step 9: Score each job against the resume (45 min)

Tell Antigravity:

> "In services/job_matcher.py, write an async function that takes a job's
> JD text and the resume raw_text from the database. Call the Gemini API
> using the google-generativeai Python package with model `gemini-1.5-flash`.
> Load the API key from a GEMINI_API_KEY environment variable.
> The prompt should instruct Gemini to compare the resume and job description
> and return only a JSON object with: score (0 to 100), matched_skills
> (list of strings), and reason (one sentence).
> Parse the JSON response. Update the job's match_score in SQLite.
> If score is 70 or above set status to shortlisted.
> If below 70 set status to skipped.
> Emit a socket event after each job is scored."

Then tell it:

> "Run these Gemini API calls in batches of 5 simultaneously using
> asyncio.gather. Do not call the API for all 100 jobs at once — you will
> hit rate limits. Process one batch, wait for all 5 to finish, then start
> the next batch."

> **Parsing tip:** Gemini occasionally wraps JSON in markdown code fences.
> Tell Antigravity to strip any ```json prefix and ``` suffix before
> calling json.loads() and wrap it in try/except to handle failures
> without crashing the whole batch.

### Step 10: Reflect shortlisted count in the terminal (15 min)

Tell Antigravity:

> "In SearchPage.jsx, listen for the job_scored socket event. When a job's
> match score is 70 or above, increment the Shortlisted stat chip. Emit a
> terminal log line in white for each scored job showing its title and score."

**Checkpoint:** Check the backend logs. You should see `jobs_list` filling up
with scores and status updates.

---

## Hour 6 — Resume Tailoring

### Step 11: Gemini 1.5 Pro rewrites resume bullets for each job (45 min)

Tell Antigravity:

> "In services/resume_tailor.py, write a function that takes the resume
> raw_text and a job's JD text. Call the Gemini API using model
> `gemini-1.5-pro` with the GEMINI_API_KEY environment variable.
> The prompt should say: you are a professional resume writer, rewrite only
> the existing bullet points from this resume to better highlight skills
> matching this job description, do not add any skill, technology, or
> experience that does not already appear in the original resume, return
> only a JSON object where changes is a list of objects each with an
> original field and a rewritten field.
> Parse the response. Open the original base-resume DOCX file. For each
> change, find the original text and replace it with the rewritten text.
> Save the modified file as tmp/resumes/tailored-JOBID.docx.
> Store the file path in the jobs table and set status to tailoring."

> **Critical:** The instruction "do not add anything not already in the
> resume" must appear in every single tailor prompt, every single call,
> every single retry. This is your only guardrail against Gemini
> hallucinating skills.

### Step 12: Reflect tailoring in the terminal (15 min)

Tell Antigravity:

> "In SearchPage.jsx, listen for ats_scored socket events. Emit an amber
> terminal log line when tailoring starts (e.g. 'Tailoring resume for Stripe
> role...') and a green line when the ATS threshold is met (e.g. 'ATS score:
> 83 · Threshold met'). Increment the Tailored stat chip when a job reaches
> ATS 80+."

**Checkpoint:** Open the tmp/resumes/ folder. Tailored DOCX files should
be appearing. Open one and read it — the bullet points should sound more
targeted to that specific job, but no new skills should appear that
weren't in your original resume.

---

## Hour 7 — ATS Scoring Loop

### Step 13: Score and iterate until 80+ (45 min)

Tell Antigravity:

> "In services/ats_scorer.py, write a function that takes the tailored
> DOCX path and the job's JD text. Extract plain text from the DOCX.
> Call the Gemini API using model `gemini-1.5-pro` with the
> GEMINI_API_KEY environment variable. The prompt should say: act as an
> enterprise ATS parser, analyze this resume against this job description,
> return only a JSON object with score (0 to 100), missing_keywords (list),
> and improvement_suggestions (list).
> If the score is below 80 and this is attempt 1 or 2, call the tailor
> function again passing the improvement_suggestions as additional context,
> regenerate the DOCX, then call this scorer again.
> If score reaches 80 or above, update job status to ready_to_apply and
> store the ats_score.
> If still below 80 after 3 attempts, set status to ats_failed and
> log the final score. Do not apply to ats_failed jobs.
> Emit a socket event called ats_scored after each attempt with the
> job ID, current score, and attempt number."

### Step 14: Reflect ATS progress in the terminal (15 min)

Tell Antigravity:

> "In SearchPage.jsx, listen for ats_scored socket events. Show each attempt
> as an amber terminal line (e.g. 'ATS score: 74 · Retrying tailor
> (attempt 2)...'). When a job hits 80+, show a green line (e.g. 'ATS
> score: 83 · Threshold met') and increment the Tailored stat chip."

**Checkpoint:** Watch the backend terminal during ATS scoring. You should
see scores climbing across attempts — something like 71 → 78 → 83.
If the score never improves across retries, the suggestions from Gemini
are not being passed correctly into the next tailor call.

---

## Hour 8 — Auto Apply + Results Screen

### Step 15: Playwright fills and submits Easy Apply forms (45 min)

Tell Antigravity:

> "In services/job_applier.py, write an async function that takes a job
> URL and the resume profile JSON. Load LinkedIn session cookies. Navigate
> to the job URL. Click the Easy Apply button. A modal will appear.
> Loop through each form step: read each visible field label, match it to
> the resume data using this mapping — years of experience maps to
> resume years_exp, phone maps to resume phone, current company maps to
> the most recent employer in resume, LinkedIn URL maps to resume
> linkedin_url. For any field label that does not match the mapping,
> call the Gemini API using gemini-1.5-flash with the field label and
> full resume JSON to get the best answer, and cache that answer for
> identical labels in other applications.
> When a file upload input appears, upload the tailored DOCX for this job.
> Click Next on each intermediate step and Submit on the final step.
> Wait for the success confirmation text to appear on screen.
> Update job status to applied in the database.
> Save a screenshot to tmp/screenshots/JOBID.png as proof.
> Emit a job_applied socket event with job title, company, and ATS score."

Then tell it:

> "Add a hard delay of 20 to 40 random seconds between each application.
> Add a daily application cap: if applied count reaches 80, stop processing
> and emit a session_complete socket event. Never exceed this limit."

### Step 16: Wire up the Results page (15 min)

Tell Antigravity:

> "In SearchPage.jsx, listen for the session_complete socket event. When it
> fires, navigate to /results, passing session stats as query params or via
> React Router state: jobs scanned, shortlisted, resumes tailored, and
> successfully applied."

Tell Antigravity:

> "In ResultsPage.jsx, read the session stats and display them in the 2x2
> stat grid — Jobs Scanned, Shortlisted, Resumes Tailored in indigo, and
> Successfully Applied in green (#16A34A). Fetch GET /api/jobs?status=applied
> to populate the Applied Jobs list with job title, company, ATS score pill,
> and a View link. Show the summary bar with average ATS score, session
> duration, and platform. Wire the Download CSV button to
> GET /api/jobs/export. Wire the Start New Session button to navigate
> back to /."

Tell Antigravity:

> "In routers/jobs.py, create GET /api/jobs that returns all jobs filtered
> by a status query param. Create GET /api/jobs/export that returns a CSV
> with columns: job title, company, match score, ATS score, applied
> timestamp, and job URL."

**Checkpoint:** Watch tmp/screenshots/ fill up with proof images. Open the
CSV export — this is your demo artifact showing every job applied to with
timestamps and scores.

---

## Sanity Check List — Do These in Order

| After | Check |
|---|---|
| Hour 1 | All 4 pages load. Click between /, /upload, /search, /results without errors |
| Hour 2 | Upload your resume → correct name and skills appear in terminal |
| Hour 3 | Restart servers → /api/auth/linkedin/status returns connected without re-login |
| Hour 4 | Run scraper → 20+ log lines appear in SearchPage terminal within 5 minutes |
| Hour 5 | Open SQLite → every job has match_score filled in |
| Hour 6 | Open tmp/resumes/ → tailored DOCX files exist, read one |
| Hour 7 | Backend terminal shows ATS scores climbing across retries |
| Hour 8 | tmp/screenshots/ has proof images, CSV export works, ResultsPage shows correct counts |

---

## Environment Variables — Set These Before Starting

Create a `.env` file inside the `backend/` folder:

```
GEMINI_API_KEY=your_key_from_aistudio_google_com
OPENROUTER_API_KEY=your_key_from_openrouter_ai
```

Then tell Antigravity:

> "In backend/main.py, load environment variables from the .env file using
> python-dotenv at startup. Install python-dotenv as a dependency."

Never hardcode the API key directly in any service file. Always read it
from the environment variable. Never commit the .env file to Git — add it
to .gitignore immediately.

---

## One Rule for Using Antigravity Effectively

Always tell Antigravity exactly which file to work in. Say
"in services/resume_tailor.py do X" not just "do X".

Vibe coding tools sometimes create new files instead of editing existing
ones. This silently breaks your imports. Keep your file structure visible
in the Antigravity sidebar and reference the exact filename in every prompt.

---

## Dependency Chain — Why Order Matters

```
Resume raw_text (Hour 2)
└── Job matching prompt (Hour 5)
    └── Tailor prompt (Hour 6)
        └── ATS loop (Hour 7)
            └── Auto apply (Hour 8)
                └── Results page (Hour 8)
```

---

## Socket Events Reference

| Event | Emitted by | Consumed by | Effect in UI |
|---|---|---|---|
| `job_found` | linkedin_scraper | SearchPage | New terminal line (white), Scanned +1 |
| `job_scored` | job_matcher | SearchPage | New terminal line, Shortlisted +1 if ≥70 |
| `ats_scored` | ats_scorer | SearchPage | Amber/green terminal line, Tailored +1 if ≥80 |
| `job_applied` | job_applier | SearchPage | Green terminal line, Applied +1, progress bar advances |
| `session_complete` | job_applier | SearchPage | Navigate to /results |

---

## Page & Route Reference

| Route | Component | Comes from | Goes to |
|---|---|---|---|
| `/` | LandingPage | — | /upload (CTA click) |
| `/upload` | UploadPage | / | /search (Parse & Start) |
| `/search` | SearchPage | /upload | /results (session_complete event) |
| `/results` | ResultsPage | /search | / (Start New Session) |
