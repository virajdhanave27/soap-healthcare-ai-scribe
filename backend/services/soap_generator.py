def generate_soap_note(transcript: str):

    soap_note = f"""
SUBJECTIVE:
{transcript}

OBJECTIVE:
Patient consultation recorded.

ASSESSMENT:
Further clinical evaluation required.

PLAN:
Follow-up based on physician review.
"""

    return soap_note