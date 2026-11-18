import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="grid min-h-svh place-items-center px-6 py-16">
      <div className="max-w-md space-y-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">۴۰۴</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          صفحه پیدا نشد
        </h1>
        <p className="text-muted-foreground">
          صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است. نشانی را بررسی کنید یا به صفحه اصلی بازگردید.
        </p>
        <Button asChild>
          <Link to="/">بازگشت به صفحه اصلی</Link>
        </Button>
      </div>
    </main>
  )
}

export function RouteErrorPage({ reset }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <main className="grid min-h-svh place-items-center px-6 py-16">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          بارگذاری این صفحه ممکن نشد
        </h1>
        <p role="alert" className="text-muted-foreground">
          لطفاً دوباره تلاش کنید یا به صفحه اصلی بازگردید.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              void router.invalidate()
              reset()
            }}
          >
            تلاش دوباره
          </Button>
          <Button variant="outline" asChild>
            <a href="/">بازگشت به صفحه اصلی</a>
          </Button>
        </div>
      </div>
    </main>
  )
}
