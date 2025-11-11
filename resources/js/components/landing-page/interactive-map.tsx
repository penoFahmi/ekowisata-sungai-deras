import { useState, useMemo, useEffect, useRef } from "react";
import { TourismSpot, Umkm } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mountain, Store, X, List, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Input } from "@/components/ui/input";
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { TampilkanPosisiSaya } from '../TampilkanPosisiSaya';
import { TampilkanRute } from '../TampilkanRute';

type PointOfInterest = (TourismSpot | Umkm) & { type: 'wisata' | 'umkm' };

interface InteractiveMapProps {
    tourismSpots: TourismSpot[];
    umkms: Umkm[];
}

const createLeafletIcon = (iconUrl: string) => new L.Icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const wisataIcon = createLeafletIcon('/camera-take-pictures-svgrepo-com.svg');
const umkmIcon = createLeafletIcon('/shopping-cart-svgrepo-com.svg');
const activeIcon = createLeafletIcon('/feet-svgrepo-com.svg');

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

export function InteractiveMap({ tourismSpots, umkms }: InteractiveMapProps) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [activePoi, setActivePoi] = useState<PointOfInterest | null>(null);
    const [hoveredPoiId, setHoveredPoiId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isListVisible, setIsListVisible] = useState(false);
    const mapRef = useRef<L.Map | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [generalRoutes, setGeneralRoutes] = useState({
        wisata: true,
        umkm: true
    });
    const [personalRouteWaypoints, setPersonalRouteWaypoints] = useState<[number, number][] | null>(null);


    useEffect(() => {
        if (isListVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isListVisible]);

    useEffect(() => {
        fetch('/maps/peta.geojson')
            .then(res => res.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error("Gagal memuat batas dusun:", err));
    }, []);

    useEffect(() => {
        // Jika ada lokasi user DAN ada POI yang diklik
        if (userLocation && activePoi) {
            setPersonalRouteWaypoints([
                userLocation,
                [parseFloat(activePoi.latitude), parseFloat(activePoi.longitude)]
            ]);
        } else {
            // Jika tidak, hapus rute pribadi
            setPersonalRouteWaypoints(null);
        }
        // HANYA memantau 2 state ini.
    }, [userLocation, activePoi]);

    const pointsOfInterest = useMemo(() => {
        const spots = tourismSpots.map(spot => ({ ...spot, type: 'wisata' as const }));
        const umkmItems = umkms.map(umkm => ({ ...umkm, type: 'umkm' as const }));
        return [...spots, ...umkmItems].sort((a, b) => a.name.localeCompare(b.name));
    }, [tourismSpots, umkms]);

    const filteredPOIs = useMemo(() => {
        return pointsOfInterest.filter(poi => {
            const matchesCategory = selectedCategory === "all" || poi.type === selectedCategory;
            const matchesSearch = searchTerm === "" ||
                                  poi.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchTerm, pointsOfInterest]);

    const waypointsWisata = useMemo(() => {
        if (!tourismSpots || tourismSpots.length < 2) return null;
        return tourismSpots.map(spot => [
            parseFloat(spot.latitude),
            parseFloat(spot.longitude)
        ]);
    }, [tourismSpots]);

    const waypointsUmkm = useMemo(() => {
        if (!umkms || umkms.length < 2) return null;
        return umkms.map(umkm => [
            parseFloat(umkm.latitude),
            parseFloat(umkm.longitude)
        ]);
    }, [umkms]);

    const dusunColors: { [key: string]: string } = {
        "Dusun Beringin": "#82a9d1",
        "Dusun Pinang A": "#87c7a3",
        "Dusun Pendamar": "#e39a9b",
        "Dusun Gunung Ambawang": "#f7d4a8",
        "Dusun Sungai Deras": "#C2DED1",
        "DEFAULT": "#E0E0E0"
    };

    const getDusunStyle = (feature: any) => {
        const dusunName = feature?.properties?.Keterangan;
        const fillColor = dusunColors[dusunName] || dusunColors["DEFAULT"];
        return { fillColor, color: "#5D6D7E", weight: 1.5, opacity: 0.8, fillOpacity: 0.6 };
    };

    const onEachDusun = (feature: any, layer: L.Layer) => {
        if (feature.properties && feature.properties.Keterangan) {
            layer.bindPopup(`<b>${feature.properties.Keterangan}</b>`);
            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({ weight: 3, color: '#c0392b', fillOpacity: 0.7 });
                },
                mouseout: (e) => {
                    const geoJsonLayer = e.target;
                    geoJsonLayer.setStyle(getDusunStyle(feature));
                }
            });
        }
    };

    const handlePoiClick = (poi: PointOfInterest) => {
        setActivePoi(poi);
        setHoveredPoiId(null);
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

    const handlePoiHover = (poi: PointOfInterest | null) => {
        setHoveredPoiId(poi ? poi.id : null);
        if (poi && mapRef.current && poi.latitude && poi.longitude) {
            mapRef.current.flyTo([parseFloat(poi.latitude), parseFloat(poi.longitude)], 16, {
                animate: true,
                duration: 0.7,
                easeLinearity: 0.5
            });
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[calc(100vh-200px)] md:h-[650px] w-full lg:grid lg:grid-cols-12 lg:gap-6 rounded-lg md:shadow-xl overflow-hidden border border-stone-200 dark:border-slate-700"
                >
                    <aside className="hidden lg:block lg:col-span-4 h-full overflow-y-auto bg-white dark:bg-slate-800 p-1">
                        <FilterControls
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            generalRoutes={generalRoutes}
                            setGeneralRoutes={setGeneralRoutes}
                        />
                        <PoiList
                            pois={filteredPOIs}
                            activePoi={activePoi}
                            onPoiClick={handlePoiClick}
                            getImageUrl={getImageUrl}
                            onPoiHover={handlePoiHover}
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
                                const isActive = activePoi?.id === poi.id && activePoi?.type === poi.type;

                                const getIcon = () => {
                                    if (isActive) return activeIcon;
                                    return poi.type === 'wisata' ? wisataIcon : umkmIcon;
                                };

                                return (
                                    <Marker
                                        key={`${poi.type}-${poi.id}`}
                                        position={[parseFloat(poi.latitude), parseFloat(poi.longitude)]}
                                        icon={getIcon()}
                                        eventHandlers={{ click: () => handlePoiClick(poi) }}
                                        className={isActive ? 'pulsing-marker' : ''}
                                    >
                                        <Popup>
                                            <div className="w-40 sm:w-48">
                                                <img src={getImageUrl(poi.galleries)} alt={poi.name} className="w-full h-24 object-cover rounded-md mb-2" />
                                                <h4 className="font-bold text-md text-gray-800">{poi.name}</h4>
                                                <Badge variant="secondary" className="mt-1">{poi.category.name}</Badge>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                        <TampilkanPosisiSaya onLocationFound={setUserLocation} shouldSetView={true} />

                        {generalRoutes.wisata && waypointsWisata && (
                            <TampilkanRute
                                waypoints={waypointsWisata}
                                routeColor={'#e74c3c'}
                            />
                        )}

                        {generalRoutes.umkm && waypointsUmkm && (
                            <TampilkanRute
                                waypoints={waypointsUmkm}
                                routeColor={'#2ecc71'}
                            />
                        )}

                        {/* Rute personal dirender terakhir agar berada di lapisan atas */}
                        <TampilkanRute
                            waypoints={personalRouteWaypoints}
                            routeColor={'#3498db'}
                            isPersonalRoute={true}
                        />

                        </MapContainer>
                    </div>

                    {/* Map Legend */}
                    <div className="absolute bottom-4 left-4 z-[1000] lg:bottom-auto lg:top-4 lg:left-auto lg:right-4">
                        <MapLegend dusunColors={dusunColors} userLocation={userLocation} mapRef={mapRef} />
                    </div>

                    <div className="lg:hidden">
                        <AnimatePresence>
                            {isListVisible && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsListVisible(false)}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"
                                />
                            )}
                        </AnimatePresence>

                        <Button
                            onClick={() => setIsListVisible(!isListVisible)}
                            className="absolute bottom-4 right-4 z-20 rounded-full h-14 w-14 shadow-lg bg-amber-600 hover:bg-amber-700 text-white"
                            aria-label="Tampilkan Daftar"
                        >
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={isListVisible ? "close" : "list"}
                                    initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isListVisible ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
                                </motion.div>
                            </AnimatePresence>
                        </Button>

                        <AnimatePresence>
                            {isListVisible && (
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: "0%" }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    className="absolute bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-800 rounded-t-2xl shadow-2xl"
                                    style={{ height: '70vh' }}
                                >
                                    <div className="p-4 border-b border-stone-200 dark:border-slate-700">
                                        <div className="w-12 h-1.5 bg-stone-300 dark:bg-slate-600 rounded-full mx-auto"></div>
                                        <h3 className="text-center font-semibold text-lg mt-2 text-gray-800 dark:text-slate-200">Jelajahi Desa</h3>
                                    </div>
                                    <div className="h-[calc(100%-70px)] overflow-y-auto p-1">
                                        <FilterControls
                                            selectedCategory={selectedCategory}
                                            onCategoryChange={setSelectedCategory}
                                            searchTerm={searchTerm}
                                            onSearchChange={setSearchTerm}
                                            generalRoutes={generalRoutes}
                                            setGeneralRoutes={setGeneralRoutes}
                                        />
                                        <PoiList
                                            pois={filteredPOIs}
                                            activePoi={activePoi}
                                            onPoiClick={handlePoiClick}
                                            getImageUrl={getImageUrl}
                                            onPoiHover={handlePoiHover}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

const FilterControls = ({ selectedCategory, onCategoryChange, searchTerm, onSearchChange, generalRoutes, setGeneralRoutes}: any) => {
    const categories = [
        { id: "all", name: "Semua", icon: MapPin },
        { id: "wisata", name: "Wisata", icon: Mountain },
        { id: "umkm", name: "UMKM", icon: Store },
    ];

    const toggleRoute = (routeType: 'wisata' | 'umkm') => {
        setGeneralRoutes(prev=> ({
            ...prev,
            [routeType]: !prev[routeType]
        }));
    };
    return (
        <div className="p-4 sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <Input
                    placeholder="Cari nama lokasi..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-700 border-stone-300 dark:border-slate-600"
                />
            </div>
            <div className="flex space-x-2">
                {categories.map(cat => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => onCategoryChange(cat.id)}
                        className={`flex-1 transition-all duration-300 ${selectedCategory === cat.id ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-stone-300 dark:border-slate-600'}`}
                    >
                        <cat.icon className="w-4 h-4 mr-2" />
                        {cat.name}
                    </Button>
                ))}
            </div>
            <div className="pt-2 space-y-2 border-t border-stone-200 dark:border-slate-700">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tampilkan Rute Umum</label>
                <Button
                    onClick={() => toggleRoute('wisata')}
                    variant={generalRoutes.wisata ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${generalRoutes.wisata ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                >
                    {generalRoutes.wisata ? "Sembunyikan" : "Tampilkan"} Rute Wisata
                </Button>
                <Button
                    onClick={() => toggleRoute('umkm')}
                    variant={generalRoutes.umkm ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${generalRoutes.umkm ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                >
                    {generalRoutes.umkm ? "Sembunyikan" : "Tampilkan"} Rute UMKM
                </Button>
            </div>
        </div>
    );
};

const MapLegend = ({ dusunColors, userLocation, mapRef }: {
    dusunColors: { [key: string]: string },
    userLocation: [number, number] | null,
    mapRef: React.RefObject<L.Map | null>
}) => {
    const dusunEntries = Object.entries(dusunColors).filter(([key]) => key !== "DEFAULT" && key !== "Dusun Sungai Deras");

    const handleFlyToUserLocation = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.flyTo(userLocation, 16, {
                animate: true,
                duration: 1
            });
        }
    };

    const iconEntries = [
        { name: 'Posisi Anda', customIcon: <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md" />, onClick: handleFlyToUserLocation, isClickable: !!userLocation },
        { name: 'Wisata', iconUrl: wisataIcon.options.iconUrl },
        { name: 'UMKM', iconUrl: umkmIcon.options.iconUrl },
    ];

    const routeEntries = [
        { name: 'Rute Anda', color: '#3498db' },
        { name: 'Rute Wisata', color: '#e74c3c' },
        { name: 'Rute UMKM', color: '#2ecc71' },
    ];

    return (
        <div className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-stone-200 dark:border-slate-700 w-52">
            <h4 className="font-bold text-sm mb-3 text-gray-800 dark:text-slate-200 border-b pb-1 border-stone-200 dark:border-slate-600">Legenda</h4>
            <div className="space-y-4">
                <div>
                    <h5 className="font-semibold text-xs mb-2 text-gray-600 dark:text-slate-400">Ikon Lokasi</h5>
                    <ul className="space-y-1.5">
                        {iconEntries.map(item => (
                            <li
                                key={item.name}
                                onClick={item.onClick}
                                className={`flex items-center ${item.isClickable ? 'cursor-pointer hover:bg-stone-100 dark:hover:bg-slate-700/50 rounded-md -mx-1 px-1' : ''}`}
                            >
                                <div className="w-5 flex justify-center items-center mr-1.5">
                                    {item.iconUrl ? (
                                        <img src={item.iconUrl} alt={item.name} className="w-4 h-auto" />
                                    ) : (
                                        item.customIcon
                                    )}
                                </div>
                                <span className="text-xs text-gray-700 dark:text-slate-300">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-xs mb-2 text-gray-600 dark:text-slate-400">Warna Rute</h5>
                    <ul className="space-y-1.5">
                        {routeEntries.map(item => (
                            <li key={item.name} className="flex items-center">
                                <span className="w-4 h-1 rounded-full mr-2" style={{ backgroundColor: item.color, border: '1px solid rgba(0,0,0,0.2)' }}></span>
                                <span className="text-xs text-gray-700 dark:text-slate-300">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-xs mb-2 text-gray-600 dark:text-slate-400">Wilayah Dusun</h5>
                    <ul className="space-y-1.5">
                        {dusunEntries.map(([name, color]) => (
                            <li key={name} className="flex items-center">
                                <span className="w-4 h-3 rounded-sm mr-2" style={{ backgroundColor: color }}></span>
                                <span className="text-xs text-gray-700 dark:text-slate-300">{name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const PoiList = ({ pois, activePoi, onPoiClick, getImageUrl, onPoiHover }: any) => {
    return (
        <div className="h-full">
            <div className="p-2 space-y-2">
                {pois.length > 0 ? pois.map((poi: PointOfInterest) => (
                    <div
                        key={`${poi.type}-${poi.id}`}
                        onClick={() => onPoiClick(poi)}
                        onMouseEnter={() => onPoiHover(poi)}
                        onMouseLeave={() => onPoiHover(null)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${activePoi?.id === poi.id && activePoi?.type === poi.type ? 'bg-amber-100 dark:bg-amber-900/50 ring-2 ring-amber-500' : 'hover:bg-stone-100 dark:hover:bg-slate-700'}`}
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
};
