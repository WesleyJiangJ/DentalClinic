FROM python:3.9.6

WORKDIR /app

COPY wait-for-it.sh /usr/local/bin/wait-for-it
COPY build.sh /usr/local/bin/build.sh

RUN chmod +x /usr/local/bin/wait-for-it && chmod +x /usr/local/bin/build.sh

RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt --disable-pip-version-check

COPY . .

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/build.sh"]