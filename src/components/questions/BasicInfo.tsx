import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, User, DollarSign, Users } from "lucide-react"
import { QuestionLayout } from "@/components/shared/QuestionLayout"
import { SelectionButton } from "@/components/shared/SelectionButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useApp } from "@/context/AppContext"
import { INCOME_OPTIONS } from "@/types"

export function BasicInfo() {
  const { state, dispatch, goNext, goBack } = useApp()
  const { userData } = state

  const [step, setStep] = useState(0)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { name: e.target.value } })
  }

  const handleAgeChange = (value: number[]) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { age: value[0] } })
  }

  const handleIncomeSelect = (income: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { income } })
  }

  const handleChildrenSelect = (hasChildren: boolean) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { hasChildren } })
    if (!hasChildren) {
      dispatch({ type: "UPDATE_USER_DATA", payload: { numberOfChildren: 0 } })
    }
  }

  const handleChildCountChange = (value: number[]) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { numberOfChildren: value[0] } })
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return userData.name.trim().length > 0
      case 1:
        return userData.age >= 18 && userData.age <= 100
      case 2:
        return userData.income !== ""
      case 3:
        return true // Can always proceed from children question
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      goNext()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      goBack()
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <Label htmlFor="name" className="text-lg text-slate-700">
                What should we call you?
              </Label>
              <Input
                id="name"
                placeholder="Enter your first name"
                value={userData.name}
                onChange={handleNameChange}
                className="text-lg h-14"
                autoFocus
              />
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="age"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-8">
              <p className="text-lg text-slate-600 text-center">
                Great to meet you, <span className="font-semibold text-indigo-600">{userData.name}</span>!
              </p>
              <div className="bg-indigo-50 rounded-2xl p-8 text-center">
                <p className="text-slate-600 mb-2">Your age</p>
                <p className="text-5xl font-bold text-indigo-600 mb-6">
                  {userData.age}
                </p>
                <Slider
                  value={[userData.age]}
                  onValueChange={handleAgeChange}
                  min={18}
                  max={85}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span>18</span>
                  <span>85</span>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="income"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-600 text-center mb-6">
                What's your approximate annual household income?
              </p>
              <div className="space-y-3">
                {INCOME_OPTIONS.map((option) => (
                  <SelectionButton
                    key={option.value}
                    label={option.label}
                    selected={userData.income === option.value}
                    onClick={() => handleIncomeSelect(option.value)}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="children"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-slate-600 text-center mb-6">
                Do you have any children or dependents?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <SelectionButton
                  label="Yes"
                  selected={userData.hasChildren}
                  onClick={() => handleChildrenSelect(true)}
                />
                <SelectionButton
                  label="No"
                  selected={userData.hasChildren === false && userData.income !== ""}
                  onClick={() => handleChildrenSelect(false)}
                />
              </div>

              {userData.hasChildren && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-purple-50 rounded-2xl p-6 mt-4"
                >
                  <p className="text-slate-600 mb-2 text-center">Number of children</p>
                  <p className="text-4xl font-bold text-purple-600 text-center mb-4">
                    {userData.numberOfChildren}
                  </p>
                  <Slider
                    value={[userData.numberOfChildren]}
                    onValueChange={handleChildCountChange}
                    min={1}
                    max={6}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-slate-500">
                    <span>1</span>
                    <span>6+</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <QuestionLayout
      title="Let's get to know you"
      subtitle="This helps us personalize your financial health score"
      currentStep={1}
      totalSteps={7}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {renderStep()}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step < 3 ? "Continue" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
