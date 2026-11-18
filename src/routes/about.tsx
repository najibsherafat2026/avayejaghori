import { createFileRoute } from '@tanstack/react-router'
import { BookCheck, Compass, Eye, Mail, ShieldCheck, Target } from 'lucide-react'
import { LogoMark } from '@/components/logo'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'درباره آوای جاغوری' }] }),
  component: AboutPage,
})

const roles = [
  'یک رسانه فرهنگی و اجتماعی', 'یک پایگاه تخصصی معارف اسلامی', 'یک مرکز تبلیغ و آموزش دینی', 'یک کتابخانه دیجیتال',
  'یک پایگاه پژوهش‌های تاریخی و فرهنگی', 'یک مرکز آموزش علمی و مهارتی', 'یک آرشیو اسناد و تصاویر تاریخی',
  'یک رسانه چندرسانه‌ای', 'یک فضای تعامل نویسندگان، پژوهشگران و کاربران', 'یک مرجع دیجیتال برای معرفی جاغوری و میراث افغانستان',
]

const policy = [
  'استفاده از منابع معتبر در مطالب دینی و ذکر دقیق منابع آیات و احادیث',
  'رعایت امانت علمی و پرهیز از نقل‌قول و سند ساختگی',
  'ارائه اختلاف دیدگاه‌های فقهی و کلامی با دقت و احترام',
  'تفکیک روشن خبر، گزارش، تحلیل، مقاله و یادداشت',
  'تفکیک اسناد مستند، روایت‌های شفاهی و فرضیه‌های تاریخی',
  'رعایت حقوق مالکیت فکری نویسندگان، ناشران و صاحبان تصویر',
  'احترام به تنوع فرهنگی و مذهبی و پرهیز از محتوای تفرقه‌افکنانه',
  'بررسی علمی و تحریری مطالب پیش از انتشار',
]

function AboutPage() {
  return (
    <main>
      <section className="pattern-girih bg-forest text-white">
        <div className="mx-auto max-w-reading px-4 py-14 text-center">
          <LogoMark className="mx-auto mb-4 size-16" />
          <h1 className="text-4xl font-black">درباره آوای جاغوری</h1>
          <p className="mt-4 text-lg leading-8 text-white/85">
            آوای جاغوری یک رسانه مستقل، فرهنگی، دینی، علمی، آموزشی، تاریخی و پژوهشی است که با هدف گسترش معارف اسلامی، ارتقای آگاهی جامعه، معرفی تاریخ و تمدن جاغوری و هزاره‌ها، تقویت هویت فرهنگی و ترویج ارزش‌های اخلاقی و انسانی فعالیت می‌کند.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-content space-y-14 px-4 py-12">
        <section className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: 'رسالت', text: 'نشر معارف اسلامی، گسترش دانش و پاسداری از هویت فرهنگی مردم جاغوری، هزاره‌ها و افغانستان.' },
            { icon: Compass, title: 'اهداف', text: 'حمایت از آموزش و پژوهش، ثبت میراث تاریخی و شفاهی، و ایجاد فضای گفت‌وگوی علمی و محترمانه.' },
            { icon: Eye, title: 'چشم‌انداز', text: 'تبدیل‌شدن به مرجع دیجیتال معتبر برای معارف اسلامی و تاریخ و فرهنگ جاغوری و هزاره‌ها.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <Icon className="mb-3 size-8 text-gold" />
              <h2 className="mb-2 text-lg font-black text-navy">{title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-black text-navy">آوای جاغوری چه نقش‌هایی دارد؟</h2>
          <ol className="grid gap-3 sm:grid-cols-2">
            {roles.map((r, i) => (
              <li key={r} className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-forest text-xs font-bold text-gold">{(i + 1).toLocaleString('fa-AF')}</span>{r}
              </li>
            ))}
          </ol>
        </section>

        <section id="policy" className="rounded-2xl border-r-4 border-gold bg-card p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-black text-navy"><ShieldCheck className="text-primary" />سیاست تحریریه و اعتبار علمی</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {policy.map((p) => (
              <li key={p} className="flex gap-2 text-sm leading-7"><BookCheck className="mt-1 size-4 shrink-0 text-primary" />{p}</li>
            ))}
          </ul>
          <p className="mt-5 rounded-lg bg-gold/10 p-3 text-sm text-[#6b4f1d]">
            هیچ محتوای آزمایشی به‌عنوان اطلاعات واقعی نمایش داده نمی‌شود؛ تمام داده‌های نمونه در سایت با برچسب «نمونه» مشخص شده‌اند.
          </p>
        </section>

        <section id="contact" className="scroll-mt-32 grid gap-6 rounded-2xl bg-navy p-8 text-white md:grid-cols-2">
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-2xl font-black"><Mail className="text-gold" />تماس با ما</h2>
            <p className="text-white/75">برای همکاری، ارسال مقاله، پیشنهاد یا گزارش خطا با تحریریه در ارتباط باشید.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p>ایمیل: <a href="mailto:info@avayejaghori.com" className="text-gold hover:underline" dir="ltr">info@avayejaghori.com</a></p>
            <p>شبکه‌های اجتماعی: <span dir="ltr" className="text-gold">@AvayeJaghori</span></p>
            <p className="text-white/60">فرم تماس و همکاری آنلاین در مرحله بعد افزوده می‌شود.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
