import re

from fastapi import HTTPException, status

from app.shared.types.content import ContentStatus


def calculate_reading_time(text: str, wpm: int = 200) -> int:
    """Calculates reading time in minutes based on words per minute (WPM)."""
    if not text:
        return 1
    words = len(re.findall(r"\w+", text))
    minutes = words / wpm
    return max(1, round(minutes))

def validate_publish_state(status_val: ContentStatus, required_fields: dict) -> None:
    """Validates that a model has all required fields to be published."""
    if status_val == ContentStatus.PUBLISHED:
        missing = [k for k, v in required_fields.items() if not v]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot publish. Missing required fields: {', '.join(missing)}"
            )

def validate_status_transition(current_status: ContentStatus, new_status: ContentStatus) -> None:
    """Validates if a status transition is allowed."""
    if current_status == new_status:
        return
        
    allowed_transitions = {
        ContentStatus.DRAFT: [ContentStatus.REVIEW, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED],
        ContentStatus.REVIEW: [ContentStatus.DRAFT, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED],
        ContentStatus.PUBLISHED: [ContentStatus.DRAFT, ContentStatus.ARCHIVED],
        ContentStatus.ARCHIVED: [ContentStatus.DRAFT]
    }
    
    if new_status not in allowed_transitions.get(current_status, []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from {current_status.value} to {new_status.value}"
        )
