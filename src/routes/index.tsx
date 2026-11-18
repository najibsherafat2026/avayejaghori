import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, BookMarked, CalendarDays, Headphones, Library, PlayCircle, Sparkles, TrendingUp } from 'lucide-react'
import { ArticleCard, ArticleCover, SectionHeading } from '@/components/article-card'
import { BookCover } from '@/components/book-cover'
import { CategoryIcon } from '@/components/category-icon'
import { NewsletterForm } from '@/components/newsletter-form'
import { SampleBadge } from '@/components/sample-badge'
import { Button } from '@/components/ui/button'
import { articles, authorById, authors, books, categories, categoryBySlug, media } from '@/data/fixtures'
import { formatShamsi, heroImage, toFaDigits } from '@/lib/format'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

const quickLinks: { label: string; category?: string; library?: boolean }[] = [
  { label: 'تازه‌ترین مطالب' },
  { label: 'کتابخانه دیجیتال', library: true },
  { label: 'معارف اسلامی', category: 'quran' },
  { label: 'تاریخ و فرهنگ جاغوری', category: 'jaghori' },
  { label: 'مرکز آموزش و پژوهش', category: 'education' },
]

const byDate = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

function Home() {
  return (
    <main>
      <Hero />
      <div className="mx-auto max-w-content space-y-16 px-4 py-12">
        <Featured />
        <Latest />
        <Categories />
        <ThreeColumns />
        <NewBooks />
        <Media />
        <PopularAndAuthors />
      </div>
      <NewsletterBand />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest">
      <img
        src={heroImage(1600)}
        srcSet={`${heroImage(800)} 800w, ${heroImage(1280)} 1280w, ${heroImage(1920)} 1920w`}
        sizes="100vw"
        alt="منظره کوهستانی جاغوری با روستای سنتی و مسجدی با گنبد سبز در طلوع آفتاب"
        className="absolute inset-0 -z-10 size-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/60 via-forest/40 to-forest/90" />
      <div className="mx-auto flex min-h-[540px] max-w-content flex-col items-center justify-center px-4 py-20 text-center text-white md:min-h-[600px]">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/20 px-4 py-1 text-xs text-gold backdrop-blur">
          <Sparkles className="size-3.5" /> رسانه مستقل فرهنگی، دینی، علمی و پژوهشی
        </span>
        <h1 className="text-5xl font-black drop-shadow-lg md:text-7xl">آوای جاغوری</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.4em] text-gold" dir="ltr">Avaye Jaghori</p>
        <div className="gold-rule my-6 w-48" />
        <p className="text-xl font-bold md:text-2xl">صدای فرهنگ، دانش، ایمان و هویت</p>
        <p className="mt-4 max-w-2xl text-base leading-8 text-white/90 md:text-lg">
          آوای جاغوری، رسانه‌ای برای نشر معارف اسلامی، گسترش دانش، پاسداری از هویت فرهنگی، معرفی تاریخ و تمدن و تقویت اندیشه و آگاهی جامعه.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {quickLinks.map((q, i) => (
            <Button key={q.label} asChild size="lg" className={cn(i === 0 ? 'bg-gold font-bold text-navy hover:bg-gold/90' : 'border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20')}>
              {q.library ? (
                <Link to="/library">{q.label}</Link>
              ) : (
                <Link to="/articles" search={{ category: q.category }}>{q.label}</Link>
              )}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const featured = articles.filter((a) => a.featured)
  const [main, ...rest] = featured
  if (!main) return null
  const author = authorById(main.authorId)
  return (
    <section>
      <SectionHeading title="مطالب برجسته" subtitle="گزیده تحریریه آوای جاغوری" />
      <div className="grid gap-6 lg:grid-cols-5">
        <Link to="/articles/$slug" params={{ slug: main.slug }} className="group overflow-hidden rounded-2xl border bg-card shadow-sm lg:col-span-3">
          <ArticleCover article={main} className="h-64" />
          <div className="space-y-3 p-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-primary">{categoryBySlug(main.category)?.title}</span>
              <SampleBadge />
            </div>
            <h3 className="text-2xl font-black leading-10 text-navy group-hover:text-primary">{main.title}</h3>
            <p className="leading-7 text-muted-foreground">{main.excerpt}</p>
            <p className="text-xs text-muted-foreground">{author?.name} · {formatShamsi(main.publishedAt)}</p>
          </div>
        </Link>
        <div className="grid gap-6 lg:col-span-2">
          {rest.map((a) => <ArticleCard key={a.slug} article={a} compact />)}
        </div>
      </div>
    </section>
  )
}

function Latest() {
  const [cat, setCat] = useState<string>('all')
  const filterCats = ['all', 'quran', 'jaghori', 'culture', 'science', 'news']
  const list = useMemo(() => byDate.filter((a) => cat === 'all' || a.category === cat).slice(0, 6), [cat])
  return (
    <section>
      <SectionHeading
        title="تازه‌ترین مطالب"
        subtitle="به ترتیب تاریخ انتشار"
        action={<Button asChild variant="outline" size="sm"><Link to="/articles">آرشیو مطالب <ArrowLeft className="size-4" /></Link></Button>}
      />
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="فیلتر دسته‌بندی">
        {filterCats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={cn('rounded-full border px-4 py-1.5 text-sm transition', cat === c ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary hover:text-primary')}
          >
            {c === 'all' ? 'همه' : categoryBySlug(c)?.title}
          </button>
        ))}
      </div>
      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">در این دسته هنوز مطلبی منتشر نشده است.</p>
      )}
    </section>
  )
}

function Categories() {
  return (
    <section>
      <SectionHeading title="دسته‌بندی‌های اصلی" subtitle="دسترسی سریع به تمام بخش‌های تخصصی" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((c) => (
          <Link key={c.slug} to="/articles" search={{ category: c.slug }} className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center shadow-sm transition hover:border-gold hover:shadow-md">
            <span className="pattern-girih grid size-14 place-items-center rounded-full bg-forest text-gold transition group-hover:scale-105">
              <CategoryIcon slug={c.slug} className="size-6" />
            </span>
            <span className="text-sm font-bold leading-6 text-navy">{c.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Column({ title, slugs, more }: { title: string; slugs: string[]; more: string }) {
  const list = byDate.filter((a) => slugs.includes(a.category)).slice(0, 3)
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center justify-between border-b pb-3 font-black text-navy">
        {title}
        <Link to="/articles" search={{ category: more }} className="text-xs font-medium text-primary hover:underline">بیشتر</Link>
      </h3>
      <ul className="space-y-4">
        {list.map((a) => (
          <li key={a.slug}>
            <Link to="/articles/$slug" params={{ slug: a.slug }} className="group flex gap-3">
              <ArticleCover article={a} className="size-16 shrink-0 rounded-lg [&_svg]:size-6 [&>span]:hidden" />
              <span>
                <span className="block text-sm font-bold leading-6 group-hover:text-primary">{a.title}</span>
                <span className="text-xs text-muted-foreground">{formatShamsi(a.publishedAt)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ThreeColumns() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <Column title="تازه‌ترین اخبار" slugs={['news']} more="news" />
      <Column title="مطالب دینی و قرآنی" slugs={['quran', 'hadith', 'akhlaq', 'ahkam', 'islamic-history']} more="quran" />
      <Column title="تاریخ جاغوری و هزاره‌ها" slugs={['jaghori', 'culture']} more="jaghori" />
    </section>
  )
}

function NewBooks() {
  return (
    <section className="rounded-3xl bg-secondary p-6 md:p-10">
      <SectionHeading
        title="کتاب‌های تازه افزوده‌شده"
        subtitle="از کتابخانه دیجیتال آوای جاغوری"
        action={<Button asChild size="sm"><Link to="/library"><Library className="size-4" />ورود به کتابخانه</Link></Button>}
      />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {books.slice(0, 6).map((b) => (
          <Link key={b.id} to="/library" search={{ book: b.id }} className="group">
            <BookCover book={b} className="transition group-hover:-translate-y-1" />
            <p className="mt-3 text-sm font-bold leading-6 group-hover:text-primary">{b.title}</p>
            <p className="text-xs text-muted-foreground">{b.author}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Media() {
  return (
    <section id="media" className="scroll-mt-32">
      <SectionHeading title="ویدئوها و پادکست‌ها" subtitle="مرکز چندرسانه‌ای: مستند، آموزش، سخنرانی و گفت‌وگو" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {media.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className={cn('pattern-girih relative grid h-36 place-items-center', m.type === 'video' ? 'bg-navy' : 'bg-[#6b4f1d]')}>
              {m.type === 'video' ? <PlayCircle className="size-14 text-gold" /> : <Headphones className="size-12 text-gold" />}
              <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[11px] text-white">{m.duration}</span>
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary">{m.type === 'video' ? 'ویدئو' : `پادکست · ${m.series}`}</span>
                <SampleBadge />
              </div>
              <p className="text-sm font-bold leading-6">{m.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PopularAndAuthors() {
  const popular = [...articles].sort((a, b) => b.views - a.views).slice(0, 5)
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 border-b pb-3 font-black text-navy"><TrendingUp className="size-5 text-gold" />مطالب پربازدید</h3>
        <ol className="space-y-3">
          {popular.map((a, i) => (
            <li key={a.slug} className="flex gap-3">
              <span className="text-2xl font-black text-gold/80">{toFaDigits(i + 1)}</span>
              <Link to="/articles/$slug" params={{ slug: a.slug }} className="text-sm font-bold leading-6 hover:text-primary">{a.title}</Link>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 border-b pb-3 font-black text-navy"><BookMarked className="size-5 text-gold" />نویسندگان و پژوهشگران</h3>
        <ul className="space-y-4">
          {authors.map((a) => (
            <li key={a.id} className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-primary/10 font-black text-primary">{a.name.split(' ').at(-1)?.[0]}</span>
              <span>
                <span className="block text-sm font-bold">{a.name}</span>
                <span className="text-xs text-muted-foreground">{a.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <OccasionsCard />
    </section>
  )
}

function OccasionsCard() {
  return (
    <div className="pattern-girih rounded-2xl bg-forest p-5 text-white shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 border-b border-white/15 pb-3 font-black"><CalendarDays className="size-5 text-gold" />مناسبت‌های اسلامی</h3>
      <p className="text-sm leading-7 text-white/85">
        تقویم مناسبت‌های اسلامی و اوقات شرعی بر اساس موقعیت شما، پس از تأیید منابع معتبر تقویمی در این بخش نمایش داده می‌شود.
      </p>
      <p className="mt-4 rounded-lg bg-white/10 p-3 text-xs leading-6 text-white/80">
        تاریخ امروز به سه تقویم شمسی، قمری و میلادی در نوار بالای سایت نمایش داده می‌شود. تاریخ قمری محاسباتی است و ممکن است با رؤیت هلال یک روز تفاوت داشته باشد.
      </p>
    </div>
  )
}

function NewsletterBand() {
  return (
    <section className="mx-auto max-w-content px-4">
      <div className="pattern-girih grid items-center gap-6 rounded-3xl bg-navy p-8 text-white md:grid-cols-2 md:p-12">
        <div>
          <h2 className="text-2xl font-black">عضویت در خبرنامه آوای جاغوری</h2>
          <p className="mt-2 text-white/75">هر هفته گزیده‌ای از مقالات، کتاب‌ها و رویدادهای فرهنگی و علمی را دریافت کنید.</p>
        </div>
        <NewsletterForm dark />
      </div>
    </section>
  )
}
