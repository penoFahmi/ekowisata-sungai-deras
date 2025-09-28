import { Card, CardContent } from "../ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Jakarta",
    rating: 5,
    text: "Pengalaman yang luar biasa! Air terjun Sungai Deras benar-benar memukau. Penduduk lokalnya sangat ramah dan produk UMKM-nya berkualitas tinggi.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612d2d9?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Budi Santoso",
    location: "Surabaya",
    rating: 5,
    text: "Desa wisata yang sangat well-managed. Peta interaktifnya membantu sekali untuk explore semua tempat menarik. Kerajinan bambunya unik banget!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Lisa Chen",
    location: "Singapore",
    rating: 5,
    text: "Amazing village tourism experience! The interactive map made it so easy to find all the interesting spots. The local food is absolutely delicious.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export function TestimonialSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Testimoni Wisatawan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman wisatawan lain yang telah menjelajahi Desa Sungai Deras
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 text-accent opacity-20">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
