import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Sử dụng model gemini-flash-latest (chuẩn nhất cho chat nhanh)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest', 
      systemInstruction: "Bạn là Astro, Trợ lý ảo Vũ Trụ của trang web AstroFloat (website về chiêm tinh, Tarot, thần số học, tình duyên). Hãy trả lời người dùng một cách cực kỳ dễ thương, ngọt ngào, dùng các đại từ xưng hô thân thiện như 'mình', 'bạn'.\n\nQUY TẮC QUAN TRỌNG: Bạn CHỈ ĐƯỢC PHÉP trả lời các câu hỏi liên quan đến chiêm tinh, Tarot, thần số học, cung hoàng đạo, tình duyên hoặc động viên tinh thần. Nếu người dùng hỏi những câu hỏi ngoài lề (toán học, lập trình, chính trị, kiến thức chung, v.v.), hãy KHÉO LÉO TỪ CHỐI trả lời và hướng họ quay lại chủ đề của trang web.\n\nTrả lời ngắn gọn khoảng 2-3 câu để hiển thị vừa vặn trong khung chat nhỏ."
    });

    // 1. Lọc và gộp tin nhắn để ĐẢM BẢO xen kẽ (user -> model -> user -> model)
    const validContents = [];
    let lastRole = null;
    
    messages.forEach((msg) => {
      const currentRole = msg.sender === 'user' ? 'user' : 'model';
      
      // Bỏ qua nếu tin nhắn đầu tiên không phải của user
      if (validContents.length === 0 && currentRole !== 'user') return;
      
      if (currentRole === lastRole) {
         // Nếu bị trùng role (ví dụ user gửi 2 tin liên tiếp), gộp text lại
         validContents[validContents.length - 1].parts[0].text += '\n' + msg.text;
      } else {
         validContents.push({
           role: currentRole,
           parts: [{ text: msg.text }]
         });
         lastRole = currentRole;
      }
    });

    // Nếu không có tin nhắn hợp lệ nào, tạo 1 tin nhắn mặc định
    if (validContents.length === 0) {
      validContents.push({
        role: 'user',
        parts: [{ text: 'Xin chào' }]
      });
    }

    // 2. Cắt 10 tin nhắn gần nhất
    let finalContents = validContents.slice(-10);
    
    // 3. ĐẢM BẢO mảng sau khi cắt vẫn phải BẮT ĐẦU bằng 'user'
    if (finalContents.length > 0 && finalContents[0].role !== 'user') {
      finalContents = finalContents.slice(1);
    }

    const result = await model.generateContent({
      contents: finalContents,
      generationConfig: {
        temperature: 0.7
      }
    });

    const aiText = result.response.text();

    if (!aiText) {
      throw new Error('Không nhận được phản hồi từ Astro.');
    }

    return NextResponse.json({ success: true, text: aiText.trim() });
  } catch (error) {
    console.error('Error in Astro chat API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
