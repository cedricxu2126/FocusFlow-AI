
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()


def get_ai_client():
    """Create an OpenAI client using the saved API key."""

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise ValueError("OpenAI API key was not found.")

    return OpenAI(api_key=api_key)


def test_ai_connection():
    """Send a simple test request to OpenAI."""

    client = get_ai_client()

    response = client.responses.create(
        model="gpt-4.1-mini",
        input="Say hello to FocusFlow AI in one short sentence."
    )

    return response.output_text
