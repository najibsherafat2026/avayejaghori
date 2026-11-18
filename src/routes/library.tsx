import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { BookOpen, Download, Heart, Lightbulb, Search } from 'lucide-react'
import { toast } from 'sonner'
import { BookCover } from '@/components/book-cover'
import { SampleBadge } from '@/components/sample-badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { bookCategories, books } from '@/data/fixtures'
import { matchesQuery, toFaDigits } from '@/lib/format'
import { cn } from '@/lib/utils'

type LibrarySearch = { q?: string; cat?: string; book?: string }

export const Route = createFileRoute('/library')({
  validateSearch: (s: Record<string, unknown>): LibrarySearch => ({
    q: typeof s.q === 'string' && s.q ? s.q : undefined,
    cat: typeof s.cat === 'string' && bookCategories.includes(s.cat) ? s.cat : undefined,
    book: typeof s.book === 'string' ? s.book : undefined,
  }),
  head: () => ({ meta: [{ title: 'کتابخانه دیجیتال | آوای جاغوری' }] }),
  component: LibraryPage,
})

function LibraryPage() {
  const { q, cat, book } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [draft, setDraft] = useState(q ?? '')
  const set = (patch: Partial<LibrarySearch>) => void navigate({ search: (prev) => ({ ...prev, ...patch }), resetScroll: false })

  const list = books
    .filter((b) => !cat || b.category === cat)
    .filter((b) => !q || matchesQuery(q, b.title, b.author, b.translator ?? '', b.publisher, b.category))
  const selected = books.find((b) => b.id === book)
  const related = selected ? books.filter((b) => b.id !== selected.id && b.category === selected.category).slice(0, 3) : []

  return (
    <main>
      <section className="pattern-girih bg-forest text-white">
        <div className="mx-auto max-w-content px-4 py-12 text-center">
          <BookOpen className="mx-auto mb-3 size-10 text-gold" />
          <h1 className="text-4xl font-black">کتابخانه دیجیتال</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            مجموعه‌ای از کتاب‌های قرآنی، حدیثی، فقهی، تاریخی، ادبی و علمی. تنها فایل‌هایی منتشر می‌شوند که مجوز انتشار آن‌ها از نویسنده یا ناشر دریافت شده باشد.
          </p>
          <form role="search" className="relative mx-auto mt-6 max-w-xl" onSubmit={(e) => { e.preventDefault(); set({ q: draft.trim() || undefined }) }}>
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="نام کتاب، نویسنده، مترجم یا ناشر…" aria-label="جست‌وجوی کتاب" className="h-12 bg-white pl-12 text-navy" />
            <button type="submit" aria-label="جست‌وجو" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"><Search /></button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          <button onClick={() => set({ cat: undefined })} className={cn('rounded-full border px-4 py-1.5 text-sm', !cat ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary')}>همه</button>
          {bookCategories.map((c) => (
            <button key={c} onClick={() => set({ cat: c })} className={cn('rounded-full border px-4 py-1.5 text-sm', cat === c ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary')}>{c}</button>
          ))}
        </div>
        <p className="mb-5 text-sm text-muted-foreground">{toFaDigits(list.length)} کتاب</p>
        {list.length ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.map((b) => (
              <button key={b.id} onClick={() => set({ book: b.id })} className="group text-right">
                <BookCover book={b} className="transition group-hover:-translate-y-1" />
                <p className="mt-3 text-sm font-bold leading-6 group-hover:text-primary">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.author} · {b.year}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">کتابی با این مشخصات یافت نشد.</p>
        )}

        <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-secondary p-8 text-center md:flex-row md:text-right">
          <Lightbulb className="size-10 shrink-0 text-gold" />
          <div className="flex-1">
            <h2 className="font-black text-navy">کتابی را پیشنهاد می‌کنید؟</h2>
            <p className="text-sm text-muted-foreground">نام کتاب، نویسنده و وضعیت مجوز انتشار آن را برای کتابدار ما بفرستید.</p>
          </div>
          <Button onClick={() => toast.info('فرم پیشنهاد کتاب همراه با حساب‌های کاربری فعال می‌شود.')}>ارسال پیشنهاد کتاب</Button>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && set({ book: undefined })}>
        {selected && (
          <DialogContent dir="rtl" className="sm:max-w-2xl">
            <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
              <BookCover book={selected} className="mx-auto w-40" />
              <div className="space-y-3">
                <SampleBadge />
                <DialogTitle className="text-xl font-black leading-8">{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-muted-foreground">نویسنده</dt><dd>{selected.author}</dd>
                  {selected.translator && (<><dt className="text-muted-foreground">مترجم</dt><dd>{selected.translator}</dd></>)}
                  <dt className="text-muted-foreground">ناشر</dt><dd>{selected.publisher}</dd>
                  <dt className="text-muted-foreground">سال انتشار</dt><dd>{selected.year}</dd>
                  <dt className="text-muted-foreground">موضوع</dt><dd>{selected.category}</dd>
                  <dt className="text-muted-foreground">صفحات</dt><dd>{toFaDigits(selected.pages)}</dd>
                </dl>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => toast.info('مطالعه آنلاین پس از بارگذاری فایل‌های مجاز فعال می‌شود.')}><BookOpen />مطالعه آنلاین</Button>
                  <Button size="sm" variant="outline" disabled={!selected.hasPdf} onClick={() => toast.info('فایل PDF مجاز پس از بارگذاری در دسترس قرار می‌گیرد.')}><Download />{selected.hasPdf ? 'دریافت PDF' : 'PDF مجاز ندارد'}</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.info('علاقه‌مندی‌ها با فعال‌شدن حساب کاربری ذخیره می‌شوند.')}><Heart />علاقه‌مندی</Button>
                </div>
              </div>
            </div>
            {related.length > 0 && (
              <div className="border-t pt-4">
                <p className="mb-3 text-sm font-bold">کتاب‌های مرتبط</p>
                <div className="flex gap-4">
                  {related.map((b) => (
                    <button key={b.id} onClick={() => set({ book: b.id })} className="w-20"><BookCover book={b} /></button>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
      <p className="sr-only"><Link to="/">صفحه اصلی</Link></p>
    </main>
  )
}
