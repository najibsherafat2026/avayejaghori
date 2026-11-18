import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { ArticleCard } from '@/components/article-card'
import { CategoryIcon } from '@/components/category-icon'
import { Input } from '@/components/ui/input'
import { articles, authorById, categories, categoryBySlug, kindLabels, type ContentKind } from '@/data/fixtures'
import { matchesQuery, toFaDigits } from '@/lib/format'
import { cn } from '@/lib/utils'

type ArticlesSearch = { q?: string; category?: string; kind?: ContentKind; sort?: 'new' | 'popular' }

export const Route = createFileRoute('/articles/')({
  validateSearch: (s: Record<string, unknown>): ArticlesSearch => ({
    q: typeof s.q === 'string' && s.q ? s.q : undefined,
    category: typeof s.category === 'string' && categoryBySlug(s.category) ? s.category : undefined,
    kind: typeof s.kind === 'string' && s.kind in kindLabels ? (s.kind as ContentKind) : undefined,
    sort: s.sort === 'popular' ? 'popular' : undefined,
  }),
  head: () => ({ meta: [{ title: 'آرشیو مطالب | آوای جاغوری' }] }),
  component: ArticlesPage,
})

function ArticlesPage() {
  const { q, category, kind, sort } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [draft, setDraft] = useState(q ?? '')
  const cat = category ? categoryBySlug(category) : undefined

  const results = articles
    .filter((a) => !category || a.category === category)
    .filter((a) => !kind || a.kind === kind)
    .filter((a) => !q || matchesQuery(q, a.title, a.excerpt, a.tags.join(' '), authorById(a.authorId)?.name ?? '', categoryBySlug(a.category)?.title ?? ''))
    .sort((a, b) => (sort === 'popular' ? b.views - a.views : b.publishedAt.localeCompare(a.publishedAt)))

  const set = (patch: Partial<ArticlesSearch>) => void navigate({ search: (prev) => ({ ...prev, ...patch }) })

  return (
    <main>
      <section className="pattern-girih bg-forest text-white">
        <div className="mx-auto max-w-content px-4 py-10">
          <nav className="mb-3 text-xs text-white/70"><Link to="/" className="hover:text-gold">صفحه اصلی</Link> / آرشیو مطالب</nav>
          <h1 className="flex items-center gap-3 text-3xl font-black">
            {cat && <CategoryIcon slug={cat.slug} className="size-8 text-gold" />}
            {q ? `نتایج جست‌وجو برای «${q}»` : (cat?.title ?? 'آرشیو مطالب')}
          </h1>
          <p className="mt-2 text-white/75">{cat?.description ?? 'مقالات، اخبار، گزارش‌ها، تحلیل‌ها و یادداشت‌های آوای جاغوری'}</p>
          <form
            role="search"
            className="relative mt-6 max-w-xl"
            onSubmit={(e) => { e.preventDefault(); set({ q: draft.trim() || undefined }) }}
          >
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="عنوان، برچسب، نویسنده یا موضوع…" aria-label="جست‌وجو در مطالب" className="h-12 bg-white pl-12 text-navy" />
            <button type="submit" aria-label="جست‌وجو" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"><Search /></button>
          </form>
        </div>
      </section>

      <div className="mx-auto grid max-w-content gap-8 px-4 py-10 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-6">
          <div>
            <h2 className="mb-2 text-sm font-black text-navy">دسته‌بندی</h2>
            <ul className="space-y-1 text-sm">
              <li><button onClick={() => set({ category: undefined })} className={cn('w-full rounded-md px-3 py-1.5 text-right hover:bg-muted', !category && 'bg-primary/10 font-bold text-primary')}>همه دسته‌ها</button></li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button onClick={() => set({ category: c.slug })} className={cn('flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-right hover:bg-muted', category === c.slug && 'bg-primary/10 font-bold text-primary')}>
                    <CategoryIcon slug={c.slug} className="size-4 shrink-0" />{c.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-black text-navy">نوع محتوا</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(kindLabels) as ContentKind[]).map((k) => (
                <button key={k} onClick={() => set({ kind: kind === k ? undefined : k })} className={cn('rounded-full border px-3 py-1 text-xs', kind === k ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary')}>
                  {kindLabels[k]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{toFaDigits(results.length)} مطلب یافت شد</p>
            <div className="flex items-center gap-2 text-sm">
              {(q || category || kind) && (
                <button onClick={() => { setDraft(''); void navigate({ search: {} }) }} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs hover:bg-accent">
                  <X className="size-3" /> پاک کردن فیلترها
                </button>
              )}
              <button onClick={() => set({ sort: undefined })} className={cn('rounded-md px-3 py-1', !sort && 'bg-navy text-white')}>جدیدترین</button>
              <button onClick={() => set({ sort: 'popular' })} className={cn('rounded-md px-3 py-1', sort === 'popular' && 'bg-navy text-white')}>پربازدیدترین</button>
            </div>
          </div>
          {results.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <p className="font-bold text-navy">مطلبی با این مشخصات یافت نشد.</p>
              <p className="mt-2 text-sm text-muted-foreground">واژه‌های دیگری را امتحان کنید یا فیلترها را تغییر دهید.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
