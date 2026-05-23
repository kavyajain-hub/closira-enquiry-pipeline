import json
import httpx
from typing import Optional, Dict
from app.core.config import settings
from app.core.logging import logger

def analyze_enquiry_with_ai(customer_name: str, message: str) -> Optional[Dict]:
    """
    Calls the Google Gemini API to analyze a customer enquiry, match it to a standard SOP,
    generate a 1-sentence intent summary, and draft a personalized response.
    
    If GEMINI_API_KEY is not set or the request fails, returns None to trigger local fallback.
    """
    if not settings.GEMINI_API_KEY:
        logger.info(
            "GEMINI_API_KEY not configured. Operating in local regex keyword matching mode.",
            extra={"extra_data": {"mode": "fallback"}}
        )
        return None

    # Construct the instruction and prompt for Gemini
    system_instruction = (
        "You are Closira's AI Copilot, an expert customer communication assistant for SMBs. "
        "Your task is to analyze an incoming customer message, summarize it in exactly one sentence, "
        "classify it under one of our 4 Standard Operating Procedures (SOPs), draft a warm personalized reply, "
        "and determine the correct operational pipeline status.\n\n"
        
        "Here are our 4 standard SOPs and routing guidelines:\n"
        "1. **SOP-001: Lead Qualification & Booking**\n"
        "   - **Criteria**: Customer wants to schedule a product demo, book a slot, make an appointment, or reserve something.\n"
        "   - **Suggested Response Guideline**: Express enthusiasm, thank them, and ask for their preferred date and time to schedule the session.\n"
        "   - **Status**: qualified\n"
        "2. **SOP-002: Service Pricing & Cataloging**\n"
        "   - **Criteria**: Customer asks about prices, fees, cost, quotes, discounts, pricing tiers, or plans.\n"
        "   - **Suggested Response Guideline**: Warmly thank them, state that custom platform packages start at just $99/month, mention that a detailed catalog has been emailed, and ask if they'd like a call.\n"
        "   - **Status**: qualified\n"
        "3. **SOP-003: High Priority Complaint**\n"
        "   - **Criteria**: Customer reports double charging, billing errors, broken service, malfunctions, expresses anger, or requests a refund.\n"
        "   - **Suggested Response Guideline**: Apologize sincerely and deeply, state that a manager or director has been notified immediately, and assure them someone will call them shortly.\n"
        "   - **Status**: escalated\n"
        "4. **SOP-004: After-Hours Automated Routing**\n"
        "   - **Criteria**: Customer asks about opening hours, operating times, closing schedules, or weekend support.\n"
        "   - **Suggested Response Guideline**: Thank them, state that offices are currently closed, explain their inquiry is safely queued, and assure them a support representative will reply first thing in the morning.\n"
        "   - **Status**: qualified\n\n"
        
        "If a customer query doesn't match any of these SOPs, or explicitly requests to speak with a human/supervisor, "
        "set `matched_sop` to null, `status` to 'escalated', and draft a warm response asking them to wait a moment "
        "while a human operator connects.\n\n"
        
        "IMPORTANT: You MUST return a single, valid JSON object ONLY. Do not include any markdown block fences or additional commentary. "
        "The JSON object must contain exactly the following keys and data types:\n"
        "{\n"
        "  \"matched_sop\": string | null (must be exactly 'SOP-001: Lead Qualification & Booking', 'SOP-002: Service Pricing & Cataloging', 'SOP-003: High Priority Complaint', 'SOP-004: After-Hours Automated Routing', or null),\n"
        "  \"suggested_response\": string (personalized drafted response, address them by customer name if provided),\n"
        "  \"status\": string (must be exactly 'qualified' or 'escalated'),\n"
        "  \"ai_summary\": string (exactly 1 sentence summarizing the customer's intent or query)\n"
        "}"
    )

    user_prompt = f"Customer Name: {customer_name}\nCustomer Message: \"{message}\"\n\nAnalyze and respond in the requested JSON format."

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_instruction}\n\n{user_prompt}"}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        logger.info(
            "Sending REST request to Google Gemini API.",
            extra={"extra_data": {"model": "gemini-2.5-flash", "customer": customer_name}}
        )
        
        response = httpx.post(url, headers=headers, json=payload, timeout=12.0)
        
        if response.status_code != 200:
            logger.error(
                f"Gemini API request failed with status code {response.status_code}.",
                extra={"extra_data": {"error_body": response.text}}
            )
            return None

        result_json = response.json()
        
        # Extract text from response structure
        candidates = result_json.get("candidates", [])
        if not candidates:
            logger.error("No candidates returned from Gemini API response.")
            return None
            
        content_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        if not content_text:
            logger.error("No text parts found in Gemini API candidate.")
            return None

        # Parse the structured JSON response
        parsed_data = json.loads(content_text.strip())
        
        # Perform schema verification checks
        required_keys = ["matched_sop", "suggested_response", "status", "ai_summary"]
        if not all(k in parsed_data for k in required_keys):
            logger.error("Parsed Gemini response is missing required keys.", extra={"extra_data": {"keys": list(parsed_data.keys())}})
            return None
            
        logger.info(
            "Gemini API successfully qualified enquiry and returned structured metadata.",
            extra={
                "extra_data": {
                    "matched_sop": parsed_data.get("matched_sop"),
                    "status": parsed_data.get("status"),
                    "ai_summary": parsed_data.get("ai_summary")
                }
            }
        )
        return parsed_data

    except httpx.RequestError as exc:
        logger.error(
            f"HTTP connection error while calling Gemini API: {exc}.",
            extra={"extra_data": {"exception": str(exc)}}
        )
        return None
    except json.JSONDecodeError as exc:
        logger.error(
            f"Failed to parse JSON response from Gemini model: {exc}.",
            extra={"extra_data": {"raw_response": content_text if 'content_text' in locals() else None}}
        )
        return None
    except Exception as exc:
        logger.error(
            f"Unexpected error in Gemini AI integration: {exc}.",
            extra={"extra_data": {"exception": str(exc)}}
        )
        return None
