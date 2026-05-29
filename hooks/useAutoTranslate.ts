"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { translateText } from "@/lib/translator"

export function useAutoTranslate(text: string, sourceLang = "fr"): string {
  const { i18n } = useTranslation()
  const [result, setResult] = useState(text)

  useEffect(() => {
    if (!text || i18n.language === sourceLang) {
      setResult(text)
      return
    }
    let cancelled = false
    translateText(text, i18n.language, sourceLang).then((t) => {
      if (!cancelled) setResult(t)
    })
    return () => { cancelled = true }
  }, [text, i18n.language, sourceLang])

  return result
}
