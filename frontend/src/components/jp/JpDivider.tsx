export default function JpDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 jp-divider-line--left" />
      <span className="text-sm" style={{ color: '#22c55e' }} aria-hidden>
        🦕
      </span>
      <div className="h-px flex-1 jp-divider-line--right" />
    </div>
  );
}
