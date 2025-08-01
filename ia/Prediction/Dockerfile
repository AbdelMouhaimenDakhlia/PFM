FROM python:3.10-slim

WORKDIR /app

# Installer pandas, numpy, flask, oracledb, catboost, etc.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "api_catboost.py"]
