import { Chip } from '@/components/ui/Chip'
import { ChevronRight } from 'lucide-react'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
  onClick?: () => void
}

/**
 * Tarjeta de curso en el tab "Aprender".
 */
export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border cursor-pointer
        transition-all duration-150
        hover:border-[var(--color-primary-light)] hover:bg-[var(--color-primary-50)]"
      style={{ borderColor: 'var(--color-border-light)' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* Icono */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] flex-shrink-0"
        style={{ background: 'var(--color-primary-100)' }}
      >
        {course.emoji}
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[15px]" style={{ color: 'var(--color-text)' }}>
          {course.title}
        </div>
        <div className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {course.desc}
        </div>
      </div>

      {/* Duración + flecha */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Chip className="text-[11px]">{course.duration}</Chip>
        <ChevronRight size={16} style={{ color: 'var(--color-text-subtle)' }} />
      </div>
    </div>
  )
}