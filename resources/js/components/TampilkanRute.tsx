import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Komponen ini sekarang menerima 'waypoints', 'routeColor', dan 'isPersonalRoute'
export function TampilkanRute({ waypoints, routeColor, isPersonalRoute = false }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  // Tentukan warna default jika prop tidak dikirim
  const color = routeColor || '#3498db'; // Default ke warna Biru

  // Buat pane kustom jika ini adalah rute personal untuk memastikan z-index lebih tinggi
  useEffect(() => {
    if (isPersonalRoute && !map.getPane('personalRoutePane')) {
      const pane = map.createPane('personalRoutePane');
      pane.style.zIndex = '650'; // Lebih tinggi dari pane rute default (sekitar 600)
    }
  }, [map, isPersonalRoute]);

  useEffect(() => {
    // Jika waypoints tidak ada ATAU kurang dari 2 titik, hapus rute
    if (!waypoints || waypoints.length < 2) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    // Hapus rute lama jika ada
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const leafletWaypoints = waypoints.map(coord => L.latLng(coord[0], coord[1]));

    const routingControl = L.Routing.control({
      waypoints: leafletWaypoints,
      routeWhileDragging: false,
      show: false, // Kita sembunyikan panel instruksi agar bersih
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      // Gunakan pane yang sesuai
      pane: isPersonalRoute ? 'personalRoutePane' : 'overlayPane',
      lineOptions: {
        styles: [{ color: color, opacity: 0.8, weight: 6 }]
      },
      createMarker: () => { return null; } // Sembunyikan marker A, B, C, dst.
    }).addTo(map);

    routingControlRef.current = routingControl;

    // --- INI BAGIAN PENTING ---
    // Fungsi cleanup yang akan dijalankan saat komponen unmount
    // atau saat dependensi berubah sebelum efek baru dijalankan.
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, waypoints, routeColor, isPersonalRoute]); // <-- Tambahkan isPersonalRoute sebagai dependency

  return null;
}
