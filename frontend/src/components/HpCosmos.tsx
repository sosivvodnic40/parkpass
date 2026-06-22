import '@/app/worlds/harry-potter/harry-potter.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function HpCosmos({ children, className = '' }: Props) {
  return (
    <div className={`relative bg-[#0b0d14] overflow-x-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 hp-footer-nebula" />
        <div className="absolute inset-0 hp-footer-stars opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-[#0a0806] via-[#0a0806]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-[#0b0d14] to-transparent" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
