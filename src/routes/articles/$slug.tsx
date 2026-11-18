import { useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { AlertTriangle, Bookmark, Clock, Eye, Printer, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { ArticleCard, ArticleCover } from '@/components/article-card'
import { SampleBadge } from '@/components/sample-badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { articleBySlug, articles, authorById, categoryBySlug, kindLabels } from '@/data/fixtures'
import { formatShamsi, toFaDigits } from '@/lib/format'

export const Route = createFileRoute('/articles/$slug')({
  loader: ({ params }) => {
    const article = articleBySlug(params.slug)
    if (!article) throw notFound()
    return article
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | آوای جاغوری` },
          { name: 'description', content: loaderData.excerpt },
          { property: 'og:title', content: loaderData.title },
          { property: 'og:description', content: loaderData.excerpt },
          { property: 'og:type', content: 'article' },
        ]
      : [],
  }),
  component: ArticlePage,
})

function ArticlePage() {
  const article = Route.useLoaderData()
  const author = authorById(article.authorId)
  const cat = categoryBySlug(article.category)
  const related = articles.filter((a) => a.slug !== article.slug && (a.category === article.category || a.tags.some((t) => article.tags.includes(t)))).slice(0, 3)
  const [comment, setComment] = useState('')

  const share = async () => {
    const url = window.location.href
    if (navigator.share) await navigator.share({ title: article.title, url }).catch(() => {})
    else { await navigator.clipboard.writeText(url); toast.success('پیوند مطلب کپی شد.') }
  }

  return (
    <main>
      <article>
        <header className="pattern-girih bg-forest text-white">
          <div className="mx-auto max-w-reading px-4 py-10">
            <nav className="mb-4 text-xs text-white/70">
              <Link to="/" className="hover:text-gold">صفحه اصلی</Link> / <Link to="/articles" search={{ category: article.category }} className="hover:text-gold">{cat?.title}</Link>
            </nav>
            <div className="mb-3 flex items-center gap-2 text-xs">
              <span className="rounded bg-gold px-2 py-0.5 font-bold text-navy">{kindLabels[article.kind]}</span>
              <SampleBadge />
            </div>
            <h1 className="text-3xl font-black leading-[1.6] md:text-4xl">{article.title}</h1>
            <p className="mt-4 text-lg leading-8 text-white/85">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="font-bold text-white">{author?.name}</span>
              <span>انتشار: {formatShamsi(article.publishedAt)}</span>
              {article.updatedAt && <span>به‌روزرسانی: {formatShamsi(article.updatedAt)}</span>}
              <span className="inline-flex items-center gap-1"><Clock className="size-4" />{toFaDigits(article.readMinutes)} دقیقه مطالعه</span>
              <span className="inline-flex items-center gap-1"><Eye className="size-4" />{toFaDigits(article.views)} بازدید</span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-content gap-10 px-4 py-10 lg:grid-cols-[1fr_16rem]">
          <div className="mx-auto w-full max-w-reading">
            <ArticleCover article={article} className="mb-8 h-56 rounded-2xl" />
            <div className="no-print mb-8 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={share}><Share2 />اشتراک‌گذاری</Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}><Printer />چاپ</Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('علاقه‌مندی‌ها با فعال‌شدن حساب کاربری ذخیره می‌شوند.')}><Bookmark />افزودن به علاقه‌مندی‌ها</Button>
            </div>
            <div className="space-y-8 text-[17px] leading-9 text-navy">
              {article.sections.map((s, i) => (
                <section key={s.heading} id={`s-${i}`} className="scroll-mt-32">
                  <h2 className="mb-3 text-xl font-black text-forest">{s.heading}</h2>
                  <p>{s.body}</p>
                </section>
              ))}
            </div>
            <section className="mt-10 rounded-xl border-r-4 border-gold bg-secondary p-5">
              <h2 className="mb-2 font-black text-navy">منابع و مآخذ</h2>
              <ul className="list-disc space-y-1 pr-5 text-sm text-muted-foreground">
                {article.sources.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </section>
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <Link key={t} to="/articles" search={{ q: t }} className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-accent">#{t}</Link>
              ))}
            </div>

            <section className="no-print mt-12 rounded-2xl border bg-card p-6">
              <h2 className="mb-1 font-black text-navy">دیدگاه شما</h2>
              <p className="mb-4 text-xs text-muted-foreground">دیدگاه‌ها پس از بررسی تحریریه منتشر می‌شوند.</p>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('سپاس! ثبت و نظارت دیدگاه‌ها به‌زودی فعال می‌شود.'); setComment('') }} className="space-y-3">
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} required minLength={3} rows={4} placeholder="دیدگاه خود را بنویسید…" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button type="submit">ارسال دیدگاه</Button>
                  <button type="button" onClick={() => toast.info('سپاس از دقت شما. گزارش خطا به تحریریه با راه‌اندازی پنل مدیریت فعال می‌شود.')} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                    <AlertTriangle className="size-3.5" /> گزارش خطا یا محتوای نامعتبر
                  </button>
                </div>
              </form>
            </section>
          </div>

          <aside className="no-print space-y-6 lg:sticky lg:top-36 lg:self-start">
            <div className="rounded-xl border bg-card p-4">
              <h2 className="mb-3 text-sm font-black text-navy">فهرست مطالب</h2>
              <ol className="space-y-2 text-sm">
                {article.sections.map((s, i) => (
                  <li key={s.heading}><a href={`#s-${i}`} className="text-muted-foreground hover:text-primary">{toFaDigits(i + 1)}. {s.heading}</a></li>
                ))}
              </ol>
            </div>
            {author && (
              <div className="rounded-xl border bg-card p-4 text-sm">
                <p className="font-bold">{author.name}</p>
                <p className="text-xs text-primary">{author.role}</p>
                <p className="mt-2 text-muted-foreground">{author.bio}</p>
              </div>
            )}
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="no-print mx-auto max-w-content px-4">
          <h2 className="mb-5 text-xl font-black text-navy">مطالب مرتبط</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </section>
      )}
    </main>
  )
}
