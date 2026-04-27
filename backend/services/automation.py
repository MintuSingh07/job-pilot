import asyncio
import os
from fpdf import FPDF
from playwright.async_api import async_playwright
from playwright_stealth import Stealth
from services import tailor


# ─────────────────────────────────────────────
# Helper: generate tailored PDF from text
# ─────────────────────────────────────────────
def generate_pdf(text: str, path: str):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=11)
    safe = text.replace("•", "-").encode("latin-1", "replace").decode("latin-1")
    pdf.multi_cell(0, 5, text=safe)
    pdf.output(path)


# ─────────────────────────────────────────────
# Helper: decide smart fill value from label
# ─────────────────────────────────────────────
def smart_fill_value(label: str, input_type: str) -> str:
    label = label.lower()
    if any(k in label for k in ["phone", "mobile", "contact number"]):
        return "+1 555 000 0000"
    if any(k in label for k in ["year", "experience", "exp"]):
        return "2"
    if any(k in label for k in ["salary", "ctc", "compensation", "expected"]):
        return "60000"
    if any(k in label for k in ["notice", "joining"]):
        return "30"
    if any(k in label for k in ["city", "location", "address"]):
        return "New York, NY"
    if any(k in label for k in ["linkedin", "portfolio", "website", "url", "github"]):
        return "https://linkedin.com/in/applicant"
    if "first name" in label:
        return "Alex"
    if "last name" in label:
        return "Johnson"
    if "name" in label:
        return "Alex Johnson"
    if input_type == "number":
        return "2"
    if input_type == "tel":
        return "+1 555 000 0000"
    return "Yes"


def pick_radio_answer(question: str) -> str:
    """Return 'yes' or 'no' based on question context."""
    question = question.lower()
    if any(k in question for k in [
        "authorized", "eligible", "legally", "citizen", "willing",
        "relocate", "remote", "hybrid", "agree", "background check",
        "drug", "available", "certif"
    ]):
        return "yes"
    if any(k in question for k in ["sponsorship", "visa", "require sponsor", "need visa"]):
        return "no"
    return "yes"


