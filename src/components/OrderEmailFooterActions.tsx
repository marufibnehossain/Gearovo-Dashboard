export default function OrderEmailFooterActions() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-50"
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
        Reply
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-transparent px-4 py-2 text-sm font-normal text-gray-700 hover:bg-gray-50"
        aria-label="Forward"
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
          <polyline points="15 17 20 12 15 7" />
          <path d="M4 18v-2a4 4 0 014-4h12" />
        </svg>
        Forward
      </button>
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
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
    </div>
  )
}
