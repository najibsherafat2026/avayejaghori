/**
 * Sample (stub) content for Avaye Jaghori — milestone 1.
 *
 * Every record here is placeholder data and is labelled «نمونه» in the UI.
 * Later milestones replace this module with Netlify Database queries
 * (see PLAN.md). Keep the exported shapes stable so screens keep working.
 */

export type ContentKind = 'article' | 'news' | 'report' | 'analysis' | 'note'

export const kindLabels: Record<ContentKind, string> = {
  article: 'مقاله',
  news: 'خبر',
  report: 'گزارش',
  analysis: 'تحلیل',
  note: 'یادداشت',
}

export type Category = {
  slug: string
  title: string
  icon: string // lucide icon name, resolved in components/category-icon.tsx
  group: 'maaref' | 'history' | 'knowledge' | 'media'
  description: string
}

export const categories: Category[] = [
  { slug: 'quran', title: 'قرآن و معارف اسلامی', icon: 'BookOpen', group: 'maaref', description: 'متن، ترجمه، تفسیر، تجوید و تدبر در قرآن کریم' },
  { slug: 'hadith', title: 'حدیث و سیره اهل‌بیت (ع)', icon: 'ScrollText', group: 'maaref', description: 'احادیث مستند، نهج‌البلاغه، صحیفه سجادیه و سیره' },
  { slug: 'ahkam', title: 'احکام و مسائل شرعی', icon: 'Scale', group: 'maaref', description: 'عبادات، معاملات، خانواده و مسائل مستحدثه' },
  { slug: 'aqaid', title: 'عقاید و کلام اسلامی', icon: 'Sparkles', group: 'maaref', description: 'مبانی اعتقادی و پاسخ به پرسش‌ها' },
  { slug: 'akhlaq', title: 'اخلاق و تربیت اسلامی', icon: 'HeartHandshake', group: 'maaref', description: 'سبک زندگی، تربیت خانواده و اخلاق اجتماعی' },
  { slug: 'tabligh', title: 'تبلیغ و دعوت اسلامی', icon: 'Megaphone', group: 'maaref', description: 'سخنرانی‌ها، پاسخ به شبهات و مهارت‌های تبلیغ' },
  { slug: 'islamic-history', title: 'تاریخ و تمدن اسلامی', icon: 'Landmark', group: 'history', description: 'تاریخ اسلام و دستاوردهای تمدنی مسلمانان' },
  { slug: 'jaghori', title: 'تاریخ جاغوری و هزاره‌ها', icon: 'Mountain', group: 'history', description: 'تاریخ، جغرافیا، مناطق، شخصیت‌ها و روایت‌های شفاهی' },
  { slug: 'culture', title: 'فرهنگ و ادبیات', icon: 'Feather', group: 'history', description: 'شعر فارسی و هزارگی، ضرب‌المثل‌ها، هنر و صنایع دستی' },
  { slug: 'education', title: 'آموزش و پژوهش', icon: 'GraduationCap', group: 'knowledge', description: 'روش تحقیق، زبان، مهارت‌ها و دوره‌های آموزشی' },
  { slug: 'science', title: 'علوم و فناوری', icon: 'Atom', group: 'knowledge', description: 'علوم طبیعی و انسانی، فناوری اطلاعات و هوش مصنوعی' },
  { slug: 'society', title: 'جامعه و مسائل اجتماعی', icon: 'Users', group: 'knowledge', description: 'تحلیل مسائل اجتماعی افغانستان و جامعه مهاجر' },
  { slug: 'news', title: 'اخبار و رویدادها', icon: 'Newspaper', group: 'media', description: 'اخبار جاغوری، رویدادهای فرهنگی، علمی و دینی' },
  { slug: 'articles', title: 'مقالات و یادداشت‌ها', icon: 'PenLine', group: 'media', description: 'مقالات تحلیلی، پژوهشی و یادداشت‌های نویسندگان' },
]

export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug)

export type Author = {
  id: string
  name: string
  role: string
  bio: string
}

