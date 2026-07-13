from enum import Enum

class ContentKind(str, Enum):
    NEWS = "news"
    ARTICLE = "article"
    MAGAZINE = "magazine"

class ContentStatus(str, Enum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class MagazineType(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"
    SPECIAL = "special"

class MediaType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    DOCUMENT = "document"
    AUDIO = "audio"
