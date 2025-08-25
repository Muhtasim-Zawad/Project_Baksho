# Dockerfile

# 1. Use an official lightweight Python runtime as a parent image
FROM python:3.11-slim

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy the dependencies file and install them
# This is done in a separate layer to leverage Docker's build cache.
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip -r requirements.txt

# 4. Copy the rest of the application source code into the container
COPY . .

# 5. Expose the port the app runs on
EXPOSE 8001

# 6. Define the command to run the application
# We use 0.0.0.0 to make it accessible from outside the container.
# The APP_HOST environment variable will be used by the Eureka client.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