export const authors: Author[] = [
  { id: 'a1', name: 'نویسنده نمونه یکم', role: 'پژوهشگر تاریخ', bio: 'معرفی نمونه برای نمایش ساختار صفحه نویسندگان.' },
  { id: 'a2', name: 'نویسنده نمونه دوم', role: 'پژوهشگر معارف اسلامی', bio: 'معرفی نمونه برای نمایش ساختار صفحه نویسندگان.' },
  { id: 'a3', name: 'نویسنده نمونه سوم', role: 'شاعر و ادیب', bio: 'معرفی نمونه برای نمایش ساختار صفحه نویسندگان.' },
  { id: 'a4', name: 'تحریریه آوای جاغوری', role: 'سردبیری', bio: 'مطالب تحریریه رسانه.' },
]

export const authorById = (id: string) => authors.find((a) => a.id === id)

export type Article = {
  slug: string
  title: string
  excerpt: string
  category: string
  kind: ContentKind
  authorId: string
  publishedAt: string // ISO date
  updatedAt?: string
  readMinutes: number
  views: number
  featured?: boolean
  tags: string[]
  sections: { heading: string; body: string }[]
  sources: string[]
}

const placeholderBody =
  'این متن نمونه است و تنها برای نمایش ساختار صفحه، فهرست مطالب، خوانایی فونت و چیدمان راست‌چین نوشته شده است. محتوای واقعی این بخش پس از بررسی علمی و تحریری و با ذکر منابع معتبر منتشر خواهد شد.'

const sampleSections = (topics: string[]) =>
  topics.map((heading) => ({ heading, body: placeholderBody }))

