import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    'HTTP-Referer': 'http://localhost:5173', 
  },
});

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const contextRes = await fetch(`${backendUrl}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await contextRes.json();
    if (!contextRes.ok) {
      console.error('Backend /ask error:', data);
      return NextResponse.json({ error: 'Failed to get context from backend' }, { status: 500 });
    }

    const context = typeof data === 'string' ? data : data.answer;

    const prompt = `Context: ${context}\n\nQuestion: ${question}\nAnswer:`;

    const result = await generateText({
      model: openai('anthropic/claude-3-haiku'), 
      prompt,
      maxTokens: 500,
    });

    return NextResponse.json({ answer: result.text.trim() });
  } catch (error: any) {
    console.error(' Error in /api/ask route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
