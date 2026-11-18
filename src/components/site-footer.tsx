import { Link } from '@tanstack/react-router'
import { categories } from '@/data/fixtures'
import { Logo } from './logo'
import { NewsletterForm } from './newsletter-form'
import { socialLinks } from './site-header'

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-forest text-white/80">
      <div className="gold-rule" />
      <div className="pattern-girih">
        <div className="mx-auto grid max-w-content gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo light />
            <p className="text-sm leading-7">
              رسانه‌ای مستقل برای نشر معارف اسلامی، گسترش دانش، پاسداری از هویت فرهنگی و معرفی تاریخ و تمدن جاغوری و هزاره‌ها.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="grid size-8 place-items-center rounded-full bg-white/10 text-xs hover:bg-gold hover:text-navy">{s.short}</a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-gold">دسته‌بندی‌های اصلی</h3>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              {categories.slice(0, 7).map((c) => (
                <li key={c.slug}><Link to="/articles" search={{ category: c.slug }} className="hover:text-gold">{c.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-gold">دسترسی سریع</h3>
            <ul className="grid gap-2 text-sm">
              {categories.slice(7).map((c) => (
                <li key={c.slug}><Link to="/articles" search={{ category: c.slug }} className="hover:text-gold">{c.title}</Link></li>
              ))}
              <li><Link to="/library" className="hover:text-gold">کتابخانه دیجیتال</Link></li>
              <li><Link to="/about" className="hover:text-gold">درباره ما و سیاست تحریریه</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-gold">خبرنامه و تماس</h3>
            <p className="text-sm">تازه‌ترین مطالب را در ایمیل خود دریافت کنید.</p>
            <NewsletterForm dark />
            <p className="text-sm">ایمیل: <span dir="ltr">info@avayejaghori.com</span></p>
            <p className="text-sm" dir="ltr">@AvayeJaghori</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs md:flex-row">
          <p className="font-bold text-white">
            آوای جاغوری | <span dir="ltr">Avaye Jaghori</span> — صدای فرهنگ، دانش، ایمان و هویت
          </p>
          <p>تمام حقوق مادی و معنوی این وب‌سایت محفوظ است. نقل مطالب با ذکر منبع مجاز است.</p>
        </div>
      </div>
    </footer>
  )
}
