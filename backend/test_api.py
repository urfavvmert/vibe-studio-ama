import requests
import json

response = requests.post(
    "http://localhost:8000/api/generate",
    json={"content": "dating appler", "tone": "viral"}
)
print(response.status_code)
try:
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
except Exception as e:
    print(response.text)
