import { Toaster } from "react-hot-toast"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { getLocalVilles } from "@/lib/supabase-data"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Villes actives (base, repli fichier) pour le sous-menu « Zones ».
  const villes = await getLocalVilles()

  return (
    <>
      {/* Un seul Toaster pour tout le site public : le modal de devis se
          demonte a la fermeture, un Toaster interne emporterait le message
          de confirmation avec lui. */}
      <Toaster position="top-right" />
      <Navbar villes={villes} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
