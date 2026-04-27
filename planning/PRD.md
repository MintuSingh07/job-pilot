# Product Requirements Document (PRD)

## 1. Product Overview
- Project Title: JobPilot
- Version: 1.0
- Owner: Mintu

## 2. Problem Statement
Job seekers spend hours manually searching and applying for jobs. Many applications are rejected by ATS filters because the resume wasn't tailored to the specific job description.

## 3. Goals & Objectives
- Goal: Apply to LinkedIn Easy Apply jobs in bulk with perfectly tailored resumes.
- Objective: Build a web app that discovers the latest LinkedIn Easy Apply jobs (via OpenRouter/Perplexity), extracts JDs, tailors the resume using Gemini 1.5, and auto-applies via Playwright.

## 4. Success Metrics
- Success Metric: High-speed discovery of LinkedIn jobs via API (saving search time).
- Success Metric: Guaranteed 80+ ATS score using Gemini 1.5 Pro without adding false information.

## 5. Target Users & Personas
Job seekers who want to maximize their application volume and quality through intelligent automation.

## 6. Features & Requirements
### P0 — Must Have (MVP)
1. Upload base resume:
- Support for PDF/DOCX upload.
- Extraction of raw text and initial skills analysis.
- Storage in-memory for the current session.

2. Platform Authentication:
- Secure one-time connection to LinkedIn.
- Credential storage in-memory (and session cookie persistence in `tmp/`).

3. Discover LinkedIn Jobs:
- Use OpenRouter (Perplexity Sonar) to find direct LinkedIn Job URLs matching the user's profile.
- Navigate directly to job pages using Playwright to fetch full descriptions.
- Filter for "Easy Apply" and recent postings (last 3 weeks).

4. Tailor Resume (Gemini 1.5) and Apply:
- Rewrite bullet points using Gemini 1.5 Pro to align with JD keywords.
- Iterative ATS scoring loop until 80+ score is achieved.
- Auto-fill LinkedIn Easy Apply forms and custom questions using Gemini 1.5.
- Save screenshots of successful applications as proof.