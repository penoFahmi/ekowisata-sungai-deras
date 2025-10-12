import { useState, useMemo, useEffect, useRef } from "react";
import { TourismSpot, Umkm } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mountain, Store, X, List, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Type Definitions ---
type PointOfInterest = (TourismSpot | Umkm) & { type: 'wisata' | 'umkm' };

// --- Leaflet Icon Fix & Custom Icons (WARNA BARU) ---
const createLeafletIcon = (iconUrl: string) => new L.Icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Menggunakan warna Teal untuk Wisata dan Orange untuk UMKM
const wisataIcon = createLeafletIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-teal.png');
const umkmIcon = createLeafletIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png');
const activeIcon = createLeafletIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png');


// --- Helper Component to Set Map Bounds ---
const MapBoundsSetter = ({ geoJsonData }: { geoJsonData: any }) => {
    const map = useMap();
    useEffect(() => {
        if (geoJsonData) {
            const bounds = L.geoJSON(geoJsonData).getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [20, 20] });
            }
        }
    }, [geoJsonData, map]);
    return null;
};

// --- Main Component ---
interface InteractiveMapProps {
    tourismSpots: TourismSpot[];
    umkms: Umkm[];
}

export function InteractiveMap({ tourismSpots, umkms }: InteractiveMapProps) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [activePoi, setActivePoi] = useState<PointOfInterest | null>(null);
    const [isListVisible, setIsListVisible] = useState(false);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        fetch('/maps/peta.geojson')
            .then(res => res.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error("Gagal memuat batas dusun:", err));
    }, []);

    const pointsOfInterest = useMemo(() => {
        const spots = tourismSpots.map(spot => ({ ...spot, type: 'wisata' as const }));
        const umkmItems = umkms.map(umkm => ({ ...umkm, type: 'umkm' as const }));
        return [...spots, ...umkmItems].sort((a, b) => a.name.localeCompare(b.name));
    }, [tourismSpots, umkms]);

    const filteredPOIs = useMemo(() => {
        if (selectedCategory === "all") return pointsOfInterest;
        return pointsOfInterest.filter(poi => poi.type === selectedCategory);
    }, [selectedCategory, pointsOfInterest]);

    // --- Styling and Event Handlers for GeoJSON (WARNA BARU) ---
    const dusunColors = ['#A7D7C5', '#F7D4A8', '#C2DED1', '#FBE6C6', '#87C4B1', '#EFCB9A']; // Nuansa Teal & Amber

    const getDusunStyle = (feature: any) => {
        const colorIndex = feature.properties.id % dusunColors.length;
        return {
            fillColor: dusunColors[colorIndex],
            color: "#5D6D7E",
            weight: 1.5,
            opacity: 0.8,
            fillOpacity: 0.5
        };
    };

    const onEachDusun = (feature: any, layer: L.Layer) => {
        if (feature.properties && feature.properties.Keterangan) {
            layer.bindPopup(`<b>${feature.properties.Keterangan}</b>`);
            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({ weight: 3, color: '#c0392b', fillOpacity: 0.7 });
                    l.openPopup();
                },
                mouseout: (e) => {
                    const l = e.target;
                    (e.target.feature as any).resetStyle(l); // Cara reset style yang lebih baik
                    l.closePopup();
                }
            });
        }
    };

    // --- Interactivity Handlers ---
    const handlePoiClick = (poi: PointOfInterest) => {
        setActivePoi(poi);
        if (mapRef.current && poi.latitude && poi.longitude) {
            mapRef.current.flyTo([parseFloat(poi.latitude), parseFloat(poi.longitude)], 16, {
                animate: true,
                duration: 1.5
            });
        }
        if (window.innerWidth < 1024) {
            setIsListVisible(false);
        }
    };

    const getImageUrl = (galleries: any[] | undefined) => {
        const path = galleries?.[0]?.path;
        return path ? `/storage/${path}` : 'https://placehold.co/300x200/e0e0e0/757575?text=Gambar';
    };

    const defaultCenter: [number, number] = [-0.260472, 109.241244];

    return (
        <section id="map" className="py-24 bg-white dark:bg-slate-800">
            <div className="container mx-auto px-0 md:px-4">
                <div className="text-center mb-12 px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-teal-900 dark:text-teal-200 mb-3">
                        Peta Interaktif Desa
                    </h2>
                    <p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
                        Jelajahi setiap sudut Desa Sungai Deras, temukan lokasi wisata dan produk UMKM unggulan.
                    </p>
                </div>

                <div className="relative h-[calc(100vh-250px)] md:h-[650px] w-full lg:grid lg:grid-cols-12 lg:gap-6 rounded-lg md:shadow-xl overflow-hidden border border-stone-200 dark:border-slate-700">
                    <aside className="hidden lg:block lg:col-span-4 h-full overflow-y-auto bg-white dark:bg-slate-800 p-1">
                        <PoiList
                            pois={filteredPOIs}
                            activePoi={activePoi}
                            onPoiClick={handlePoiClick}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            getImageUrl={getImageUrl}
                        />
                    </aside>

                    <div className="lg:col-span-8 h-full w-full">
                        <MapContainer
                            center={defaultCenter}
                            zoom={14}
                            scrollWheelZoom={true}
                            className="h-full w-full z-0"
                            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />

                            {geoJsonData && <MapBoundsSetter geoJsonData={geoJsonData} />}
                            {geoJsonData && <GeoJSON data={geoJsonData} style={getDusunStyle} onEachFeature={onEachDusun} />}

                            {filteredPOIs.map((poi) => {
                                if (!poi.latitude || !poi.longitude) return null;
                                return (
                                    <Marker
                                        key={`${poi.type}-${poi.id}`}
                                        position={[parseFloat(poi.latitude), parseFloat(poi.longitude)]}
                                        icon={activePoi?.id === poi.id ? activeIcon : (poi.type === 'wisata' ? wisataIcon : umkmIcon)}
                                        eventHandlers={{ click: () => setActivePoi(poi) }}
                                    >
                                        <Popup>
                                            <div className="w-48">
                                                <img src={getImageUrl(poi.galleries)} alt={poi.name} className="w-full h-24 object-cover rounded-md mb-2" />
                                                <h4 className="font-bold text-md text-gray-800">{poi.name}</h4>
                                                <Badge variant="secondary" className="mt-1">{poi.category.name}</Badge>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>

                    <div className="lg:hidden">
                        <Button
                            onClick={() => setIsListVisible(!isListVisible)}
                            className="absolute bottom-4 right-4 z-10 rounded-full h-14 w-14 shadow-lg bg-amber-600 hover:bg-amber-700"
                            aria-label="Tampilkan Daftar"
                        >
                            {isListVisible ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
                        </Button>

                        <div className={`absolute bottom-0 left-0 right-0 z-10 bg-white dark:bg-slate-800 rounded-t-2xl shadow-2xl transition-transform duration-500 ease-in-out ${isListVisible ? 'translate-y-0' : 'translate-y-full'}`}
                             style={{ height: '70vh' }}
                        >
                             <div className="p-4 border-b border-stone-200 dark:border-slate-700">
                                 <div className="w-12 h-1.5 bg-stone-300 dark:bg-slate-600 rounded-full mx-auto"></div>
                                 <h3 className="text-center font-semibold text-lg mt-2 text-gray-800 dark:text-slate-200">Jelajahi Desa</h3>
                             </div>
                            <div className="h-[calc(100%-70px)] overflow-y-auto p-1">
                                <PoiList
                                    pois={filteredPOIs}
                                    activePoi={activePoi}
                                    onPoiClick={handlePoiClick}
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={setSelectedCategory}
                                    getImageUrl={getImageUrl}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


// --- Sub-component for rendering the POI list (reused for mobile/desktop) ---
const PoiList = ({ pois, activePoi, onPoiClick, selectedCategory, onCategoryChange, getImageUrl }: any) => {
    const categories = [
        { id: "all", name: "Semua", icon: MapPin },
        { id: "wisata", name: "Wisata", icon: Mountain },
        { id: "umkm", name: "UMKM", icon: Store },
    ];

    return (
        <div>
            <div className="p-4 sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10">
                <h3 className="text-xl font-bold mb-3 text-teal-900 dark:text-teal-200">Kategori Lokasi</h3>
                <div className="flex space-x-2">
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => onCategoryChange(cat.id)}
                            className={`flex-1 transition-all duration-300 ${selectedCategory === cat.id ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-stone-300'}`}
                        >
                            <cat.icon className="w-4 h-4 mr-2" />
                            {cat.name}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="p-2 space-y-2">
                {pois.length > 0 ? pois.map((poi: PointOfInterest) => (
                    <div
                        key={`${poi.type}-${poi.id}`}
                        onClick={() => onPoiClick(poi)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${activePoi?.id === poi.id ? 'bg-amber-100 dark:bg-amber-900/50 ring-2 ring-amber-500' : 'hover:bg-stone-100 dark:hover:bg-slate-700'}`}
                    >
                        <img src={getImageUrl(poi.galleries)} alt={poi.name} className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
                        <div className="flex-grow overflow-hidden">
                            <p className="font-semibold text-gray-800 dark:text-slate-200 truncate">{poi.name}</p>
                            <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{poi.category.name}</p>
                        </div>
                        <Badge variant={'secondary'} className={`capitalize text-xs ml-2 flex-shrink-0 text-white ${poi.type === 'wisata' ? 'bg-teal-600' : 'bg-amber-600'}`}>
                            {poi.type}
                        </Badge>
                    </div>
                )) : (
                    <div className="text-center py-10 px-4">
                        <Search className="mx-auto h-10 w-10 text-stone-400" />
                        <p className="mt-2 text-stone-600 dark:text-stone-400">Tidak ada lokasi ditemukan untuk kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
