import {
  Atom, BookOpen, Feather, GraduationCap, HeartHandshake, Landmark, Megaphone,
  Mountain, Newspaper, PenLine, Scale, ScrollText, Sparkles, Users, type LucideIcon,
} from 'lucide-react'
import { categoryBySlug } from '@/data/fixtures'

const icons: Record<string, LucideIcon> = {
  Atom, BookOpen, Feather, GraduationCap, HeartHandshake, Landmark, Megaphone,
  Mountain, Newspaper, PenLine, Scale, ScrollText, Sparkles, Users,
}

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[categoryBySlug(slug)?.icon ?? 'BookOpen'] ?? BookOpen
  return <Icon className={className} aria-hidden="true" />
}
