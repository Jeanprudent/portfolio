import { Toaster } from "react-hot-toast"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Un seul Toaster pour tout le site public : le modal de devis se
          demonte a la fermeture, un Toaster interne emporterait le message
          de confirmation avec lui. */}
      <Toaster position="top-right" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
