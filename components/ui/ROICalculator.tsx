import { useState } from "react"

export default function ROICalculator({ initialHours = 5, initialRate = 10000 }: { initialHours?: number; initialRate?: number }) {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(initialHours)
  const [hourlyRate, setHourlyRate] = useState<number>(initialRate)

  const annualCost = Math.max(0, hoursPerWeek) * Math.max(0, hourlyRate) * 52
  const euroRate = 655.957 // CFA -> EUR fixed conversion (approx)
  const annualCostEur = annualCost / euroRate

  const formatted = (value: number, locale = "fr-FR", currency?: string) => {
    try {
      if (currency) return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value)
      return new Intl.NumberFormat(locale).format(value)
    } catch {
      return String(value)
    }
  }

  const handleExample = () => {
    setHoursPerWeek(2)
    setHourlyRate(initialRate)
  }

  return (
    <section aria-labelledby="roi-title" className="p-4 bg-gradient-to-r from-white/3 to-white/5 rounded-lg border border-(--glass-border)">
      <h3 id="roi-title" className="font-semibold text-lg mb-2">Combien ça vous coûte aujourd'hui ?</h3>
      <p className="text-(--text-secondary) text-sm mb-4">Estimez rapidement les heures perdues à gérer des tâches manuelles (emails, relances, saisie) — l'automatisation peut récupérer ce temps.</p>

      <div className="grid grid-cols-2 gap-3 items-end">
        <label htmlFor="roi-hours" className="flex flex-col">
          <span className="text-xs text-(--text-secondary) mb-1">Heures / semaine</span>
          <input id="roi-hours" className="input" type="number" min={0} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} aria-label="Heures par semaine" />
        </label>

        <label htmlFor="roi-rate" className="flex flex-col">
          <span className="text-xs text-(--text-secondary) mb-1">Tarif horaire (FCFA)</span>
          <input id="roi-rate" className="input" type="number" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} aria-label="Tarif horaire en FCFA" />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-(--text-secondary)">Coût annuel estimé</div>
          <div className="font-heading font-bold text-2xl">{formatted(annualCost)} FCFA</div>
          <div className="text-xs text-(--text-secondary)">~ {formatted(annualCostEur, "fr-FR", "EUR")}</div>
        </div>

        <div className="text-right">
          <button type="button" className="btn-outline mr-2" onClick={handleExample}>Exemple : 2h / semaine</button>
          <a href="#contact" className="btn-primary" aria-label="Réserver audit SEO gratuit 15 minutes">Réserver mon audit SEO gratuit (15 min)</a>
        </div>
      </div>

      <p className="mt-3 text-xs text-(--text-secondary)">À {formatted(hourlyRate)} FCFA / ~{formatted(hourlyRate / euroRate, "fr-FR", "EUR")} par heure, vous perdez ~{formatted(annualCost)} FCFA ({formatted(annualCostEur, "fr-FR", "EUR")}) par an.</p>
    </section>
  )
}
