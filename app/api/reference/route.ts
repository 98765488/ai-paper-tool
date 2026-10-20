import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/deepseek'

const SYSTEM_PROMPT = `你是一名文献格式专家。
用户会提供论文的基本信息（标题、作者、期刊、年份等），你需要：
1. 按照GB/T 7714-2015格式生成标准参考文献
2. 如果信息不完整，按已有信息尽量生成，并注明缺少的字段
3. 同时给出APA格式版本

输出格式：
【GB/T 7714格式】
（引用格式）

【APA格式】
（引用格式）`

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text?.trim()) {
      return NextResponse.json({ error: '请输入文献信息' }, { status: 400 })
    }
    const result = await callAI(SYSTEM_PROMPT, text)
    return NextResponse.json({ result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'AI处理失败，请稍后重试' }, { status: 500 })
  }
}
