import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, MessageSquare } from "lucide-react"
import { QuestionLayout } from "@/components/shared/QuestionLayout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/context/AppContext"

const CONCERN_SUGGESTIONS = [
  "Am I saving enough for retirement?",
  "Are my investments too risky or too conservative?",
  "How do I reduce investment fees?",
  "Should I pay off debt or invest more?",
  "How do I protect my family financially?",
]

export function BiggestConcern() {
  const { state, dispatch, goNext, goBack, calculateResults } = useApp()
  const { userData } = state

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { biggestConcern: e.target.value } })
  }

  const handleSuggestionClick = (suggestion: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { biggestConcern: suggestion } })
  }

  const handleCalculate = () => {
    calculateResults()
    goNext()
  }

  return (
    <QuestionLayout
      title="One more thing..."
      subtitle="What's your biggest financial concern right now?"
      currentStep={6}
      totalSteps={7}
    >
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
          <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
        </div>

        <Textarea
          value={userData.biggestConcern}
          onChange={handleChange}
          placeholder="Tell us what keeps you up at night financially..."
          className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none"
        />

        <div className="mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">Or select a common concern:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CONCERN_SUGGESTIONS.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border transition-all select-none min-h-[36px] ${
                  userData.biggestConcern === suggestion
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 active:bg-slate-50"
                }`}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>

        {userData.biggestConcern && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <p className="text-xs sm:text-sm text-green-700">
              We'll address this in your personalized recommendations.
            </p>
          </motion.div>
        )}

        <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={goBack} className="min-w-[100px] sm:min-w-[120px]">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
          <Button onClick={handleCalculate} className="min-w-[120px] sm:min-w-[160px]">
            <span className="text-sm sm:text-base">Calculate My Score</span>
            <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
