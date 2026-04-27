import fitz  # PyMuPDF
import docx
import spacy
import os

# Load NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback if model not found
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_skills(text):
    doc = nlp(text)
    # Basic entity extraction for now, will be enhanced with Gemini later
    # Extracting NOUNs and PROPNs as potential skills
    skills = set()
    for token in doc:
        if token.pos_ in ["PROPN", "NOUN"] and len(token.text) > 2:
            skills.add(token.text)
    return list(skills)

def parse_resume(file_path):
    extension = os.path.splitext(file_path)[1].lower()
    if extension == ".pdf":
        text = extract_text_from_pdf(file_path)
    elif extension == ".docx":
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format")
    
    skills = extract_skills(text)
    return {
        "raw_text": text,
        "skills": ", ".join(skills[:20]) # Limit to top 20 for now
    }
