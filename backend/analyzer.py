"""Google Gemini API integration for conversation analysis."""

import json
import os
import re
import time

from google import genai

SYSTEM_PROMPT = (
    "You are a digital safety AI that analyzes conversations for scams, "
    "manipulation, grooming, or harassment. Return ONLY a valid JSON object "
    "with this structure: { \"overall_risk_level\": \"LOW\"/\"MODERATE\"/\"HIGH\", "
    "\"risk_score\": 0-100, \"summary\": \"string\", "
    "\"detected_tactics\": [\"string\"], "
    "\"suspicious_phrases\": [{\"phrase\": \"string\", \"reason\": \"string\", "
    "\"severity\": \"low\"/\"medium\"/\"high\"}], "
    "\"safety_advice\": [\"string\"] }. "
    "Tactics to detect: Love Bombing, Urgency/Pressure, Isolation Attempt, "
    "Financial Request, Gift Card Request, Fake Emergency, Guilt Tripping, "
    "Identity Concealment, Personal Info Harvesting. "
    "If the conversation is normal return LOW risk with a score under 30. "
    "Do NOT wrap the JSON in markdown code fences. Return raw JSON only."
)

MODEL = "gemini-2.0-flash-lite"
MAX_RETRIES = 3


def get_client():
    """Create and return a Gemini client."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
    return genai.Client(api_key=api_key)


def _fallback_analysis(conversation_text: str) -> dict:
    """
    Provide a basic keyword-based analysis when the API is unavailable.
    This is a simple heuristic fallback — not AI-powered.
    """
    text_lower = conversation_text.lower()

    # Keyword-based detection
    scam_keywords = {
        "send money": ("Financial Request", "high"),
        "gift card": ("Gift Card Request", "high"),
        "wire transfer": ("Financial Request", "high"),
        "western union": ("Financial Request", "high"),
        "bitcoin": ("Financial Request", "medium"),
        "crypto": ("Financial Request", "medium"),
        "bank account": ("Personal Info Harvesting", "high"),
        "ssn": ("Personal Info Harvesting", "high"),
        "social security": ("Personal Info Harvesting", "high"),
        "password": ("Personal Info Harvesting", "high"),
        "urgent": ("Urgency/Pressure", "medium"),
        "hurry": ("Urgency/Pressure", "medium"),
        "act now": ("Urgency/Pressure", "medium"),
        "limited time": ("Urgency/Pressure", "medium"),
        "don't tell anyone": ("Isolation Attempt", "high"),
        "keep this secret": ("Isolation Attempt", "high"),
        "only trust me": ("Isolation Attempt", "high"),
        "i love you": ("Love Bombing", "medium"),
        "soulmate": ("Love Bombing", "medium"),
        "meant to be": ("Love Bombing", "medium"),
        "emergency": ("Fake Emergency", "high"),
        "hospital": ("Fake Emergency", "medium"),
        "accident": ("Fake Emergency", "medium"),
        "feel guilty": ("Guilt Tripping", "medium"),
        "after everything i've done": ("Guilt Tripping", "medium"),
    }

    detected_tactics = set()
    suspicious_phrases = []

    for keyword, (tactic, severity) in scam_keywords.items():
        if keyword in text_lower:
            detected_tactics.add(tactic)
            suspicious_phrases.append({
                "phrase": keyword,
                "reason": f"Potential indicator of {tactic}",
                "severity": severity,
            })

    # Calculate risk score
    if not suspicious_phrases:
        risk_score = 15
        risk_level = "LOW"
        summary = (
            "⚠️ API quota exceeded — using basic keyword analysis. "
            "No obvious suspicious keywords detected in this conversation. "
            "For a full AI-powered analysis, please try again later when the API quota resets."
        )
    elif len(suspicious_phrases) <= 2:
        risk_score = 45
        risk_level = "MODERATE"
        summary = (
            f"⚠️ API quota exceeded — using basic keyword analysis. "
            f"Found {len(suspicious_phrases)} potentially suspicious keyword(s): "
            f"{', '.join(detected_tactics)}. "
            f"For a full AI analysis, try again later."
        )
    else:
        risk_score = 75
        risk_level = "HIGH"
        summary = (
            f"⚠️ API quota exceeded — using basic keyword analysis. "
            f"Found {len(suspicious_phrases)} suspicious keyword(s) across "
            f"{len(detected_tactics)} tactic(s): {', '.join(detected_tactics)}. "
            f"For a full AI analysis, try again later."
        )

    safety_advice = [
        "This is a basic keyword-based analysis (API quota exceeded).",
        "For accurate AI-powered results, try again in a few minutes.",
        "Never share personal/financial information with strangers online.",
        "If something feels off, trust your instincts and stop the conversation.",
        "Report suspicious accounts to the platform.",
    ]

    return {
        "overall_risk_level": risk_level,
        "risk_score": risk_score,
        "summary": summary,
        "detected_tactics": list(detected_tactics),
        "suspicious_phrases": suspicious_phrases,
        "safety_advice": safety_advice,
    }


def analyze_conversation(conversation_text: str) -> dict:
    """
    Send a conversation to Gemini for analysis and return structured results.
    Falls back to keyword-based analysis if the API quota is exceeded.
    """
    client = get_client()

    # Retry with exponential backoff for rate-limit errors
    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=f"Analyze the following conversation for suspicious activity:\n\n{conversation_text}",
                config={
                    "system_instruction": SYSTEM_PROMPT,
                    "temperature": 0.2,
                },
            )
            break
        except Exception as e:
            is_rate_limit = "429" in str(e) or "rate" in str(e).lower() or "quota" in str(e).lower()
            if is_rate_limit and attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
                continue
            elif is_rate_limit:
                # All retries exhausted — use fallback
                print(f"⚠️  API quota exceeded after {MAX_RETRIES} retries. Using fallback analysis.")
                return _fallback_analysis(conversation_text)
            raise

    response_text = response.text

    # Try to parse JSON from the response
    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", response_text)
        if json_match:
            result = json.loads(json_match.group(1).strip())
        else:
            json_match = re.search(r"\{[\s\S]*\}", response_text)
            if json_match:
                result = json.loads(json_match.group(0))
            else:
                raise ValueError("Could not parse JSON from Gemini's response.")

    # Validate required fields
    required_fields = [
        "overall_risk_level",
        "risk_score",
        "summary",
        "detected_tactics",
        "suspicious_phrases",
        "safety_advice",
    ]
    for field in required_fields:
        if field not in result:
            raise ValueError(f"Missing required field in response: {field}")

    return result
