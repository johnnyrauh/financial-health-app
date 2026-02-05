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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-xl border-2 transition-all duration-200",
        variant === "default" ? "p-4 sm:p-5" : "p-3 sm:p-4",
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              selected ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "font-semibold",
                variant === "default" ? "text-base sm:text-lg" : "text-sm sm:text-base",
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
                "mt-1 text-sm",
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
