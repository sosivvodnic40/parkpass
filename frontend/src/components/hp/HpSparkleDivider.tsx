export default function HpSparkleDivider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="hp-divider-sparkle hp-divider-sparkle--left flex-1" />
      <svg
        className="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c9922a"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      </svg>
      <div className="hp-divider-sparkle hp-divider-sparkle--right flex-1" />
    </div>
  );
}
