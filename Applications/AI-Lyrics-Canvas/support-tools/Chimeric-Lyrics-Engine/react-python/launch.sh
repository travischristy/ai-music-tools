#!/bin/bash

# Activate conda environment
source /opt/homebrew/anaconda3/bin/activate chimeric-lyrics

# Start the backend server in the background
cd backend

echo "Starting backend server..."
uvicorn main:app --host 0.0.0.0 --port 8000 & 

# Go back to the root directory and start the frontend server
cd ../frontend

echo "Starting frontend server..."
npm run dev
