# Use Ubuntu Focal (20.04) as the base image
FROM ubuntu:focal

# Set non-interactive mode to avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install Python and other dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt ./

# Install the Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY app.py ./

# Expose port 8000 for the FastAPI app
EXPOSE 8000

# Run the FastAPI application using uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
