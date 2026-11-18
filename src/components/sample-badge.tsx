import { cn } from '@/lib/utils'

/** Marks placeholder content, as required by the editorial policy. */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      title="این محتوا نمونه است و اطلاعات واقعی نیست"
      className={cn('inline-flex items-center rounded-full border border-gold/60 bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-[#7a5c1e]', className)}
    >
      نمونه
    </span>
  )
}
