import aioboto3
from typing import Optional
from app.core.config import Environment, settings
from app.core.logging import logger

class R2StorageClient:
    def __init__(self):
        self.account_id = settings.R2_ACCOUNT_ID
        self.access_key = settings.R2_ACCESS_KEY_ID
        self.secret_key = settings.R2_SECRET_ACCESS_KEY.get_secret_value()
        self.bucket = settings.R2_BUCKET_NAME
        self.endpoint_url = f"https://{self.account_id}.r2.cloudflarestorage.com"
        
        self.session = aioboto3.Session()

    async def check_health(self) -> bool:
        """Check connection to S3/R2 storage provider."""
        if not self.account_id or not self.access_key:
            if settings.ENV == Environment.testing:
                return True
            return False
            
        try:
            async with self.session.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                region_name='auto'
            ) as s3_client:
                await s3_client.head_bucket(Bucket=self.bucket)
                return True
        except Exception as e:
            logger.error(f"Storage health check failed: {e}")
            return False

    async def upload_file(self, file_bytes: bytes, object_key: str, content_type: str = "application/octet-stream") -> bool:
        """Upload raw file bytes to R2 bucket."""
        if settings.ENV == Environment.testing:
            return True

        try:
            async with self.session.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                region_name='auto'
            ) as s3_client:
                await s3_client.put_object(
                    Bucket=self.bucket,
                    Key=object_key,
                    Body=file_bytes,
                    ContentType=content_type
                )
                logger.info(f"Uploaded key {object_key} to bucket {self.bucket}")
                return True
        except Exception as e:
            logger.error(f"Failed to upload {object_key} to storage: {e}")
            return False

    async def delete_file(self, object_key: str) -> bool:
        """Delete an object from R2 bucket."""
        if settings.ENV == Environment.testing:
            return True

        try:
            async with self.session.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                region_name='auto'
            ) as s3_client:
                await s3_client.delete_object(
                    Bucket=self.bucket,
                    Key=object_key
                )
                logger.info(f"Deleted key {object_key} from bucket {self.bucket}")
                return True
        except Exception as e:
            logger.error(f"Failed to delete {object_key} from storage: {e}")
            return False

    def public_url(self, object_key: str) -> str:
        """Return the public URL for an object (assuming public bucket access is configured)."""
        # If there's a custom domain, we'd use it here. Defaulting to Cloudflare's public R2 URL structure
        # In a real app this should be a configurable setting like settings.STORAGE_PUBLIC_URL
        return f"https://pub-{self.account_id}.r2.dev/{object_key}"
