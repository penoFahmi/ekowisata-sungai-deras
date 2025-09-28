import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function Footer() {
  const quickLinks = [
    { name: "Beranda", href: "#home" },
    { name: "Peta Wisata", href: "#map" },
    { name: "UMKM", href: "#umkm" },
    { name: "Agenda", href: "#events" },
    { name: "Artikel", href: "#articles" }
  ];

  const attractions = [
    "Air Terjun Sungai Deras",
    "Bukit Sunrise",
    "Sentra Kerajinan Bambu",
    "Pasar Kuliner Tradisional",
    "Homestay Sari Asih"
  ];

  const handleLinkClick = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Desa Sungai Deras</h3>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed">
              Destinasi wisata terpadu yang memadukan keindahan alam, budaya lokal,
              dan pemberdayaan ekonomi masyarakat melalui UMKM berkualitas.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="border-secondary-foreground/20">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-secondary-foreground/20">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-secondary-foreground/20">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Navigasi Cepat</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Attractions */}
          <div className="space-y-4">
            <h4 className="font-semibold">Destinasi Populer</h4>
            <ul className="space-y-2">
              {attractions.map((attraction) => (
                <li key={attraction}>
                  <span className="text-secondary-foreground/80 text-sm">
                    {attraction}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Informasi Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary-foreground/60" />
                <div className="text-sm text-secondary-foreground/80">
                  <p>Desa Sungai Deras</p>
                  <p>Kecamatan Indah, Kabupaten Sejahtera</p>
                  <p>Provinsi Nusantara 12345</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary-foreground/60" />
                <span className="text-sm text-secondary-foreground/80">
                  +62 812-3456-7890
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary-foreground/60" />
                <span className="text-sm text-secondary-foreground/80">
                  info@desasungaideras.id
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-secondary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-secondary-foreground/60">
            © 2025 Desa Wisata Sungai Deras. Semua hak cipta dilindungi.
          </p>
          <div className="flex space-x-6 text-sm">
            <button className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
              Kebijakan Privasi
            </button>
            <button className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
              Syarat & Ketentuan
            </button>
            <button className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
              Bantuan
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
