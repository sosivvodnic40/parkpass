/** Общая сетка страницы Star Wars — единые отступы и выравнивание */
export function SwContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-6xl mx-auto w-full px-5 md:px-8 ${className}`}>{children}</div>
  );
}

export function SwSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-14 md:py-20 scroll-mt-28 ${className}`}>
      {children}
    </section>
  );
}

export function SwDivider({ className = '' }: { className?: string }) {
  return (
    <SwContainer className={`py-6 ${className}`}>
      <div className="h-px bg-white/[0.06]" />
    </SwContainer>
  );
}

export function SwSectionHeader({
  label,
  title,
  subtitle,
  center = false,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 md:mb-12 ${center ? 'text-center' : ''}`}>
      {label && (
        <p className="text-[#FFE81F] text-xs font-bold uppercase tracking-[0.25em] mb-2">
          {label}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-stone-500 text-sm md:text-base mt-3 max-w-2xl leading-relaxed ${
            center ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
