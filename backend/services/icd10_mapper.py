ICD_CODES = {
    "diabetes": {
        "code": "E11.9",
        "description": "Type 2 Diabetes Mellitus"
    },
    "hypertension": {
        "code": "I10",
        "description": "Essential Hypertension"
    },
    "fever": {
        "code": "R50.9",
        "description": "Fever"
    },
    "headache": {
        "code": "R51.9",
        "description": "Headache"
    },
    "asthma": {
        "code": "J45.909",
        "description": "Asthma"
    }
}


def get_icd10_codes(transcript: str):

    transcript = transcript.lower()

    results = []

    for keyword, value in ICD_CODES.items():
        if keyword in transcript:
            results.append(value)

    return results