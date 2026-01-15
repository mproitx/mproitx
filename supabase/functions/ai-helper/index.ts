// AI Helper Edge Function for PM - Roit Educational App
// Uses Gemini 2.5 Flash for educational assistance

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'संदेश आवश्यक हैं' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format messages for Gemini API
    const formattedMessages: ChatMessage[] = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add system context for educational assistance
    const systemContext = {
      role: 'user',
      parts: [{
        text: 'You are PM Roit, an expert educational AI assistant for Class 8-12 students in India. You specialize in Physics, Chemistry, and Mathematics. Provide clear, detailed explanations with step-by-step solutions. Use Hindi and English mix (Hinglish) when appropriate. Always be encouraging and supportive.'
      }]
    };

    const modelResponse = {
      role: 'model',
      parts: [{
        text: 'Namaste! मैं PM Roit हूं, आपका educational assistant। मैं Physics, Chemistry और Mathematics में आपकी मदद करूंगा। कृपया अपना सवाल पूछें।'
      }]
    };

    // Prepare the conversation with context
    const conversationWithContext = [
      systemContext,
      modelResponse,
      ...formattedMessages
    ];

    // Call Gemini API
    const apiUrl = 'https://api-integrations.appmedo.com/app-8vqzns7lohkx/api-pLVzJnE6NKDL/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationWithContext,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI सेवा में त्रुटि हुई' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Stream the response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.candidates && jsonData.candidates[0]?.content?.parts) {
                const text = jsonData.candidates[0].content.parts[0]?.text || '';
                fullResponse += text;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        response: fullResponse || 'कोई उत्तर नहीं मिला',
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in AI Helper:', error);
    return new Response(
      JSON.stringify({ 
        error: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
