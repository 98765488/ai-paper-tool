import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/deepseek'

const SYSTEM_PROMPT = `你是一名专业的学术写作专家。
用户会提供一段论文文字，你需要：
1. 保持原意和核心论点不变
2. 用不同的词汇和句式重新表达
3. 确保语言符合学术规范
4. 输出长度与原文大致相同
只输出改写后的文字，不要加任何说明。`

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text?.trim() || text.trim().length < 20) {
      return NextResponse.json({ error: '内容太短，请至少输入20个字' }, { status: 400 })
    }
    const result = await callAI(SYSTEM_PROMPT, text)
    return NextResponse.json({ result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'AI处理失败，请稍后重试' }, { status: 500 })
  }
}
