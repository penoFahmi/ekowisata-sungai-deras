import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// CSS untuk marker GPS (Anda bisa taruh di file CSS utama Anda)
// .custom-gps-marker { background: #3388ff; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5); }

// Komponen ini menerima prop 'onLocationFound'
// dan 'shouldSetView' untuk kontrol zoom otomatis.
export function TampilkanPosisiSaya({ onLocationFound, shouldSetView = false }) {
  const map = useMap();
  // Ref untuk memastikan setView hanya terjadi sekali.
  const hasSetViewRef = useRef(false);

  useEffect(() => {
    map.locate({
      watch: true,
      setView: false,
      maxZoom: 16,
      enableHighAccuracy: true
    });

    // Buat sebuah icon untuk marker
    const gpsIcon = L.divIcon({
      className: 'custom-gps-marker', // Anda perlu styling CSS di atas
      iconSize: [18, 18]
    });

    // Variabel untuk menyimpan marker & lingkaran
    let marker = null;
    let circle = null;

    map.on('locationfound', (e) => {
      // Laporkan lokasi ke parent
      onLocationFound([e.latlng.lat, e.latlng.lng]);

      // Jika shouldSetView true dan belum pernah dilakukan, flyTo ke lokasi user.
      if (shouldSetView && !hasSetViewRef.current) {
        map.flyTo(e.latlng, 16);
        hasSetViewRef.current = true; // Tandai bahwa sudah dilakukan.
      }

      const radius = e.accuracy / 2;

      // Hapus marker lama jika ada
      if (marker) {
        map.removeLayer(marker);
      }
      if (circle) {
        map.removeLayer(circle);
      }

      // Tambahkan marker & lingkaran baru
      marker = L.marker(e.latlng, { icon: gpsIcon }).addTo(map)
        .bindPopup(`Lokasi Anda (akurasi ${radius.toFixed(0)} m)`);

      circle = L.circle(e.latlng, radius, {
        color: '#3388ff',
        fillColor: '#3388ff',
        fillOpacity: 0.1,
        weight: 1
      }).addTo(map);
    });

    map.on('locationerror', (e) => {
      alert("Gagal mendapatkan lokasi GPS: " + e.message);
    });

    // Cleanup saat komponen unmount
    return () => {
      map.stopLocate(); // Berhenti memantau lokasi
      map.off('locationfound'); // Hapus listener
      map.off('locationerror'); // Hapus listener
    };
  }, [map, onLocationFound, shouldSetView]);

  return null;
}
