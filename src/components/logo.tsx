import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

/** Brand mark: open book + Jaghori peaks + sound waves inside a girih star. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn('size-11', className)}>
      <rect width="64" height="64" rx="14" fill="var(--forest)" />
      <path d="M32 5l7.6 18.4L58 31l-18.4 7.6L32 57l-7.6-18.4L6 31l18.4-7.6z" fill="none" stroke="var(--gold)" strokeWidth="1.2" opacity=".55" />
      <path d="M14 34l9-11 6 7 5-6 16 10z" fill="#3aa57f" />
      <path d="M12 38c7-3 13-3 20 1 7-4 13-4 20-1v12c-7-3-13-3-20 1-7-4-13-4-20-1z" fill="#f7f1e3" />
      <path d="M32 39v12" stroke="var(--forest)" strokeWidth="1.6" />
      <path d="M42 14c2.5 2 2.5 6 0 8M46 11c4.5 3.6 4.5 10.4 0 14" stroke="var(--gold)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ light = false, withSlogan = true }: { light?: boolean; withSlogan?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="آوای جاغوری — صفحه اصلی">
      <LogoMark />
      <span className="leading-tight">
        <span className={cn('block text-xl font-black', light ? 'text-white' : 'text-forest')}>آوای جاغوری</span>
        <span className={cn('block text-[11px] font-medium tracking-[0.2em] uppercase', light ? 'text-gold' : 'text-primary')} dir="ltr">
          Avaye Jaghori
        </span>
        {withSlogan && (
          <span className={cn('hidden text-xs sm:block', light ? 'text-white/70' : 'text-muted-foreground')}>
            صدای فرهنگ، دانش، ایمان و هویت
          </span>
        )}
      </span>
    </Link>
  )
}
