import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFoundPage } from '@/components/error-pages'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

import '../styles.css'

const siteName = 'آوای جاغوری | Avaye Jaghori'
const siteDescription =
  'آوای جاغوری، رسانه‌ای برای نشر معارف اسلامی، گسترش دانش، پاسداری از هویت فرهنگی، معرفی تاریخ و تمدن و تقویت اندیشه و آگاهی جامعه.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { property: 'og:locale', content: 'fa_AF' },
      { name: 'theme-color', content: '#1f4a3c' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800;900&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa-AF" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </TooltipProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
