import type {
  UserData,
  Scores,
  Recommendation,
  AllocationData
} from '@/types';

export interface CurrentPortfolio extends AllocationData {
  issues: string[];
}

export interface RecommendedFund {
  name: string;
  ticker: string;
  percentage: number;
  expenseRatio: number;
}

export interface PortfolioExplanation {
  icon: string;
  title: string;
  current: string;
  recommended: string;
  why: string;
}

export interface RecommendedPortfolio extends AllocationData {
  benefits: string[];
  explanations: PortfolioExplanation[];
  recommendedFunds: RecommendedFund[];
}

export interface FeeBreakdown {
  type: string;
  description: string;
  current: number;
  recommended: number;
  annualSavings: number;
}

export interface CostData {
  currentExpenseRatio: number;
  recommendedExpenseRatio: number;
  currentAdvisorFee: number;
  recommendedAdvisorFee: number;
  totalCurrentFees: number;
  totalRecommendedFees: number;
  annualCurrentCost: number;
  annualRecommendedCost: number;
  totalAnnualSavings: number;
  feeBreakdown: FeeBreakdown[];
  projectionWithCurrentFees: { [year: number]: number };
  projectionWithRecommendedFees: { [year: number]: number };
  finalValueWithCurrentFees: number;
  finalValueWithRecommendedFees: number;
  savings: number;
}

export interface TradingHistoryPoint {
  month: number;
  trades: number;
}

export interface BehavioralData {
  tradesPerYear: number;
  tradingHistory: TradingHistoryPoint[];
  costPerTrade: number;
  annualPenaltyPercent: number;
  buyAndHoldValue: number;
  yourValue: number;
}

/**
 * Calculate Financial Health Scores
 */
export function calculateFinancialHealthScores(userData: UserData): Scores {
  const investmentStrategy = calculateInvestmentStrategyScore(userData);
  const costEfficiency = calculateCostEfficiencyScore(userData);
  const taxOptimization = calculateTaxOptimizationScore(userData);
  const behavioralHealth = calculateBehavioralHealthScore(userData);
  const goalCoverage = calculateGoalCoverageScore(userData);

  // Weighted average - cost and behavioral are most impactful
  const overall = Math.round(
    investmentStrategy * 0.20 +
    costEfficiency * 0.30 +
    taxOptimization * 0.15 +
    behavioralHealth * 0.25 +
    goalCoverage * 0.10
  );

  return {
    overall,
    investmentStrategy,
    costEfficiency,
    taxOptimization,
    behavioralHealth,
    goalCoverage,
  };
}

function calculateInvestmentStrategyScore(userData: UserData): number {
  let score = 0;
  const { stocks, bonds, cash, other } = userData.allocation;

  // Assume stocks split: 70% US, 30% international for scoring
  const intlStocks = Math.round(stocks * 0.3);

  // Diversification (40 points)
  const hasStocks = stocks > 0;
  const hasIntl = intlStocks > 0;
  const hasBonds = bonds > 0;
  const tooMuchCash = cash > 20;
  const tooMuchOther = other > 10;

  if (hasStocks) score += 15;
  if (hasIntl) score += 15;
  if (hasBonds) score += 10;
  if (tooMuchCash) score -= 5;
  if (tooMuchOther) score -= 5;

  // Age-appropriate allocation (30 points)
  const recommendedStockPercent = Math.max(Math.min(110 - userData.age, 90), 30);
  const actualStockPercent = stocks;
  const allocationDiff = Math.abs(recommendedStockPercent - actualStockPercent);

  if (allocationDiff <= 5) score += 30;
  else if (allocationDiff <= 10) score += 20;
  else if (allocationDiff <= 20) score += 10;

  // Global diversification (30 points)
  if (intlStocks >= 20 && intlStocks <= 40) score += 30;
  else if (intlStocks >= 10 && intlStocks < 20) score += 20;
  else if (intlStocks > 0) score += 10;

  return Math.max(0, Math.min(100, score));
}

