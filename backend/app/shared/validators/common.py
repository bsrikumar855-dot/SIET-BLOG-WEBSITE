import re

def validate_email_format(email: str) -> str:
    """Validates if the provided string follows a standard email format."""
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if not re.match(pattern, email):
        raise ValueError("Invalid email format.")
    return email

def validate_password_strength(password: str) -> str:
    """Validates if the password has at least 8 characters, containing a letter and digit."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not any(char.isdigit() for char in password):
        raise ValueError("Password must contain at least one digit.")
    if not any(char.isalpha() for char in password):
        raise ValueError("Password must contain at least one letter.")
    return password
