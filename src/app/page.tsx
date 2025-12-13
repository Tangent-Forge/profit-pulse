import Link from "next/link";
import { Zap, Target, Sparkles, Check, Rocket } from "lucide-react";

const pricingTiers = [
  {
    id: 'free',
    name: 'Free QPV',
    description: 'Quick evaluation of any idea',
    price: '$0',
    priceId: 'free',
    features: [
      'Weighted QPV score (0-10)',
      'Instant interpretation',
      'No signup required',
    ],
    buttonText: 'Start Free',
    href: '/evaluate',
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Full Evaluation + Blueprint',
    price: '$9',
    priceId: 'price_starter',
    features: [
      '1 Full Evaluation',
      '1 Execution Blueprint',
      '4-layer scoring (30+ data points)',
      'Failure mode analysis',
      'Export to PDF/Markdown',
    ],
    buttonText: 'Get Starter — $9',
    href: '/checkout?tier=starter',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'For Serious Validators',
    price: '$29',
    priceId: 'price_explorer',
    features: [
      '5 Full Evaluations',
      '2 Execution Blueprints',
      'Compare ideas side-by-side',
      'Export to Notion',
      'Save $16 vs separate',
    ],
    isPopular: true,
    buttonText: 'Get Explorer — $29',
    href: '/checkout?tier=explorer',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Profit <span className="text-[var(--tf-forge-orange)]">Pulse</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--tf-smoked-gray)] mb-2">
              Stop overthinking. Start building.
            </p>
            <p className="text-base md:text-lg text-[var(--tf-muted-steel)] max-w-2xl mx-auto">
              The only idea evaluation tool that tells you why ideas like yours fail — and how to avoid it.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex justify-center gap-3">
            <Link
              href="/evaluate"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-[var(--tf-forge-orange)] text-white shadow-lg hover:bg-[var(--tf-ember-glow)]"
            >
              <Zap size={20} />
              Evaluate
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-[var(--tf-deep-charcoal)] text-[var(--tf-smoked-gray)] hover:bg-[var(--tf-steel-gray)]"
            >
              My Ideas
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 md:p-12 shadow-2xl">
          {/* Pricing Section */}
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Choose Your Evaluation Level
              </h2>
              <p className="text-[var(--tf-smoked-gray)]">
                Start with the free Quick QPV or unlock the complete multi-layer analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative flex flex-col p-6 rounded-xl border-2 transition-all ${
                    tier.isPopular
                      ? 'bg-gradient-to-br from-[var(--tf-forge-orange)]/10 to-[var(--tf-ember-glow)]/10 border-[var(--tf-forge-orange)] hover:border-[var(--tf-ember-glow)] hover:shadow-2xl'
                      : 'bg-gradient-to-br from-[var(--tf-deep-charcoal)] to-[var(--tf-charcoal)] border-[var(--tf-copper-sheen)]/50 hover:border-[var(--tf-copper-sheen)] hover:shadow-xl'
                  }`}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        BEST VALUE
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className={`p-2 rounded-lg ${
                      tier.isPopular ? 'bg-[var(--tf-forge-orange)]/20' : 'bg-[var(--tf-copper-sheen)]/20'
                    }`}>
                      {tier.id === 'free' && <Zap className="text-[var(--tf-copper-sheen)]" size={28} />}
                      {tier.id === 'starter' && <Sparkles className="text-[var(--tf-copper-sheen)]" size={28} />}
                      {tier.id === 'explorer' && <Rocket className="text-[var(--tf-forge-orange)]" size={28} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-[var(--tf-copper-sheen)]">
                      {tier.price}
                    </span>
                    <span className="text-[var(--tf-muted-steel)] text-sm ml-2">one-time</span>
                  </div>

                  <p className="text-[var(--tf-smoked-gray)] text-sm mb-4">
                    {tier.description}
                  </p>

                  <ul className="space-y-2 text-[var(--tf-muted-steel)] text-sm mb-6 flex-grow">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="text-[var(--tf-copper-sheen)] flex-shrink-0" size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`w-full px-6 py-3 rounded-lg font-bold transition-all mt-auto text-center block ${
                      tier.isPopular
                        ? 'bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white shadow-lg'
                        : 'bg-[var(--tf-copper-sheen)] hover:bg-[var(--tf-dark-copper)] text-white'
                    }`}
                  >
                    {tier.buttonText}
                  </Link>
                </div>
              ))}
            </div>

            {/* Value Proposition */}
            <div className="mt-8 bg-[var(--tf-deep-charcoal)]/50 rounded-xl p-6 border border-[var(--tf-steel-gray)]">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="text-[var(--tf-copper-sheen)]" size={24} />
                <h4 className="text-lg font-bold text-white">How it works for multiple ideas</h4>
              </div>
              <p className="text-[var(--tf-smoked-gray)] text-sm">
                Screen unlimited ideas with the free QPV. When you find promising ones, use your evaluations to go deep. 
                Build blueprints only for the ideas you&apos;re ready to execute. <strong className="text-white">Explorer saves you $16</strong> if you&apos;re comparing 5+ ideas.
              </p>
            </div>

            {/* Feature Comparison */}
            <div className="mt-12 pt-8 border-t border-[var(--tf-steel-gray)]">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Why Profit Pulse 2.0?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Target className="text-[var(--tf-copper-sheen)] mx-auto mb-3" size={40} />
                  <h4 className="font-bold text-white mb-2">Predict Failure</h4>
                  <p className="text-sm text-[var(--tf-muted-steel)]">
                    See the exact obstacles that kill ideas in your category
                  </p>
                </div>
                <div className="text-center">
                  <Sparkles className="text-[var(--tf-ember-glow)] mx-auto mb-3" size={40} />
                  <h4 className="font-bold text-white mb-2">Assess Readiness</h4>
                  <p className="text-sm text-[var(--tf-muted-steel)]">
                    Know if you&apos;re ready to execute NOW or what gaps to fill
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="text-[var(--tf-forge-orange)] mx-auto mb-3" size={40} />
                  <h4 className="font-bold text-white mb-2">Get Actionable</h4>
                  <p className="text-sm text-[var(--tf-muted-steel)]">
                    Receive specific mitigation strategies, not generic advice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-[var(--tf-muted-steel)] text-sm space-y-2">
          <p>© 2025 Profit Pulse — A Tangent Forge Product</p>
          <p className="text-xs">
            Helping founders cut through shiny object syndrome
          </p>
        </footer>
      </div>
    </div>
  );
}
