import xml.etree.ElementTree as ET
from typing import Any

import httpx

from app.core.logging import logger


class RSSClient:
    """Client for fetching and parsing RSS feeds without business logic."""
    
    def __init__(self):
        self.timeout = httpx.Timeout(15.0)

    async def fetch_feed(self, url: str) -> list[dict[str, Any]]:
        """Fetches an RSS feed and returns parsed items as dictionaries."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url)
                response.raise_for_status()
                
                return self._parse_xml(response.text)
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching RSS feed from {url}: {e}")
            return []
        except ET.ParseError as e:
            logger.error(f"XML parse error for feed {url}: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error fetching feed {url}: {e}")
            return []

    def _parse_xml(self, xml_content: str) -> list[dict[str, Any]]:
        """Parses generic RSS/Atom XML content into a list of dicts."""
        items = []
        root = ET.fromstring(xml_content)
        
        # Determine if RSS or Atom
        is_atom = "http://www.w3.org/2005/Atom" in root.tag
        
        if is_atom:
            # Simple Atom parser
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            entries = root.findall(".//atom:entry", namespaces=ns)
            for entry in entries:
                title = entry.find("atom:title", namespaces=ns)
                link = entry.find("atom:link", namespaces=ns)
                summary = entry.find("atom:summary", namespaces=ns)
                published = entry.find("atom:published", namespaces=ns)
                
                href = link.attrib.get("href") if link is not None else None
                
                items.append({
                    "title": title.text if title is not None else "",
                    "link": href,
                    "summary": summary.text if summary is not None else "",
                    "published": published.text if published is not None else "",
                })
        else:
            # Simple RSS parser
            channel_items = root.findall(".//item")
            for item in channel_items:
                title = item.find("title")
                link = item.find("link")
                description = item.find("description")
                pub_date = item.find("pubDate")
                
                items.append({
                    "title": title.text if title is not None else "",
                    "link": link.text if link is not None else "",
                    "description": description.text if description is not None else "",
                    "pub_date": pub_date.text if pub_date is not None else "",
                })
                
        return items
