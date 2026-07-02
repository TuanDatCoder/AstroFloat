import { NextResponse } from 'next/server';
import { TarotAiPromptManager } from '@/services/aiPromptService';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { topicName, cards, fullText, styleName } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Khởi tạo model Gemini Flash (phiên bản ổn định mới nhất của Google)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = TarotAiPromptManager.getSummaryPrompt(topicName, cards, fullText, styleName);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });
    
    const aiText = result.response.text();

    if (!aiText) {
      throw new Error('Không nhận được phản hồi từ AI.');
    }

    return NextResponse.json({ success: true, analysis: aiText });
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

