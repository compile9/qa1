#!/bin/bash
# Build the Docker image
docker build -t qawolf-task .

# Run the Docker container
docker run --rm -it qawolf-task
