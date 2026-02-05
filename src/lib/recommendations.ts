import type { UserData, Recommendation, Scores } from "@/types"
import { parseInvestmentRange } from "./utils"

export function generateRecommendations(
  userData: UserData,
  _scores: Scores
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const investmentValue = parseInvestmentRange(userData.totalInvested)

  // High expense ratio recommendation
  if (["0.5-1", "over-1"].includes(userData.expenseRatio)) {
    const currentRatio =
      userData.expenseRatio === "over-1" ? 1.2 : 0.75
    const targetRatio = 0.05
    const annualSavings = investmentValue * (currentRatio - targetRatio) / 100
    const tenYearSavings = annualSavings * 10

    recommendations.push({
      id: "expense-ratio",
      title: "Switch to Low-Cost Index Funds",
      category: "Cost Efficiency",
      priority: "high",
      currentState: `Your funds have expense ratios averaging ${currentRatio}%`,
      recommendedState: "Move to index funds with 0.03-0.10% expense ratios",
      dollarImpact: tenYearSavings,
      impactDescription: `Save up to ${formatDollar(tenYearSavings)} over 10 years`,
      explanation:
        "High expense ratios silently erode your returns. A 1% difference in fees can cost you 25% of your portfolio over 35 years. Index funds provide market returns at a fraction of the cost.",
      steps: [
        {
          title: "Review your current fund holdings",
          description:
            "Log into your brokerage account and list all funds with their expense ratios.",
        },
        {
          title: "Identify low-cost alternatives",
          description:
            "For each high-cost fund, find an equivalent index fund. Popular options include VTI (total market), VXUS (international), and BND (bonds).",
          link: "https://www.vanguard.com",
        },
        {
          title: "Execute the switch",
          description:
            "Sell high-cost funds and buy low-cost alternatives. If in a tax-advantaged account, there's no tax impact.",
        },
      ],
    })
  }

  // High advisor fees
  if (
    userData.hasAdvisor &&
    ["1-1.5", "over-1.5"].includes(userData.advisorFee)
  ) {
    const feeRate = userData.advisorFee === "over-1.5" ? 1.75 : 1.25
    const annualFees = investmentValue * (feeRate / 100)

    recommendations.push({
      id: "advisor-fees",
      title: "Evaluate Your Advisor Costs",
      category: "Cost Efficiency",
      priority: "medium",
      currentState: `Paying approximately ${feeRate}% in advisor fees`,
      recommendedState:
        "Consider a robo-advisor (0.25%) or fee-only advisor",
      dollarImpact: annualFees * 0.7,
      impactDescription: `Could save ${formatDollar(annualFees * 0.7)} annually`,
      explanation:
        "Traditional advisors charging over 1% often don't provide enough value to justify the cost. Robo-advisors and fee-only planners offer similar services at lower costs.",
      steps: [
        {
          title: "Document what services you receive",
          description:
            "List all services your advisor provides: investment management, tax planning, estate planning, etc.",
        },
        {
          title: "Compare alternatives",
          description:
            "Research robo-advisors (Betterment, Wealthfront) or fee-only advisors in your area.",
          link: "https://www.napfa.org/find-an-advisor",
        },
        {
          title: "Have a conversation",
          description:
            "Ask your current advisor to justify their fees or negotiate a lower rate.",
        },
      ],
    })
  }

  // Too much cash allocation
  if (userData.allocation.cash > 20) {
    const excessCash =
      investmentValue * ((userData.allocation.cash - 10) / 100)
    const missedReturns = excessCash * 0.07 // Assume 7% market return

    recommendations.push({
      id: "excess-cash",
      title: "Put Your Cash to Work",
      category: "Investment Strategy",
      priority: "high",
      currentState: `${userData.allocation.cash}% of portfolio in cash`,
      recommendedState: "Reduce cash to 5-10% for emergency reserves",
      dollarImpact: missedReturns * 10,
      impactDescription: `Potential ${formatDollar(missedReturns * 10)} in missed gains over 10 years`,
      explanation:
        "While cash feels safe, holding too much means missing out on market growth. Over time, inflation erodes cash value while investments grow.",
      steps: [
        {
          title: "Determine your emergency fund needs",
          description:
            "Keep 3-6 months of expenses in a high-yield savings account, not your investment portfolio.",
        },
        {
          title: "Create an investment plan",
          description:
            "Decide whether to invest the excess cash all at once or dollar-cost average over 6-12 months.",
        },
        {
          title: "Invest in a diversified portfolio",
          description:
            "Move excess cash into a mix of stocks and bonds appropriate for your age and goals.",
        },
      ],
    })
  }

  // Frequent trading
  if (["monthly", "weekly"].includes(userData.tradingFrequency)) {
    recommendations.push({
      id: "trading-frequency",
      title: "Adopt a Buy-and-Hold Strategy",
      category: "Behavioral Health",
      priority: "medium",
      currentState: "Trading frequently (monthly or more)",
      recommendedState: "Rebalance quarterly or annually",
      dollarImpact: investmentValue * 0.02,
      impactDescription: "Reduce trading costs and improve returns by 1-2%",
      explanation:
        "Frequent trading increases costs (commissions, spreads, taxes) and usually leads to worse returns. Studies show most active traders underperform buy-and-hold investors.",
      steps: [
        {
          title: "Set a rebalancing schedule",
          description:
            "Decide to rebalance quarterly or annually, or when allocations drift more than 5% from targets.",
        },
        {
          title: "Automate contributions",
          description:
            "Set up automatic investments to remove the temptation to time the market.",
        },
        {
          title: "Remove trading apps",
          description:
            "Reduce the temptation to trade by limiting access to trading platforms.",
        },
      ],
    })
  }

  // Panic selling history
  if (["sometimes", "often"].includes(userData.panicSelling)) {
    recommendations.push({
      id: "panic-selling",
      title: "Develop an Investment Policy Statement",
      category: "Behavioral Health",
      priority: "high",
      currentState: "History of selling during market downturns",
      recommendedState: "Written plan for market volatility",
      dollarImpact: investmentValue * 0.15,
      impactDescription: "Avoid potentially 15%+ in permanent losses",
      explanation:
        "Selling during downturns locks in losses and misses the recovery. The market has recovered from every crash, but only for those who stayed invested.",
      steps: [
        {
          title: "Write an investment policy statement",
          description:
            "Document your goals, risk tolerance, and what you will (and won't) do during market declines.",
        },
        {
          title: "Review historical data",
          description:
            "Study past market crashes and recoveries to build confidence in long-term investing.",
        },
        {
          title: "Set up a 'cooling off' period",
          description:
            "Commit to waiting 48 hours before making any sell decision during volatile markets.",
        },
      ],
    })
  }

  // Missing emergency fund
  if (!userData.financialGaps.emergencyFund) {
    recommendations.push({
      id: "emergency-fund",
      title: "Build an Emergency Fund",
      category: "Goal Coverage",
      priority: "high",
      currentState: "No emergency fund in place",
      recommendedState: "3-6 months of expenses in savings",
      dollarImpact: 0,
      impactDescription: "Prevent costly debt during emergencies",
      explanation:
        "An emergency fund prevents you from going into debt or selling investments at bad times when unexpected expenses arise.",
      steps: [
        {
          title: "Calculate your monthly expenses",
          description:
            "Add up essential costs: housing, food, utilities, insurance, transportation.",
        },
        {
          title: "Open a high-yield savings account",
          description:
            "Find an account paying 4%+ APY for your emergency fund.",
          link: "https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts",
        },
        {
          title: "Automate monthly contributions",
          description:
            "Set up automatic transfers until you reach 3-6 months of expenses.",
        },
      ],
    })
  }

  // Missing life insurance with children
  if (userData.hasChildren && !userData.financialGaps.lifeInsurance) {
    recommendations.push({
      id: "life-insurance",
      title: "Get Term Life Insurance",
      category: "Goal Coverage",
      priority: "high",
      currentState: "No life insurance with dependents",
      recommendedState: "Term life insurance (10-12x income)",
      dollarImpact: 0,
      impactDescription: "Protect your family's financial future",
      explanation:
        "With children depending on your income, life insurance ensures they're financially protected if something happens to you.",
      steps: [
        {
          title: "Calculate coverage needed",
          description:
            "Aim for 10-12 times your annual income, plus any debts and future education costs.",
        },
        {
          title: "Get quotes from multiple providers",
          description:
            "Compare term life policies from several insurers.",
          link: "https://www.policygenius.com",
        },
        {
          title: "Choose a term length",
          description:
            "Select a term that covers until your youngest child is financially independent.",
        },
      ],
    })
  }

  // Missing 529 with children and education goal
  if (
    userData.hasChildren &&
    userData.goals.includes("education") &&
    !userData.financialGaps.collegesSavings
  ) {
    recommendations.push({
      id: "education-savings",
      title: "Open a 529 Education Savings Plan",
      category: "Goal Coverage",
      priority: "medium",
      currentState: "No dedicated education savings",
      recommendedState: "529 plan with regular contributions",
      dollarImpact: investmentValue * 0.03,
      impactDescription: "Tax-free growth for education expenses",
      explanation:
        "529 plans offer tax-free growth and withdrawals for education expenses, making them the most efficient way to save for college.",
      steps: [
        {
          title: "Research state plans",
          description:
            "Check if your state offers tax deductions for 529 contributions. You can use any state's plan.",
        },
        {
          title: "Choose investments",
          description:
            "Select age-based options that automatically become more conservative as your child approaches college.",
        },
        {
          title: "Set up automatic contributions",
          description:
            "Even $100-200/month can grow significantly over 18 years.",
        },
      ],
    })
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  )

  return recommendations.slice(0, 5) // Return top 5 recommendations
}

function formatDollar(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}
