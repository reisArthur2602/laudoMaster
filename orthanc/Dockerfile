
FROM python:3.10-slim
WORKDIR /app
RUN python3 -m venv /app/venv
COPY requirements.txt .
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["/app/venv/bin/python", "app.py"]
