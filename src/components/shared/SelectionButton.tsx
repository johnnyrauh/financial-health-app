import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectionButtonProps {
  label: string
  description?: string
  icon?: React.ReactNode
  selected: boolean
  onClick: () => void
  variant?: "default" | "compact"
}

export function SelectionButton({
  label,
  description,
  icon,
  selected,
  onClick,
  variant = "default",
}: SelectionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-xl border-2 transition-all duration-200 select-none",
        // Ensure minimum 44px height for touch targets
        variant === "default" ? "p-3.5 sm:p-4 md:p-5 min-h-[52px]" : "p-3 sm:p-4 min-h-[48px]",
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md active:bg-slate-50"
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              "flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center",
              selected ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "font-semibold leading-tight",
                variant === "default" ? "text-sm sm:text-base md:text-lg" : "text-sm sm:text-base",
                selected ? "text-indigo-900" : "text-slate-900"
              )}
            >
              {label}
            </span>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex-shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </div>
          {description && (
            <p
              className={cn(
                "mt-0.5 sm:mt-1 text-xs sm:text-sm leading-snug",
                selected ? "text-indigo-700" : "text-slate-500"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  )
}
