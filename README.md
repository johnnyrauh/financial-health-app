# Financial Health Score

A client-side web application that evaluates your overall financial well-being through an interactive questionnaire, then generates a personalized Financial Health Score (0-100) with tailored recommendations.

## What It Does

**Financial Health Score** helps individuals understand where they stand financially and what to improve.

**How it works:**

1. **Answer questions** - You fill out a short questionnaire about your situation (age, income, dependents), goals (retirement, home, education), investments (allocation, fees), and financial habits (trading frequency, panic selling)

2. **Instant analysis** - The app calculates your Financial Health Score from 0-100 across five weighted categories

3. **Get a personalized report** - You receive:
   - Your overall score with a color-coded gauge
   - Category-by-category breakdown (investment strategy, cost efficiency, tax optimization, behavioral health, goal coverage)
   - Portfolio comparison charts (current vs. recommended allocation)
   - Cost analysis showing fee impact over 30 years
   - Up to 5 prioritized action items with dollar impact estimates

4. **Take action** - Each recommendation includes specific steps and links to get started

**Why it matters:** Most people don't have a clear picture of their financial health. This tool gives them a quick, comprehensive assessment and a clear roadmap to improve—covering everything from investment fees eating into returns to behavioral habits that hurt performance.

## Features

- **Interactive Questionnaire**: 7-step assessment covering personal info, goals, investments, behavior, and financial gaps
- **Weighted Scoring Engine**: Calculates scores across 5 categories with age-appropriate benchmarks
- **Portfolio Analysis**: Compares current asset allocation to recommended targets with visual charts
- **Cost Impact Visualization**: Shows how expense ratios and advisor fees compound over 30 years
- **Behavioral Assessment**: Evaluates trading frequency, panic selling history, and portfolio monitoring habits
- **Personalized Recommendations**: Up to 5 action items with priority levels, dollar impact, and step-by-step guidance
- **Animated Results**: Score gauge animation, confetti for high scores, and smooth transitions throughout

## Tech Stack

### Frontend (everything runs in the browser)
- **React** - A popular toolkit for building interactive web pages. It's like LEGO blocks for websites—you build small pieces (buttons, forms, cards) and snap them together.
- **TypeScript** - JavaScript with training wheels. It catches mistakes before they become problems.
- **Tailwind CSS** - A shortcut system for styling. Instead of writing custom design code, you use pre-made classes like "make this blue" or "add padding."
- **Vite** - A tool that bundles all your code and makes the site load fast.
- **Radix UI** - Pre-built accessible components (sliders, checkboxes, dialogs) that work with keyboards and screen readers out of the box.
- **Recharts** - A charting library for the portfolio comparison and cost analysis visualizations.
- **Framer Motion** - Handles all the smooth animations and transitions between screens.

### No backend needed
This app runs entirely in the browser. All scoring and recommendations are calculated client-side—no data is sent to a server, and nothing is stored. Your financial information stays on your device.

## How Scoring Works

The app evaluates financial health across **5 weighted categories**:

| Category | Weight | What It Measures |
|----------|--------|-----------------|
| Investment Strategy | 25% | Asset allocation for your age, diversification, global exposure |
| Cost Efficiency | 25% | Fund expense ratios, advisor fees, total annual costs |
| Tax Optimization | 15% | Tax-advantaged account usage, 529 plans |
| Behavioral Health | 20% | Trading frequency, panic selling, portfolio checking habits |
| Goal Coverage | 15% | Emergency fund, insurance, estate plan, life-stage alignment |

Each category scores 0-100, and the overall score is the weighted average.

## Project Structure

```
financial-health-app/
├── src/
│   ├── App.tsx                    # Main app with screen routing
│   ├── context/
│   │   └── AppContext.tsx         # Global state management
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces & constants
│   ├── lib/
│   │   ├── calculations.ts       # Scoring & analysis logic
│   │   ├── recommendations.ts    # Recommendation generation
│   │   └── utils.ts              # Helper functions
│   ├── components/
│   │   ├── Welcome.tsx           # Landing screen
│   │   ├── Processing.tsx        # Loading animation
│   │   ├── questions/            # Questionnaire steps
│   │   │   ├── BasicInfo.tsx
│   │   │   ├── GoalsTimeline.tsx
│   │   │   ├── InvestmentSnapshot.tsx
│   │   │   ├── BehavioralAssessment.tsx
│   │   │   ├── FinancialGaps.tsx
│   │   │   └── BiggestConcern.tsx
│   │   ├── results/              # Results dashboard
│   │   │   ├── ResultsDashboard.tsx
│   │   │   ├── HeroScore.tsx
│   │   │   ├── CategoryBreakdown.tsx
│   │   │   ├── PortfolioComparison.tsx
│   │   │   ├── CostAnalysis.tsx
│   │   │   └── PriorityActions.tsx
│   │   ├── shared/               # Reusable components
│   │   └── ui/                   # Radix UI primitives
│   └── public/                   # Static assets
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd financial-health-app
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the app in development mode:
```bash
npm run dev
```

This will start the app at http://localhost:5173

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Deployment

### Vercel

1. Connect your repository to Vercel
2. It will auto-detect Vite and configure the build
3. No environment variables needed—everything runs client-side

## Disclaimer

This assessment provides general guidance based on the information provided. It does not constitute legal, financial, or tax advice. Users should consult with qualified financial professionals before making investment or planning decisions.

## License

MIT