function calculateCostEfficiencyScore(userData: UserData): number {
  let score = 100;

  // Expense ratio impact (70 points)
  const erMap: { [key: string]: number } = {
    'under-0.1': 70,
    '0.1-0.5': 50,
    '0.5-1': 25,
    'over-1': 0,
    'unknown': 35,
  };
  score = erMap[userData.expenseRatio] || 35;

  // Advisor fee impact (30 points)
  if (userData.hasAdvisor && userData.advisorFee) {
    const feeMap: { [key: string]: number } = {
      'under-0.5': 25,
      '0.5-1': 20,
      '1-1.5': 10,
      'over-1.5': 0,
      'flat-fee': 20,
      'unknown': 10,
    };
    score += feeMap[userData.advisorFee] || 10;
  } else {
    score += 30;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateTaxOptimizationScore(userData: UserData): number {
  let score = 50; // Base score

  // Has tax-advantaged accounts (simplified assumption)
  score += 20;

  // 529 if kids (30 points)
  if (userData.hasChildren) {
    score += userData.financialGaps.collegesSavings ? 30 : 0;
  } else {
    score += 30;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateBehavioralHealthScore(userData: UserData): number {
  let score = 0;

  // Trading frequency (40 points)
  const tradingMap: { [key: string]: number } = {
    'rarely': 40,
    'occasionally': 30,
    'monthly': 15,
    'weekly': 0,
  };
  score += tradingMap[userData.tradingFrequency] || 20;

  // Panic selling (30 points)
  const panicMap: { [key: string]: number } = {
    'never': 30,
    'once': 20,
    'sometimes': 10,
    'often': 0,
  };
  score += panicMap[userData.panicSelling] || 15;

  // Checking frequency (30 points)
  const checkingMap: { [key: string]: number } = {
    'yearly': 30,
    'quarterly': 25,
    'monthly': 20,
    'weekly': 10,
    'daily': 0,
  };
  score += checkingMap[userData.checkingFrequency] || 15;

  return Math.max(0, Math.min(100, score));
}

function calculateGoalCoverageScore(userData: UserData): number {
  let score = 0;
  const totalInvested = convertInvestmentRangeToNumber(userData.totalInvested);

  // Emergency fund (40 points)
  score += userData.financialGaps.emergencyFund ? 40 : 0;

  // Retirement on track (40 points)
  const ageScore = totalInvested > (userData.age - 25) * 10000 ? 40 : 20;
  score += ageScore;

  // 529 if kids (20 points)
  if (userData.hasChildren) {
    score += userData.financialGaps.collegesSavings ? 20 : 0;
  } else {
    score += 20;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate current portfolio analysis
 */
export function generateCurrentPortfolio(userData: UserData): CurrentPortfolio {
  const issues: string[] = [];
  const { stocks, bonds, cash, other } = userData.allocation;

  // Assume 30% of stocks should be international
  const estimatedIntl = Math.round(stocks * 0.3);

  if (estimatedIntl < 10) issues.push('Missing international diversification');
  if (cash > 20) issues.push('Too much cash not growing');
  if (other > 10) issues.push('Overly complex with non-core assets');

  const recommendedStockPercent = Math.max(Math.min(110 - userData.age, 90), 30);

  if (Math.abs(stocks - recommendedStockPercent) > 15) {
    if (stocks > recommendedStockPercent) {
      issues.push('Too aggressive for your age');
    } else {
      issues.push('Too conservative for your timeline');
    }
  }

  if (bonds < 10 && userData.age > 40) {
    issues.push('Need more bonds for stability');
  }

  return {
    ...userData.allocation,
    issues,
  };
}

/**
 * Generate recommended portfolio
 */
export function generateRecommendedPortfolio(userData: UserData): RecommendedPortfolio {
  const recommendedStockPercent = Math.max(Math.min(110 - userData.age, 90), 30);
  const recommendedBondPercent = 100 - recommendedStockPercent;

  const usStocks = Math.round(recommendedStockPercent * 0.7);
  const intlStocks = Math.round(recommendedStockPercent * 0.3);
  const bonds = recommendedBondPercent;

  const benefits: string[] = [];
  const currentIntl = Math.round(userData.allocation.stocks * 0.3);

  if (currentIntl < 10) benefits.push('Global diversification reduces risk');
  if (userData.allocation.cash > 20) benefits.push('Cash put to work for long-term growth');
  if (userData.allocation.other > 10) benefits.push('Simplified to core asset classes');
  benefits.push('Lower costs with index funds');
  benefits.push('Easier to manage and rebalance');

  const currentER = getExpenseRatioEstimate(userData.expenseRatio);

  const explanations: PortfolioExplanation[] = [
    {
      icon: '🎯',
      title: 'Simplify',
      current: 'Complex mix across multiple asset types',
      recommended: 'Just 3 index funds cover the entire global market',
      why: "Simpler is better. More investments doesn't mean more diversification.",
    },
    {
      icon: '💰',
      title: 'Cut costs',
      current: `Average expense ratio: ${currentER}%`,
      recommended: 'Average expense ratio: 0.05%',
      why: 'A 1% fee can cost you 25% of your total returns over 30 years.',
    },
    {
      icon: '🌍',
      title: 'Diversify globally',
      current: `~${currentIntl}% international`,
      recommended: '30% international stocks',
      why: 'The US is only 60% of world markets. International diversification reduces risk.',
    },
    {
      icon: '⚖️',
      title: 'Balance risk',
      current: `${userData.allocation.stocks}% stocks at age ${userData.age}`,
      recommended: `${recommendedStockPercent}% stocks`,
      why: 'This balance gives you growth while protecting against volatility.',
    },
  ];

  const recommendedFunds: RecommendedFund[] = [
    { name: 'Total US Stock Market Index', ticker: 'VTI', percentage: usStocks, expenseRatio: 0.03 },
    { name: 'Total International Stock Index', ticker: 'VXUS', percentage: intlStocks, expenseRatio: 0.05 },
    { name: 'Total Bond Market Index', ticker: 'BND', percentage: bonds, expenseRatio: 0.03 },
  ];

  return {
    stocks: recommendedStockPercent,
    bonds,
    cash: 0,
    other: 0,
    benefits,
    explanations,
    recommendedFunds,
  };
}

/**
 * Generate cost analysis
 */
export function generateCostAnalysis(userData: UserData): CostData {
  const balance = convertInvestmentRangeToNumber(userData.totalInvested);

  const currentER = getExpenseRatioEstimate(userData.expenseRatio);
  const recommendedER = 0.05;

  const currentAdvisorFee = userData.hasAdvisor ? getAdvisorFeeEstimate(userData.advisorFee) : 0;
  const recommendedAdvisorFee = 0;

  const totalCurrentFees = currentER + currentAdvisorFee;
  const totalRecommendedFees = recommendedER + recommendedAdvisorFee;

  const annualCurrentCost = balance * (totalCurrentFees / 100);
  const annualRecommendedCost = balance * (totalRecommendedFees / 100);
  const totalAnnualSavings = annualCurrentCost - annualRecommendedCost;

  const feeBreakdown: FeeBreakdown[] = [
    {
      type: 'Fund expense ratios',
      description: 'Annual fees charged by your funds',
      current: currentER,
      recommended: recommendedER,
      annualSavings: balance * ((currentER - recommendedER) / 100),
    },
  ];

  if (userData.hasAdvisor) {
    feeBreakdown.push({
      type: 'Advisor fees',
      description: 'Percentage of assets charged by advisor',
      current: currentAdvisorFee,
      recommended: recommendedAdvisorFee,
      annualSavings: balance * (currentAdvisorFee / 100),
    });
  }

  const years = 30;
  const annualReturn = 0.07;
  const projectionWithCurrentFees: { [year: number]: number } = {};
  const projectionWithRecommendedFees: { [year: number]: number } = {};

  let currentValue = balance;
  let recommendedValue = balance;

  for (let year = 0; year <= years; year++) {
    projectionWithCurrentFees[year] = Math.round(currentValue);
    projectionWithRecommendedFees[year] = Math.round(recommendedValue);

    if (year < years) {
      currentValue *= (1 + annualReturn - totalCurrentFees / 100);
      recommendedValue *= (1 + annualReturn - totalRecommendedFees / 100);
    }
  }

  const finalValueWithCurrentFees = projectionWithCurrentFees[years];
  const finalValueWithRecommendedFees = projectionWithRecommendedFees[years];
  const savings = finalValueWithRecommendedFees - finalValueWithCurrentFees;

  return {
    currentExpenseRatio: currentER,
    recommendedExpenseRatio: recommendedER,
    currentAdvisorFee,
    recommendedAdvisorFee,
    totalCurrentFees,
    totalRecommendedFees,
    annualCurrentCost,
    annualRecommendedCost,
    totalAnnualSavings,
    feeBreakdown,
    projectionWithCurrentFees,
    projectionWithRecommendedFees,
    finalValueWithCurrentFees,
    finalValueWithRecommendedFees,
    savings,
  };
}

function getExpenseRatioEstimate(category: string): number {
  const erMap: { [key: string]: number } = {
    'under-0.1': 0.05,
    '0.1-0.5': 0.30,
    '0.5-1': 0.75,
    'over-1': 1.25,
    'unknown': 0.65,
  };
  return erMap[category] || 0.65;
}

function getAdvisorFeeEstimate(category: string): number {
  const feeMap: { [key: string]: number } = {
    'under-0.5': 0.35,
    '0.5-1': 0.75,
    '1-1.5': 1.25,
    'over-1.5': 1.75,
    'flat-fee': 0.5,
    'unknown': 1.0,
  };
  return feeMap[category] || 1.0;
}

/**
 * Generate behavioral analysis
 */
export function generateBehavioralAnalysis(userData: UserData): BehavioralData {
  const tradingMap: { [key: string]: number } = {
    'rarely': 1,
    'occasionally': 6,
    'monthly': 12,
    'weekly': 52,
  };

  const tradesPerYear = tradingMap[userData.tradingFrequency] || 6;

  const tradingHistory: TradingHistoryPoint[] = Array.from({ length: 12 }, (_, month) => ({
    month,
    trades: Math.floor(tradesPerYear / 12) + (Math.random() > 0.5 ? 1 : 0),
  }));

  const costPerTrade = 25;

  const penaltyMap: { [key: string]: number } = {
    'rarely': 0,
    'occasionally': 0.5,
    'monthly': 1.5,
    'weekly': 3.5,
  };
  const annualPenaltyPercent = penaltyMap[userData.tradingFrequency] || 1.0;

  const balance = convertInvestmentRangeToNumber(userData.totalInvested);
  const annualReturn = 0.07;
  const years = 10;

  const buyAndHoldValue = Math.round(balance * Math.pow(1 + annualReturn, years));
  const yourValue = Math.round(balance * Math.pow(1 + annualReturn - annualPenaltyPercent / 100, years));

  return {
    tradesPerYear,
    tradingHistory,
    costPerTrade,
    annualPenaltyPercent,
    buyAndHoldValue,
    yourValue,
  };
}

/**
 * Generate personalized recommendations
 */
export function generateDetailedRecommendations(
  userData: UserData,
  scores: Scores,
  costData: CostData,
  behavioralData: BehavioralData
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Recommendation 1: Cut Costs
  if (scores.costEfficiency < 70) {
    recommendations.push({
      id: 'cut-costs',
      title: 'Cut your investment costs',
      category: 'Cost Efficiency',
      priority: 'high',
      currentState: `You're paying ${costData.totalCurrentFees.toFixed(2)}% in fees annually`,
      recommendedState: 'Switch to low-cost index funds (0.05% fees)',
      dollarImpact: Math.round(costData.savings),
      impactDescription: `Save $${formatNumber(Math.round(costData.savings))} over 30 years`,
      explanation: 'Every 1% in fees costs you about 25% of your total returns over time due to compounding. This is the single biggest improvement you can make.',
      steps: [
        {
          title: 'Open a low-cost brokerage account',
          description: 'Choose Vanguard, Fidelity, or Schwab - all offer excellent low-cost index funds.',
          link: 'https://investor.vanguard.com',
        },
        {
          title: 'Sell your high-fee investments',
          description: 'Liquidate funds with expense ratios over 0.2%. Consider tax implications if in taxable accounts.',
        },
        {
          title: 'Buy three low-cost index funds',
          description: 'VTI (US stocks), VXUS (International stocks), BND (Bonds) - that\'s all you need.',
        },
        {
          title: 'Set up automatic investments',
          description: 'Automate monthly contributions to remove emotion from investing.',
        },
      ],
    });
  }

  // Recommendation 2: Stop Overtrading
  if (scores.behavioralHealth < 70 && userData.tradingFrequency !== 'rarely') {
    const tradingCost = (behavioralData.buyAndHoldValue - behavioralData.yourValue);
    recommendations.push({
      id: 'stop-trading',
      title: 'Stop overtrading your portfolio',
      category: 'Behavioral Health',
      priority: 'high',
      currentState: `You made ~${behavioralData.tradesPerYear} trades last year`,
      recommendedState: 'Make 1-2 trades per year (annual rebalancing only)',
      dollarImpact: Math.round(tradingCost),
      impactDescription: `Overtrading costs you ~${behavioralData.annualPenaltyPercent}% annually`,
      explanation: 'Research shows frequent traders underperform buy-and-hold investors by 2-3% annually due to transaction costs, bad timing, and taxes.',
      steps: [
        {
          title: 'Delete trading apps from your phone',
          description: 'Remove the temptation to check and trade frequently.',
        },
        {
          title: 'Set a quarterly review schedule',
          description: 'Check your portfolio only 4 times per year on specific dates.',
        },
        {
          title: 'Automate your investments',
          description: 'Set up automatic monthly contributions so you don\'t need to actively manage.',
        },
        {
          title: 'Create a 48-hour rule',
          description: 'Wait 48 hours before making any trade to avoid emotional decisions.',
        },
      ],
    });
  }

  // Recommendation 3: Build Emergency Fund
  if (!userData.financialGaps.emergencyFund) {
    recommendations.push({
      id: 'emergency-fund',
      title: 'Build an emergency fund',
      category: 'Goal Coverage',
      priority: 'high',
      currentState: 'No dedicated emergency fund',
      recommendedState: '6 months of expenses in high-yield savings',
      dollarImpact: 0,
      impactDescription: 'Prevents forced selling during emergencies',
      explanation: 'Without an emergency fund, unexpected expenses force you to sell investments at the worst times, locking in losses and disrupting your long-term plan.',
      steps: [
        {
          title: 'Calculate your monthly expenses',
          description: 'Add up rent/mortgage, utilities, food, insurance, and essential costs.',
        },
        {
          title: 'Open a high-yield savings account',
          description: 'Look for accounts paying 4-5% APY. Keep this separate from checking.',
          link: 'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts',
        },
        {
          title: 'Set up automatic transfers',
          description: 'Move a fixed amount each paycheck until you reach 6 months of expenses.',
        },
      ],
    });
  }

  // Recommendation 4: Open 529 Plans
  if (userData.hasChildren && !userData.financialGaps.collegesSavings) {
    recommendations.push({
      id: 'open-529',
      title: 'Open 529 college savings plans',
      category: 'Goal Coverage',
      priority: 'medium',
      currentState: `${userData.numberOfChildren} ${userData.numberOfChildren === 1 ? 'child' : 'children'} with no 529 plans`,
      recommendedState: 'Active 529 plan with automatic contributions',
      dollarImpact: 27000,
      impactDescription: 'Tax savings over 18 years of contributions',
      explanation: '529 plans offer tax-free growth and many states offer tax deductions. Starting early maximizes compound growth for education expenses.',
      steps: [
        {
          title: 'Research your state\'s 529 plan',
          description: 'Many states offer tax deductions for contributions to their plan.',
          link: 'https://www.savingforcollege.com/compare-529-plans',
        },
        {
          title: 'Open an account for each child',
          description: 'You can open accounts online in about 15 minutes.',
        },
        {
          title: 'Start with automatic contributions',
          description: 'Even $200-300/month per child adds up significantly over 18 years.',
        },
        {
          title: 'Choose age-based portfolios',
          description: 'These automatically become more conservative as your child approaches college.',
        },
      ],
    });
  }

  // Recommendation 5: Get Life Insurance
  if (userData.hasChildren && !userData.financialGaps.lifeInsurance) {
    recommendations.push({
      id: 'life-insurance',
      title: 'Get term life insurance',
      category: 'Goal Coverage',
      priority: 'high',
      currentState: 'No life insurance with dependents',
      recommendedState: 'Term life policy (10-12x annual income)',
      dollarImpact: 0,
      impactDescription: 'Protects your family\'s financial future',
      explanation: 'With dependents relying on your income, life insurance ensures they\'re protected if something happens to you. Term life is affordable and straightforward.',
      steps: [
        {
          title: 'Calculate coverage needed',
          description: 'Aim for 10-12x your annual income, plus debts and future education costs.',
        },
        {
          title: 'Get quotes from multiple providers',
          description: 'Compare term life policies from several insurers.',
          link: 'https://www.policygenius.com',
        },
        {
          title: 'Choose appropriate term length',
          description: 'Select a term that covers until your youngest child is financially independent.',
        },
      ],
    });
  }

  // Recommendation 6: Rebalance Portfolio
  const recommendedStocks = Math.max(Math.min(110 - userData.age, 90), 30);
  if (Math.abs(userData.allocation.stocks - recommendedStocks) > 15) {
    recommendations.push({
      id: 'rebalance',
      title: 'Rebalance your portfolio allocation',
      category: 'Investment Strategy',
      priority: 'medium',
      currentState: `${userData.allocation.stocks}% in stocks at age ${userData.age}`,
      recommendedState: `${recommendedStocks}% in stocks for your age and timeline`,
      dollarImpact: 0,
      impactDescription: 'Better risk-adjusted returns over time',
      explanation: userData.allocation.stocks > recommendedStocks
        ? 'Your portfolio is more aggressive than recommended for your age. Reducing stock exposure will lower volatility.'
        : 'Your portfolio is too conservative for your timeline. More stocks will help maximize long-term growth.',
      steps: [
        {
          title: 'Review your current allocation',
          description: 'Log into your accounts and calculate your total stock/bond/cash percentages.',
        },
        {
          title: 'Sell overweight positions',
          description: 'Reduce positions that are above target allocation.',
        },
        {
          title: 'Buy underweight positions',
          description: 'Add to positions that are below target allocation.',
        },
        {
          title: 'Set annual rebalancing reminder',
          description: 'Rebalance once per year to maintain your target allocation.',
        },
      ],
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations.slice(0, 5);
}

export function convertInvestmentRangeToNumber(range: string): number {
  const rangeMap: { [key: string]: number } = {
    'under-10k': 5000,
    '10k-50k': 30000,
    '50k-100k': 75000,
    '100k-500k': 300000,
    '500k-1m': 750000,
    '1m-plus': 2000000,
  };
  return rangeMap[range] || 100000;
}

export function calculatePercentile(score: number): number {
  if (score >= 90) return 95;
  if (score >= 80) return 85;
  if (score >= 70) return 70;
  if (score >= 60) return 55;
  if (score >= 50) return 40;
  return 25;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}
