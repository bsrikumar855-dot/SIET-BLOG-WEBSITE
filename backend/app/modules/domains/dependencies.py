from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.domains.repository import DomainRepository
from app.modules.domains.service import DomainService


def get_domain_repository(db: AsyncSession = Depends(get_db)) -> DomainRepository:
    return DomainRepository(db)

def get_domain_service(repository: DomainRepository = Depends(get_domain_repository)) -> DomainService:
    return DomainService(repository)
