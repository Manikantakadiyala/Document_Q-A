# Document Q&A System

This is a full-stack AI-powered system for querying large PDF documents (books, manuals, research papers) stored in Google Drive using natural language. The system performs semantic search using Qdrant vector DB and answers queries using an LLM (OpenAI or OpenRouter) via the Vercel AI SDK.

## Key Features

- Connects to Google Drive and downloads PDF documents using a service account
- Extracts, chunks, and embeds document text using Transformers.js (Xenova)
- Stores document chunks and embeddings in a local Qdrant vector database
- Provides a REST API for ingesting documents and asking questions
- Uses OpenAI or OpenRouter to generate answers from the most relevant document chunks
- Frontend interface built with Next.js and Vercel AI SDK for user interaction

## Getting Started

To run the project locally, you need to set up both the backend and the frontend.

### 1. Backend Setup

See: `document-qa-system/README.md`

Key environment variables to include in `.env`:

GOOGLE_FOLDER_ID=your_google_drive_folder_id
PORT=3000

Google service account credentials
PROJECT_ID=your_project_id
PRIVATE_KEY_ID=your_private_key_id
PRIVATE_KEY="your_private_key_with_newlines_escaped"
CLIENT_EMAIL=your_service_account_email
CLIENT_ID=your_client_id
AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
CLIENT_X509_CERT_URL=your_cert_url
UNIVERSE_DOMAIN=googleapis.com

#qdrant setup
Your backend uses Qdrant as the vector database to store document embeddings. You need Qdrant running locally before starting the backend.

Option 1: Run Qdrant Using Docker (Recommended)
Install Docker

Download and install Docker from: https://www.docker.com/products/docker-desktop/

Start Docker after installation.

Run Qdrant container

In your terminal, run:
docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
This will pull and run the official Qdrant image.

It will store Qdrant data locally in the qdrant_storage folder.

Verify it's running

Visit: http://localhost:6333


#Start the backend server:
cd document-qa-system
npm install
npm start
Qdrant must be running locally on port 6333.

2. Frontend Setup
See: document-qa-ui/README.md

Configure .env.local like this:

OPENROUTER_API_KEY=your_openrouter_or_openai_key
BACKEND_URL=http://localhost:3000

Start the frontend:
cd document-qa-ui
npm install
npm run dev -- -p 5173
Open in browser: http://localhost:5173

#System Flow Overview

Document Ingestion Flow (Backend)
/ingest API fetches PDF documents from Google Drive using service account credentials.

PDF content is extracted and split into ~500-token chunks.

Chunks are embedded using Xenova's all-MiniLM-L6-v2 model (Transformers.js).

Embeddings and metadata are stored in Qdrant (running locally).

Question Answering Flow (Backend & Frontend)
User enters a question on the frontend.

Frontend sends question to backend /ask API.

Backend embeds the question and retrieves the most relevant chunks from Qdrant.

These chunks are passed to the LLM (OpenRouter or OpenAI) via the Vercel AI SDK.

Answer is returned and shown to the user.

#Screenshots
Screenshots showing chunking, ingestion, and Qdrant upsert process can be found in:
document-qa-system/screenshots/
#License
This project is for educational and technical assessment purposes only.
Let me know if you'd like me to generate or include the `document-qa-system/README.md` and `document-qa-ui/REA
