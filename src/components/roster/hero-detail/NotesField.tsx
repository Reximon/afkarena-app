import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, Textarea } from '@/components/ui/Input'

interface NotesFieldProps {
  value: string
  onChange: (value: string) => void
}

export function NotesField({ value, onChange }: NotesFieldProps) {
  const { t } = useTranslation()
  const [text, setText] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  const timer = useRef<number | undefined>(undefined)
  const latest = useRef({ text, value, onChange })

  if (value !== prevValue) {
    setPrevValue(value)
    setText(value)
  }

  useEffect(() => {
    latest.current = { text, value, onChange }
  })

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
      const { text: pending, value: saved, onChange: commit } = latest.current
      if (pending !== saved) commit(pending)
    },
    [],
  )

  function handleChange(next: string) {
    setText(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => onChange(next), 400)
  }

  return (
    <Field label={t('hero.notes')}>
      <Textarea
        value={text}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={t('roster.notesPlaceholder')}
      />
    </Field>
  )
}
