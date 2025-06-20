import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
  children: ReactNode
  sectionKey: string
}

const SectionTransition = ({ children, sectionKey }: Props) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sectionKey}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default SectionTransition 