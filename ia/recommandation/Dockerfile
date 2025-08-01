FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV ORACLE_HOST=oracle
ENV ORACLE_PORT=1521
ENV ORACLE_DB=XE
ENV ORACLE_USER=system
ENV ORACLE_PASS=oracle

EXPOSE 5000

CMD ["python", "xgb-api.py"]
