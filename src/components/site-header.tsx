import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, Globe, LogIn, Mail, Menu, Search, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { categories, type Category } from '@/data/fixtures'
import { formatGregorian, formatHijri, formatShamsi, formatWeekday } from '@/lib/format'
import { CategoryIcon } from './category-icon'
import { Logo } from './logo'
import { AuthDialog } from './auth-dialog'

const groups: { label: string; key: Category['group'] }[] = [
  { label: 'معارف اسلامی', key: 'maaref' },
  { label: 'تاریخ و فرهنگ', key: 'history' },
  { label: 'دانش و آموزش', key: 'knowledge' },
]

export const socialLinks = [
  { label: 'فیسبوک', short: 'f', href: '#' },
  { label: 'یوتیوب', short: '▶', href: '#' },
  { label: 'تلگرام', short: '✈', href: '#' },
  { label: 'اینستاگرام', short: '◎', href: '#' },
]

function TodayDates() {
  // Rendered on the client only, so the date follows the visitor's timezone.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(new Date()), [])
  if (!now) return <span className="h-4 w-64" />
  return (
    <span className="flex flex-wrap items-center gap-x-3">
      <span className="font-bold text-gold">{formatWeekday(now)}</span>
      <span>{formatShamsi(now)}</span>
      <span className="hidden sm:inline">· {formatHijri(now)}</span>
      <span className="hidden md:inline" dir="ltr">· {formatGregorian(now)}</span>
    </span>
  )
}

function SearchBox({ onDone }: { onDone?: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault()
        void navigate({ to: '/articles', search: { q: q.trim() || undefined } })
        onDone?.()
      }}
    >
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جست‌وجو در مطالب، کتاب‌ها و…"
        aria-label="جست‌وجو"
        className="h-9 w-full bg-white/95 pl-9 text-navy lg:w-56"
      />
      <button type="submit" aria-label="جست‌وجو" className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
        <Search className="size-4" />
      </button>
    </form>
  )
}

const navLink = 'rounded-md px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white'
const navActive = { className: 'bg-white/10 text-gold' }

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Top bar */}
      <div className="bg-navy text-xs text-white/80">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-2 px-4 py-1.5">
          <TodayDates />
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 sm:flex">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} title={`${s.label} — @AvayeJaghori`} className="grid size-6 place-items-center rounded-full bg-white/10 text-[10px] hover:bg-gold hover:text-navy">
                  {s.short}
                </a>
              ))}
            </div>
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-gold">
                <Globe className="size-3.5" /> دری
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>زبان سایت</DropdownMenuLabel>
                <DropdownMenuItem>فارسی (دری)</DropdownMenuItem>
                {['العربية', 'English', 'هزارگی'].map((l) => (
                  <DropdownMenuItem key={l} onSelect={() => toast.info(`نسخه ${l} در مرحله چندزبانه‌سازی افزوده می‌شود.`)}>
                    {l} <span className="mr-auto text-[10px] text-muted-foreground">به‌زودی</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" hash="contact" className="hidden items-center gap-1 hover:text-gold md:inline-flex">
              <Mail className="size-3.5" /> ارتباط با مدیریت
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-40 bg-forest text-white transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="pattern-girih">
          <div className={`mx-auto flex max-w-content items-center justify-between gap-4 px-4 transition-all ${scrolled ? 'py-2' : 'py-4'}`}>
            <Logo light withSlogan={!scrolled} />
            <div className="hidden items-center gap-2 lg:flex">
              <SearchBox />
              <AuthDialog
                defaultTab="login"
                trigger={<Button size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><LogIn className="size-4" />ورود</Button>}
              />
              <AuthDialog
                defaultTab="signup"
                trigger={<Button size="sm" className="bg-gold font-bold text-navy hover:bg-gold/90"><UserPlus className="size-4" />عضویت</Button>}
              />
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="باز کردن منو">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto bg-background p-0" dir="rtl">
                <SheetHeader className="bg-forest p-4 text-white">
                  <SheetTitle className="text-white">منوی آوای جاغوری</SheetTitle>
                </SheetHeader>
                <div className="space-y-5 p-4">
                  <SearchBox onDone={() => setOpen(false)} />
                  <nav className="space-y-4" aria-label="منوی موبایل">
                    {groups.map((g) => (
                      <div key={g.key}>
                        <p className="mb-1 text-xs font-bold text-gold">{g.label}</p>
                        {categories.filter((c) => c.group === g.key).map((c) => (
                          <Link key={c.slug} to="/articles" search={{ category: c.slug }} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                            <CategoryIcon slug={c.slug} className="size-4 text-primary" /> {c.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-2 border-t pt-4 text-sm">
                      <Link to="/articles" search={{ category: 'news' }} onClick={() => setOpen(false)} className="rounded-md bg-muted px-3 py-2">اخبار و رویدادها</Link>
                      <Link to="/articles" onClick={() => setOpen(false)} className="rounded-md bg-muted px-3 py-2">همه مطالب</Link>
                      <Link to="/library" onClick={() => setOpen(false)} className="rounded-md bg-muted px-3 py-2">کتابخانه دیجیتال</Link>
                      <Link to="/about" onClick={() => setOpen(false)} className="rounded-md bg-muted px-3 py-2">درباره ما</Link>
                    </div>
                  </nav>
                  <div className="grid grid-cols-2 gap-2">
                    <AuthDialog defaultTab="login" trigger={<Button variant="outline">ورود</Button>} />
                    <AuthDialog defaultTab="signup" trigger={<Button>عضویت</Button>} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop nav */}
        <nav aria-label="منوی اصلی" className="hidden border-t border-white/10 bg-forest/95 lg:block">
          <div className="mx-auto flex max-w-content items-center gap-1 px-4 py-1">
            <Link to="/" className={navLink} activeProps={navActive} activeOptions={{ exact: true, includeSearch: false }}>صفحه اصلی</Link>
            {groups.map((g) => (
              <DropdownMenu key={g.key} dir="rtl">
                <DropdownMenuTrigger className={`${navLink} inline-flex items-center gap-1 outline-none`}>
                  {g.label} <ChevronDown className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  {categories.filter((c) => c.group === g.key).map((c) => (
                    <DropdownMenuItem key={c.slug} asChild>
                      <Link to="/articles" search={{ category: c.slug }} className="flex items-start gap-3 py-2">
                        <CategoryIcon slug={c.slug} className="mt-0.5 size-4 text-primary" />
                        <span>
                          <span className="block font-bold">{c.title}</span>
                          <span className="block text-xs text-muted-foreground">{c.description}</span>
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/articles">مشاهده همه مطالب</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            <Link to="/articles" search={{ category: 'news' }} className={navLink}>اخبار و رویدادها</Link>
            <Link to="/articles" search={{ category: 'articles' }} className={navLink}>مقالات و یادداشت‌ها</Link>
            <Link to="/library" className={navLink} activeProps={navActive}>کتابخانه دیجیتال</Link>
            <a href="/#media" className={navLink}>چندرسانه‌ای</a>
            <Link to="/about" className={navLink} activeProps={navActive}>درباره ما</Link>
          </div>
        </nav>
      </header>
    </>
  )
}
