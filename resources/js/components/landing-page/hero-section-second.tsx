import { LucideIcon } from "lucide-react";

interface HeroSectionSecondProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function HeroSectionSecond({ title, description, icon: Icon }: HeroSectionSecondProps) {

  return (
    // DARI: Gradien hijau ke hijau
    // MENJADI: Gradien "Senja di Perbukitan Hijau" yang dramatis
    <section className="relative bg-gradient-to-b from-teal-700 to-amber-600 pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Optional: Tambahkan overlay pattern untuk tekstur */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-4xl md:5xl font-bold leading-tight tracking-tight text-shadow-md">
            {title}
          </h1>
          {/* DARI: text-primary-foreground/80 */}
          {/* MENJADI: Warna putih gading yang lebih lembut dan hangat */}
          <p className="text-lg md:text-xl text-amber-100/90 max-w-3xl mx-auto text-shadow">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
