import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/deepseek'

const SYSTEM_PROMPT = `你是一名专业的学术写作编辑。
用户会提供一段文字，你需要：
1. 将口语化表达改写为规范的学术语言
2. 修正语病和逻辑不通的地方
3. 提升文字的严谨性和专业性
4. 保持原有的核心意思
只输出润色后的文字，不要加任何说明。`

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text?.trim() || text.trim().length < 10) {
      return NextResponse.json({ error: '内容太短' }, { status: 400 })
    }
    const result = await callAI(SYSTEM_PROMPT, text)
    return NextResponse.json({ result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'AI处理失败，请稍后重试' }, { status: 500 })
  }
}
