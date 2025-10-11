import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function Footer() {
  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Wisata", href: "/wisata-list" },
    { name: "UMKM", href: "/umkm-list" },
    { name: "Agenda", href: "/agenda-list" },
    { name: "Bank Foto", href: "/bank-foto" }
  ];

  const attractions = [
    "Air Terjun Mini",
    "Bukit Bendera",
    "Wisata Alam Indah Lestari",
    "Saung Nila"
  ];

  const handleLinkClick = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <a
              href="https://desasungaideras.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <img src="/logodesa.png" alt="Logo Desa Sungai Deras" className="h-8 w-auto" />
              <h3 className="text-xl font-bold text-white">Desa Sungai Deras</h3>
            </a>
            <p className="text-slate-400 leading-relaxed">
              Destinasi wisata terpadu yang memadukan keindahan alam, budaya lokal,
              dan pemberdayaan ekonomi masyarakat melalui UMKM berkualitas.
            </p>
            <div className="flex space-x-2">
              <Button asChild size="icon" variant="ghost" className="text-slate-400 hover:bg-slate-800 hover:text-amber-400">
                <a href="https://www.facebook.com/sungai.deras.560/" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="text-slate-400 hover:bg-slate-800 hover:text-amber-400">
                <a href="https://www.instagram.com/sungaideras_official/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="text-slate-400 hover:bg-slate-800 hover:text-amber-400">
                <a href="https://www.youtube.com/@DESASUNGAIDERAS" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Navigasi Cepat</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Attractions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Destinasi Populer</h4>
            <ul className="space-y-2">
              {attractions.map((attraction) => (
                <li key={attraction}>
                  <span className="text-slate-400 text-sm">
                    {attraction}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Informasi Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-slate-500" />
                <div className="text-sm text-slate-400">
                  <p>Desa Sungai Deras</p>
                  <p>Kecamatan Teluk Pakedai, Kabupaten Kubu Raya</p>
                  <p>Provinsi Kalimantan Barat</p>
                </div>
              </div>

              {/* <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-slate-500" />
                <span className="text-sm text-slate-400">
                  +62 812-3456-7890
                </span>
              </div> */}

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-slate-500" />
                <span className="text-sm text-slate-400">
                  derasdesasungai@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-800" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
            <p className="text-sm text-slate-500">
              © 2025 Desa Wisata Sungai Deras. Semua hak cipta dilindungi.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Dikembangkan oleh Tim PMM Universitas Muhammadiyah Pontianak.
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <button className="text-slate-500 hover:text-amber-400 transition-colors">
              Kebijakan Privasi
            </button>
            <button className="text-slate-500 hover:text-amber-400 transition-colors">
              Syarat & Ketentuan
            </button>
            <button className="text-slate-500 hover:text-amber-400 transition-colors">
              Bantuan
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
