import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogoMark } from './logo'

/**
 * Login / signup UI. Accounts are wired to Netlify Identity in a later
 * milestone (see PLAN.md) — for now submitting shows a notice.
 */
export function AuthDialog({ trigger, defaultTab }: { trigger: React.ReactNode; defaultTab: 'login' | 'signup' }) {
  const notice = (e: React.FormEvent) => {
    e.preventDefault()
    toast.info('حساب‌های کاربری به‌زودی فعال می‌شوند. از شکیبایی شما سپاس‌گزاریم.')
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <LogoMark className="size-12" />
          <DialogTitle className="text-xl">حساب کاربری آوای جاغوری</DialogTitle>
          <DialogDescription>برای ذخیره علاقه‌مندی‌ها، ارسال دیدگاه و مقاله وارد شوید.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} dir="rtl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">ورود</TabsTrigger>
            <TabsTrigger value="signup">ثبت‌نام</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form className="space-y-3 pt-2" onSubmit={notice}>
              <div className="space-y-1.5"><Label htmlFor="li-email">ایمیل</Label><Input id="li-email" type="email" required dir="ltr" /></div>
              <div className="space-y-1.5"><Label htmlFor="li-pass">رمز عبور</Label><Input id="li-pass" type="password" required dir="ltr" /></div>
              <Button type="submit" className="w-full">ورود</Button>
              <button type="button" onClick={() => toast.info('بازیابی رمز عبور همراه با حساب‌های کاربری فعال می‌شود.')} className="w-full text-center text-xs text-primary hover:underline">
                رمز عبور را فراموش کرده‌اید؟
              </button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form className="space-y-3 pt-2" onSubmit={notice}>
              <div className="space-y-1.5"><Label htmlFor="su-name">نام و نام خانوادگی</Label><Input id="su-name" required /></div>
              <div className="space-y-1.5"><Label htmlFor="su-email">ایمیل</Label><Input id="su-email" type="email" required dir="ltr" /></div>
              <div className="space-y-1.5"><Label htmlFor="su-pass">رمز عبور</Label><Input id="su-pass" type="password" minLength={8} required dir="ltr" /></div>
              <Button type="submit" className="w-full">ایجاد حساب</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
