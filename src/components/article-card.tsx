import { Link } from '@tanstack/react-router'
import { Clock, Eye } from 'lucide-react'
import { authorById, categoryBySlug, kindLabels, type Article } from '@/data/fixtures'
import { formatShamsi, toFaDigits } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CategoryIcon } from './category-icon'
import { SampleBadge } from './sample-badge'

const tints: Record<string, string> = {
  maaref: 'from-[#1f4a3c] to-[#2f7a5f]',
  history: 'from-[#6b4f1d] to-[#a7802f]',
  knowledge: 'from-[#22365c] to-[#3c5a8a]',
  media: 'from-[#2a3a3a] to-[#46645c]',
}

export function ArticleCover({ article, className }: { article: Article; className?: string }) {
  const cat = categoryBySlug(article.category)
  return (
    <div className={cn('pattern-girih relative flex items-center justify-center overflow-hidden bg-gradient-to-br', tints[cat?.group ?? 'media'], className)}>
      <CategoryIcon slug={article.category} className="size-12 text-gold/90 drop-shadow" />
      <span className="absolute bottom-2 right-2 rounded bg-black/30 px-2 py-0.5 text-[11px] text-white backdrop-blur">
        {kindLabels[article.kind]}
      </span>
    </div>
  )
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const cat = categoryBySlug(article.category)
  const author = authorById(article.authorId)
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to="/articles/$slug" params={{ slug: article.slug }} tabIndex={-1} aria-hidden="true">
        <ArticleCover article={article} className={compact ? 'h-28' : 'h-40'} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <Link to="/articles" search={{ category: article.category }} className="font-bold text-primary hover:underline">
            {cat?.title}
          </Link>
          <SampleBadge />
        </div>
        <h3 className="font-bold leading-7 text-navy group-hover:text-primary">
          <Link to="/articles/$slug" params={{ slug: article.slug }}>{article.title}</Link>
        </h3>
        {!compact && <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
          <span>{author?.name}</span>
          <span>{formatShamsi(article.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3" />{toFaDigits(article.readMinutes)} دقیقه</span>
          {!compact && <span className="inline-flex items-center gap-1"><Eye className="size-3" />{toFaDigits(article.views)}</span>}
        </div>
      </div>
    </article>
  )
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-3 text-2xl font-black text-navy">
          <span className="inline-block h-6 w-1.5 rounded-full bg-gold" />
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
