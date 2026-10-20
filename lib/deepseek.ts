import OpenAI from 'openai'

// DeepSeek兼容OpenAI格式，直接用openai包
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

export async function callAI(systemPrompt: string, userContent: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })
  return response.choices[0].message.content ?? ''
}
