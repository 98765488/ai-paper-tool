'use client'

import { useState } from 'react'

type Tab = 'rewrite' | 'polish' | 'reference'

const TOOLS: Record<Tab, { label: string; desc: string; placeholder: string }> = {
  rewrite: {
    label: '论文降重',
    desc: '智能改写，保留原意降低重复率',
    placeholder: '粘贴需要降重的段落（建议每次200-500字效果最好）...',
  },
  polish: {
    label: '学术润色',
    desc: '口语转学术，提升文字专业性',
    placeholder: '输入需要润色的文字...',
  },
  reference: {
    label: '参考文献',
    desc: '生成GB/T 7714和APA格式引用',
    placeholder: `输入文献信息，例如：
作者：张三、李四
标题：人工智能在教育领域的应用研究
期刊：计算机教育
年份：2023
卷期：第5期`,
  },
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('rewrite')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [freeLeft, setFreeLeft] = useState(3)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim()) return
    if (freeLeft <= 0) {
      alert('今日免费次数已用完\n\n付费方式：0.99元/次 或 19.9元/月无限次\n请微信联系客服开通')
      return
    }

    setLoading(true)
    setOutput('')

    try {
      const res = await fetch(`/api/${tab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        setOutput(data.result)
        setFreeLeft(prev => prev - 1)
      }
    } catch {
      alert('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="animate-fade-up">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              AI论文助手
            </h1>
            <p className="text-sm text-[var(--muted)] mt-0.5">降重 · 润色 · 参考文献生成</p>
          </div>
          <div
            className={`
              shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
              ${freeLeft > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-600 border-rose-200'
              }
            `}
          >
            今日剩余 <span className="font-bold">{freeLeft}</span> 次
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {(Object.keys(TOOLS) as Tab[]).map(key => {
            const active = tab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTab(key)
                  setInput('')
                  setOutput('')
                  setCopied(false)
                }}
                className={`
                  text-left p-4 rounded-2xl border transition-all duration-200 ease-out
                  ${active
                    ? 'bg-white border-sky-300 shadow-md shadow-sky-100 ring-2 ring-sky-200 -translate-y-0.5'
                    : 'bg-white/70 border-[var(--border)] hover:bg-white hover:border-sky-200 hover:-translate-y-0.5 hover:shadow-sm'
                  }
                `}
              >
                <div className={`text-sm font-semibold ${active ? 'text-[var(--primary-deep)]' : 'text-[var(--text)]'}`}>
                  {TOOLS[key].label}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{TOOLS[key].desc}</div>
              </button>
            )
          })}
        </div>

        {/* Editor: input | output */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-stretch animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          {/* Input */}
          <section className="flex flex-col gap-3 min-h-0 bg-white border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--text)]">输入内容</label>
              <span className="text-xs text-[var(--muted)] tabular-nums">{input.length} 字</span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={TOOLS[tab].placeholder}
              className="
                flex-1 min-h-64 lg:min-h-72 p-4 rounded-xl resize-none text-sm leading-relaxed
                bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-slate-400
                transition-all duration-200
                focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 focus:bg-white
                hover:border-sky-200
              "
            />
            <div className="flex gap-2 items-stretch">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="
                  flex-1 min-h-11 px-4 rounded-xl text-sm font-semibold text-white
                  bg-[var(--primary)] shadow-sm shadow-sky-200
                  transition-all duration-200 ease-out
                  hover:bg-[var(--primary-deep)] hover:-translate-y-0.5 hover:shadow-md hover:shadow-sky-200
                  active:translate-y-0 active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm
                "
              >
                {loading ? '处理中...' : '开始处理'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="
                  min-h-11 px-4 rounded-xl text-sm font-medium
                  text-[var(--muted)] bg-white border border-[var(--border)]
                  transition-all duration-200 ease-out
                  hover:border-sky-300 hover:text-[var(--primary-deep)] hover:bg-sky-50 hover:-translate-y-0.5
                  active:translate-y-0 active:scale-[0.98]
                "
              >
                清空
              </button>
            </div>
          </section>

          {/* Output */}
          <section className="flex flex-col gap-3 min-h-0 bg-white border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-500 font-medium">处理结果</label>
              <span className="text-xs text-slate-400">{output.length} 字</span>
            </div>
            <div className="flex-1 min-h-72 p-4 rounded-xl text-sm leading-relaxed bg-slate-50 border border-slate-200 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-6 h-6 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                </div>
              ) : output ? (
                <p className="text-slate-800 whitespace-pre-wrap">{output}</p>
              ) : (
                <p className="text-slate-400 text-center mt-24">结果将在这里显示</p>
              )}
            </div>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all border border-slate-200"
              >
                {copied ? '已复制 ✓' : '复制结果'}
              </button>
            )}
          </section>
        </div>

        {/* Pricing */}
        <section
          className="mt-10 p-6 sm:p-8 rounded-2xl bg-white border border-[var(--border)] text-center shadow-sm animate-fade-up"
          style={{ animationDelay: '180ms' }}
        >
          <p className="text-[var(--muted)] text-sm mb-5">免费次数用完后，可选择以下方式继续使用</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="flex-1 px-6 py-5 rounded-2xl bg-[var(--bg)] border border-[var(--border)] transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-md">
              <div className="text-[var(--primary-deep)] text-3xl font-bold tracking-tight">¥0.99</div>
              <div className="text-[var(--muted)] text-xs mt-1.5">按次付费</div>
            </div>
            <div className="flex-1 px-6 py-5 rounded-2xl bg-sky-50 border border-sky-200 transition-all duration-200 hover:-translate-y-1 hover:border-sky-400 hover:shadow-md">
              <div className="text-[var(--primary-deep)] text-3xl font-bold tracking-tight">¥19.9</div>
              <div className="text-[var(--muted)] text-xs mt-1.5">月度无限</div>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-5">微信扫码联系客服开通 · 24小时内处理</p>
        </section>
      </main>
    </div>
  )
}
