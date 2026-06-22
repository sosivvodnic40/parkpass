import '@/app/worlds/star-wars/star-wars.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Звёздный фон — overflow-y visible, чтобы не обрезать карточки */
export default function StarCosmos({ children, className = '' }: Props) {
  return (
    <div className={`relative bg-[#050508] overflow-x-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 sw-footer-stars opacity-55" />
        <div className="absolute inset-0 sw-footer-stars-2 opacity-35" />
        <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-[#050508] via-[#050508]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-[#050508] to-transparent" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