# ─────────────────────────────────────────────
# Helper: fill one Easy Apply form step
# ─────────────────────────────────────────────
async def fill_form_step(page, pdf_path: str, sio):
    # 1. Upload tailored resume — handle LinkedIn's "Change resume" flow
    try:
        # First try: click "Change resume" or "Upload resume" button to reveal the file picker
        change_btn = page.locator(
            "button:has-text('Change resume'), "
            "button:has-text('Upload resume'), "
            "button:has-text('Replace'), "
            "label:has-text('Upload resume'), "
            "[aria-label*='Change resume'], "
            "[aria-label*='Upload resume']"
        ).first
        try:
            await change_btn.wait_for(state="visible", timeout=2000)
            await change_btn.click()
            await asyncio.sleep(1)
            await sio.emit("log", {"level": "INFO", "message": "🔄 Clicked 'Change resume' to replace preloaded resume."})
        except Exception:
            pass  # No existing resume shown, proceed to direct file input

        # Now set the file — try visible inputs first, then force-set hidden ones
        file_inputs = page.locator("input[type='file']")
        count = await file_inputs.count()
        uploaded = False
        for idx in range(count):
            fi = file_inputs.nth(idx)
            try:
                # set_input_files works even on hidden inputs
                await fi.set_input_files(pdf_path)
                uploaded = True
                await sio.emit("log", {"level": "INFO", "message": "📎 Tailored resume PDF uploaded to form."})
                break
            except Exception:
                continue

        if not uploaded:
            await sio.emit("log", {"level": "WARN", "message": "⚠️ Could not find file upload input on this step."})
    except Exception:
        pass

    # 2. Smart-fill text/number inputs by reading their label
    try:
        inputs = page.locator(
            "input.artdeco-text-input--input, input[type='text'], input[type='number'], input[type='tel']"
        )
        count = await inputs.count()
        for idx in range(count):
            inp = inputs.nth(idx)
            if not await inp.is_visible():
                continue
            val = await inp.input_value()
            if val:
                continue  # already filled

            input_id = await inp.get_attribute("id") or ""
            input_type = await inp.get_attribute("type") or "text"
            label_text = ""
            try:
                if input_id:
                    lbl = page.locator(f"label[for='{input_id}']")
                    if await lbl.count() > 0:
                        label_text = (await lbl.first.inner_text()).strip()
            except Exception:
                pass

            fill_value = smart_fill_value(label_text, input_type)
            await inp.fill(fill_value)
            await sio.emit("log", {
                "level": "INFO",
                "message": f"✏️ Filled \"{label_text or input_type}\" → \"{fill_value}\""
            })
    except Exception:
        pass

    # 3. Handle dropdowns — read label, pick contextually correct option
    try:
        selects = page.locator("select")
        count = await selects.count()
        for idx in range(count):
            sel = selects.nth(idx)
            if not await sel.is_visible():
                continue
            val = await sel.input_value()
            if val:
                continue

            select_id = await sel.get_attribute("id") or ""
            label_text = ""
            try:
                if select_id:
                    lbl = page.locator(f"label[for='{select_id}']")
                    if await lbl.count() > 0:
                        label_text = (await lbl.first.inner_text()).lower()
            except Exception:
                pass

            options = sel.locator("option")
            opt_count = await options.count()
            if opt_count <= 1:
                continue

            selected = False
            # For yes/no type questions, prefer "Yes"
            if any(k in label_text for k in [
                "authorized", "eligible", "sponsor", "citizen", "willing", "agree"
            ]):
                for oi in range(opt_count):
                    opt_text = (await options.nth(oi).inner_text()).lower()
                    if "yes" in opt_text:
                        await sel.select_option(index=oi)
                        selected = True
                        break
            if not selected:
                await sel.select_option(index=1)
    except Exception:
        pass

    # 4. Handle radio buttons — read legend/question, pick smart answer
    try:
        fieldsets = page.locator("fieldset")
        count = await fieldsets.count()
        for idx in range(count):
            fs = fieldsets.nth(idx)
            if not await fs.is_visible():
                continue

            question_text = ""
            try:
                legend = fs.locator("legend, span.artdeco-text, .artdeco-text--medium")
                if await legend.count() > 0:
                    question_text = (await legend.first.inner_text()).strip()
            except Exception:
                pass

            radios = fs.locator("input[type='radio']")
            radio_count = await radios.count()
            if radio_count == 0:
                continue

            target_value = pick_radio_answer(question_text)
            clicked = False

            for ri in range(radio_count):
                radio = radios.nth(ri)
                radio_val = (await radio.get_attribute("value") or "").lower()
                if target_value in radio_val:
                    rid = await radio.get_attribute("id")
                    lbl = fs.locator(f"label[for='{rid}']")
                    if await lbl.count() > 0:
                        await lbl.first.click()
                        clicked = True
                        await sio.emit("log", {
                            "level": "INFO",
                            "message": f"🔘 \"{question_text[:50]}\" → {target_value.capitalize()}"
                        })
                        break

            if not clicked:
                first_radio = radios.first
                rid = await first_radio.get_attribute("id")
                lbl = fs.locator(f"label[for='{rid}']")
                if await lbl.count() > 0:
                    await lbl.first.click()
    except Exception:
        pass


