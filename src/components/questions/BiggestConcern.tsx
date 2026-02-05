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
  const { state, dispatch, goNext, goBack } = useApp()
  const { userData } = state

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { biggestConcern: e.target.value } })
  }

  const handleSuggestionClick = (suggestion: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { biggestConcern: suggestion } })
  }

  return (
    <QuestionLayout
      title="One more thing..."
      subtitle="What's your biggest financial concern right now?"
      currentStep={6}
      totalSteps={7}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
          <MessageSquare className="w-8 h-8 text-indigo-600" />
        </div>

        <Textarea
          value={userData.biggestConcern}
          onChange={handleChange}
          placeholder="Tell us what keeps you up at night financially..."
          className="min-h-[120px] text-base"
        />

        <div className="mt-6">
          <p className="text-sm text-slate-500 mb-3">Or select a common concern:</p>
          <div className="flex flex-wrap gap-2">
            {CONCERN_SUGGESTIONS.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  userData.biggestConcern === suggestion
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
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
            className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <p className="text-sm text-green-700">
              We'll address this in your personalized recommendations.
            </p>
          </motion.div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={goNext}>
            Calculate My Score
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
