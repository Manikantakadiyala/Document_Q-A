Document Q&A System
A document-based question answering system that allows users to query large PDF files (such as books or manuals) stored in Google Drive using natural language. The system retrieves the most relevant chunks from the documents using semantic search and responds using a large language model (LLM) via the Vercel AI SDK.

Features
->Connects to Google Drive to fetch PDF documents

->Uses Transformers.js for text embeddings (locally via Xenova)

->Stores embeddings in a local Qdrant vector database

->Performs semantic search over embedded documents

->Uses OpenRouter (or OpenAI) via Vercel AI SDK to generate answers

->Built with modular Express backend and Next.js React frontend

Tech Stack
Layer	Technology
Frontend	Next.js (React), Vercel AI SDK
Backend	Node.js, Express, TypeScript
Vector DB	Qdrant (running locally on port 6333)
Embeddings	Transformers.js (Xenova/all-MiniLM-L6-v2)
LLM API	OpenAI / OpenRouter (via Vercel AI SDK)

How It Works – Step-by-Step Flow

Document Ingestion ( http://localhost:3000/ingest endpoint):

Loads PDF files from Google Drive using a service account.

Extracts text using pdf-parse.

Splits content into manageable chunks (≈500 tokens).

Uses Transformers.js to generate embeddings for each chunk.

Stores the chunk embeddings into Qdrant along with metadata.

Query Handling ( http://localhost:3000/ask endpoint):

User asks a natural-language question.

The question is embedded using the same Transformers.js model.

Qdrant performs a vector similarity search to return the top N most relevant document chunks.

These are passed to the LLM (via Vercel AI SDK), which answers based on the context.

Setup Instructions

Clone the repo and navigate to the backend:

cd document-qa-system/document-qa-system

npm install

Create a .env file:

GOOGLE_FOLDER_ID=your_google_drive_folder_id
PORT=

Start Qdrant locally (ensure it’s running at http://localhost:6333)

Run the backend:
npm start


Strategy and Design Rationale

Transformer Embeddings (Xenova locally): Using Transformers.js allows embeddings to be generated on-device without OpenAI embedding APIs, saving cost and ensuring data privacy.

Chunked Document Embedding: Breaking down large PDFs into small chunks (~500 tokens) improves semantic retrieval precision.

Qdrant as Vector DB: Chosen for its blazing-fast similarity search capabilities and ease of use with local or Docker setup.

Vercel AI SDK: Provides a streamlined way to call OpenAI or OpenRouter LLMs with context passing, out of the box.

Two-tiered Retrieval-Augmented Generation (RAG):

First layer: retrieves semantically matched document chunks

Second layer: generates answers using a language model based on those chunks
