"use client"

import { useAutoTranslate } from "@/hooks/useAutoTranslate"

export function T({ children }: { children: string | null | undefined }) {
  const text = useAutoTranslate(children ?? "")
  return <>{text}</>
}
