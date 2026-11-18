import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/** Newsletter signup UI — storage is added with the newsletter milestone (PLAN.md). */
export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        toast.success('سپاس! خبرنامه به‌زودی راه‌اندازی می‌شود و نخستین شماره را برایتان می‌فرستیم.')
        setEmail('')
      }}
    >
      <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل شما" aria-label="ایمیل برای خبرنامه" dir="ltr" className={dark ? 'border-white/20 bg-white/10 text-white placeholder:text-white/50' : 'bg-white'} />
      <Button type="submit" className="shrink-0 bg-gold font-bold text-navy hover:bg-gold/90">عضویت</Button>
    </form>
  )
}
