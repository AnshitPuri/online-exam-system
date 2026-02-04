from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Online Examination System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = "mysql+pymysql://root:tiger@localhost:3306/exam_system"
    
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-characters-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]
    
    ADMIN_EMAIL: str = "admin@exam.com"
    ADMIN_PASSWORD: str = "Admin@123"
    
    MAX_TAB_SWITCHES: int = 3
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()