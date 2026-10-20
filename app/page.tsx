'use client'

import { useState } from 'react'
import { CONTACT_WECHAT, PAYMENT_DELIVERY } from '@/lib/contact'
import { MONTH_CODES, ONCE_CODES } from '@/lib/codes'

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
  const [csOpen, setCsOpen] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')

  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase()
    if (!code) {
      alert('请输入兑换码')
      return
    }
    if (ONCE_CODES.includes(code)) {
      setFreeLeft(prev => prev + 1)
      setRedeemCode('')
      alert('兑换成功！已增加 1 次额度')
      return
    }
    if (MONTH_CODES.includes(code)) {
      setFreeLeft(9999)
      setRedeemCode('')
      alert('月度会员已开通！')
      return
    }
    alert('兑换码无效，请核对后重试')
  }

  const handleSubmit = async () => {
    if (!input.trim()) return
    if (freeLeft <= 0) {
      setCsOpen(true)
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

          <button
            type="button"
            onClick={() => setCsOpen(true)}
            className="
              mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
              text-[var(--primary-deep)] bg-sky-50 border border-sky-200
              transition-all duration-200
              hover:bg-sky-100 hover:-translate-y-0.5 hover:shadow-sm
            "
          >
            点右下角客服扫码付款
          </button>

          <div className="mt-6 max-w-md mx-auto text-left">
            <p className="text-sm text-slate-500 text-center mb-3">
              付款后客服会发兑换码，在下方输入开通
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRedeem()
                }}
                placeholder="输入兑换码"
                className="
                  flex-1 min-h-11 px-4 rounded-xl text-sm
                  bg-slate-50 border border-slate-200 text-slate-800
                  focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100
                  transition-all
                "
              />
              <button
                type="button"
                onClick={handleRedeem}
                className="
                  min-h-11 px-5 rounded-xl text-sm font-semibold text-white
                  bg-sky-500 hover:bg-sky-400 transition-all
                  active:scale-[0.98]
                "
              >
                兑换
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              长按收款码联系客服 · 24小时内处理
            </p>
          </div>
        </section>

        <footer className="mt-10 py-8 text-center text-xs text-slate-400 border-t border-slate-200">
          <p>本工具仅用于学术写作辅助与语言表达优化，不提供代写服务。</p>
          <p className="mt-1">使用者应遵守所在院校的学术规范，因使用本工具产生的一切后果由使用者自行承担。</p>
        </footer>
      </main>

      <CustomerService open={csOpen} onOpenChange={setCsOpen} />
    </div>
  )
}

function CustomerService({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* 展开面板 */}
      <div
        className={`
          w-[300px] sm:w-[320px] origin-bottom-right
          rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-300/50
          transition-all duration-250 ease-out
          ${open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-3 pointer-events-none'
          }
        `}
        role="dialog"
        aria-label="微信客服收款"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-[#07c160]/5 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#07c160] animate-pulse" />
            <span className="text-sm font-semibold text-slate-800">微信客服 / 扫码开通</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="
              w-8 h-8 rounded-full text-slate-400 text-lg leading-none
              hover:bg-slate-100 hover:text-slate-600 transition-colors
            "
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <div className="p-4 flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500 text-center">
            ¥0.99 / 次 · ¥19.9 / 月无限 · 备注「论文」
          </p>
          <img
            src="/qrcode.png"
            alt="微信收款码"
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
          />
          <p className="text-sm font-medium text-slate-700 text-center select-all">
            {CONTACT_WECHAT}
          </p>
          <p className="text-xs text-slate-400 text-center leading-relaxed">{PAYMENT_DELIVERY}</p>
        </div>
      </div>

      {/* 悬浮按钮 */}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={`
          group flex items-center gap-2 pl-3 pr-4 h-14 rounded-full
          bg-[#07c160] text-white font-semibold text-sm
          shadow-lg shadow-emerald-500/40
          transition-all duration-200
          hover:bg-[#06ad56] hover:scale-105 hover:shadow-xl
          active:scale-95
          ${open ? 'ring-4 ring-emerald-200' : ''}
        `}
        aria-expanded={open}
        aria-label={open ? '关闭客服' : '打开客服'}
      >
        <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg transition-transform duration-200 group-hover:rotate-6">
          {open ? '×' : '💬'}
        </span>
        <span>{open ? '收起' : '客服开通'}</span>
      </button>
    </div>
  )
}

