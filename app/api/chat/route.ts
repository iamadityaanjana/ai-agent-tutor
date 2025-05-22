import { NextRequest, NextResponse } from 'next/server';
import { TutorAgent } from '../../../lib/agents/tutor-agent';
import { ConversationContext, Message } from '../../../lib/agents/types';

export const maxDuration = 30; // Set max duration to 30 seconds for serverless function

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    // Initialize tutor agent
    const tutorAgent = new TutorAgent(apiKey);
    
    // Create context from conversation history
    const context: ConversationContext = {
      history: history || [],
    };
    
    // Process the message
    const response = await tutorAgent.process(message, context);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing message:', error);
    
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
