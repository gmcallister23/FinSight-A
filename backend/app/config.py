"""
Application configuration from environment variables.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from .env file."""
    
    # App
    APP_NAME: str = "FinSight"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # APIs
    ALPHA_VANTAGE_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    
    # CORS
    FRONTEND_ORIGIN: str = "https://fin-sight-a-five.vercel.app"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    """Get settings instance (cached)."""
    return Settings()


settings = get_settings()