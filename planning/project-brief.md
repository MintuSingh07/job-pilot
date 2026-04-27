# JobPilot: Project Brief & Roadmap

This brief synthesizes the **PRD** and **Implementation Plan** for the LinkedIn Resume Tailor (JobPilot) project.

## 🎯 Core Objective
Build a web application that automates the job application process on LinkedIn (Easy Apply) by fetching suitable jobs, tailoring the user's resume using AI (Gemini) to achieve an **ATS score of 80+**, and autonomously submitting applications.

## 🛠️ Technology Stack
- **Frontend**: Vite + React, Tailwind CSS, shadcn/ui, Socket.io-client.
- **Backend**: FastAPI (Python), Redis (optional for task queuing), Socket.io.
- **AI/ML**: Gemini 1.5 (Flash for matching, Pro for Tailoring/ATS), spaCy (Entity Extraction).
- **Search API**: OpenRouter (Perplexity Sonar) for direct LinkedIn job discovery.
- **Automation**: Playwright + Playwright-stealth (Auto-applying).
- **File Handling**: PyMuPDF (PDF), python-docx (DOCX).

## 📋 Key Features & Success Metrics
- **Base Resume Upload**: Support for PDF/DOCX; extraction of skills and raw text.
- **Secure Auth**: Encrypted LinkedIn credential storage (Fernet encryption derived from hardware UUID).
- **Smart Matching**: Gemini-powered JD matching (Score ≥ 70 required to shortlist).
- **AI Tailoring**: Rewriting bullet points without hallucinating skills.
- **ATS Loop**: Iterative scoring and refining in-memory until ATS score ≥ 80.
- **Auto-Fill**: Intelligent form filling using resume data and Gemini for custom questions.
- **Success Metric**: Aim for high-volume applications (goal: 100+/min) and guaranteed 80+ ATS score.

## ⏳ Implementation Phases (8-Hour Sprint)

| Phase | Focus | Key Deliverables |
| :--- | :--- | :--- |
| **Hour 1** | **UI Shell** | 4-page React app (Landing, Upload, Search, Results). |
| **Hour 2** | **Resume Engine** | FastAPI setup + Resume upload & parsing (In-memory storage). |
| **Hour 3** | **Platform Auth** | Secure LinkedIn credential storage + Playwright session saving. |
| **Hour 4** | **Job Discovery** | OpenRouter (Perplexity) finds 100+ direct LinkedIn job URLs. |
| **Hour 5** | **JD Analysis** | Gemini 1.5 Flash scoring jobs against resume (70+ shortlist). |
| **Hour 6** | **Resume Tailor** | Gemini 1.5 Pro DOCX bullet point rewriting. |
| **Hour 7** | **ATS Loop** | Gemini 1.5 Pro iterative scoring loop (target 80+ score). |
| **Hour 8** | **Auto-Apply** | Playwright form filling + results dashboard & CSV export. |

## ⚠️ Critical Constraints & Gotchas
- **Data Integrity**: Never discard the `raw_text` of the resume; all AI calls depend on it.
- **Anti-Bot Evasion**: Random delays (1.5s - 4s) in Playwright are mandatory to avoid bans.
- **Hallucination Guard**: Prompting must strictly forbid adding skills not present in the original resume.
- **Batch Processing**: Process Gemini API calls in small batches (e.g., 5) to avoid rate limits.
- **Daily Cap**: Limit applications to 80 per day to protect the user's LinkedIn account.

---
> [!TIP]
> Use this brief as a "Source of Truth" to stay on track during each hour of the sprint. Always reference specific files when prompting for edits.
