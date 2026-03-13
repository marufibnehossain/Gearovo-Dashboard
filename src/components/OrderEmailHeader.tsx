function formatOrderDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface OrderEmailHeaderProps {
  order?: { customer?: { email?: string }; date?: string } | null
}

export default function OrderEmailHeader({ order }: OrderEmailHeaderProps) {
  const customerEmail = order?.customer?.email || 'customer@example.com'
  const orderDate = formatOrderDate(order?.date)
  return (
    <header className="rounded-t-lg border-b border-gray-200 bg-transparent px-4 py-4">
      {/* Row 1: Subject, gold arrow, Inbox badge, right-aligned icons */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-visible">
          <h1 className="min-w-0 shrink text-xl font-semibold leading-relaxed text-[#3c4043]" style={{ lineHeight: 1.5 }}>
            Your Gearovo order confirmation
          </h1>
          <span className="shrink-0" aria-hidden>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-amber-500"
              aria-hidden
            >
              <path
                d="M4 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-gray-200 px-2 py-0.5 text-sm font-normal text-[#3c4043]">
            Inbox
            <button
              type="button"
              className="rounded p-0.5 hover:bg-gray-300"
              aria-label="Remove Inbox filter"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded p-1.5 text-[#5f6368] hover:bg-gray-200 hover:text-[#3c4043]"
            aria-label="Print"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-[#5f6368] hover:bg-gray-200 hover:text-[#3c4043]"
            aria-label="Open in new window"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: Avatar, sender, recipient, timestamp + icons */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d2e3fc]"
            aria-hidden
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#1a73e8"
              aria-hidden
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 overflow-visible">
            <p className="text-sm font-semibold leading-relaxed text-[#3c4043]">
              Gearovo <span className="font-normal text-[#5f6368]">&lt;support@gearovo.com&gt;</span>
            </p>
            <div className="mt-0.5 flex items-center gap-1 overflow-visible">
              <span className="text-xs leading-relaxed text-[#5f6368]">to {customerEmail}</span>
              <button
                type="button"
                className="rounded p-0.5 text-[#5f6368] hover:bg-gray-200"
                aria-label="Show recipients"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <span className="px-1 text-xs text-[#5f6368]">{orderDate}</span>
          <button
            type="button"
            className="rounded p-1.5 text-[#5f6368] hover:bg-gray-200 hover:text-[#3c4043]"
            aria-label="Star"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-[#5f6368] hover:bg-gray-200 hover:text-[#3c4043]"
            aria-label="Add emoji"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-[#5f6368] hover:bg-gray-200 hover:text-[#3c4043]"
            aria-label="Reply"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 17 4 12 9 7" />
              <path d="M20 18v-2a4 4 0 00-4-4H4" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-[#5f6368] hover:bg-gray-200 hover:text-[#3c4043]"
            aria-label="More options"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