export const articles: Article[] = [
  {
    slug: 'jaghori-geography',
    title: 'جغرافیای تاریخی جاغوری؛ درآمدی بر شناخت مناطق و دره‌ها',
    excerpt: 'نگاهی به موقعیت جغرافیایی، دره‌ها، قریه‌ها و پیوند طبیعت کوهستانی با زندگی مردم جاغوری.',
    category: 'jaghori', kind: 'article', authorId: 'a1',
    publishedAt: '2026-11-16', readMinutes: 9, views: 4210, featured: true,
    tags: ['جاغوری', 'جغرافیا', 'هزاره‌ها'],
    sections: sampleSections(['موقعیت و حدود', 'دره‌ها و مناطق', 'طبیعت و زندگی مردم', 'جمع‌بندی']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
  {
    slug: 'tajwid-basics',
    title: 'آموزش تجوید برای نوآموزان؛ گام نخست در روان‌خوانی قرآن',
    excerpt: 'مجموعه‌ای آموزشی برای آشنایی با مخارج حروف و قواعد پایه تجوید به زبان ساده.',
    category: 'quran', kind: 'article', authorId: 'a2',
    publishedAt: '2026-11-15', readMinutes: 7, views: 3820, featured: true,
    tags: ['قرآن', 'تجوید', 'آموزش'],
    sections: sampleSections(['چرا تجوید؟', 'مخارج حروف', 'تمرین روزانه']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
  {
    slug: 'hazaragi-proverbs',
    title: 'ضرب‌المثل‌های هزارگی؛ گنجینه‌ای از خرد مردمی',
    excerpt: 'گردآوری و شرح ضرب‌المثل‌های رایج در میان مردم هزاره و جایگاه آن در ادبیات شفاهی.',
    category: 'culture', kind: 'article', authorId: 'a3',
    publishedAt: '2026-11-14', readMinutes: 6, views: 2950, featured: true,
    tags: ['ادبیات شفاهی', 'هزارگی', 'فرهنگ'],
    sections: sampleSections(['ادبیات شفاهی', 'نمونه‌ها و شرح', 'پاسداری از میراث']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
  {
    slug: 'school-opening-news',
    title: 'برگزاری کارگاه آموزشی روش تحقیق برای جوانان',
    excerpt: 'خبر نمونه درباره برگزاری کارگاه یک‌روزه روش تحقیق و مقاله‌نویسی علمی.',
    category: 'news', kind: 'news', authorId: 'a4',
    publishedAt: '2026-11-17', readMinutes: 2, views: 1290,
    tags: ['آموزش', 'رویداد'],
    sections: sampleSections(['شرح خبر']),
    sources: ['منبع خبر نمونه'],
  },
  {
    slug: 'library-week-news',
    title: 'فراخوان ارسال کتاب و اسناد تاریخی برای آرشیو دیجیتال',
    excerpt: 'اطلاعیه نمونه برای دعوت از پژوهشگران و خانواده‌ها جهت مشارکت در آرشیو اسناد.',
    category: 'news', kind: 'news', authorId: 'a4',
    publishedAt: '2026-11-13', readMinutes: 2, views: 980,
    tags: ['فراخوان', 'آرشیو'],
    sections: sampleSections(['متن فراخوان']),
    sources: ['اطلاعیه نمونه'],
  },
  {
    slug: 'ethics-family',
    title: 'تربیت دینی در خانواده؛ گفت‌وگو، محبت و الگو بودن',
    excerpt: 'یادداشتی درباره نقش گفت‌وگو و رفتار والدین در تربیت دینی فرزندان.',
    category: 'akhlaq', kind: 'note', authorId: 'a2',
    publishedAt: '2026-11-12', readMinutes: 5, views: 2140,
    tags: ['اخلاق', 'خانواده'],
    sections: sampleSections(['مقدمه', 'گفت‌وگو', 'الگو بودن']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
  {
    slug: 'ai-and-society',
    title: 'هوش مصنوعی و آینده آموزش در افغانستان',
    excerpt: 'تحلیلی درباره فرصت‌ها و چالش‌های فناوری‌های نو برای آموزش در جامعه.',
    category: 'science', kind: 'analysis', authorId: 'a1',
    publishedAt: '2026-11-11', readMinutes: 8, views: 3310,
    tags: ['فناوری', 'هوش مصنوعی', 'آموزش'],
    sections: sampleSections(['زمینه', 'فرصت‌ها', 'چالش‌ها', 'پیشنهادها']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
  {
    slug: 'carpet-weaving',
    title: 'قالین‌بافی هزارگی؛ نقش‌ها، رنگ‌ها و روایت‌ها',
    excerpt: 'گزارشی از هنر قالین‌بافی و معنای نقش‌های سنتی در میان بافندگان.',
    category: 'culture', kind: 'report', authorId: 'a3',
    publishedAt: '2026-11-10', readMinutes: 6, views: 1870,
    tags: ['صنایع دستی', 'هنر'],
    sections: sampleSections(['تاریخچه', 'نقش‌ها و رنگ‌ها', 'بافندگان امروز']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
  {
    slug: 'islamic-civilization-science',
    title: 'سهم دانشمندان مسلمان در تاریخ علم',
    excerpt: 'مروری بر دستاوردهای علمی تمدن اسلامی در ریاضیات، پزشکی و نجوم.',
    category: 'islamic-history', kind: 'article', authorId: 'a2',
    publishedAt: '2026-11-08', readMinutes: 10, views: 2760,
    tags: ['تمدن اسلامی', 'تاریخ علم'],
    sections: sampleSections(['ریاضیات', 'پزشکی', 'نجوم', 'میراث امروز']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
  {
    slug: 'oral-histories',
    title: 'روایت‌های شفاهی؛ چرا باید خاطرات بزرگان را ثبت کنیم؟',
    excerpt: 'یادداشتی درباره اهمیت ثبت روایت‌های شفاهی و تفاوت آن با سند مکتوب.',
    category: 'jaghori', kind: 'note', authorId: 'a1',
    publishedAt: '2026-11-06', readMinutes: 4, views: 1540,
    tags: ['روایت شفاهی', 'تاریخ'],
    sections: sampleSections(['روایت یا سند؟', 'روش ثبت', 'دعوت به مشارکت']),
    sources: ['منبع نمونه — فهرست منابع پس از بازبینی تحریریه افزوده می‌شود.'],
  },
]

export const articleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug)

export type Book = {
  id: string
  title: string
  author: string
  translator?: string
  publisher: string
  year: string
  category: string
  pages: number
  description: string
  hasPdf: boolean
  color: string
}

export const bookCategories = [
  'قرآن و علوم قرآنی',
  'حدیث و علوم حدیث',
  'فقه و اصول',
  'عقاید و کلام',
  'تاریخ اسلام',
  'تاریخ افغانستان',
  'تاریخ جاغوری و هزاره‌ها',
  'فرهنگ و ادبیات',
  'علوم انسانی',
  'علوم طبیعی',
  'آموزش و پژوهش',
]

export const books: Book[] = [
  { id: 'b1', title: 'کتاب نمونه در علوم قرآنی', author: 'مؤلف نمونه', publisher: 'ناشر نمونه', year: '۱۴۰۳', category: 'قرآن و علوم قرآنی', pages: 240, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: true, color: '#1f4a3c' },
  { id: 'b2', title: 'کتاب نمونه در تاریخ هزاره‌ها', author: 'مؤلف نمونه', publisher: 'ناشر نمونه', year: '۱۴۰۲', category: 'تاریخ جاغوری و هزاره‌ها', pages: 412, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: false, color: '#7a5c1e' },
  { id: 'b3', title: 'کتاب نمونه در فقه و احکام', author: 'مؤلف نمونه', publisher: 'ناشر نمونه', year: '۱۴۰۱', category: 'فقه و اصول', pages: 318, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: true, color: '#2c3e64' },
  { id: 'b4', title: 'کتاب نمونه در ادبیات هزارگی', author: 'مؤلف نمونه', translator: 'مترجم نمونه', publisher: 'ناشر نمونه', year: '۱۴۰۳', category: 'فرهنگ و ادبیات', pages: 196, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: true, color: '#8a3b2e' },
  { id: 'b5', title: 'کتاب نمونه در روش تحقیق', author: 'مؤلف نمونه', publisher: 'ناشر نمونه', year: '۱۴۰۰', category: 'آموزش و پژوهش', pages: 264, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: true, color: '#2f6f5a' },
  { id: 'b6', title: 'کتاب نمونه در تاریخ افغانستان', author: 'مؤلف نمونه', publisher: 'ناشر نمونه', year: '۱۳۹۹', category: 'تاریخ افغانستان', pages: 520, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: false, color: '#4b3a6b' },
  { id: 'b7', title: 'کتاب نمونه در عقاید', author: 'مؤلف نمونه', publisher: 'ناشر نمونه', year: '۱۴۰۲', category: 'عقاید و کلام', pages: 288, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: true, color: '#14532d' },
  { id: 'b8', title: 'کتاب نمونه در علوم طبیعی', author: 'مؤلف نمونه', translator: 'مترجم نمونه', publisher: 'ناشر نمونه', year: '۱۴۰۱', category: 'علوم طبیعی', pages: 350, description: 'معرفی نمونه برای نمایش ساختار کتابخانه دیجیتال.', hasPdf: true, color: '#1e3a5f' },
]

export type MediaItem = {
  id: string
  type: 'video' | 'podcast' | 'audio'
  title: string
  duration: string
  series?: string
}

export const media: MediaItem[] = [
  { id: 'm1', type: 'video', title: 'مستند نمونه: طبیعت و روستاهای جاغوری', duration: '۲۴:۱۰' },
  { id: 'm2', type: 'video', title: 'درس نمونه: آموزش روخوانی قرآن — جلسه اول', duration: '۱۸:۴۵' },
  { id: 'm3', type: 'podcast', title: 'پادکست نمونه: گفت‌وگو درباره ادبیات شفاهی', duration: '۳۸:۰۲', series: 'صدای میراث' },
  { id: 'm4', type: 'podcast', title: 'پادکست نمونه: جوانان و پرسش‌های اعتقادی', duration: '۲۹:۳۰', series: 'گفت‌وگوی نسل‌ها' },
]
