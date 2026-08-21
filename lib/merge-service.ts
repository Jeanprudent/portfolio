import type { Service } from "@/types/portfolio"

/**
 * Fusionne la fiche venue de Supabase avec celle du fichier local.
 *
 * La base fait autorité, le fichier ne comble que les trous. Ce qui compte
 * ici est la définition de « trou » : la migration 003 crée `offers` avec la
 * valeur par défaut `'[]'`, et `long_description` à `null`. Sans traiter le
 * tableau vide et la chaîne vide comme absents, activer la base ferait
 * disparaître les offres et le texte long des services pas encore repris —
 * régression constatée le 21/08, la section Tarifs s'était volatilisée.
 *
 * `false` et `0` restent en revanche des valeurs légitimes : un service
 * masqué (`visible: false`) ou premier dans l'ordre (`order_index: 0`) ne
 * doit pas se faire écraser par le fichier.
 */
function estRenseigne(v: unknown): boolean {
  if (v === null || v === undefined) return false
  if (typeof v === "string") return v.trim() !== ""
  if (Array.isArray(v)) return v.length > 0
  return true
}

export function mergeService(
  local: Service | null,
  distant: Service
): Service {
  if (!local) return distant

  const retenus = Object.fromEntries(
    Object.entries(distant).filter(([, v]) => estRenseigne(v))
  )

  return { ...local, ...retenus } as Service
}
