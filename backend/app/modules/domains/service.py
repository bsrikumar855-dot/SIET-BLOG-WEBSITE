from typing import List
from app.modules.domains.models import Domain
from app.modules.domains.schemas import DomainCreate, DomainUpdate
from app.modules.domains.repository import DomainRepository
from app.modules.domains.exceptions import DomainNotFoundException, DomainAlreadyExistsException
from app.shared.utils.slugs import generate_slug, ensure_unique_slug

class DomainService:
    def __init__(self, repository: DomainRepository):
        self.repository = repository

    async def get_domain(self, domain_id: int) -> Domain:
        domain = await self.repository.get_by_id(domain_id)
        if not domain:
            raise DomainNotFoundException()
        return domain

    async def get_domain_by_slug(self, slug: str) -> Domain:
        domain = await self.repository.get_by_slug(slug)
        if not domain:
            raise DomainNotFoundException()
        return domain

    async def list_domains(self, skip: int = 0, limit: int = 100) -> List[Domain]:
        return await self.repository.get_all(skip, limit)

    async def create_domain(self, domain_in: DomainCreate) -> Domain:
        slug = generate_slug(domain_in.name)
        slug = await ensure_unique_slug(self.repository.db, Domain, slug)
        
        domain = Domain(
            name=domain_in.name,
            slug=slug,
            description=domain_in.description
        )
        domain = await self.repository.create(domain)
        await self.repository.db.commit()
        await self.repository.db.refresh(domain)
        return domain

    async def update_domain(self, domain_id: int, domain_in: DomainUpdate) -> Domain:
        domain = await self.get_domain(domain_id)
        
        update_dict = domain_in.model_dump(exclude_unset=True)
        if "name" in update_dict and update_dict["name"] != domain.name:
            slug = generate_slug(update_dict["name"])
            slug = await ensure_unique_slug(self.repository.db, Domain, slug, exclude_id=domain_id)
            update_dict["slug"] = slug
            
        for key, value in update_dict.items():
            setattr(domain, key, value)
            
        domain = await self.repository.update(domain)
        await self.repository.db.commit()
        await self.repository.db.refresh(domain)
        return domain

    async def delete_domain(self, domain_id: int) -> None:
        domain = await self.get_domain(domain_id)
        await self.repository.delete(domain)
        await self.repository.db.commit()
