FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Run Uvicorn on Render's automatic PORT
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}
