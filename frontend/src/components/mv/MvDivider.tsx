export default function MvDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 mv-divider-line--left" />
      <svg className="w-4 h-4 shrink-0 mv-divider-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
      <div className="h-px flex-1 mv-divider-line--right" />
    </div>
  );
}
