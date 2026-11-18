import type { Book } from '@/data/fixtures'
import { cn } from '@/lib/utils'
import { LogoMark } from './logo'

/** Generated book cover used until real cover images are uploaded. */
export function BookCover({ book, className }: { book: Book; className?: string }) {
  return (
    <div
      className={cn('pattern-girih relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-md p-3 text-white shadow-[6px_8px_18px_-6px_rgb(0_0_0/0.45)]', className)}
      style={{ backgroundColor: book.color }}
    >
      <span className="absolute inset-y-0 right-0 w-2 bg-black/25" />
      <span className="rounded border border-gold/60 px-1.5 py-0.5 text-center text-[10px] text-gold">{book.category}</span>
      <span className="text-center text-sm font-black leading-6">{book.title}</span>
      <span className="flex items-center justify-between text-[10px] text-white/75">
        <span>{book.author}</span>
        <LogoMark className="size-5" />
      </span>
    </div>
  )
}
