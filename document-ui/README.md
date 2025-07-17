# Document Q&A UI (Frontend)

This is the frontend interface for the Document Q&A System. It is built with **Next.js 13+ (App Router)** and integrates the **Vercel AI SDK** to communicate with a backend service that handles document search and question answering.

---

## Features

- Clean and minimal UI for chatting with your document knowledge base
- Connects to a local or hosted Node.js backend
- Uses **OpenRouter** (or **OpenAI**) via Vercel AI SDK for final answer generation
- Simple to deploy on Vercel or run locally

## Tech Stack

| Layer     | Technology                      |
|-----------|----------------------------------|
| Framework | Next.js 13+ (App Router)         |
| LLM SDK   | Vercel AI SDK (`@vercel/ai`)     |
| Styling   | Tailwind CSS                     |
| UI        | ShadCN (optional) / Basic HTML   |

## Setup Instructions

### 1. Clone & Install

cd document-qa-ui
npm install

# Configure Environment Variables

Create a .env.local file in the root of the frontend:

# Use your OpenRouter or OpenAI key
OPENROUTER_API_KEY=your_openrouter_or_openai_key

# Backend URL
BACKEND_URL=http://localhost:3000

# Start the Development Server

npm run dev -- -p 5173
Open the app in your browser: http://localhost:5173

# How It Works
The user enters a question in the chat box

The question is sent to the backend (/ask) API route

The backend embeds the question and retrieves relevant chunks from Qdrant

The backend forwards those chunks + the question to the LLM (OpenAI or OpenRouter)

The response is returned to the frontend and displayed in the UI

