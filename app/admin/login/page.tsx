"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/lib/supabase"

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
})

type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPwd, setShowPwd] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email, password }: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      router.push("/admin")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Identifiants incorrects")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#050510" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(22px)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.2))",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            >
              <Icon icon="ant-design:lock-twotone" width={32} className="text-[#7C3AED]" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white mb-1">
              Administration
            </h1>
            <p className="text-white/50 text-sm">
              Connectez-vous pour gérer votre portfolio
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#FCA5A5",
              }}
            >
              <Icon icon="line-md:alert-twotone" width={16} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="login@exemple.com"
                {...register("email")}
                className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-1 transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full h-11 px-4 pr-11 rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  <Icon icon={showPwd ? "line-md:eye-off" : "line-md:eye"} width={18} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 mt-2 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Icon icon="line-md:loading-loop" width={18} />
                  Connexion…
                </>
              ) : (
                <>
                  <Icon icon="line-md:login" width={18} />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <a
            href="/"
            className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            <Icon icon="line-md:arrow-left" width={14} />
            Retour au portfolio
          </a>
        </div>
      </motion.div>
    </div>
  )
}
