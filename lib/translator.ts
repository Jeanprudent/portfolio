const cache = new Map<string, string>()

function splitIntoChunks(text: string, maxLen = 450): string[] {
  if (text.length <= maxLen) return [text]
  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?»])\s+/)
  let current = ""
  for (const sentence of sentences) {
    if (current && (current + " " + sentence).length > maxLen) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? current + " " + sentence : sentence
    }
  }
  if (current) chunks.push(current.trim())
  return chunks
}

export async function translateText(text: string, to: string, from = "fr"): Promise<string> {
  if (!text?.trim() || to === from) return text

  const cacheKey = `${from}|${to}|${text}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)!

  const chunks = splitIntoChunks(text)

  const translated = await Promise.all(
    chunks.map(async (chunk) => {
      const chunkKey = `${from}|${to}|${chunk}`
      if (cache.has(chunkKey)) return cache.get(chunkKey)!
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${from}|${to}`
        )
        const data = await res.json()
        const result: string = data.responseData?.translatedText || chunk
        cache.set(chunkKey, result)
        return result
      } catch {
        return chunk
      }
    })
  )

  const full = translated.join(" ")
  cache.set(cacheKey, full)
  return full
}
