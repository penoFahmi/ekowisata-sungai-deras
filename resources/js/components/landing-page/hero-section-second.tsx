import { LucideIcon } from "lucide-react";

interface HeroSectionSecondProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function HeroSectionSecond({ title, description, icon: Icon }: HeroSectionSecondProps) {
  return (
    <section className="relative bg-teal-900 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-shadow-md">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-3xl mx-auto text-shadow">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
