import { Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';

const promotions = [
  {
    icon: Sparkles,
    text: '0% Brokerage',
    color: 'text-accent',
  },
  {
    icon: ShieldCheck,
    text: 'Verified Stays',
    color: 'text-primary-foreground',
  },
  {
    icon: TrendingUp,
    text: '100% Accurate Data',
    color: 'text-accent',
  },
];

export default function MarqueePromoBanner() {
  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_linear_infinite]" />
      </div>

      <div className="relative z-10 py-3 xl:py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* Duplicate the content twice for seamless loop */}
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center">
              {promotions.map((promo, index) => {
                const Icon = promo.icon;
                return (
                  <div
                    key={`${setIndex}-${index}`}
                    className="flex items-center gap-3 mx-8 xl:mx-12"
                  >
                    <div className="bg-primary-foreground/20 p-2 rounded-full">
                      <Icon className={`w-5 h-5 xl:w-6 xl:h-6 ${promo.color}`} />
                    </div>
                    <span className="text-base xl:text-xl font-bold text-primary-foreground">
                      {promo.text}
                    </span>
                    <span className="text-primary-foreground/60 text-lg xl:text-2xl">•</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
