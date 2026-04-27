import google.generativeai as genai
from openai import AsyncOpenAI
from config import GEMINI_API_KEY, OPENROUTER_API_KEY

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# Configure OpenRouter
if OPENROUTER_API_KEY:
    or_client = AsyncOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )
else:
    or_client = None

async def analyze_job_market(job_title: str) -> str:
    if not or_client:
        return "⚠️ OpenRouter API key not configured. Using default market data."
    
    prompt = f"Provide a very brief (2 sentences) market analysis and top 3 key skills currently in demand for the role: {job_title}."
    
    try:
        completion = await or_client.chat.completions.create(
            model="google/gemini-2.5-flash", # Or any other openrouter model
            messages=[
                {"role": "system", "content": "You are an expert technical recruiter providing quick market insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error fetching market data: {str(e)}"

async def tailor_resume(resume_text: str, job_description: str) -> str:
    if not model:
        return "⚠️ Gemini API key not configured. Mock tailored resume."
    
    prompt = f"""
    You are an expert technical recruiter and resume writer.
    Your task is to tailor the following resume to perfectly match the provided job description.
    
    RULES:
    1. Highlight relevant skills and experiences that match the job description.
    2. Rewrite the bullet points to be more impactful (use action verbs and metrics).
    3. DO NOT hallucinate or add fake experience, skills, or metrics that aren't implied by the original resume.
    4. Ensure the resulting resume is highly optimized for ATS (Applicant Tracking Systems).
    5. Output ONLY the tailored resume text in plain text format.
    
    JOB DESCRIPTION:
    {job_description}
    
    ORIGINAL RESUME:
    {resume_text}
    """
    
    try:
        # Use generate_content_async for non-blocking execution
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        return f"Error during Gemini tailoring: {str(e)}"