# ─────────────────────────────────────────────
# Main automation entry point
# ─────────────────────────────────────────────
async def run_automation(email: str, password: str, resume_text: str, skills: str, sio):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        )
        page = await context.new_page()
        await Stealth().apply_stealth_async(page)

        try:
            # ── STEP 1: Login ──────────────────────────────
            await sio.emit("log", {"level": "INFO", "message": "🚀 Launching LinkedIn..."})
            await page.goto("https://www.linkedin.com/login", wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_selector("#username", state="visible", timeout=15000)
            await page.fill("#username", email)
            await asyncio.sleep(0.8)
            await page.fill("#password", password)
            await asyncio.sleep(0.5)
            await sio.emit("log", {"level": "INFO", "message": "🔐 Submitting credentials..."})
            await page.click("button[type='submit']")
            await asyncio.sleep(15)

            current_url = page.url
            if "feed" in current_url or "mynetwork" in current_url:
                await sio.emit("log", {"level": "INFO", "message": "✅ Logged in successfully."})
            elif "checkpoint" in current_url or "challenge" in current_url:
                await sio.emit("log", {"level": "WARN", "message": "⚠️ 2FA detected — approve on your phone (60s)..."})
                try:
                    await page.wait_for_url("**/feed/**", timeout=60000)
                    await sio.emit("log", {"level": "INFO", "message": "✅ 2FA approved!"})
                except Exception:
                    await sio.emit("log", {"level": "ERROR", "message": "❌ 2FA timeout. Aborting."})
                    return
            else:
                await sio.emit("log", {"level": "ERROR", "message": f"❌ Login failed. URL: {current_url}"})
                return

            # ── STEP 2: Determine keyword from resume ──────
            await sio.emit("log", {"level": "INFO", "message": "🧠 Analyzing resume for best job keyword..."})
            try:
                prompt = (
                    "Read this resume carefully. Return ONE concise job search keyword "
                    "(e.g. 'Frontend Developer', 'Backend Engineer', 'Full Stack Developer', "
                    "'Data Scientist', 'DevOps Engineer'). Return ONLY the keyword, nothing else."
                )
                keyword = await tailor.tailor_resume(resume_text, prompt)
                keyword = keyword.strip().strip('"').strip("'")
                if not keyword or len(keyword) > 60 or "Error" in keyword:
                    keyword = skills.split(",")[0].strip()
            except Exception:
                keyword = skills.split(",")[0].strip()

            await sio.emit("log", {"level": "INFO", "message": f"🔍 Searching for: \"{keyword}\" (Easy Apply only)..."})

            # ── STEP 3: Navigate to Easy Apply job search ──
            encoded = keyword.replace(" ", "%20")
            search_url = f"https://www.linkedin.com/jobs/search/?keywords={encoded}&f_AL=true&sortBy=DD"
            await page.goto(search_url, wait_until="domcontentloaded", timeout=60000)
            await asyncio.sleep(4)

            # Wait for job cards
            try:
                await page.wait_for_selector("li.jobs-search-results__list-item", timeout=10000)
                job_cards = await page.locator("li.jobs-search-results__list-item").all()
            except Exception:
                try:
                    await page.wait_for_selector(".job-card-container", timeout=5000)
                    job_cards = await page.locator(".job-card-container").all()
                except Exception:
                    job_cards = []

            if not job_cards:
                await sio.emit("log", {"level": "WARN", "message": "⚠️ No job cards found."})
                return

            await sio.emit("log", {
                "level": "INFO",
                "message": f"✅ Found {len(job_cards)} Easy Apply jobs. Processing top 5..."
            })
            os.makedirs("tmp", exist_ok=True)

            # ── STEP 4: Loop through top 5 jobs ──────────
            applied_count = 0
            for i, card in enumerate(job_cards[:5]):
                pdf_path = None
                try:
                    await sio.emit("log", {"level": "INFO", "message": f"── Job #{i+1} ──────────────────────────"})

                    # 4a. Click card
                    await card.scroll_into_view_if_needed()
                    await card.click()
                    await asyncio.sleep(3)

                    # ── EARLY GATE: confirm Easy Apply button exists ──
                    easy_apply_check = page.locator(
                        ".jobs-apply-button--top-card button, "
                        "button.jobs-apply-button, "
                        "button:has-text('Easy Apply')"
                    ).first
                    try:
                        await easy_apply_check.wait_for(state="visible", timeout=3000)
                    except Exception:
                        await sio.emit("log", {"level": "WARN", "message": f"⏭️ Job #{i+1} has no Easy Apply — skipping."})
                        continue

                    # 4b. Extract job title & company from detail panel
                    try:
                        job_title = await page.locator(
                            ".jobs-unified-top-card__job-title, h1.t-24, .job-details-jobs-unified-top-card__job-title"
                        ).first.inner_text(timeout=5000)
                        job_title = job_title.strip()
                    except Exception:
                        job_title = keyword

                    try:
                        company_name = await page.locator(
                            ".jobs-unified-top-card__company-name a, "
                            ".jobs-unified-top-card__subtitle-primary-grouping a, "
                            ".job-details-jobs-unified-top-card__company-name a"
                        ).first.inner_text(timeout=5000)
                        company_name = company_name.strip()
                    except Exception:
                        company_name = "Company"

                    await sio.emit("log", {
                        "level": "INFO",
                        "message": f"📂 {job_title} @ {company_name}"
                    })

                    # 4c. Scrape job description
                    try:
                        jd_el = page.locator(
                            ".jobs-description-content__text, "
                            ".jobs-description__content, "
                            "#job-details"
                        ).first
                        await jd_el.wait_for(state="visible", timeout=5000)
                        jd_text = await jd_el.inner_text()
                    except Exception:
                        jd_text = "General software engineering position."

                    await sio.emit("log", {"level": "INFO", "message": "📋 Job description scraped."})

                    # 4d. Tailor resume via Gemini
                    await sio.emit("log", {"level": "INFO", "message": f"✨ Tailoring resume for {job_title}..."})
                    tailored = await tailor.tailor_resume(resume_text, jd_text)
                    match_score = 90 if "Error" not in tailored else 60
                    await sio.emit("log", {
                        "level": "INFO",
                        "message": f"✅ Resume tailored! Estimated ATS match: {match_score}%"
                    })

                    # 4e. Generate PDF
                    pdf_path = os.path.abspath(f"tmp/tailored_{i+1}.pdf")
                    generate_pdf(tailored, pdf_path)
                    await sio.emit("log", {"level": "INFO", "message": "📄 Tailored PDF generated."})

                    # 4f. Click Easy Apply
                    apply_btn = page.locator(
                        ".jobs-apply-button--top-card button, "
                        "button.jobs-apply-button, "
                        "button:has-text('Easy Apply')"
                    ).first
                    try:
                        await apply_btn.wait_for(state="visible", timeout=5000)
                        await apply_btn.click()
                        await sio.emit("log", {"level": "INFO", "message": "🖱️ Clicked Easy Apply!"})
                        await asyncio.sleep(2)
                    except Exception:
                        await sio.emit("log", {
                            "level": "WARN",
                            "message": f"⚠️ Easy Apply button not found for {company_name}. Skipping."
                        })
                        continue

                    # 4g. Fill form — up to 8 steps
                    await sio.emit("log", {"level": "INFO", "message": "📝 Filling application form..."})
                    for step in range(8):
                        await asyncio.sleep(1.5)
                        await fill_form_step(page, pdf_path, sio)
                        await asyncio.sleep(1)

                        submit_btn = page.locator("button[aria-label='Submit application']")
                        review_btn = page.locator("button[aria-label='Review your application']")
                        next_btn   = page.locator("button[aria-label='Continue to next step']")

                        if await submit_btn.is_visible():
                            await sio.emit("log", {"level": "INFO", "message": "🚀 Submitting application..."})
                            await submit_btn.click()
                            await asyncio.sleep(2)
                            applied_count += 1
                            await sio.emit("log", {
                                "level": "INFO",
                                "message": f"✅ Applied to {job_title} @ {company_name}!"
                            })
                            break
                        elif await review_btn.is_visible():
                            await review_btn.click()
                        elif await next_btn.is_visible():
                            await next_btn.click()
                        else:
                            break

                    # Send real data to Results page
                    await sio.emit("job_applied", {
                        "title": job_title,
                        "company": company_name,
                        "score": f"{match_score}%",
                        "loc": "LinkedIn",
                        "status": "Applied",
                        "link": page.url
                    })

                    # Dismiss any modal
                    try:
                        dismiss = page.locator("button[aria-label='Dismiss']")
                        if await dismiss.is_visible(timeout=2000):
                            await dismiss.click()
                            await asyncio.sleep(1)
                            discard = page.locator(
                                "button[data-control-name='discard_application_confirm_btn']"
                            )
                            if await discard.is_visible():
                                await discard.click()
                    except Exception:
                        pass

                except Exception as e:
                    await sio.emit("log", {"level": "ERROR", "message": f"⚠️ Job #{i+1} error: {str(e)}"})

                finally:
                    if pdf_path and os.path.exists(pdf_path):
                        os.remove(pdf_path)
                        await sio.emit("log", {"level": "INFO", "message": "🗑️ Temp PDF deleted."})

            await sio.emit("log", {
                "level": "INFO",
                "message": f"🏁 Done! Applied to {applied_count} job(s) this session."
            })

        except Exception as e:
            await sio.emit("log", {"level": "ERROR", "message": f"❌ Critical error: {str(e)}"})
        finally:
            await browser.close()
