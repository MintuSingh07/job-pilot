from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ResumeBase(BaseModel):
    filename: str
    raw_text: str
    skills: str

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    job_url: str

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    match_score: Optional[float] = None
    ats_score: Optional[float] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class LogBase(BaseModel):
    level: str
    message: str

class Log(LogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
