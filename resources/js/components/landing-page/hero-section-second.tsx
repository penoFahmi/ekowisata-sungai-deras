import { usePage } from "@inertiajs/react";
import { LucideIcon } from "lucide-react";

interface HeroSectionSecondProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function HeroSectionSecond({ title, description, icon: Icon }: HeroSectionSecondProps) {

  return (
    <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
