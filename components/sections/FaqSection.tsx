"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"

type FaqItem = { q: string; a: string }

function FaqItemComp({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FaqItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`glass-card overflow-hidden transition-all duration-300 ${
          isOpen ? "border-primary/30 shadow-[0_8px_32px_rgba(124,58,237,0.18)]" : ""
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 p-6 text-left group"
          aria-expanded={isOpen}
        >
          <span className="font-heading font-semibold text-sm md:text-base text-(--text-primary) leading-snug group-hover:text-primary transition-colors duration-200">
            {faq.q}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200 ${
              isOpen
                ? "bg-primary text-white"
                : "glass border border-(--glass-border) text-(--text-secondary)"
            }`}
          >
            <Icon icon="line-md:plus" width={16} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="px-6 pb-6">
                <div className="h-px bg-(--glass-border) mb-4" />
                <p className="text-(--text-secondary) text-sm md:text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function FaqSection() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = t("faq.questions", { returnObjects: true }) as FaqItem[]

  return (
    <section id="faq" className="section-spacing">
      <div className="container-max">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="section-label mb-4 inline-flex">
            <Icon icon="line-md:chat-bubble-twotone" width={14} />
            {t("faq.label")}
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-(--text-primary) mb-4">
            {t("faq.title")}{" "}
            <span className="gradient-text">{t("faq.title_highlight")}</span>
          </h2>
          <p className="text-(--text-secondary) text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {t("faq.subtitle")}{" "}
            <a href="#contact" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
              {t("faq.subtitle_link")}
            </a>
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {Array.isArray(faqs) && faqs.map((faq, i) => (
            <FaqItemComp
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="#contact" className="btn-primary inline-flex">
            <Icon icon="line-md:phone-call-loop" width={18} />
            {t("faq.cta")}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
