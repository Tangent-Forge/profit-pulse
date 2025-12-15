import { Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Zap className="text-[var(--tf-forge-orange)] animate-pulse" size={64} />
        </div>
        <h2 className="text-2xl font-bold text-white">Loading...</h2>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-[var(--tf-forge-orange)] animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[var(--tf-ember-glow)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[var(--tf-copper-sheen)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
